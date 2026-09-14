import dart from 'highlight.js/lib/languages/dart';
import { common } from 'lowlight';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import CodeBlock from '@/components/CodeBlock';

// lowlight의 common 언어 묶음에는 Dart가 없어 직접 등록한다.
const highlightOptions = { languages: { ...common, dart } };

const components = {
  pre({ children }) {
    const className = children?.props?.className ?? '';
    const language = /language-([\w-]+)/.exec(className)?.[1] ?? null;
    return <CodeBlock language={language}>{children}</CodeBlock>;
  },
  a({ href = '', children }) {
    const isExternal = /^https?:\/\//.test(href);
    return (
      <a href={href} {...(isExternal ? { target: '_blank', rel: 'noreferrer' } : {})}>
        {children}
      </a>
    );
  },
  table({ children }) {
    return (
      <div className="table-wrap">
        <table>{children}</table>
      </div>
    );
  },
};

export default function LessonContent({ markdown }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, highlightOptions]]}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
