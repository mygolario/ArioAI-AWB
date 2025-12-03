// Session storage key for passing layout between pages
// Used when navigating from Websites page → Generate page
export const CURRENT_LAYOUT_SESSION_KEY = 'arioai_current_layout';

// DEPRECATED: localStorage functions are no longer used
// All website data is now persisted in the database via API routes
// Keeping these for backward compatibility but they should not be used
// in new code. Use /api/websites endpoints instead.

/* 
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
*/

