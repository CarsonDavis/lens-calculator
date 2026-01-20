import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Format, FormatPreset, FormatCategory } from '@/calc';
import formatsData from '@/data/formats.json';

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
