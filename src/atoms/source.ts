import { atom } from 'jotai';
import type { SourceState } from '@/calc';

// Primitive atoms for source state
export const sourceFormatIdAtom = atom<string>('full-frame-35mm');
export const sourceFocalLengthAtom = atom<number>(50);
export const sourceApertureAtom = atom<number>(1.4);
export const subjectDistanceAtom = atom<number | null>(null);

// Combined source state (derived, read-only)
export const sourceStateAtom = atom<SourceState>((get) => ({
  formatId: get(sourceFormatIdAtom),
  focalLength: get(sourceFocalLengthAtom),
  aperture: get(sourceApertureAtom),
  subjectDistance: get(subjectDistanceAtom),
}));
