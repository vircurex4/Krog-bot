import React, { useState } from 'react';
import { X, Download, Upload, FileText, Code2, Check, AlertCircle } from 'lucide-react';

export default function ExportModal({
  isOpen,
  onClose,
  activeChat,
  onExportAll,
  onImportAll
}) {
  const [importStatus, setImportStatus] = useState(null);

  if (!isOpen) return null;

  const handleExportMarkdown = () => {
    if (!activeChat || !activeChat.messages) return;
    let md = `# ${activeChat.title}\n*Exported from GrokPulse Desktop on ${new Date().toLocaleString()}*\n\n---\n\n`;

    activeChat.messages.forEach(msg => {
      const roleName = msg.role === 'user' ? '👤 User' : `🚀 Grok (${msg.persona || 'AI'})`;
      md += `### ${roleName}\n\n${msg.content}\n\n`;
      if (msg.reasoning) {
        md += `> **Reasoning Process:**\n> ${msg.reasoning.replace(/\n/g, '\n> ')}\n\n`;
      }
      md += `---\n\n`;
    });

    downloadBlob(md, `${activeChat.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`, 'text/markdown');
  };

  const handleExportJSON = () => {
    if (!activeChat) return;
    const jsonStr = JSON.stringify(activeChat, null, 2);
    downloadBlob(jsonStr, `${activeChat.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.json`, 'application/json');
  };

  const handleExportFullWorkspace = () => {
    const fullData = onExportAll();
    downloadBlob(fullData, `grok-workspace-backup-${Date.now()}.json`, 'application/json');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const result = onImportAll(content);
        if (result.success) {
          setImportStatus({ type: 'success', message: `Imported ${result.count} conversations successfully!` });
        } else {
          setImportStatus({ type: 'error', message: result.error || 'Failed to import JSON.' });
        }
      }
    };
    reader.readAsText(file);
  };

  function downloadBlob(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-obsidian-900 border border-obsidian-750 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-obsidian-800 flex items-center justify-between bg-obsidian-950/60">
          <div className="flex items-center space-x-2">
            <Download className="w-4 h-4 text-grok-blue" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Export & Import Data</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-obsidian-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Current Chat Export */}
          {activeChat && (
            <div className="p-3.5 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-2.5">
              <h3 className="text-xs font-bold text-slate-200">Export Current Conversation:</h3>
              <p className="text-[11px] text-obsidian-400 truncate">"{activeChat.title}" ({activeChat.messages?.length || 0} messages)</p>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={handleExportMarkdown}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-xs text-slate-200 border border-obsidian-700 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Markdown (.md)</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-xs text-slate-200 border border-obsidian-700 transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>JSON (.json)</span>
                </button>
              </div>
            </div>
          )}

          {/* Full Workspace Backup */}
          <div className="p-3.5 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-200">Full Workspace Backup:</h3>
            <p className="text-[11px] text-obsidian-400">
              Download all conversation histories and settings as an encrypted JSON archive.
            </p>

            <button
              onClick={handleExportFullWorkspace}
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 text-xs font-semibold text-white transition-colors"
            >
              <Download className="w-4 h-4 text-grok-blue" />
              <span>Download Full Backup (.json)</span>
            </button>
          </div>

          {/* Import JSON Backup */}
          <div className="p-3.5 rounded-xl bg-obsidian-850 border border-obsidian-750 space-y-2.5">
            <h3 className="text-xs font-bold text-slate-200">Restore / Import Backup:</h3>
            <label className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 border border-obsidian-700 text-xs font-semibold text-slate-200 hover:text-white cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Select Backup JSON File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {importStatus && (
              <div className={`p-2 rounded-lg text-xs flex items-center space-x-1.5 ${
                importStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/10 text-red-300 border border-red-500/30'
              }`}>
                {importStatus.type === 'success' ? <Check className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                <span>{importStatus.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
