import { NextRequest, NextResponse } from 'next/server';
import { streamClaudeResponse, testApiKey } from '@/lib/claude';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, systemPrompt, apiKey, test } = body;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 401 });
    }

    if (!apiKey.startsWith('sk-ant-')) {
      return NextResponse.json({ error: 'Invalid API key format' }, { status: 401 });
    }

    // Test mode - just validate the key
    if (test) {
      const isValid = await testApiKey(apiKey);
      if (isValid) {
        return NextResponse.json({ ok: true });
      } else {
        return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
      }
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const stream = await streamClaudeResponse(
      messages,
      systemPrompt || 'You are a helpful AI research assistant.',
      apiKey
    );

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

    if (err.status === 401 || err.message?.includes('401') || err.message?.includes('authentication')) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check your Anthropic API key at console.anthropic.com' },
        { status: 401 }
      );
    }

    if (err.status === 429 || err.message?.includes('429') || err.message?.includes('rate limit')) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before trying again.' },
        { status: 429 }
      );
    }

    if (err.message?.includes('timeout')) {
      return NextResponse.json({ error: 'Request timed out. Please try again.' }, { status: 408 });
    }

    console.error('AI route error:', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
