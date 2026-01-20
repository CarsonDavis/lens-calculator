import { atom } from 'jotai';
import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import {
  parseUrlParams,
  serializeToUrlParams,
  updateUrl,
  getCurrentUrlSearch,
  type UrlState,
} from '@/utils/url';
import type { Format } from '@/calc';

import { sourceFormatIdAtom } from './source';
import { sourceFocalLengthAtom } from './source';
import { sourceApertureAtom } from './source';
import { subjectDistanceAtom } from './source';
import { targetFormatIdAtom } from './target';
import { targetFocalLengthOverrideAtom } from './target';
import { targetApertureOverrideAtom } from './target';
import { equivalenceMethodAtom } from './options';
import { matchModeAtom } from './options';
import {
  allFormatsAtom,
  allFormatsWithUrlAtom,
  urlCustomFormatsAtom,
} from './formats';

// ID prefix for URL-based custom formats (temporary, not persisted)
const URL_CUSTOM_FORMAT_PREFIX = 'url-custom-';

// localStorage key for session persistence
const SESSION_STORAGE_KEY = 'lens-calc-session';

/**
 * Generate a deterministic ID for a URL custom format
 */
function generateUrlCustomFormatId(
  side: 'source' | 'target',
  width: number,
  height: number
): string {
  return `${URL_CUSTOM_FORMAT_PREFIX}${side}-${width}x${height}`;
}

/**
 * Session state shape for localStorage
 */
interface SessionState {
  sourceFormatId: string;
  sourceFocalLength: number;
  sourceAperture: number;
  subjectDistance: number | null;
  targetFormatId: string;
  targetFocalLengthOverride: number | null;
  targetApertureOverride: number | null;
  equivalenceMethod: string;
  matchMode: string;
}

/**
 * Save session state to localStorage
 */
function saveSessionToStorage(state: SessionState): void {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors (e.g., quota exceeded, private browsing)
  }
}

/**
 * Load session state from localStorage
 */
function loadSessionFromStorage(): Partial<UrlState> | null {
  try {
    const stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as SessionState;

    // Convert to UrlState format
    return {
      sourceFormatId: parsed.sourceFormatId,
      sourceFocalLength: parsed.sourceFocalLength,
      sourceAperture: parsed.sourceAperture,
      subjectDistance: parsed.subjectDistance,
      targetFormatId: parsed.targetFormatId,
      targetFocalLengthOverride: parsed.targetFocalLengthOverride,
      targetApertureOverride: parsed.targetApertureOverride,
      equivalenceMethod:
        parsed.equivalenceMethod as UrlState['equivalenceMethod'],
      matchMode: parsed.matchMode as UrlState['matchMode'],
    };
  } catch {
    return null;
  }
}

/**
 * Read-only atom that combines all state for URL serialization
 */
export const urlStateAtom = atom((get) => ({
  sourceFormatId: get(sourceFormatIdAtom),
  sourceFocalLength: get(sourceFocalLengthAtom),
  sourceAperture: get(sourceApertureAtom),
  subjectDistance: get(subjectDistanceAtom),
  targetFormatId: get(targetFormatIdAtom),
  targetFocalLengthOverride: get(targetFocalLengthOverrideAtom),
  targetApertureOverride: get(targetApertureOverrideAtom),
  equivalenceMethod: get(equivalenceMethodAtom),
  matchMode: get(matchModeAtom),
  allFormats: get(allFormatsWithUrlAtom),
}));

/**
 * Write-only atom to apply URL state to all atoms
 */
export const applyUrlStateAtom = atom(
  null,
  (get, set, urlState: UrlState & { urlCustomFormats?: Format[] }) => {
    // Apply URL custom formats first (if any)
    if (urlState.urlCustomFormats) {
      set(urlCustomFormatsAtom, urlState.urlCustomFormats);
    }

    // Source format
    if (urlState.sourceFormatId !== undefined) {
      set(sourceFormatIdAtom, urlState.sourceFormatId);
    }

    // Source lens settings
    if (urlState.sourceFocalLength !== undefined) {
      set(sourceFocalLengthAtom, urlState.sourceFocalLength);
    }
    if (urlState.sourceAperture !== undefined) {
      set(sourceApertureAtom, urlState.sourceAperture);
    }
    if (urlState.subjectDistance !== undefined) {
      set(subjectDistanceAtom, urlState.subjectDistance);
    }

    // Target format
    if (urlState.targetFormatId !== undefined) {
      set(targetFormatIdAtom, urlState.targetFormatId);
    }

    // Target overrides (directly set, not through mutual exclusion atoms)
    if (urlState.targetFocalLengthOverride !== undefined) {
      set(targetFocalLengthOverrideAtom, urlState.targetFocalLengthOverride);
    }
    if (urlState.targetApertureOverride !== undefined) {
      set(targetApertureOverrideAtom, urlState.targetApertureOverride);
    }

    // Options
    if (urlState.equivalenceMethod !== undefined) {
      set(equivalenceMethodAtom, urlState.equivalenceMethod);
    }
    if (urlState.matchMode !== undefined) {
      set(matchModeAtom, urlState.matchMode);
    }
  }
);

