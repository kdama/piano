import { Note, noteFromNumber, noteToNumber } from "./Note";

export default function detect(notes: Note[]): string {
  if (notes.length === 0) {
    return "N/A";
  }
  const noteNumbers = notes.map(n => noteToNumber(n));
  const baseNoteNumber = Math.min(...noteNumbers);
  const baseNote = noteFromNumber(baseNoteNumber);
  const structure = {
    a1: noteNumbers.some(n => (n - baseNoteNumber) % 12 === 1),
    a2: noteNumbers.some(n => (n - baseNoteNumber) % 12 === 2),
    a3: noteNumbers.some(n => (n - baseNoteNumber) % 12 === 3),
    a4: noteNumbers.some(n => (n - baseNoteNumber) % 12 === 4),
    a5: noteNumbers.some(n => (n - baseNoteNumber) % 12 === 5),
    a6: noteNumbers.some(n => (n - baseNoteNumber) % 12 === 6),
    a7: noteNumbers.some(n => (n - baseNoteNumber) % 12 === 7),
    a8: noteNumbers.some(n => (n - baseNoteNumber) % 12 === 8),
    a9: noteNumbers.some(n => (n - baseNoteNumber) % 12 === 9),
    a10: noteNumbers.some(n => (n - baseNoteNumber) % 12 === 10),
    a11: noteNumbers.some(n => (n - baseNoteNumber) % 12 === 11),
  };

  const estimated = [
    {
      label: "",
      score: estimate(structure, major),
    },
    {
      label: "m",
      score: estimate(structure, minor),
    },
    {
      label: "aug",
      score: estimate(structure, augment),
    },
    {
      label: "dim",
      score: estimate(structure, diminish),
    },
    {
      label: "sus2",
      score: estimate(structure, sus2),
    },
    {
      label: "sus4",
      score: estimate(structure, sus4),
    },
    {
      label: "M7",
      score: estimate(structure, major7th),
    },
    {
      label: "M9",
      score: estimate(structure, major9th),
    },
    {
      label: "m7",
      score: estimate(structure, minor7th),
    },
    {
      label: "m9",
      score: estimate(structure, minor9th),
    },
  ];

  if (estimated.every(e => e.score < 0.5)) {
    return `?/${baseNote.key}`;
  }
  const max = estimated.reduce((x, y) => (x.score >= y.score ? x : y));
  return `${baseNote.key}${max.label}`;
}

interface Structure {
  a1?: boolean;
  a2?: boolean;
  a3?: boolean;
  a4?: boolean;
  a5?: boolean;
  a6?: boolean;
  a7?: boolean;
  a8?: boolean;
  a9?: boolean;
  a10?: boolean;
  a11?: boolean;
}

const major: Structure = {
  a4: true,
  a7: true,
};

const minor: Structure = {
  a3: true,
  a7: true,
};

const augment: Structure = {
  a4: true,
  a8: true,
};

const diminish: Structure = {
  a3: true,
  a6: true,
};

const sus2: Structure = {
  a2: true,
  a7: true,
};

const sus4: Structure = {
  a5: true,
  a7: true,
};

const major7th: Structure = {
  a4: true,
  a7: true,
  a11: true,
};

const major9th: Structure = {
  a2: true,
  a4: true,
  a7: true,
  a11: true,
};

const minor7th: Structure = {
  a3: true,
  a7: true,
  a10: true,
};

const minor9th: Structure = {
  a2: true,
  a3: true,
  a7: true,
  a10: true,
};

function estimate(structure: Structure, chord: Structure): number {
  return Object.keys(structure)
    .map(key => {
      if (structure[key as keyof Structure]) {
        if (chord[key as keyof Structure])
          return (
            1 /
            Object.keys(structure).filter(k => chord[k as keyof Structure])
              .length
          );
        return (
          -1 /
          Object.keys(structure).filter(k => !chord[k as keyof Structure])
            .length
        );
      }
      return 0;
    })
    .reduce((x, y) => x + y);
}
