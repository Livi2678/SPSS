import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const maxDuration = 60;

type Provider = 'anthropic' | 'openai' | 'gemini';

async function streamAnthropic(messages: { role: string; content: string }[], systemPrompt: string, apiKey: string, model: string): Promise<ReadableStream> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey });

  const stream = await client.messages.stream({
    model: model || 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: systemPrompt,
    messages: messages as { role: 'user' | 'assistant'; content: string }[],
  });

  return new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            controller.enqueue(new TextEncoder().encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      stream.abort();
    },
  });
}

async function streamOpenAI(messages: { role: string; content: string }[], systemPrompt: string, apiKey: string, model: string): Promise<ReadableStream> {
  const allMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'gpt-4o',
      messages: allMessages,
      stream: true,
      max_tokens: 4096,
    }),
    signal: AbortSignal.timeout(55000),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const error = new Error(err?.error?.message || 'OpenAI API error') as Error & { status: number };
    error.status = response.status;
    throw error;
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n').filter(l => l.startsWith('data: '));
          for (const line of lines) {
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) controller.enqueue(new TextEncoder().encode(content));
            } catch {}
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

async function streamGemini(messages: { role: string; content: string }[], systemPrompt: string, apiKey: string, model: string): Promise<ReadableStream> {
  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-2.0-flash'}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: 4096 },
      }),
      signal: AbortSignal.timeout(55000),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const error = new Error(err?.error?.message || 'Gemini API error') as Error & { status: number };
    error.status = response.status;
    throw error;
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          const lines = text.split('\n').filter(l => l.startsWith('data: '));
          for (const line of lines) {
            const data = line.slice(6).trim();
            if (!data) continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
              if (content) controller.enqueue(new TextEncoder().encode(content));
            } catch {}
          }
        }
        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
    cancel() {
      reader.cancel();
    },
  });
}

async function validateKey(provider: Provider, apiKey: string, model: string): Promise<boolean> {
  try {
    if (provider === 'anthropic') {
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const client = new Anthropic({ apiKey });
      await client.messages.create({
        model: model || 'claude-sonnet-4-20250514',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'Hi' }],
      });
      return true;
    }
    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        signal: AbortSignal.timeout(10000),
      });
      return res.ok;
    }
    if (provider === 'gemini') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
        { signal: AbortSignal.timeout(10000) }
      );
      return res.ok;
    }
    return false;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, systemPrompt, apiKey, provider = 'anthropic', model, test } = body;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 401 });
    }

    if (test) {
      const isValid = await validateKey(provider as Provider, apiKey, model);
      return isValid
        ? NextResponse.json({ ok: true })
        : NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    let stream: ReadableStream;
    const sys = systemPrompt || 'You are a helpful AI research assistant specializing in academic writing.';

    if (provider === 'openai') {
      stream = await streamOpenAI(messages, sys, apiKey, model);
    } else if (provider === 'gemini') {
      stream = await streamGemini(messages, sys, apiKey, model);
    } else {
      stream = await streamAnthropic(messages, sys, apiKey, model);
    }

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    const err = error as Error & { status?: number };
    const status = err.status ?? 500;

    if (status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Check your key in Settings.' },
        { status: 401 }
      );
    }
    if (status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before trying again.' },
        { status: 429 }
      );
    }
    if (err.message?.includes('timeout') || status === 408) {
      return NextResponse.json({ error: 'Request timed out. Please try again.' }, { status: 408 });
    }

    console.error('AI route error:', err.message);
    return NextResponse.json({ error: 'Internal server error. Please try again.' }, { status: 500 });
  }
}
