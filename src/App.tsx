import React, { useState, useEffect } from "react";
import { instrument, Player, InstrumentName } from "soundfont-player";

interface Note {
  key: string;
  octave: number;
}

const keymap: {
  [key: string]: Note | undefined;
} = {
  z: { key: "c", octave: 4 },
  s: { key: "c#", octave: 4 },
  x: { key: "d", octave: 4 },
  d: { key: "d#", octave: 4 },
  c: { key: "e", octave: 4 },
  v: { key: "f", octave: 4 },
  g: { key: "f#", octave: 4 },
  b: { key: "g", octave: 4 },
  h: { key: "g#", octave: 4 },
  n: { key: "a", octave: 4 },
  j: { key: "a#", octave: 4 },
  m: { key: "b", octave: 4 },
  ",": { key: "c", octave: 5 },
  l: { key: "c#", octave: 5 },
  ".": { key: "d", octave: 5 },
  ";": { key: "d#", octave: 5 },
  "/": { key: "e", octave: 5 },
  "\\": { key: "f", octave: 5 },
  "]": { key: "f#", octave: 5 },
  q: { key: "c", octave: 5 },
  2: { key: "c#", octave: 5 },
  w: { key: "d", octave: 5 },
  3: { key: "d#", octave: 5 },
  e: { key: "e", octave: 5 },
  r: { key: "f", octave: 5 },
  5: { key: "f#", octave: 5 },
  t: { key: "g", octave: 5 },
  6: { key: "g#", octave: 5 },
  y: { key: "a", octave: 5 },
  7: { key: "a#", octave: 5 },
  u: { key: "b", octave: 5 },
  i: { key: "c", octave: 6 },
  9: { key: "c#", octave: 6 },
  o: { key: "d", octave: 6 },
  0: { key: "d#", octave: 6 },
  p: { key: "e", octave: 6 },
  "@": { key: "f", octave: 6 },
  "^": { key: "f#", octave: 6 },
  "[": { key: "g", octave: 6 },
};

const instruments: InstrumentName[] = [
  "accordion",
  "acoustic_bass",
  "acoustic_grand_piano",
  "acoustic_guitar_nylon",
  "acoustic_guitar_steel",
  "agogo",
  "alto_sax",
  "applause",
  "bagpipe",
  "banjo",
  "baritone_sax",
  "bassoon",
  "bird_tweet",
  "blown_bottle",
  "brass_section",
  "breath_noise",
  "bright_acoustic_piano",
  "celesta",
  "cello",
  "choir_aahs",
  "church_organ",
  "clarinet",
  "clavinet",
  "contrabass",
  "distortion_guitar",
  "drawbar_organ",
  "dulcimer",
  "electric_bass_finger",
  "electric_bass_pick",
  "electric_grand_piano",
  "electric_guitar_clean",
  "electric_guitar_jazz",
  "electric_guitar_muted",
  "electric_piano_1",
  "electric_piano_2",
  "english_horn",
  "fiddle",
  "flute",
  "french_horn",
  "fretless_bass",
  "fx_1_rain",
  "fx_2_soundtrack",
  "fx_3_crystal",
  "fx_4_atmosphere",
  "fx_5_brightness",
  "fx_6_goblins",
  "fx_7_echoes",
  "fx_8_scifi",
  "glockenspiel",
  "guitar_fret_noise",
  "guitar_harmonics",
  "gunshot",
  "harmonica",
  "harpsichord",
  "helicopter",
  "honkytonk_piano",
  "kalimba",
  "koto",
  "lead_1_square",
  "lead_2_sawtooth",
  "lead_3_calliope",
  "lead_4_chiff",
  "lead_5_charang",
  "lead_6_voice",
  "lead_7_fifths",
  "lead_8_bass__lead",
  "marimba",
  "melodic_tom",
  "music_box",
  "muted_trumpet",
  "oboe",
  "ocarina",
  "orchestra_hit",
  "orchestral_harp",
  "overdriven_guitar",
  "pad_1_new_age",
  "pad_2_warm",
  "pad_3_polysynth",
  "pad_4_choir",
  "pad_5_bowed",
  "pad_6_metallic",
  "pad_7_halo",
  "pad_8_sweep",
  "pan_flute",
  "percussive_organ",
  "piccolo",
  "pizzicato_strings",
  "recorder",
  "reed_organ",
  "reverse_cymbal",
  "rock_organ",
  "seashore",
  "shakuhachi",
  "shamisen",
  "shanai",
  "sitar",
  "slap_bass_1",
  "slap_bass_2",
  "soprano_sax",
  "steel_drums",
  "string_ensemble_1",
  "string_ensemble_2",
  "synth_bass_1",
  "synth_bass_2",
  "synth_brass_1",
  "synth_brass_2",
  "synth_choir",
  "synth_drum",
  "synth_strings_1",
  "synth_strings_2",
  "taiko_drum",
  "tango_accordion",
  "telephone_ring",
  "tenor_sax",
  "timpani",
  "tinkle_bell",
  "tremolo_strings",
  "trombone",
  "trumpet",
  "tuba",
  "tubular_bells",
  "vibraphone",
  "viola",
  "violin",
  "voice_oohs",
  "whistle",
  "woodblock",
  "xylophone",
];

const defaultInstrument = "acoustic_grand_piano";

let player: Player | null = null;

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [instrument, setInstrument] = useState<InstrumentName>(
    defaultInstrument,
  );
  useEffect(() => {
    document.onkeydown = createHandleKeyDown(logs, setLogs);
    document.onkeyup = createHandleKeyUp(logs, setLogs);
  });
  return (
    <div>
      <h1>Piano</h1>
      <select
        onChange={createHandleSelect(setInstrument)}
        defaultValue={defaultInstrument}
      >
        {instruments.map((instrument, idx) => (
          <option key={idx} value={instrument}>
            {instrument}
          </option>
        ))}
      </select>
      <button onClick={createActivate(instrument)}>Start</button>
      <ul>
        {logs.map((log, idx) => (
          <li key={idx}>{log}</li>
        ))}
      </ul>
    </div>
  );
}

function createHandleSelect(
  setInstrument: React.Dispatch<React.SetStateAction<InstrumentName>>,
) {
  return (event: React.ChangeEvent<HTMLSelectElement>) => {
    setInstrument(event.target.value as InstrumentName);
  };
}

function createHandleKeyDown(
  logs: string[],
  setLogs: React.Dispatch<React.SetStateAction<string[]>>,
) {
  return (event: KeyboardEvent) => {
    if (event.repeat) return;
    const note = keymap[event.key];
    if (note) {
      play(note, logs, setLogs);
    }
  };
}

function createHandleKeyUp(
  logs: string[],
  setLogs: React.Dispatch<React.SetStateAction<string[]>>,
) {
  return (event: KeyboardEvent) => {
    if (event.repeat) return;
    const note = keymap[event.key];
    if (note) {
      stop(note, logs, setLogs);
    }
  };
}

async function play(
  note: Note,
  logs: string[],
  setLogs: React.Dispatch<React.SetStateAction<string[]>>,
) {
  setLogs([...logs, noteToString(note) + " PLAY"]);
  player && player.play(noteToString(note));
}

async function stop(
  note: Note,
  logs: string[],
  setLogs: React.Dispatch<React.SetStateAction<string[]>>,
) {
  setLogs([...logs, noteToString(note) + " STOP"]);
}

function noteToString(note: Note) {
  return note.key + note.octave;
}

function createActivate(instrumentName: InstrumentName) {
  return async () => {
    player = await instrument(new AudioContext() as any, instrumentName);
  };
}
