import { atom } from 'jotai';
import type { TargetState } from '@/calc';

// Primitive atoms for target state
export const targetFormatIdAtom = atom<string>('apsc-canon');
export const targetFocalLengthOverrideAtom = atom<number | null>(null);
export const targetApertureOverrideAtom = atom<number | null>(null);

// Combined target state (derived, read-only)
export const targetStateAtom = atom<TargetState>((get) => ({
  formatId: get(targetFormatIdAtom),
  focalLengthOverride: get(targetFocalLengthOverrideAtom),
  apertureOverride: get(targetApertureOverrideAtom),
}));

// Write-only atom that sets focal length override and clears aperture override
// This enforces the invariant: at most one override at a time
export const setTargetFocalLengthOverrideAtom = atom(
  null,
  (get, set, value: number | null) => {
    set(targetFocalLengthOverrideAtom, value);
    if (value !== null) {
      set(targetApertureOverrideAtom, null);
    }
  }
);

// Write-only atom that sets aperture override and clears focal length override
export const setTargetApertureOverrideAtom = atom(
  null,
  (get, set, value: number | null) => {
    set(targetApertureOverrideAtom, value);
    if (value !== null) {
      set(targetFocalLengthOverrideAtom, null);
    }
  }
);
