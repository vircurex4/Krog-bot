import React, { useState, useEffect, useCallback } from 'react';
import DesktopTitleBar from './components/DesktopTitleBar';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SettingsModal from './components/SettingsModal';
import CommandPalette from './components/CommandPalette';
import ShortcutsModal from './components/ShortcutsModal';

import { storageService } from './services/storageService';
import { llmService } from './services/llmService';
import { searchService } from './services/searchService';
import { GROK_PERSONAS } from './constants/personas';
import { PROVIDERS } from './constants/providers';

export default function App() {
  const [settings, setSettings] = useState(() => storageService.getSettings());
  const [chats, setChats] = useState(() => storageService.getChats());
  const [activeChatId, setActiveChatId] = useState(() => storageService.getActiveChatId());
  
  const [activePersona, setActivePersona] = useState(settings.activePersona || 'normal');
  const [activeProvider, setActiveProvider] = useState(settings.activeProvider || 'demo');
  const [activeModel, setActiveModel] = useState(settings.activeModel || 'grok-demo-v1');
  const [deepSearchEnabled, setDeepSearchEnabled] = useState(settings.deepSearchEnabled || false);

  const [isLoading, setIsLoading] = useState(false);
  const [searchStatus, setSearchStatus] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Initialize active chat
  useEffect(() => {
    if (chats.length === 0) {
      const initialChat = storageService.createNewChat(activePersona, 'New Conversation');
      setChats([initialChat]);
      setActiveChatId(initialChat.id);
      storageService.saveChats([initialChat]);
      storageService.saveActiveChatId(initialChat.id);
    } else if (!activeChatId || !chats.find(c => c.id === activeChatId)) {
      setActiveChatId(chats[0].id);
      storageService.saveActiveChatId(chats[0].id);
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      storageService.saveChats(chats);
    }
  }, [chats]);

  useEffect(() => {
    storageService.saveSettings(settings);
  }, [settings]);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  const handleNewChat = useCallback(() => {
    const newChat = storageService.createNewChat(activePersona, 'New Conversation');
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    storageService.saveActiveChatId(newChat.id);
  }, [activePersona]);

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

  const handleRenameChat = useCallback((chatId, newTitle) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c));
  }, []);

  const handleTogglePin = useCallback((chatId) => {
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, isPinned: !c.isPinned } : c));
  }, []);

  const handleClearMessages = useCallback(() => {
    if (!activeChatId) return;
    setChats(prev => prev.map(c => c.id === activeChatId ? { ...c, messages: [], updatedAt: new Date().toISOString() } : c));
  }, [activeChatId]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...(activeChat?.messages || []), userMessage];
    
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

      if (deepSearchEnabled) {
        setSearchStatus(`Searching web for "${text.slice(0, 24)}..."`);
        const searchResults = await searchService.performDeepSearch(text, 4);
        searchContext = searchService.formatSearchResultsForPrompt(searchResults);
        searchSources = searchResults.results || [];
        setSearchStatus(`Synthesizing search results...`);
      }

      const assistantResponse = await llmService.sendMessage({
        messages: updatedMessages,
        activeProvider,
        activeModel,
        activePersona,
        settings,
        searchContext
      });

      if (searchSources.length > 0) {
        assistantResponse.searchSources = searchSources;
      }

      setChats(prev => prev.map(c => c.id === activeChatId ? {
        ...c,
        updatedAt: new Date().toISOString(),
        messages: [...c.messages, assistantResponse]
      } : c));
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = {
        role: 'assistant',
        content: `⚠️ Error: ${error.message}\n\nPlease check your API key in Settings (⚙️) or switch to Demo mode in the top model menu.`,
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleNewChat();
      } else if ((e.ctrlKey || e.metaKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setDeepSearchEnabled(prev => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsCommandPaletteOpen(false);
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNewChat]);

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

  const handleSelectModel = (modelId) => {
    setActiveModel(modelId);
    setSettings(prev => ({ ...prev, activeModel: modelId }));
  };

  const handleSelectPersona = (personaId) => {
    setActivePersona(personaId);
    setSettings(prev => ({ ...prev, activePersona: personaId }));
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    setActivePersona(newSettings.activePersona || activePersona);
    setActiveProvider(newSettings.activeProvider || activeProvider);
    setActiveModel(newSettings.activeModel || activeModel);
  };

  const handleClearAllData = () => {
    localStorage.clear();
    const fresh = storageService.createNewChat('normal', 'New Conversation');
    setChats([fresh]);
    setActiveChatId(fresh.id);
    setSettings(storageService.getSettings());
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-arena-950 text-arena-100 overflow-hidden font-sans">
      <DesktopTitleBar
        activePersona={activePersona}
        activeProvider={activeProvider}
        activeModel={activeModel}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        sidebarOpen={sidebarOpen}
        onNewChat={handleNewChat}
      />

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
          deepSearchEnabled={deepSearchEnabled}
          onToggleDeepSearch={() => setDeepSearchEnabled(!deepSearchEnabled)}
        />
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onExportData={() => {
          const data = storageService.exportAllData();
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `arashmidos-backup-${Date.now()}.json`;
          a.click();
        }}
        onClearAllData={handleClearAllData}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNewChat={handleNewChat}
        onSelectPersona={handleSelectPersona}
        onToggleDeepSearch={() => setDeepSearchEnabled(prev => !prev)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        chats={chats}
        onSelectChat={(id) => {
          setActiveChatId(id);
          storageService.saveActiveChatId(id);
        }}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
