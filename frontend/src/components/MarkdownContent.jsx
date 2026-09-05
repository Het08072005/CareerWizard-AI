import React from 'react';

const inline = (value) => {
  const parts = String(value).split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index} className="px-1.5 py-0.5 rounded bg-slate-900 text-emerald-300 text-xs">{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

export default function MarkdownContent({ markdown }) {
  const lines = String(markdown || '').split('\n');
  const blocks = [];
  let code = [];
  let inCode = false;
  lines.forEach((raw, index) => {
    const line = raw.trimEnd();
    if (line.startsWith('```')) {
      if (inCode) {
        blocks.push(<pre key={`code-${index}`} className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100"><code>{code.join('\n')}</code></pre>);
        code = [];
      }
      inCode = !inCode;
      return;
    }
    if (inCode) { code.push(raw); return; }
    if (!line || line.startsWith(':::')) return;
    if (line.startsWith('### ')) blocks.push(<h3 key={index} className="mt-5 text-base font-bold text-[var(--text-main)]">{inline(line.slice(4))}</h3>);
    else if (line.startsWith('## ')) blocks.push(<h2 key={index} className="mt-6 text-xl font-bold text-[var(--text-main)]">{inline(line.slice(3))}</h2>);
    else if (line.startsWith('# ')) blocks.push(<h1 key={index} className="mb-3 text-2xl font-bold text-[var(--text-main)]">{inline(line.slice(2))}</h1>);
    else if (/^[-*]\s/.test(line)) blocks.push(<div key={index} className="flex gap-2 text-sm leading-7 text-[var(--text-muted)]"><span className="text-emerald-500">•</span><span>{inline(line.slice(2))}</span></div>);
    else blocks.push(<p key={index} className="text-sm leading-7 text-[var(--text-muted)]">{inline(line)}</p>);
  });
  return <div className="space-y-2">{blocks}</div>;
}
