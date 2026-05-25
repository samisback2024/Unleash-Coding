import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { clsx } from "clsx";

// ─── Inline formatter ─────────────────────────────────────────────────────────

function formatInline(text: string): React.ReactNode {
  // Split on **bold**, `inline code`, *italic*
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return (
        <strong key={i} className="text-[#e2e8f0] font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 rounded bg-[#2a2d3e] text-[#a5a0ff] text-xs font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    if (part.startsWith("*") && part.endsWith("*"))
      return (
        <em key={i} className="text-[#94a3b8] italic">
          {part.slice(1, -1)}
        </em>
      );
    return part;
  });
}

// ─── Code block ───────────────────────────────────────────────────────────────

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-[#2a2d3e]">
      {/* Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1017] border-b border-[#2a2d3e]">
        <span className="text-xs text-[#64748b] font-mono">
          {lang || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#f1f5f9] transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-[#10b981]" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      {/* Code */}
      <pre className="overflow-x-auto p-5 bg-[#090c12] text-sm font-mono leading-6 text-[#e2e8f0]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Paragraph renderer ───────────────────────────────────────────────────────

function renderBlock(block: string, key: string): React.ReactNode {
  const trimmed = block.trim();
  if (!trimmed) return null;

  // Headings
  if (trimmed.startsWith("## "))
    return (
      <h2
        key={key}
        className="text-xl font-bold text-[#f1f5f9] mt-8 mb-3 pb-2 border-b border-[#2a2d3e]"
      >
        {trimmed.slice(3)}
      </h2>
    );

  if (trimmed.startsWith("### "))
    return (
      <h3
        key={key}
        className="text-base font-semibold text-[#e2e8f0] mt-6 mb-2"
      >
        {trimmed.slice(4)}
      </h3>
    );

  // Blockquote (first line only — multi-line blockquotes uncommon in our content)
  if (trimmed.startsWith("> "))
    return (
      <blockquote
        key={key}
        className="my-4 flex gap-3 border-l-4 border-[#f59e0b] bg-[#f59e0b]/5 rounded-r-lg px-4 py-3"
      >
        <span className="text-[#f59e0b] shrink-0 text-base mt-0.5">⚠</span>
        <p className="text-sm text-[#94a3b8] leading-relaxed">
          {formatInline(trimmed.slice(2))}
        </p>
      </blockquote>
    );

  // Bullet list — every line starts with "- " or "* "
  const lines = trimmed.split("\n");
  const isBullet = lines.every((l) => /^[-*] /.test(l.trim()));
  if (isBullet)
    return (
      <ul key={key} className="my-3 space-y-2">
        {lines.map((line, i) => (
          <li
            key={i}
            className="flex items-start gap-2.5 text-sm text-[#94a3b8]"
          >
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#6c63ff] shrink-0" />
            <span>{formatInline(line.trim().replace(/^[-*] /, ""))}</span>
          </li>
        ))}
      </ul>
    );

  // Ordered list
  const isOrdered = lines.every((l) => /^\d+\. /.test(l.trim()));
  if (isOrdered)
    return (
      <ol key={key} className="my-3 space-y-2">
        {lines.map((line, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-[#94a3b8]">
            <span className="shrink-0 w-5 h-5 rounded-full bg-[#6c63ff]/20 text-[#6c63ff] text-xs flex items-center justify-center font-semibold mt-0.5">
              {i + 1}
            </span>
            <span>{formatInline(line.trim().replace(/^\d+\. /, ""))}</span>
          </li>
        ))}
      </ol>
    );

  // Default paragraph
  return (
    <p key={key} className="text-sm text-[#94a3b8] leading-7 my-2">
      {formatInline(trimmed)}
    </p>
  );
}

// ─── Main parser ──────────────────────────────────────────────────────────────

function parseContent(content: string): React.ReactNode[] {
  // Split by fenced code blocks (``` ... ```)
  const segments = content.split(/(```[\s\S]*?```)/g);
  const nodes: React.ReactNode[] = [];

  segments.forEach((segment, si) => {
    if (segment.startsWith("```")) {
      const firstNl = segment.indexOf("\n");
      const lang = firstNl === -1 ? "" : segment.slice(3, firstNl).trim();
      const code =
        firstNl === -1
          ? ""
          : segment
              .slice(firstNl + 1)
              .replace(/```\s*$/, "")
              .trimEnd();
      nodes.push(<CodeBlock key={`code-${si}`} lang={lang} code={code} />);
    } else {
      segment
        .split(/\n{2,}/)
        .forEach((block, bi) => nodes.push(renderBlock(block, `${si}-${bi}`)));
    }
  });

  return nodes.filter(Boolean);
}

// ─── Export ───────────────────────────────────────────────────────────────────

interface LessonContentProps {
  content: string;
  className?: string;
}

export function LessonContent({ content, className }: LessonContentProps) {
  return (
    <div className={clsx("lesson-content", className)}>
      {parseContent(content)}
    </div>
  );
}
