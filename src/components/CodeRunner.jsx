import React, { useState } from 'react';
import { Play, Check, Copy, Terminal, Loader2, RotateCcw } from 'lucide-react';
import axios from 'axios';

export default function CodeRunner({ code, language = 'javascript' }) {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [duration, setDuration] = useState(null);
  const [hasError, setHasError] = useState(false);

  const canRun = ['javascript', 'js', 'node', 'python', 'py'].includes(language.toLowerCase());

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput(null);
    setHasError(false);

    try {
      const response = await axios.post('/api/execute-code', {
        code,
        language: language.toLowerCase()
      });

      setOutput(response.data.output || 'Code executed successfully with no console output.');
      setDuration(response.data.duration);
      setHasError(!response.data.success);
    } catch (err) {
      setOutput(`Execution failed: ${err.response?.data?.error || err.message}`);
      setHasError(true);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-obsidian-750 bg-obsidian-950/90 shadow-lg font-mono text-xs">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-obsidian-900 border-b border-obsidian-800 text-obsidian-400">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 mr-1">
            <span className="w-2.5 h-2.5 rounded-full bg-obsidian-750 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-obsidian-750 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-obsidian-750 inline-block"></span>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-obsidian-300 font-semibold">{language}</span>
        </div>

        <div className="flex items-center space-x-2">
          {canRun && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 text-[11px] font-semibold transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              {isRunning ? (
                <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
              ) : (
                <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
              )}
              <span>{isRunning ? 'Running...' : 'Run Code'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-obsidian-800 hover:bg-obsidian-750 text-obsidian-300 hover:text-white transition-colors"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-grok-blue" />
                <span className="text-grok-blue">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Block Content */}
      <div className="p-3.5 overflow-x-auto text-slate-200 leading-relaxed font-mono">
        <pre><code>{code}</code></pre>
      </div>

      {/* Execution Output Console */}
      {output !== null && (
        <div className="border-t border-obsidian-800 bg-obsidian-900/95 p-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-1.5 text-[11px] text-obsidian-400">
            <div className="flex items-center space-x-1.5">
              <Terminal className="w-3.5 h-3.5 text-obsidian-300" />
              <span className="font-semibold text-slate-300">Terminal Output</span>
              {duration && <span className="text-obsidian-500">• {duration}</span>}
            </div>
            <button
              onClick={() => setOutput(null)}
              className="text-obsidian-400 hover:text-slate-200"
              title="Clear Output"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <pre className={`p-2 rounded-lg bg-obsidian-950 font-mono text-xs overflow-x-auto border ${
            hasError ? 'border-red-500/40 text-red-400' : 'border-obsidian-800 text-emerald-300'
          }`}>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
