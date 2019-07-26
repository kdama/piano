import React, { useState, useCallback } from "react";
import { instrument, Player, InstrumentName } from "soundfont-player";
import { keyboardEventToNote } from "./Keyboard";
import { Note, noteToNumber, noteFromNumber, noteToString } from "./Note";
import { defaultInstrument, instruments } from "./Instrument";
import detect from "./Chord";

let player: Player | null = null;

interface PlayingNotesMap {
  [key: string]: { stop: () => void }[] | undefined;
}

export default function App() {
  const [logs, setLogs] = useState<string[]>([]);
  const [playingNotesMap, setPlayingNotesMap] = useState<PlayingNotesMap>({});
  const [instrument, setInstrument] = useState<InstrumentName>(
    defaultInstrument,
  );
  const [release, setRelease] = useState<number>(10);
  const [transpose, setTranspose] = useState<number>(0);
  const handleKeyDown = useCallback(
    createHandleKeyDown(
      logs,
      setLogs,
      playingNotesMap,
      setPlayingNotesMap,
      release,
      transpose,
    ),
    [logs, playingNotesMap],
  );
  const handleKeyUp = useCallback(
    createHandleKeyUp(
      logs,
      setLogs,
      playingNotesMap,
      setPlayingNotesMap,
      transpose,
    ),
    [logs, playingNotesMap],
  );
  const handleSelect = useCallback(createHandleSelect(setInstrument), []);
  const handleRelease = useCallback(createHandleTranspose(setRelease), []);
  const handleTranspose = useCallback(createHandleTranspose(setTranspose), []);
  const handleActivate = useCallback(createActivate(instrument), [instrument]);
  const playingNotes = Object.keys(playingNotesMap)
    .filter(key => playingNotesMap[key])
    .map(noteNumber => noteFromNumber(Number(noteNumber)));
  return (
    <div onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} tabIndex={0}>
      <div>
        Instrument:
        <select onChange={handleSelect} defaultValue={defaultInstrument}>
          {instruments.map((instrument, idx) => (
            <option key={idx} value={instrument}>
              {instrument
                .split("_")
                .map(s => (s ? s[0].toUpperCase() + s.substr(1) : s))
                .join(" ")}
            </option>
          ))}
        </select>
      </div>
      <div>
        Transpose:
        <input onChange={handleTranspose} defaultValue={String(transpose)} />
      </div>
      <div>
        Release:{" "}
        <input onChange={handleRelease} defaultValue={String(release)} />
      </div>
      <div>
        <button onClick={handleActivate}>Start</button>
      </div>
      <p>
        Playing:
        {playingNotes.map(n => noteToString(n)).join(", ") || "-"}
      </p>
      <p>
        Guess:
        {detect(playingNotes)}
      </p>
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

function createHandleTranspose(
  setTranspose: React.Dispatch<React.SetStateAction<number>>,
) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    setTranspose(Number(event.target.value));
  };
}

function createHandleRelease(
  setRelease: React.Dispatch<React.SetStateAction<number>>,
) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    setRelease(Number(event.target.value));
  };
}

function createHandleKeyDown(
  logs: string[],
  setLogs: React.Dispatch<React.SetStateAction<string[]>>,
  playingNotesMap: PlayingNotesMap,
  setPlayingNotesMap: React.Dispatch<React.SetStateAction<PlayingNotesMap>>,
  release: number,
  transpose: number,
) {
  return async (event: React.KeyboardEvent) => {
    const note = keyboardEventToNote(event, transpose);
    if (note) {
      console.log(noteToString(note));
      const playingNote = await play(note, logs, release, setLogs);
      if (!playingNote) {
        return;
      }
      setPlayingNotesMap({
        ...playingNotesMap,
        [noteToNumber(note)]: [
          ...(playingNotesMap[noteToNumber(note)] || []),
          { stop: () => playingNote.stop() },
        ],
      });
    }
  };
}

function createHandleKeyUp(
  logs: string[],
  setLogs: React.Dispatch<React.SetStateAction<string[]>>,
  playingNotesMap: PlayingNotesMap,
  setPlayingNotesMap: React.Dispatch<React.SetStateAction<PlayingNotesMap>>,
  transpose: number,
) {
  return async (event: React.KeyboardEvent) => {
    const note = keyboardEventToNote(event, transpose);
    if (note) {
      console.log(noteToString(note));
      await stop(
        note,
        playingNotesMap[noteToNumber(note)] || [],
        logs,
        setLogs,
      );
      setPlayingNotesMap({
        ...playingNotesMap,
        [noteToNumber(note)]: undefined,
      });
    }
  };
}

async function play(
  note: Note,
  logs: string[],
  release: number,
  setLogs: React.Dispatch<React.SetStateAction<string[]>>,
) {
  setLogs([`${noteToString(note)} - PLAY`, ...logs.splice(0, 16)]);
  if (!player) {
    return;
  }
  return player.play(noteToString(note), undefined, { release });
}

async function stop(
  note: Note,
  playingNotes: { stop: () => void }[],
  logs: string[],
  setLogs: React.Dispatch<React.SetStateAction<string[]>>,
) {
  setLogs([`${noteToString(note)} - STOP`, ...logs.splice(0, 16)]);
  playingNotes.forEach(pn => pn.stop());
}

function createActivate(instrumentName: InstrumentName) {
  return async () => {
    player = await instrument(new AudioContext() as any, instrumentName);
  };
}
