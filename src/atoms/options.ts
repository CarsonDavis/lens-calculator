import { atom } from 'jotai';
import type { EquivalenceMethod, MatchMode, Unit, Options } from '@/calc';

// Primitive atoms for individual option values
export const equivalenceMethodAtom = atom<EquivalenceMethod>('diagonal');
export const matchModeAtom = atom<MatchMode>('blur_disc');
export const displayUnitAtom = atom<Unit>('mm');

// Combined options atom (derived, read-only)
export const optionsAtom = atom<Options>((get) => ({
  equivalenceMethod: get(equivalenceMethodAtom),
  matchMode: get(matchModeAtom),
  displayUnit: get(displayUnitAtom),
}));
