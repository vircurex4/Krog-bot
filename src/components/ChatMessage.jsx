import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  ThumbsUp, 
  ThumbsDown, 
  Sparkles, 
  BrainCircuit, 
  Globe, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  User,
  Flame,
  Zap,
  Skull,
  Terminal
} from 'lucide-react';
import CodeRunner from './CodeRunner';
import { GROK_PERSONAS } from '../constants/personas';
import { speechService } from '../services/speechService';

const ICON_MAP = {
  Flame: Flame,
  BrainCircuit: BrainCircuit,
  Zap: Zap,
  Skull: Skull,
  Terminal: Terminal
};

export default function ChatMessage({
  message,
  onRegenerate,
  isLatest
}) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showReasoning, setShowReasoning] = useState(true);
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike'

  const persona = GROK_PERSONAS.find(p => p.id === message.persona) || GROK_PERSONAS[0];
  const IconComponent = ICON_MAP[persona.iconName] || Sparkles;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      speechService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      speechService.speak(message.content, {
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  // Helper to parse markdown-like code blocks and regular text
  const renderFormattedContent = (content) => {
    if (!content) return null;

    // Split content by code fences ```lang ... ```
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          value: content.substring(lastIndex, match.index)
        });
      }

      // Code block
      parts.push({
        type: 'code',
        language: match[1] || 'javascript',
        value: match[2].trim()
      });

      lastIndex = match.index + match[0].length;
    }

    // Remaining text after last code block
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

      // Render regular text with markdown parsing (paragraphs, bold, lists, inline code)
      return (
        <div key={idx} className="markdown-body space-y-2">
          {renderTextParagraphs(part.value)}
        </div>
      );
    });
  };

  // Helper to render formatted text with inline formatting
  const renderTextParagraphs = (text) => {
    const paragraphs = text.split('\n\n');

    return paragraphs.map((para, pIdx) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      // Check for headings
      if (trimmed.startsWith('### ')) {
        return <h3 key={pIdx} className="text-base font-bold text-slate-100 mt-3 mb-1">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={pIdx} className="text-lg font-bold text-white mt-4 mb-2">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('# ')) {
        return <h1 key={pIdx} className="text-xl font-extrabold text-white mt-4 mb-2">{trimmed.replace('# ', '')}</h1>;
      }

      // Check for bullet lists
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
        const lines = trimmed.split('\n');
        return (
          <ul key={pIdx} className="list-disc pl-5 space-y-1 my-2 text-slate-200">
            {lines.map((line, lIdx) => (
              <li key={lIdx}>
                {renderInlineStyles(line.replace(/^[-*]\s+|\d+\.\s+/, ''))}
              </li>
            ))}
          </ul>
        );
      }

      // Check for blockquotes
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={pIdx} className="border-l-2 border-grok-blue pl-3 py-1 my-2 text-obsidian-300 italic bg-obsidian-900/40 rounded-r">
            {renderInlineStyles(trimmed.replace(/^>\s+/, ''))}
          </blockquote>
        );
      }

      return (
        <p key={pIdx} className="text-slate-200 leading-relaxed">
          {renderInlineStyles(trimmed)}
        </p>
      );
    });
  };

  // Simple inline parser for **bold**, *italic*, `code`, and [links](url)
  const renderInlineStyles = (str) => {
    // Process formatting tokens
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
        tokens.push(<em key={m.index} className="text-slate-300 italic">{val.slice(1, -1)}</em>);
      } else if (val.startsWith('`') && val.endsWith('`')) {
        tokens.push(<code key={m.index} className="bg-obsidian-800 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono border border-obsidian-700">{val.slice(1, -1)}</code>);
      } else if (val.startsWith('[') && val.includes('](')) {
        const title = val.slice(1, val.indexOf(']('));
        const url = val.slice(val.indexOf('](') + 2, -1);
        tokens.push(
          <a key={m.index} href={url} target="_blank" rel="noopener noreferrer" className="text-grok-blue hover:underline inline-flex items-center space-x-0.5">
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
    <div className={`py-4 px-4 md:px-6 transition-colors ${
      isUser ? 'bg-obsidian-950/40' : 'bg-obsidian-900/30 border-y border-obsidian-900/60'
    }`}>
      <div className="max-w-4xl mx-auto flex space-x-3.5">
        {/* Avatar */}
        <div className="shrink-0 mt-0.5">
          {isUser ? (
            <div className="w-8 h-8 rounded-xl bg-obsidian-800 border border-obsidian-700 flex items-center justify-center text-obsidian-300 shadow-sm">
              <User className="w-4 h-4" />
            </div>
          ) : (
            <div 
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md relative group"
              style={{ backgroundColor: `${persona.accentColor}20`, border: `1px solid ${persona.accentColor}60` }}
            >
              <IconComponent 
                className="w-4 h-4"
                style={{ color: persona.accentColor }}
              />
              <span 
                className="absolute -inset-1 rounded-xl opacity-25 blur-sm pointer-events-none"
                style={{ backgroundColor: persona.accentColor }}
              />
            </div>
          )}
        </div>

        {/* Message Body & Metadata */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-200">
                {isUser ? 'You' : `Grok (${persona.shortName})`}
              </span>

              {!isUser && message.model && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-obsidian-850 text-obsidian-400 font-mono border border-obsidian-800">
                  {message.model}
                </span>
              )}

              {message.timestamp && (
                <span className="text-[10px] text-obsidian-500">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            {/* Speaking animation indicator */}
            {isSpeaking && (
              <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] text-grok-blue">
                <span className="w-1.5 h-1.5 rounded-full bg-grok-blue animate-ping mr-1"></span>
                <span>Speaking...</span>
              </div>
            )}
          </div>

          {/* DeepSearch Badge & Sources (if message has search sources) */}
          {message.searchSources && message.searchSources.length > 0 && (
            <div className="my-2 p-2.5 rounded-xl bg-obsidian-850/80 border border-obsidian-750 text-xs">
              <div className="flex items-center space-x-1.5 text-amber-400 font-semibold mb-2">
                <Globe className="w-3.5 h-3.5" />
                <span>DeepSearch Sources ({message.searchSources.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {message.searchSources.map((source, sIdx) => (
                  <a
                    key={sIdx}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-1.5 rounded bg-obsidian-900 hover:bg-obsidian-800 border border-obsidian-800 text-obsidian-300 hover:text-white transition-colors text-[11px] group"
                  >
                    <span className="truncate pr-2">{source.title || source.source}</span>
                    <ExternalLink className="w-3 h-3 text-obsidian-500 group-hover:text-amber-400 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Reasoning / Chain of Thought Process Block */}
          {message.reasoning && (
            <div className="my-2 rounded-xl border border-purple-500/30 bg-purple-950/15 overflow-hidden">
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="w-full flex items-center justify-between px-3 py-1.5 bg-purple-950/30 text-purple-300 text-xs font-semibold hover:bg-purple-900/30 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                  <span>Thinking Process & Reasoning</span>
                </div>
                {showReasoning ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {showReasoning && (
                <div className="p-3 text-xs text-purple-200/90 font-mono whitespace-pre-wrap leading-relaxed border-t border-purple-500/20 bg-obsidian-950/40">
                  {message.reasoning}
                </div>
              )}
            </div>
          )}

          {/* Main Message Content */}
          <div className="text-slate-100 text-sm leading-relaxed">
            {renderFormattedContent(message.content)}
          </div>

          {/* Actions toolbar for assistant messages */}
          {!isUser && (
            <div className="pt-2 flex items-center justify-between border-t border-obsidian-800/50">
              <div className="flex items-center space-x-1">
                {/* Copy */}
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg text-obsidian-400 hover:text-slate-200 hover:bg-obsidian-800 transition-colors"
                  title="Copy message"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-grok-blue" /> : <Copy className="w-3.5 h-3.5" />}
                </button>

                {/* Text to Speech */}
                <button
                  onClick={handleSpeak}
                  className={`p-1.5 rounded-lg transition-colors ${
                    isSpeaking ? 'text-grok-blue bg-cyan-500/10' : 'text-obsidian-400 hover:text-slate-200 hover:bg-obsidian-800'
                  }`}
                  title={isSpeaking ? 'Stop speaking' : 'Read aloud with Grok Voice'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>

                {/* Regenerate if latest */}
                {isLatest && onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="p-1.5 rounded-lg text-obsidian-400 hover:text-slate-200 hover:bg-obsidian-800 transition-colors"
                    title="Regenerate response"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Feedback Like / Dislike */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setFeedback(feedback === 'like' ? null : 'like')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    feedback === 'like' ? 'text-emerald-400 bg-emerald-500/10' : 'text-obsidian-400 hover:text-slate-200 hover:bg-obsidian-800'
                  }`}
                  title="Good response"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setFeedback(feedback === 'dislike' ? null : 'dislike')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    feedback === 'dislike' ? 'text-red-400 bg-red-500/10' : 'text-obsidian-400 hover:text-slate-200 hover:bg-obsidian-800'
                  }`}
                  title="Poor response"
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
