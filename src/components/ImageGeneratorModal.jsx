import React, { useState } from 'react';
import { 
  X, 
  Image as ImageIcon, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  Wand2,
  Maximize2
} from 'lucide-react';
import { imageService } from '../services/imageService';

const STYLES = [
  { id: 'cyberpunk', name: 'Cyberpunk Neon', badge: 'Grok Aesthetic' },
  { id: 'photorealistic', name: 'Photorealistic 8K', badge: 'Ultra Real' },
  { id: 'anime', name: 'Anime Visual', badge: 'Artistic' },
  { id: 'minimalist', name: 'Minimalist', badge: 'Clean' }
];

const RATIOS = [
  { id: 'square', label: '1:1 Square', width: 1024, height: 1024 },
  { id: 'wide', label: '16:9 Landscape', width: 1280, height: 720 },
  { id: 'tall', label: '9:16 Portrait', width: 720, height: 1280 }
];

export default function ImageGeneratorModal({ isOpen, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('cyberpunk');
  const [selectedRatio, setSelectedRatio] = useState('square');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleEnhance = () => {
    if (!prompt.trim()) return;
    const enhanced = imageService.enhancePrompt(prompt, selectedStyle);
    setPrompt(enhanced);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    const ratio = RATIOS.find(r => r.id === selectedRatio) || RATIOS[0];

    try {
      const result = await imageService.generateImage(prompt, {
        model: 'flux',
        width: ratio.width,
        height: ratio.height,
        seed: Math.floor(Math.random() * 1000000)
      });

      if (result.url) {
        setGeneratedImage(result);
      } else {
        setError('Could not generate image. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Image generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage?.url) return;
    try {
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `grok-imagine-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      window.open(generatedImage.url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-obsidian-900 border border-obsidian-750 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-obsidian-800 flex items-center justify-between bg-obsidian-950/60">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-black font-bold">
              <ImageIcon className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                <span>Imagine Studio</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Flux / Aurora AI
                </span>
              </h2>
              <p className="text-[11px] text-obsidian-400">Generate high-fidelity AI imagery directly from your workstation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-obsidian-400 hover:text-white hover:bg-obsidian-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Prompt Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200">Describe your image:</label>
              <button
                type="button"
                onClick={handleEnhance}
                disabled={!prompt.trim()}
                className="text-xs text-grok-blue hover:text-cyan-300 flex items-center space-x-1 disabled:opacity-40"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Grokify Prompt</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A cyberpunk astronaut overlooking a neon Tokyo megacity in 2099, cinematic lighting, 8k..."
              className="w-full bg-obsidian-950 text-slate-100 text-xs rounded-xl p-3 border border-obsidian-750 focus:outline-none focus:border-cyan-500/60 leading-relaxed font-sans"
            />
          </div>

          {/* Controls: Styles & Aspect Ratios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-obsidian-300 mb-1.5">Aesthetic Style:</label>
              <div className="grid grid-cols-2 gap-1.5">
                {STYLES.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left border transition-all ${
                      selectedStyle === style.id
                        ? 'bg-grok-blue/15 border-grok-blue/50 text-cyan-300 font-semibold'
                        : 'bg-obsidian-850 border-obsidian-750 text-obsidian-400 hover:text-slate-200 hover:bg-obsidian-800'
                    }`}
                  >
                    <div>{style.name}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-obsidian-300 mb-1.5">Aspect Ratio:</label>
              <div className="grid grid-cols-3 gap-1.5">
                {RATIOS.map((ratio) => (
                  <button
                    key={ratio.id}
                    onClick={() => setSelectedRatio(ratio.id)}
                    className={`px-2 py-1.5 rounded-lg text-xs font-medium text-center border transition-all ${
                      selectedRatio === ratio.id
                        ? 'bg-grok-blue/15 border-grok-blue/50 text-cyan-300 font-semibold'
                        : 'bg-obsidian-850 border-obsidian-750 text-obsidian-400 hover:text-slate-200 hover:bg-obsidian-800'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-black shadow-lg hover:opacity-90 active:scale-[0.99] transition-all disabled:opacity-40 flex items-center justify-center space-x-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Image with Flux Engine...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Masterpiece</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              {error}
            </div>
          )}

          {/* Image Result Display */}
          {generatedImage && (
            <div className="rounded-xl overflow-hidden border border-obsidian-750 bg-obsidian-950 p-2 space-y-2">
              <div className="relative group rounded-lg overflow-hidden flex items-center justify-center bg-black/50 min-h-[300px]">
                <img
                  src={generatedImage.url}
                  alt={prompt}
                  className="w-full h-auto max-h-[420px] object-contain rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between px-2 pt-1">
                <span className="text-[11px] text-obsidian-400 truncate max-w-[360px]">
                  Seed: {generatedImage.seed}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-xs text-slate-200 border border-obsidian-700 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
