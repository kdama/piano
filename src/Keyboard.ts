import { Key, Note, transpose } from "./Note";

interface KeyMap {
  keys: string[];
  firstNote: Note;
}

const keyMaps: KeyMap[] = [
  {
    firstNote: { key: Key.C, octave: 3 },
    keys: [
      "z",
      "s",
      "x",
      "d",
      "c",
      "v",
      "g",
      "b",
      "h",
      "n",
      "j",
      "m",
      ",",
      "l",
      ".",
      ";",
      "/",
      "\\",
      "]",
    ],
  },
  {
    firstNote: { key: Key.C, octave: 4 },
    keys: [
      "q",
      "2",
      "w",
      "3",
      "e",
      "r",
      "5",
      "t",
      "6",
      "y",
      "7",
      "u",
      "i",
      "9",
      "o",
      "0",
      "p",
      "@",
      "^",
      "[",
    ],
  },
  {
    firstNote: { key: Key.A, octave: 5 },
    keys: ["Enter"],
  },
];

export function keyboardEventToNote(
  event: React.KeyboardEvent,
  transposee: number,
): Note | undefined {
  if (event.repeat) return;
  const keyMap = keyMaps.find(km => km.keys.includes(event.key));
  if (!keyMap) return;
  const index = keyMap.keys.indexOf(event.key);
  return transpose(keyMap.firstNote, index + transposee);
}
