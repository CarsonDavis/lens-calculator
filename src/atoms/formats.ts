import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Format, FormatPreset, FormatCategory } from '@/calc';
import formatsData from '@/data/formats.json';

// Helper to generate unique custom format IDs
function generateCustomFormatId(): string {
  return `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// Custom formats stored in localStorage
export const customFormatsAtom = atomWithStorage<Format[]>(
  'lens-calc-custom-formats',
  []
);

// Preset formats loaded from JSON (read-only)
export const presetFormatsAtom = atom<FormatPreset[]>(
  formatsData.formats as FormatPreset[]
);

// URL-derived custom formats (temporary, not persisted to localStorage)
export const urlCustomFormatsAtom = atom<Format[]>([]);

// All formats combined: presets + user custom (without URL custom)
export const allFormatsAtom = atom<Format[]>((get) => {
  const presets = get(presetFormatsAtom);
  const custom = get(customFormatsAtom);
  return [...presets, ...custom.map((f) => ({ ...f, isCustom: true }))];
});

// All formats including URL-derived custom formats
export const allFormatsWithUrlAtom = atom<Format[]>((get) => {
  const allFormats = get(allFormatsAtom);
  const urlFormats = get(urlCustomFormatsAtom);
  return [...allFormats, ...urlFormats];
});

// Formats grouped by category for dropdown display
// Includes URL-derived custom formats in the custom category
export interface GroupedFormats {
  small: Format[];
  medium: Format[];
  large: Format[];
  cinema: Format[];
  custom: Format[];
}

export const groupedFormatsAtom = atom<GroupedFormats>((get) => {
  const presets = get(presetFormatsAtom);
  const custom = get(customFormatsAtom);
  const urlCustom = get(urlCustomFormatsAtom);

  const grouped: GroupedFormats = {
    small: [],
    medium: [],
    large: [],
    cinema: [],
    // Combine user custom formats and URL-derived custom formats
    custom: [...custom.map((f) => ({ ...f, isCustom: true })), ...urlCustom],
  };

  for (const format of presets) {
    const category = format.category as FormatCategory;
    if (category in grouped) {
      grouped[category].push(format);
    }
  }

  return grouped;
});

// CRUD operations for custom formats

export const addCustomFormatAtom = atom(
  null,
  (get, set, format: Omit<Format, 'id' | 'isCustom'>) => {
    const current = get(customFormatsAtom);
    const newFormat: Format = {
      ...format,
      id: generateCustomFormatId(),
      isCustom: true,
    };
    set(customFormatsAtom, [...current, newFormat]);
    return newFormat.id;
  }
);

export const updateCustomFormatAtom = atom(
  null,
  (
    get,
    set,
    update: { id: string; name?: string; width?: number; height?: number }
  ) => {
    const current = get(customFormatsAtom);
    set(
      customFormatsAtom,
      current.map((f) => (f.id === update.id ? { ...f, ...update } : f))
    );
  }
);

export const deleteCustomFormatAtom = atom(null, (get, set, id: string) => {
  const current = get(customFormatsAtom);
  set(
    customFormatsAtom,
    current.filter((f) => f.id !== id)
  );
});
