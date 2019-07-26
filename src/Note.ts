export interface Note {
  key: Key;
  octave: number;
}

export enum Key {
  C = "C",
  CSharp = "C#",
  D = "D",
  DSharp = "D#",
  E = "E",
  F = "F",
  FSharp = "F#",
  G = "G",
  GSharp = "G#",
  A = "A",
  ASharp = "A#",
  B = "B",
}

export function noteToNumber(note: Note): number {
  // { key: C, octave: -1 } -> 0
  switch (note.key) {
    case Key.C:
      return note.octave * 12 + 0 + 12;
    case Key.CSharp:
      return note.octave * 12 + 1 + 12;
    case Key.D:
      return note.octave * 12 + 2 + 12;
    case Key.DSharp:
      return note.octave * 12 + 3 + 12;
    case Key.E:
      return note.octave * 12 + 4 + 12;
    case Key.F:
      return note.octave * 12 + 5 + 12;
    case Key.FSharp:
      return note.octave * 12 + 6 + 12;
    case Key.G:
      return note.octave * 12 + 7 + 12;
    case Key.GSharp:
      return note.octave * 12 + 8 + 12;
    case Key.A:
      return note.octave * 12 + 9 + 12;
    case Key.ASharp:
      return note.octave * 12 + 10 + 12;
    case Key.B:
      return note.octave * 12 + 11 + 12;
  }
}

export function noteFromNumber(noteNumber: number): Note {
  // 0 -> { key: C, octave: -1 }
  const octave = Math.floor(noteNumber / 12) - 1;
  switch (noteNumber % 12) {
    case 0:
      return { key: Key.C, octave };
    case 1:
      return { key: Key.CSharp, octave };
    case 2:
      return { key: Key.D, octave };
    case 3:
      return { key: Key.DSharp, octave };
    case 4:
      return { key: Key.E, octave };
    case 5:
      return { key: Key.F, octave };
    case 6:
      return { key: Key.FSharp, octave };
    case 7:
      return { key: Key.G, octave };
    case 8:
      return { key: Key.GSharp, octave };
    case 9:
      return { key: Key.A, octave };
    case 10:
      return { key: Key.ASharp, octave };
    case 11:
      return { key: Key.B, octave };
    default:
      // TODO: error
      return { key: Key.C, octave: 0 };
  }
}

export function noteToString(note: Note) {
  return note.key.toUpperCase() + note.octave;
}

export function transpose(note: Note, n: number): Note {
  return noteFromNumber(noteToNumber(note) + n);
}
