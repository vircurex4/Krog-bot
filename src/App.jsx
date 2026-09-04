import React, { useState, useEffect, useCallback } from 'react';
import DesktopTitleBar from './components/DesktopTitleBar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SettingsModal from './components/SettingsModal';
import CommandPalette from './components/CommandPalette';
import ImageGeneratorModal from './components/ImageGeneratorModal';
import ShortcutsModal from './components/ShortcutsModal';
import ExportModal from './components/ExportModal';

import { storageService } from './services/storageService';
import { llmService } from './services/llmService';
import { searchService } from './services/searchService';
import { GROK_PERSONAS } from './constants/personas';
import { PROVIDERS } from './constants/providers';

export default function App() {
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [chats, setChats] = useState(() => storageService.getChats());
  const [activeChatId, setActiveChatId] = useState(() => storageService.getActiveChatId());
  
  const [activePersona, setActivePersona] = useState(settings.activePersona || 'fun');
  const [activeProvider, setActiveProvider] = useState(settings.activeProvider || 'demo');
  const [activeModel, setActiveModel] = useState(settings.activeModel || 'grok-demo-v1');
  const [deepSearchEnabled, setDeepSearchEnabled] = useState(settings.deepSearchEnabled || false);

  const [isLoading, setIsLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Initialize or ensure active chat
  useEffect(() => {
    if (chats.length === 0) {
      const initialChat = storageService.createNewChat(activePersona, 'Welcome to GrokPulse');
      setChats([initialChat]);
      setActiveChatId(initialChat.id);
      storageService.saveChats([initialChat]);
      storageService.saveActiveChatId(initialChat.id);
    } else if (!activeChatId || !chats.find(c => c.id === activeChatId)) {
      setActiveChatId(chats[0].id);
      storageService.saveActiveChatId(chats[0].id);
    }
  }, []);

  // Save chats whenever they change
  useEffect(() => {
    if (chats.length > 0) {
      storageService.saveChats(chats);
    }
  }, [chats]);

  // Save settings whenever they change
  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  // Get current active chat
  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  // Handle New Chat
  const handleNewChat = useCallback(() => {
    const newChat = storageService.createNewChat(activePersona, 'New Conversation');
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    storageService.saveActiveChatId(newChat.id);
  }, [activePersona]);

  // Handle Delete Chat
  const handleDeleteChat = useCallback((chatId) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== chatId);
      if (filtered.length === 0) {
        const fresh = storageService.createNewChat(activePersona, 'New Conversation');
        setActiveChatId(fresh.id);
        return [fresh];
      }
      if (activeChatId === chatId) {
        setActiveChatId(filtered[0].id);
      }
      return filtered;
    });
  }, [activeChatId, activePersona]);

  // Handle Rename Chat
  const handleRenameChat = useCallback((chatId, newTitle) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c));
  }, []);

  // Handle Toggle Pin
  const handleTogglePin = useCallback((chatId) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, isPinned: !c.isPinned } : c));
  }, []);

  // Handle Clear Messages in current chat
  const handleClearMessages = useCallback(() => {
    if (!activeChatId) return;
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [], updatedAt: new Date().toISOString() } : c));
  }, [activeChatId]);

  // Handle Send Message
  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    // Update active chat messages
    const updatedMessages = [...(activeChat?.messages || []), userMessage];
    
    // Auto-update chat title if this is the first user message
    let updatedTitle = activeChat?.title || 'New Conversation';
    if (activeChat?.messages.length === 0) {
      updatedTitle = text.slice(0, 36) + (text.length > 36 ? '...' : '');
    }

    setChats(prev => prev.map(c => c.id === activeChatId ? {
      ...c,
      title: updatedTitle,
      personaId: activePersona,
      updatedAt: new Date().toISOString(),
      messages: updatedMessages
    } : c));

    setIsLoading(true);
    setSearchStatus(null);

    try {
      let searchContext = null;
      let searchSources = [];

      // 1. Perform DeepSearch if enabled
      if (deepSearchEnabled) {
        setSearchStatus(`Scanning live web sources for "${text.slice(0, 24)}..."`);
        const searchResults = await searchService.performDeepSearch(text, 4);
        searchContext = searchService.formatSearchResultsForPrompt(searchResults);
        searchSources = searchResults.results || [];
        setSearchStatus(`Synthesizing ${searchSources.length} sources with Grok ${activePersona.toUpperCase()} engine...`);
      }

      // 2. Query LLM Service
      const assistantResponse = await llmService.sendMessage({
        messages: updatedMessages,
        activeProvider,
        activeModel,
        activePersona,
        settings,
        searchContext
      });

      // 3. Attach search sources to assistant message if used
      if (searchSources.length > 0) {
        assistantResponse.searchSources = searchSources;
      }

      // 4. Update chat with assistant reply
      setChats(prev => prev.map(c => c.id === activeChatId ? {
        ...c,
        updatedAt: new Date().toISOString(),
        messages: [...c.messages, assistantResponse]
      } : c));
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = {
        role: 'assistant',
        content: `⚠️ **Grok Alert:** ${error.message}\n\n*Tip: Check your API key in **Settings (⚙️)** or switch to the free Grok Demo Simulator in the top-right model selector.*`,
        persona: activePersona,
        timestamp: new Date().toISOString()
      };

      setChats(prev => prev.map(c => c.id === activeChatId ? {
        ...c,
        updatedAt: new Date().toISOString(),
        messages: [...c.messages, errorMsg]
      } : c));
    } finally {
      setIsLoading(false);
      setSearchStatus(null);
    }
  };

  // Handle Regenerate
  const handleRegenerate = () => {
    if (!activeChat || activeChat.messages.length < 2 || isLoading) return;
    const messagesWithoutLastAssistant = [...activeChat.messages];
    if (messagesWithoutLastAssistant[messagesWithoutLastAssistant.length - 1].role === 'assistant') {
      messagesWithoutLastAssistant.pop();
    }
    const lastUserMsg = messagesWithoutLastAssistant[messagesWithoutLastAssistant.length - 1];
    if (lastUserMsg && lastUserMsg.role === 'user') {
      setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: messagesWithoutLastAssistant } : c));
      handleSendMessage(lastUserMsg.content);
    }
  };

  // Cycle Persona Mode
  const handleCyclePersona = useCallback(() => {
    const currentIndex = GROK_PERSONAS.findIndex(p => p.id === activePersona);
    const nextIndex = (currentIndex + 1) % GROK_PERSONAS.length;
    const nextPersona = GROK_PERSONAS[nextIndex].id;
    setActivePersona(nextPersona);
    setSettings(prev => ({ ...prev, activePersona: nextPersona }));
  }, [activePersona]);

  // Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + K: Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
      // Ctrl/Cmd + N: New Chat
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewChat();
      }
      // Ctrl/Cmd + ,: Settings
      else if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
      }
      // Ctrl/Cmd + D: Toggle DeepSearch
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setDeepSearchEnabled(prev => !prev);
      }
      // Ctrl/Cmd + M: Cycle Mode
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        handleCyclePersona();
      }
      // Ctrl/Cmd + I: Imagine
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
        e.preventDefault();
        setIsImageModalOpen(prev => !prev);
      }
      // Ctrl + /: Shortcuts modal
      else if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
      // Escape: Close active modals
      else if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsCommandPaletteOpen(false);
        setIsImageModalOpen(false);
        setIsShortcutsOpen(false);
        setIsExportModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewChat, handleCyclePersona]);

  // Provider Selection Handler
  const handleSelectProvider = (providerId) => {
    const prov = PROVIDERS.find(p => p.id === providerId) || PROVIDERS[0];
    setActiveProvider(providerId);
    setActiveModel(prov.defaultModel);
    setSettings(prev => ({
      ...prev,
      activeProvider: providerId,
      activeModel: prov.defaultModel
    }));
  };

  // Model Selection Handler
  const handleSelectModel = (modelId) => {
    setActiveModel(modelId);
    setSettings(prev => ({ ...prev, activeModel: modelId }));
  };

  // Persona Selection Handler
  const handleSelectPersona = (personaId) => {
    setActivePersona(personaId);
    setSettings(prev => ({ ...prev, activePersona: personaId }));
  };

  // Save Settings from Modal
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    setActivePersona(newSettings.activePersona || activePersona);
    setActiveProvider(newSettings.activeProvider || activeProvider);
    setActiveModel(newSettings.activeModel || activeModel);
  };

  // Clear All Data
  const handleClearAllData = () => {
    localStorage.clear();
    const fresh = storageService.createNewChat('fun', 'Welcome to GrokPulse');
    setChats([fresh]);
    setActiveChatId(fresh.id);
    setSettings(storageService.getSettings());
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-obsidian-950 text-slate-100 overflow-hidden font-sans">
      {/* Desktop Frame / Window Titlebar */}
      <DesktopTitleBar
        activePersona={activePersona}
        activeProvider={activeProvider}
        activeModel={activeModel}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
      />

      {/* Main Workspace Area (Sidebar + Chat Area) */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={(id) => {
            setActiveChatId(id);
            storageService.saveActiveChatId(id);
          }}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onRenameChat={handleRenameChat}
          onTogglePin={handleTogglePin}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenImageModal={() => setIsImageModalOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          activePersona={activePersona}
          onSelectPersona={handleSelectPersona}
          isOpen={sidebarOpen}
          onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
        />

        <ChatArea
          activeChat={activeChat}
          activePersona={activePersona}
          activeProvider={activeProvider}
          activeModel={activeModel}
          settings={settings}
          isLoading={isLoading}
          searchStatus={searchStatus}
          onSendMessage={handleSendMessage}
          onStopGenerating={() => setIsLoading(false)}
          onRegenerate={handleRegenerate}
          onClearMessages={handleClearMessages}
          onSelectPersona={handleSelectPersona}
          onSelectProvider={handleSelectProvider}
          onSelectModel={handleSelectModel}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenImageModal={() => setIsImageModalOpen(true)}
          deepSearchEnabled={deepSearchEnabled}
          onToggleDeepSearch={() => setDeepSearchEnabled(!deepSearchEnabled)}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Modals & Dialogs */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onExportData={() => storageService.exportAllData()}
        onImportData={(json) => storageService.importData(json)}
        onClearAllData={handleClearAllData}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNewChat={handleNewChat}
        onSelectPersona={handleSelectPersona}
        onToggleDeepSearch={() => setDeepSearchEnabled(prev => !prev)}
        onOpenImageModal={() => setIsImageModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        chats={chats}
        onSelectChat={(id) => {
          setActiveChatId(id);
          storageService.saveActiveChatId(id);
        }}
      />

      <ImageGeneratorModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        activeChat={activeChat}
        onExportAll={() => storageService.exportAllData()}
        onImportAll={(json) => {
          const res = storageService.importData(json);
          if (res.success) {
            setChats(storageService.getChats());
          }
          return res;
        }}
      />
    </div>
  );
}
