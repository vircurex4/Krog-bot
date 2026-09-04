import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  RotateCw, 
  ThumbsUp, 
  ThumbsDown, 
  Globe, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  User,
  Terminal
} from 'lucide-react';
import CodeRunner from './CodeRunner';
import { GROK_PERSONAS } from '../constants/personas';

export default function ChatMessage({
  message,
  onRegenerate,
  isLatest
}) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [showReasoning, setShowReasoning] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const persona = GROK_PERSONAS.find(p => p.id === message.persona) || GROK_PERSONAS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderFormattedContent = (content) => {
    if (!content) return null;

    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          value: content.substring(lastIndex, match.index)
        });
      }

      parts.push({
        type: 'code',
        language: match[1] || 'javascript',
        value: match[2].trim()
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        value: content.substring(lastIndex)
      });
    }

    return parts.map((part, idx) => {
      if (part.type === 'code') {
        return (
          <CodeRunner
            key={idx}
            code={part.value}
            language={part.language}
          />
        );
      }

      return (
        <div key={idx} className="markdown-body space-y-2">
          {renderTextParagraphs(part.value)}
        </div>
      );
    });
  };

  const renderTextParagraphs = (text) => {
    const paragraphs = text.split('\n\n');

    return paragraphs.map((para, pIdx) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      if (trimmed.startsWith('### ')) {
        return <h3 key={pIdx} className="text-sm font-semibold text-white mt-3 mb-1">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={pIdx} className="text-base font-semibold text-white mt-3 mb-1.5">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('# ')) {
        return <h1 key={pIdx} className="text-lg font-bold text-white mt-4 mb-2">{trimmed.replace('# ', '')}</h1>;
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
        const lines = trimmed.split('\n');
        return (
          <ul key={pIdx} className="list-disc pl-5 space-y-1 my-2 text-arena-200">
            {lines.map((line, lIdx) => (
              <li key={lIdx}>
                {renderInlineStyles(line.replace(/^[-*]\s+|\d+\.\s+/, ''))}
              </li>
            ))}
          </ul>
        );
      }

      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={pIdx} className="border-l-2 border-arena-600 pl-3 py-0.5 my-2 text-arena-400 italic">
            {renderInlineStyles(trimmed.replace(/^>\s+/, ''))}
          </blockquote>
        );
      }

      return (
        <p key={pIdx} className="text-arena-200 leading-relaxed">
          {renderInlineStyles(trimmed)}
        </p>
      );
    });
  };

  const renderInlineStyles = (str) => {
    const tokens = [];
    const inlineRegex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
    let last = 0;
    let m;

    while ((m = inlineRegex.exec(str)) !== null) {
      if (m.index > last) {
        tokens.push(str.substring(last, m.index));
      }
      const val = m[0];
      if (val.startsWith('**') && val.endsWith('**')) {
        tokens.push(<strong key={m.index} className="text-white font-semibold">{val.slice(2, -2)}</strong>);
      } else if (val.startsWith('*') && val.endsWith('*')) {
        tokens.push(<em key={m.index} className="text-arena-300 italic">{val.slice(1, -1)}</em>);
      } else if (val.startsWith('`') && val.endsWith('`')) {
        tokens.push(<code key={m.index} className="bg-arena-850 text-arena-200 px-1.5 py-0.5 rounded text-xs font-mono border border-arena-750">{val.slice(1, -1)}</code>);
      } else if (val.startsWith('[') && val.includes('](')) {
        const title = val.slice(1, val.indexOf(']('));
        const url = val.slice(val.indexOf('](') + 2, -1);
        tokens.push(
          <a key={m.index} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center space-x-0.5">
            <span>{title}</span>
            <ExternalLink className="w-2.5 h-2.5 ml-0.5 inline" />
          </a>
        );
      }
      last = m.index + val.length;
    }

    if (last < str.length) {
      tokens.push(str.substring(last));
    }

    return tokens.length > 0 ? tokens : str;
  };

  return (
    <div className={`py-5 px-4 md:px-6 transition-colors ${
      isUser ? 'bg-arena-950' : 'bg-arena-900/40 border-y border-arena-850/60'
    }`}>
      <div className="max-w-3xl mx-auto flex space-x-3.5">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-7 h-7 rounded-lg bg-arena-800 border border-arena-700 flex items-center justify-center text-arena-300">
              <User className="w-3.5 h-3.5" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-lg bg-arena-800 border border-arena-700 flex items-center justify-center text-white">
              <span className="font-serif font-bold text-sm">π</span>
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-white">
                {isUser ? 'You' : `Arashmidos (${persona.shortName})`}
              </span>

              {!isUser && message.model && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-arena-850 text-arena-400 font-mono border border-arena-750">
                  {message.model}
                </span>
              )}
            </div>

            {message.timestamp && (
              <span className="text-[10px] text-arena-500 font-mono">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>

          {/* DeepSearch Citations */}
          {message.searchSources && message.searchSources.length > 0 && (
            <div className="my-2 p-2.5 rounded-lg bg-arena-850 border border-arena-750 text-xs">
              <div className="flex items-center space-x-1.5 text-arena-300 font-medium mb-1.5">
                <Globe className="w-3.5 h-3.5 text-arena-400" />
                <span>Web Sources ({message.searchSources.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {message.searchSources.map((source, sIdx) => (
                  <a
                    key={sIdx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-1.5 rounded bg-arena-900 hover:bg-arena-800 border border-arena-800 text-arena-300 hover:text-white transition-colors text-[11px]"
                  >
                    <span className="truncate pr-2">{source.title || source.source}</span>
                    <ExternalLink className="w-3 h-3 text-arena-500 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Reasoning Block */}
          {message.reasoning && (
            <div className="my-2 rounded-lg border border-arena-750 bg-arena-850/50 overflow-hidden">
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="w-full flex items-center justify-between px-3 py-1.5 bg-arena-850 text-arena-300 text-xs font-medium hover:text-white transition-colors"
              >
                <span>Reasoning Process</span>
                {showReasoning ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {showReasoning && (
                <div className="p-3 text-xs text-arena-300 font-mono whitespace-pre-wrap leading-relaxed border-t border-arena-750 bg-arena-950/40">
                  {message.reasoning}
                </div>
              )}
            </div>
          )}

          {/* Main Body */}
          <div className="text-arena-100 text-sm leading-relaxed">
            {renderFormattedContent(message.content)}
          </div>

          {/* Action Footer */}
          {!isUser && (
            <div className="pt-2 flex items-center justify-between border-t border-arena-850">
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleCopy}
                  className="p-1 rounded text-arena-400 hover:text-white hover:bg-arena-800 transition-colors"
                  title="Copy"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {isLatest && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="p-1 rounded text-arena-400 hover:text-white hover:bg-arena-800 transition-colors"
                    title="Regenerate"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
                  className={`p-1 rounded transition-colors ${
                    feedback === 'like' ? 'text-emerald-400' : 'text-arena-500 hover:text-arena-300'
                  }`}
                  title="Like"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
                  className={`p-1 rounded transition-colors ${
                    feedback === 'dislike' ? 'text-red-400' : 'text-arena-500 hover:text-arena-300'
                  }`}
                  title="Dislike"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
