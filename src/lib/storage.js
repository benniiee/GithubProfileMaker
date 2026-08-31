import { createDefaultBlocks } from './defaultState';

const STORAGE_KEY = 'gh_profile_readme_builder_v1';
export const CURRENT_SCHEMA_VERSION = 1;

export function loadProfileState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getInitialState();
    }

    const parsed = JSON.parse(raw);

    // Schema version check and migration path
    if (!parsed.version || parsed.version < CURRENT_SCHEMA_VERSION) {
      console.warn('Migrating legacy profile state schema to version', CURRENT_SCHEMA_VERSION);
      return {
        version: CURRENT_SCHEMA_VERSION,
        updatedAt: new Date().toISOString(),
        blocks: parsed.blocks && Array.isArray(parsed.blocks) ? parsed.blocks : createDefaultBlocks(),
      };
    }

    if (!Array.isArray(parsed.blocks) || parsed.blocks.length === 0) {
      return getInitialState();
    }

    return parsed;
  } catch (err) {
    console.error('Failed to load profile state from localStorage:', err);
    return getInitialState();
  }
}

export function saveProfileState(state) {
  try {
    const payload = {
      ...state,
      version: CURRENT_SCHEMA_VERSION,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to save profile state to localStorage:', err);
  }
}

export function clearProfileState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear profile state from localStorage:', err);
  }
}

export function getInitialState() {
  return {
    version: CURRENT_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
    blocks: createDefaultBlocks(),
  };
}

