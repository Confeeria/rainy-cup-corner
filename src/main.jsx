
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Bird, BookmarkPlus, CloudRain, Coffee, Moon, Pause, Play, SlidersHorizontal, Sparkles, Timer, Volume2, Wind } from "lucide-react";
import "./styles.css";

const SOUND_FILES = {
  rain: "/sounds/rain.mp3",
  wind: "/sounds/wind.mp3",
  cafe: "/sounds/cafe.mp3",
  birds: "/sounds/birds.mp3",
};

const STORAGE_TRACKS = "rainy-cup-corner-tracks-v4";
const STORAGE_CUSTOM_PRESET = "rainy-cup-corner-custom-preset-v4";

const DEFAULT_TRACKS = [
  { id: "rain", name: "Rain", icon: CloudRain, volume: 65, enabled: true, color: "blue" },
  { id: "wind", name: "Soft Wind", icon: Wind, volume: 25, enabled: true, color: "lavender" },
  { id: "cafe", name: "Quiet Cafe", icon: Coffee, volume: 20, enabled: true, color: "sage" },
  { id: "birds", name: "Birdsong", icon: Bird, volume: 12, enabled: true, color: "peach" },
];

const BASE_PRESETS = [
  { id: "rainy-cafe", name: "Rainy Cafe", desc: "Rain, wind, cafe warmth.", emoji: "🌧️", values: { rain: 65, wind: 25, cafe: 20, birds: 12 } },
  { id: "window-breeze", name: "Window Breeze", desc: "Soft wind and distant birds.", emoji: "🌬️", values: { rain: 25, wind: 45, cafe: 10, birds: 18 } },
  { id: "sleepy-rain", name: "Sleepy Rain", desc: "Mostly rain, fewer details.", emoji: "🌙", values: { rain: 75, wind: 18, cafe: 0, birds: 0 } },
];

const TIMERS = [
  { label: "15", sub: "min", minutes: 15 },
  { label: "30", sub: "min", minutes: 30 },
  { label: "60", sub: "min", minutes: 60 },
  { label: "∞", sub: "no timer", minutes: null },
];

function loadSavedTracks() {
  try {
    const saved = localStorage.getItem(STORAGE_TRACKS);
    return saved ? JSON.parse(saved) : DEFAULT_TRACKS;
  } catch {
    return DEFAULT_TRACKS;
  }
}

