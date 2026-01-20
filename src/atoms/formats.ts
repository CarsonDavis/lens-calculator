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

// All formats combined: presets + custom
export const allFormatsAtom = atom<Format[]>((get) => {
  const presets = get(presetFormatsAtom);
  const custom = get(customFormatsAtom);
  return [...presets, ...custom.map((f) => ({ ...f, isCustom: true }))];
});

// Formats grouped by category for dropdown display
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

  const grouped: GroupedFormats = {
    small: [],
    medium: [],
    large: [],
    cinema: [],
    custom: custom.map((f) => ({ ...f, isCustom: true })),
  };

  for (const format of presets) {
    const category = format.category as FormatCategory;
    if (category in grouped) {
      grouped[category].push(format);
    }
  }

  return grouped;
});
