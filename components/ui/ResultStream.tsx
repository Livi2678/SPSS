'use client';

import { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

interface ResultStreamProps {
  content: string;
  isStreaming: boolean;
  error?: string | null;
  placeholder?: string;
  className?: string;
  maxHeight?: string;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^#### (.+)$/gm, '<h4 style="color:var(--text);font-weight:600;margin-top:0.75rem;margin-bottom:0.25rem;font-size:0.9375rem;">$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li><span style="color:var(--gold);font-weight:600;margin-right:4px;">$1.</span>$2</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul style="list-style:none;padding-left:1rem;">${match}</ul>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hul])(.+)$/gm, (line) => {
      if (line.trim() && !line.startsWith('<')) return `<p>${line}</p>`;
      return line;
    })
    .replace(/<\/p><p>/g, '</p>\n<p>');
}

export function ResultStream({
  content,
  isStreaming,
  error,
  placeholder = 'Results will appear here...',
  className,
  maxHeight = '500px',
}: ResultStreamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming && endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [content, isStreaming]);

  if (error) {
    return (
      <div className={clsx('rounded-lg border border-[#c94040]/30 bg-[#c94040]/5 p-4', className)}>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-[#c94040]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[#c94040] text-xs font-bold">!</span>
          </div>
          <div>
            <div className="text-sm font-medium text-[#f87171] mb-1">Error</div>
            <div className="text-sm text-[#8b9ab0]">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!content && !isStreaming) {
    return (
      <div
        className={clsx(
          'rounded-lg border border-[#1f2d45] bg-[#0d1117] flex items-center justify-center',
          className
        )}
        style={{ minHeight: '200px' }}
      >
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border border-[#1f2d45] flex items-center justify-center mx-auto mb-3">
            <span className="text-[#5a6a80] text-xl">◎</span>
          </div>
          <p className="text-[#5a6a80] text-sm font-dm">{placeholder}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={clsx(
        'rounded-lg border border-[#1f2d45] bg-[#0d1117] p-4 overflow-y-auto',
        className
      )}
      style={{ maxHeight }}
    >
      <div
        className={clsx('ai-output text-sm font-dm', isStreaming && 'streaming-cursor')}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
      <div ref={endRef} />
    </div>
  );
}
