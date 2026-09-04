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

      setOutput(response.data.output || 'Executed with no output.');
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
    <div className="my-2.5 rounded-xl overflow-hidden border border-arena-750 bg-arena-950 font-mono text-xs">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-arena-900 border-b border-arena-800 text-arena-400">
        <span className="text-[11px] uppercase tracking-wider text-arena-300 font-semibold">{language}</span>

        <div className="flex items-center space-x-1.5">
          {canRun && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-arena-800 hover:bg-arena-750 text-emerald-400 border border-arena-700 text-[11px] transition-colors disabled:opacity-50"
            >
              {isRunning ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
              )}
              <span>{isRunning ? 'Running' : 'Run'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-0.5 rounded bg-arena-800 hover:bg-arena-750 text-arena-300 hover:text-white transition-colors"
            title="Copy Code"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
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

      {/* Code Content */}
      <div className="p-3 overflow-x-auto text-arena-200 leading-relaxed">
        <pre><code>{code}</code></pre>
      </div>

      {/* Output */}
      {output !== null && (
        <div className="border-t border-arena-800 bg-arena-900/90 p-2.5 animate-in fade-in duration-100">
          <div className="flex items-center justify-between mb-1 text-[11px] text-arena-400">
            <div className="flex items-center space-x-1.5">
              <Terminal className="w-3 h-3" />
              <span className="font-semibold text-arena-300">Output</span>
              {duration && <span className="text-arena-500">• {duration}</span>}
            </div>
            <button
              onClick={() => setOutput(null)}
              className="text-arena-500 hover:text-white"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          <pre className={`p-2 rounded bg-arena-950 font-mono text-xs overflow-x-auto border ${
            hasError ? 'border-red-500/40 text-red-400' : 'border-arena-800 text-emerald-300'
          }`}>
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
