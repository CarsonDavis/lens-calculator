import { atom } from 'jotai';
import { calculateEquivalence, type EquivalenceResult } from '@/calc';
import { sourceStateAtom } from './source';
import { targetStateAtom } from './target';
import { optionsAtom } from './options';
import { allFormatsWithUrlAtom } from './formats';

// Main calculation atom - calls the calculation engine
// Uses allFormatsWithUrlAtom to include URL-derived custom formats
export const equivalenceResultAtom = atom<EquivalenceResult>((get) => {
  const source = get(sourceStateAtom);
  const target = get(targetStateAtom);
  const options = get(optionsAtom);
  const formats = get(allFormatsWithUrlAtom);

  return calculateEquivalence({ source, target, options, formats });
});
