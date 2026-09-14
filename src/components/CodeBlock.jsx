'use client';

import { useRef, useState } from 'react';

const LANGUAGE_LABELS = {
  dart: 'Dart',
  bash: 'Terminal',
  yaml: 'YAML',
  kotlin: 'Kotlin',
  ini: 'Properties',
  xml: 'XML',
  json: 'JSON',
  swift: 'Swift',
  text: 'Text',
};

export default function CodeBlock({ language, children }) {
  const preRef = useRef(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(preRef.current?.textContent ?? '');
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // 클립보드 권한이 없는 환경에서는 조용히 무시한다.
    }
  }

  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span className="code-lang">{LANGUAGE_LABELS[language] ?? language ?? 'Code'}</span>
        <button type="button" className="code-copy" onClick={handleCopy} aria-live="polite">
          {copied ? '복사됨' : '복사'}
        </button>
      </div>
      <pre ref={preRef}>{children}</pre>
    </div>
  );
}
