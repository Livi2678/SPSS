'use client';

import { useState, useCallback, useRef } from 'react';

interface UseStreamOptions {
  onChunk?: (chunk: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: string) => void;
}

interface UseStreamReturn {
  content: string;
  isStreaming: boolean;
  error: string | null;
  startStream: (messages: Array<{ role: string; content: string }>, systemPrompt: string, apiKey: string | null) => Promise<void>;
  cancelStream: () => void;
  reset: () => void;
}

export function useStream(options: UseStreamOptions = {}): UseStreamReturn {
  const [content, setContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setContent('');
    setError(null);
    setIsStreaming(false);
  }, []);

  const cancelStream = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const startStream = useCallback(
    async (
      messages: Array<{ role: string; content: string }>,
      systemPrompt: string,
      apiKey: string | null
    ) => {
      cancelStream();
      setContent('');
      setError(null);
      setIsStreaming(true);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages, systemPrompt, apiKey }),
          signal: controller.signal,
        });

        if (!response.ok) {
          let errorMessage = 'Failed to connect to AI service';
          if (response.status === 401) {
            errorMessage = 'Invalid API key. Please check your Anthropic API key.';
          } else if (response.status === 429) {
            errorMessage = 'Rate limit exceeded. Please wait a moment before trying again.';
          } else if (response.status === 500) {
            errorMessage = 'Server error. Please try again.';
          }
          throw new Error(errorMessage);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setContent(prev => prev + chunk);
          options.onChunk?.(chunk);
        }

        options.onComplete?.(fullContent);
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return;
        }
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        options.onError?.(errorMessage);
      } finally {
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [cancelStream, options]
  );

  return { content, isStreaming, error, startStream, cancelStream, reset };
}
