import { Note, noteFromNumber, noteToNumber } from "./Note";

export default function detect(notes: Note[]): string {
  if (notes.length === 0) {
    return "N/A";
  }
  const noteNumbers = notes.map(n => noteToNumber(n));
  const baseNoteNumber = Math.min(...noteNumbers);
  const baseNote = noteFromNumber(baseNoteNumber);
  const first = detectOnce(notes);
  const second = detectOnce(notes.filter(n => n.key !== baseNote.key));
  if (first.score < second.score) {
    return `${second.key}${second.label}/${baseNote.key} (${Math.ceil(
      second.score * 100,
    )}%)`;
  }
  return `${baseNote.key}${first.label} (${Math.ceil(first.score * 100)}%)`;
}

function detectOnce(notes: Note[]) {
  const noteNumbers = notes.map(n => noteToNumber(n));
  const baseNoteNumber = Math.min(...noteNumbers);
  const baseNote = noteFromNumber(baseNoteNumber);
  const structure = Array(11)
    .fill(null)
    .map((_, idx) => (idx + 1) as FormElement)
    .filter(distance => {
      return noteNumbers.some(n => (n - baseNoteNumber) % 12 === distance);
    });

  const estimated = (Object.keys(patterns) as (keyof typeof patterns)[]).map(
    key => ({
      label: key,
      score: estimate(structure, patterns[key]),
    }),
  );

  return {
    key: baseNote.key,
    ...estimated.reduce((x, y) => (x.score >= y.score ? x : y)),
  };
}

type FormElement = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
type Form = FormElement[];

const patterns: { [key: string]: Form } = {
  "5": [7],
  "": [4, 7],
  m: [3, 7],
  aug: [4, 8],
  dim: [3, 6],
  sus2: [2, 7],
  sus4: [5, 7],
  M7: [4, 7, 11],
  m7: [3, 7, 10],
  "7": [4, 7, 10],
  "7♭5": [4, 6, 10],
  "7sus4": [5, 7, 10],
  mM7: [3, 7, 11],
  dim7: [3, 6, 11],
  ø7: [3, 6, 10],
  M9: [2, 4, 7, 11],
  m9: [2, 3, 7, 10],
  M11: [2, 4, 5, 7, 11],
  m11: [2, 3, 5, 7, 10],
  M13: [2, 4, 6, 7, 9, 11],
  m13: [2, 3, 5, 7, 9, 10],
};

function estimate(structure: Form, chord: Form): number {
  const allFormElements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] as Form;
  return allFormElements
    .map(distance => {
      if (structure.includes(distance)) {
        if (chord.includes(distance))
          return 1 / allFormElements.filter(k => chord.includes(k)).length;
        return -1 / allFormElements.filter(k => !chord.includes(k)).length;
      }
      return 0;
    })
    .reduce((x, y) => x + y);
}