/**
 * Process URL state and create custom formats if needed
 */
function processUrlState(
  urlState: UrlState,
  existingFormats: Format[]
): UrlState & { urlCustomFormats?: Format[] } {
  const result: UrlState & { urlCustomFormats?: Format[] } = { ...urlState };
  const urlCustomFormats: Format[] = [];

  // Handle source custom format from URL
  if (
    urlState.sourceCustomWidth !== undefined &&
    urlState.sourceCustomHeight !== undefined
  ) {
    const width = urlState.sourceCustomWidth;
    const height = urlState.sourceCustomHeight;
    const name = urlState.sourceCustomName || `${width} × ${height}mm`;
    const id = generateUrlCustomFormatId('source', width, height);

    // Check if this format already exists
    const existing = existingFormats.find(
      (f) => f.width === width && f.height === height
    );

    if (existing) {
      result.sourceFormatId = existing.id;
    } else {
      urlCustomFormats.push({
        id,
        name,
        width,
        height,
        isCustom: true,
      });
      result.sourceFormatId = id;
    }
  }

  // Handle target custom format from URL
  if (
    urlState.targetCustomWidth !== undefined &&
    urlState.targetCustomHeight !== undefined
  ) {
    const width = urlState.targetCustomWidth;
    const height = urlState.targetCustomHeight;
    const name = urlState.targetCustomName || `${width} × ${height}mm`;
    const id = generateUrlCustomFormatId('target', width, height);

    // Check if this format already exists
    const existing = existingFormats.find(
      (f) => f.width === width && f.height === height
    );

    if (existing) {
      result.targetFormatId = existing.id;
    } else {
      // Check if we already added a source format with same dimensions
      const alreadyAdded = urlCustomFormats.find(
        (f) => f.width === width && f.height === height
      );
      if (alreadyAdded) {
        result.targetFormatId = alreadyAdded.id;
      } else {
        urlCustomFormats.push({
          id,
          name,
          width,
          height,
          isCustom: true,
        });
        result.targetFormatId = id;
      }
    }
  }

  if (urlCustomFormats.length > 0) {
    result.urlCustomFormats = urlCustomFormats;
  }

  return result;
}

/**
 * Hook to sync URL with state
 *
 * Priority on load:
 * 1. URL parameters (shareable links)
 * 2. localStorage session (last used state)
 * 3. Default values
 *
 * On state change:
 * - Update URL
 * - Save to localStorage
 */
export function useUrlSync(): void {
  const state = useAtomValue(urlStateAtom);
  const applyUrlState = useSetAtom(applyUrlStateAtom);
  const allFormats = useAtomValue(allFormatsAtom);
  const isInitializedRef = useRef(false);
  const skipNextUpdateRef = useRef(false);

  // Initialize from URL or localStorage on mount
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const search = getCurrentUrlSearch();
    const urlState = search ? parseUrlParams(search) : {};
    const hasUrlParams = Object.keys(urlState).length > 0;

    if (hasUrlParams) {
      // Load from URL (shareable link)
      const processedState = processUrlState(urlState, allFormats);
      skipNextUpdateRef.current = true;
      applyUrlState(processedState);
    } else {
      // Try to load from localStorage (last session)
      const sessionState = loadSessionFromStorage();
      if (sessionState && Object.keys(sessionState).length > 0) {
        // Verify that referenced formats still exist
        const processedState = processUrlState(sessionState, allFormats);
        skipNextUpdateRef.current = true;
        applyUrlState(processedState);
      }
    }
  }, [applyUrlState, allFormats]);

  // Sync state changes to URL and localStorage
  useEffect(() => {
    if (!isInitializedRef.current) return;

    if (skipNextUpdateRef.current) {
      skipNextUpdateRef.current = false;
      return;
    }

    // Update URL
    const search = serializeToUrlParams(state);
    updateUrl(search ? `?${search}` : '');

    // Save to localStorage for session persistence
    saveSessionToStorage({
      sourceFormatId: state.sourceFormatId,
      sourceFocalLength: state.sourceFocalLength,
      sourceAperture: state.sourceAperture,
      subjectDistance: state.subjectDistance,
      targetFormatId: state.targetFormatId,
      targetFocalLengthOverride: state.targetFocalLengthOverride,
      targetApertureOverride: state.targetApertureOverride,
      equivalenceMethod: state.equivalenceMethod,
      matchMode: state.matchMode,
    });
  }, [state]);
}
