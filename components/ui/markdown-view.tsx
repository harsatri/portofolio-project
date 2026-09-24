"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export function MarkdownView({ content, className = "" }: MarkdownViewProps) {
  if (!content) return null;

  // Split content into blocks by double newlines or code fences
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLanguage = "";
  let listBuffer: string[] = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="my-3 space-y-2 pl-2">
          {listBuffer.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-zinc-300 text-sm leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              <span>{formatInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      listBuffer = [];
    }
  };

  const flushCode = () => {
    if (codeBuffer.length > 0) {
      const codeText = codeBuffer.join("\n");
      elements.push(
        <CodeBlock
          key={`code-${elements.length}`}
          code={codeText}
          language={codeLanguage || "plaintext"}
        />
      );
      codeBuffer = [];
      codeLanguage = "";
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check code fence
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        // End of code block
        flushCode();
        inCodeBlock = false;
      } else {
        // Start of code block
        flushList();
        inCodeBlock = true;
        codeLanguage = line.trim().replace(/^```/, "").trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    // Check bullet lists
    if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
      listBuffer.push(line.trim().substring(2));
      continue;
    } else {
      flushList();
    }

    // Check headings
    if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="text-lg font-bold text-zinc-950 dark:text-white mt-6 mb-2 tracking-tight flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-sm bg-purple-500 inline-block" />
          {formatInline(line.substring(4))}
        </h3>
      );
      continue;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="text-xl sm:text-2xl font-extrabold text-zinc-950 dark:text-white mt-8 mb-3 tracking-tight border-b border-zinc-200 dark:border-zinc-800/80 pb-2"
        >
          {formatInline(line.substring(3))}
        </h2>
      );
      continue;
    }

    if (line.startsWith("# ")) {
      elements.push(
        <h1
          key={`h1-${elements.length}`}
          className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white mt-8 mb-4 tracking-tight"
        >
          {formatInline(line.substring(2))}
        </h1>
      );
      continue;
    }

    // Check blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <blockquote
          key={`quote-${elements.length}`}
          className="my-3 border-l-2 border-blue-500 bg-blue-50/60 dark:bg-blue-950/20 px-4 py-2.5 rounded-r-lg text-sm text-zinc-700 dark:text-zinc-300 italic"
        >
          {formatInline(line.substring(2))}
        </blockquote>
      );
      continue;
    }

    // Blank line
    if (!line.trim()) {
      continue;
    }

    // Paragraph
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="my-3 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal"
      >
        {formatInline(line)}
      </p>
    );
  }

  flushList();
  flushCode();

  return <div className={`markdown-body space-y-1 ${className}`}>{elements}</div>;
}

// Inline formatting parser (bold, code, links)
function formatInline(text: string): React.ReactNode {
  const tokens: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|`.*?`|\[.*?\]\(.*?\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push(text.substring(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      tokens.push(
        <strong key={match.index} className="font-bold text-zinc-950 dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      tokens.push(
        <code
          key={match.index}
          className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/90 text-blue-700 dark:text-blue-300 font-mono text-xs border border-zinc-200 dark:border-zinc-700/50"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[") && token.includes("](") && token.endsWith(")")) {
      const label = token.substring(1, token.indexOf("]("));
      const url = token.substring(token.indexOf("](") + 2, token.length - 1);
      tokens.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors font-medium"
        >
          {label}
        </a>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    tokens.push(text.substring(lastIndex));
  }

  return tokens.length > 0 ? tokens : text;
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950/90 shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-blue-400" />
          <span>{language || "code"}</span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer text-[11px]"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-zinc-200 leading-relaxed selection:bg-blue-500/30">
        <code>{code}</code>
      </pre>
    </div>
  );
}
