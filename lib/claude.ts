import Anthropic from '@anthropic-ai/sdk';

export interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function streamClaudeResponse(
  messages: ClaudeMessage[],
  systemPrompt: string,
  apiKey: string
): Promise<ReadableStream<Uint8Array>> {
  const client = new Anthropic({ apiKey });

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const anthropicMessages = messages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        }));

        const response = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: systemPrompt,
          messages: anthropicMessages,
          stream: true,
        });

        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return stream;
}

export async function testApiKey(apiKey: string): Promise<boolean> {
  const client = new Anthropic({ apiKey });
  try {
    await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'Say OK' }],
    });
    return true;
  } catch {
    return false;
  }
}
