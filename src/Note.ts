export interface Note {
  key: Key;
  octave: number;
}

export const Keys = {
  C: "C",
  CSharp: "C#",
  D: "D",
  DSharp: "D#",
  E: "E",
  F: "F",
  FSharp: "F#",
  G: "G",
  GSharp: "G#",
  A: "A",
  ASharp: "A#",
  B: "B",
} as const;
export type Key = (typeof Keys)[keyof typeof Keys];

export function noteToNumber(note: Note): number {
  // { key: C, octave: -1 } -> 0
  switch (note.key) {
    case Keys.C:
      return note.octave * 12 + 0 + 12;
    case Keys.CSharp:
      return note.octave * 12 + 1 + 12;
    case Keys.D:
      return note.octave * 12 + 2 + 12;
    case Keys.DSharp:
      return note.octave * 12 + 3 + 12;
    case Keys.E:
      return note.octave * 12 + 4 + 12;
    case Keys.F:
      return note.octave * 12 + 5 + 12;
    case Keys.FSharp:
      return note.octave * 12 + 6 + 12;
    case Keys.G:
      return note.octave * 12 + 7 + 12;
    case Keys.GSharp:
      return note.octave * 12 + 8 + 12;
    case Keys.A:
      return note.octave * 12 + 9 + 12;
    case Keys.ASharp:
      return note.octave * 12 + 10 + 12;
    case Keys.B:
      return note.octave * 12 + 11 + 12;
  }
}

export function noteFromNumber(noteNumber: number): Note {
  // 0 -> { key: C, octave: -1 }
  const octave = Math.floor(noteNumber / 12) - 1;
  switch (noteNumber % 12) {
    case 0:
      return { key: Keys.C, octave };
    case 1:
      return { key: Keys.CSharp, octave };
    case 2:
      return { key: Keys.D, octave };
    case 3:
      return { key: Keys.DSharp, octave };
    case 4:
      return { key: Keys.E, octave };
    case 5:
      return { key: Keys.F, octave };
    case 6:
      return { key: Keys.FSharp, octave };
    case 7:
      return { key: Keys.G, octave };
    case 8:
      return { key: Keys.GSharp, octave };
    case 9:
      return { key: Keys.A, octave };
    case 10:
      return { key: Keys.ASharp, octave };
    case 11:
      return { key: Keys.B, octave };
    default:
      // TODO: error
      return { key: Keys.C, octave: 0 };
  }
}

export function noteToString(note: Note) {
  return note.key.toUpperCase() + note.octave;
}

export function transpose(note: Note, n: number): Note {
  return noteFromNumber(noteToNumber(note) + n);
}
