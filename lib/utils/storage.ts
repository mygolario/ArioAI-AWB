import { SavedWebsite } from '@/lib/types/layout';

const STORAGE_KEY = 'arioai_saved_websites';

export function loadSavedWebsites(): SavedWebsite[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedWebsite[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSavedWebsites(websites: SavedWebsite[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
}

export const CURRENT_LAYOUT_SESSION_KEY = 'arioai_current_layout';
