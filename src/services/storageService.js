import { DEFAULT_SETTINGS } from '../constants/defaultSettings';

const STORAGE_KEYS = {
  SETTINGS: 'grok_desktop_settings_v1',
  CHATS: 'grok_desktop_chats_v1',
  ACTIVE_CHAT_ID: 'grok_desktop_active_chat_id_v1',
  FAVORITES: 'grok_desktop_favorites_v1'
};

export const storageService = {
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.error('Error reading settings:', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Error saving settings:', e);
    }
  },

  getChats() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHATS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading chats:', e);
    }
    return [];
  },

  saveChats(chats) {
    try {
      localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
    } catch (e) {
      console.error('Error saving chats:', e);
    }
  },

  getActiveChatId() {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CHAT_ID) || null;
  },

  saveActiveChatId(id) {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
    }
  },

  createNewChat(personaId = 'fun', title = 'New Conversation') {
    const newChat = {
      id: 'chat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title,
      personaId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPinned: false,
      messages: []
    };
    return newChat;
  },

  exportAllData() {
    const chats = this.getChats();
    const settings = this.getSettings();
    // Sanitize API keys before export if desired, or let user decide
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      chats,
      settings: {
        ...settings,
        // we omit raw API keys in export file for safety
        apiKeys: { demo: '' }
      }
    };
    return JSON.stringify(data, null, 2);
  },

  importData(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.chats && Array.isArray(parsed.chats)) {
        this.saveChats(parsed.chats);
        return { success: true, count: parsed.chats.length };
      }
      return { success: false, error: 'Invalid data format' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};