function loadCustomPreset() {
  try {
    const saved = localStorage.getItem(STORAGE_CUSTOM_PRESET);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

function App() {
  const [tracks, setTracks] = useState(loadSavedTracks);
  const [customPreset, setCustomPreset] = useState(loadCustomPreset);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [activePreset, setActivePreset] = useState("rainy-cafe");
  const [note, setNote] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const audioRefs = useRef({});
  const timerRef = useRef(null);
  const saveMessageRef = useRef(null);

  const activeTracks = useMemo(() => tracks.filter(t => t.enabled && t.volume > 0), [tracks]);

  const presets = useMemo(() => {
    const myMix = customPreset ?? {
      id: "my-cozy-mix",
      name: "My Cozy Mix",
      desc: "Save your current mix first.",
      emoji: "✨",
      values: null,
      isEmpty: true,
    };
    return [...BASE_PRESETS, myMix];
  }, [customPreset]);

  const timerStatus = useMemo(() => {
    if (timer === null) return "No timer set";
    if (!isPlaying) return `Timer ready: ${timer} min`;
    if (timeLeft !== null) return `Stopping in ${formatTime(timeLeft)}`;
    return `Timer active: ${timer} min`;
  }, [timer, isPlaying, timeLeft]);

  useEffect(() => {
    localStorage.setItem(STORAGE_TRACKS, JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach(a => { a.pause(); a.src = ""; });
      clearInterval(timerRef.current);
      clearTimeout(saveMessageRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    tracks.forEach(track => {
      const audio = getAudio(track.id);
      audio.volume = track.enabled ? track.volume / 100 : 0;
      if (track.enabled && track.volume > 0 && audio.paused) {
        audio.play().catch(() => setNote("Tap Play again if your browser blocks audio at first."));
      }
      if (!track.enabled || track.volume === 0) audio.pause();
    });
  }, [tracks, isPlaying]);

  useEffect(() => {
    if (!isPlaying || timer === null) {
      setTimeLeft(null);
      clearInterval(timerRef.current);
      return;
    }
    const endAt = Date.now() + timer * 60 * 1000;
    setTimeLeft(timer * 60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setTimeLeft(left);
      if (left <= 0) {
        clearInterval(timerRef.current);
        fadeOutAndPause();
      }
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timer, isPlaying]);

  function getAudio(trackId) {
    if (!audioRefs.current[trackId]) {
      const audio = new Audio(SOUND_FILES[trackId]);
      audio.loop = true;
      audio.preload = "auto";
      audioRefs.current[trackId] = audio;
    }
    return audioRefs.current[trackId];
  }

  function start() {
    setNote("");
    tracks.forEach(track => {
      const audio = getAudio(track.id);
      audio.volume = track.enabled ? track.volume / 100 : 0;
      if (track.enabled && track.volume > 0) {
        audio.play().catch(() => setNote("Audio files are missing or your browser needs another tap."));
      }
    });
    setIsPlaying(true);
  }

  function pause() {
    Object.values(audioRefs.current).forEach(audio => audio.pause());
    setIsPlaying(false);
  }

  function fadeOutAndPause() {
    const steps = 20;
    let step = 0;
    const original = {};
    tracks.forEach(track => original[track.id] = track.volume / 100);
    const fade = setInterval(() => {
      step += 1;
      const ratio = Math.max(0, 1 - step / steps);
      tracks.forEach(track => {
        const audio = audioRefs.current[track.id];
        if (audio) audio.volume = original[track.id] * ratio;
      });
      if (step >= steps) {
        clearInterval(fade);
        pause();
      }
    }, 600);
  }

  function toggleTrack(id) {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  }

  function updateVolume(id, volume) {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, volume: Number(volume), enabled: Number(volume) > 0 } : t));
  }

  function applyPreset(preset) {
    if (!preset.values) {
      setSaveMessage("Adjust your mix, then tap Save Mix ✨");
      clearTimeout(saveMessageRef.current);
      saveMessageRef.current = setTimeout(() => setSaveMessage(""), 2400);
      return;
    }

    setActivePreset(preset.id);
    setTracks(prev => prev.map(t => {
      const volume = preset.values[t.id] ?? 0;
      return { ...t, volume, enabled: volume > 0 };
    }));
  }

  function saveCurrentMix() {
    const values = {};
    tracks.forEach(track => {
      values[track.id] = track.enabled ? track.volume : 0;
    });

    const savedPreset = {
      id: "my-cozy-mix",
      name: "My Cozy Mix",
      desc: "Your saved rainy corner.",
      emoji: "✨",
      values,
      isEmpty: false,
    };

    localStorage.setItem(STORAGE_CUSTOM_PRESET, JSON.stringify(savedPreset));
    setCustomPreset(savedPreset);
    setActivePreset("my-cozy-mix");
    setSaveMessage("Saved My Cozy Mix ✨");
    clearTimeout(saveMessageRef.current);
    saveMessageRef.current = setTimeout(() => setSaveMessage(""), 2400);
  }

  function formatTime(sec) {
    if (sec === null) return "";
    return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
  }

  return (
    <main className="stage">
      <div className="app">
        <header className="topbar">
          <div className="brand">
            <div className="brandIcon"><CloudRain size={20} /></div>
            <div><h1>Rainy Cup Corner</h1><p>mix your own cozy ambience</p></div>
          </div>
          <button className="iconButton" aria-label="Sleep mode"><Moon size={18} /></button>
        </header>

        <section className="hero">
          <div className="heroText">
            <span className="eyebrow"><Sparkles size={13} /> soft mode</span>
            <h2>Make today a little softer.</h2>
            <p>Blend rain, wind, cafe air, and birdsong into one quiet corner.</p>
          </div>
          <div className="window" aria-hidden="true">
            <div className="glass"><i /><i /><i /><i /></div>
            <div className="cup">☕</div>
          </div>
        </section>

        <section className="card">
          <div className="heading"><h3>Quick Presets</h3><span>tap to blend</span></div>
          <div className="presetRow">
            {presets.map(p => (
              <button key={p.id} onClick={() => applyPreset(p)} className={`preset ${activePreset === p.id ? "active" : ""} ${p.isEmpty ? "emptyPreset" : ""}`}>
                <span>{p.emoji}</span><strong>{p.name}</strong><small>{p.desc}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="card mixer">
          <div className="heading">
            <h3><SlidersHorizontal size={18} /> Sound Mixer</h3>
            <button className="reset" onClick={() => { setTracks(DEFAULT_TRACKS); setActivePreset("rainy-cafe"); }}>Reset</button>
          </div>
          <div className="trackList">
            {tracks.map(track => <SoundControl key={track.id} track={track} onToggle={() => toggleTrack(track.id)} onVolume={v => updateVolume(track.id, v)} />)}
          </div>
        </section>

        <section className="sleepPanel">
          <div className="grabber" />
          <div className="heading">
            <h3><Timer size={18} /> Timer</h3>
            {timeLeft !== null && <span>{formatTime(timeLeft)}</span>}
          </div>

          <div className="timerGrid">
            {TIMERS.map(t => <button key={t.sub + t.label} onClick={() => setTimer(t.minutes)} className={`timer ${timer === t.minutes ? "active" : ""}`}><strong>{t.label}</strong><small>{t.sub}</small></button>)}
          </div>

          <div className={`timerStatus ${timer !== null ? "active" : ""}`}>
            {timerStatus}
          </div>

          <div className="nowPlaying">
            <div>
              <h3>Now Playing</h3>
              <div className="pills">
                {activeTracks.length ? activeTracks.map(t => <span key={t.id}>{t.name}</span>) : <span>No active sounds</span>}
              </div>
            </div>
            <button className="play" onClick={isPlaying ? pause : start} aria-label={isPlaying ? "Pause" : "Play"}>{isPlaying ? <Pause size={28} /> : <Play size={28} />}</button>
          </div>

          <button className="saveMix" onClick={saveCurrentMix}>
            <BookmarkPlus size={18} /> Save Mix
          </button>

          {saveMessage && <p className="saveMessage">{saveMessage}</p>}
          {note && <p className="note">{note}</p>}
        </section>

        <nav className="bottomNav"><span className="active">Mixer</span><span>Presets</span><span>Timer</span><span>Profile</span></nav>
      </div>
    </main>
  );
}

function SoundControl({ track, onToggle, onVolume }) {
  const Icon = track.icon;
  return (
    <article className={`track ${track.color}`}>
      <div className="trackTop">
        <div className="trackName">
          <div className="trackIcon"><Icon size={19} /></div>
          <div><h4>{track.name}</h4><p>{track.enabled ? "enabled" : "muted"}</p></div>
        </div>
        <button aria-label={`Toggle ${track.name}`} onClick={onToggle} className={`toggle ${track.enabled ? "on" : ""}`}><span /></button>
      </div>
      <div className="volume"><Volume2 size={15} /><input type="range" min="0" max="100" value={track.volume} onChange={e => onVolume(e.target.value)} /><strong>{track.volume}%</strong></div>
    </article>
  );
}

createRoot(document.getElementById("root")).render(<App />);
