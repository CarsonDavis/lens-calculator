import { atom } from 'jotai';
import { calculateEquivalence, type EquivalenceResult } from '@/calc';
import { sourceStateAtom } from './source';
import { targetStateAtom } from './target';
import { optionsAtom } from './options';
import { allFormatsAtom } from './formats';

// Main calculation atom - calls the calculation engine
export const equivalenceResultAtom = atom<EquivalenceResult>((get) => {
  const source = get(sourceStateAtom);
  const target = get(targetStateAtom);
  const options = get(optionsAtom);
  const formats = get(allFormatsAtom);

  return calculateEquivalence({ source, target, options, formats });
});
