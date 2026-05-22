
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bird,
  CloudRain,
  Coffee,
  Timer,
  Play,
  Pause,
  Volume2,
  Moon,
  Sparkles,
  Wind,
} from "lucide-react";
import "./styles.css";

const SOUND_FILES = {
  rain: "/sounds/rain.mp3",
  wind: "/sounds/wind.mp3",
  cafe: "/sounds/cafe.mp3",
  birds: "/sounds/birds.mp3",
};

const DEFAULT_TRACKS = [
  { id: "rain", name: "Rain", icon: CloudRain, volume: 65, enabled: true, color: "blue" },
  { id: "wind", name: "Soft Wind", icon: Wind, volume: 25, enabled: true, color: "lavender" },
  { id: "cafe", name: "Quiet Cafe", icon: Coffee, volume: 20, enabled: true, color: "sage" },
  { id: "birds", name: "Birdsong", icon: Bird, volume: 12, enabled: true, color: "peach" },
];

const PRESETS = [
  {
    id: "rainy-cafe",
    name: "Rainy Cafe",
    description: "Rain, soft wind, cafe warmth, and tiny birds.",
    emoji: "🌧️",
    values: { rain: 65, wind: 25, cafe: 20, birds: 12 },
  },
  {
    id: "window-breeze",
    name: "Window Breeze",
    description: "A calm room with wind and distant birds.",
    emoji: "🌬️",
    values: { rain: 25, wind: 45, cafe: 10, birds: 18 },
  },
  {
    id: "sleepy-rain",
    name: "Sleepy Rain",
    description: "Mostly rain, almost no distractions.",
    emoji: "🌙",
    values: { rain: 75, wind: 18, cafe: 0, birds: 0 },
  },
];

const TIMER_OPTIONS = [
  { label: "15 min", minutes: 15 },
  { label: "30 min", minutes: 30 },
  { label: "60 min", minutes: 60 },
  { label: "No timer", minutes: null },
];

function loadSavedTracks() {
  try {
    const saved = localStorage.getItem("rainy-cup-corner-tracks-v2");
    return saved ? JSON.parse(saved) : DEFAULT_TRACKS;
  } catch {
    return DEFAULT_TRACKS;
  }
}

function App() {
  const [tracks, setTracks] = useState(loadSavedTracks);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [activePreset, setActivePreset] = useState("rainy-cafe");
  const [audioReadyNote, setAudioReadyNote] = useState("");
  const audioRefs = useRef({});
  const timerIntervalRef = useRef(null);

  const activeTracks = useMemo(
    () => tracks.filter((track) => track.enabled && track.volume > 0),
    [tracks]
  );

  useEffect(() => {
    localStorage.setItem("rainy-cup-corner-tracks-v2", JSON.stringify(tracks));
  }, [tracks]);

  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.src = "";
      });
      clearInterval(timerIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    tracks.forEach((track) => {
      const audio = getAudio(track.id);
      audio.volume = track.enabled ? track.volume / 100 : 0;

      if (track.enabled && track.volume > 0 && audio.paused) {
        audio.play().catch(() => {
          setAudioReadyNote("Tap Play again if your browser blocks audio at first.");
        });
      }

      if (!track.enabled || track.volume === 0) {
        audio.pause();
      }
    });
  }, [tracks, isPlaying]);

  useEffect(() => {
    if (!isPlaying || selectedTimer === null) {
      setTimeLeft(null);
      clearInterval(timerIntervalRef.current);
      return;
    }

    const endAt = Date.now() + selectedTimer * 60 * 1000;
    setTimeLeft(selectedTimer * 60);

    clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      const secondsLeft = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setTimeLeft(secondsLeft);

      if (secondsLeft <= 0) {
        clearInterval(timerIntervalRef.current);
        fadeOutAndPause();
      }
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [selectedTimer, isPlaying]);

  function getAudio(trackId) {
    if (!audioRefs.current[trackId]) {
      const audio = new Audio(SOUND_FILES[trackId]);
      audio.loop = true;
      audio.preload = "auto";
      audioRefs.current[trackId] = audio;
    }
    return audioRefs.current[trackId];
  }

  function startPlayback() {
    setAudioReadyNote("");
    tracks.forEach((track) => {
      const audio = getAudio(track.id);
      audio.volume = track.enabled ? track.volume / 100 : 0;

      if (track.enabled && track.volume > 0) {
        audio.play().catch(() => {
          setAudioReadyNote("Audio files are missing or your browser needs another tap.");
        });
      }
    });
    setIsPlaying(true);
  }

  function pausePlayback() {
    Object.values(audioRefs.current).forEach((audio) => audio.pause());
    setIsPlaying(false);
  }

  function fadeOutAndPause() {
    const steps = 20;
    const duration = 12000;
    const interval = duration / steps;
    let currentStep = 0;

    const originalVolumes = {};
    tracks.forEach((track) => {
      originalVolumes[track.id] = track.volume / 100;
    });

    const fade = setInterval(() => {
      currentStep += 1;
      const ratio = Math.max(0, 1 - currentStep / steps);

      tracks.forEach((track) => {
        const audio = audioRefs.current[track.id];
        if (audio) audio.volume = originalVolumes[track.id] * ratio;
      });

      if (currentStep >= steps) {
        clearInterval(fade);
        pausePlayback();
      }
    }, interval);
  }

  function toggleTrack(trackId) {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId ? { ...track, enabled: !track.enabled } : track
      )
    );
  }

  function updateVolume(trackId, volume) {
    setTracks((prev) =>
      prev.map((track) =>
        track.id === trackId
          ? { ...track, volume: Number(volume), enabled: Number(volume) > 0 }
          : track
      )
    );
  }

  function applyPreset(preset) {
    setActivePreset(preset.id);
    setTracks((prev) =>
      prev.map((track) => {
        const volume = preset.values[track.id] ?? 0;
        return { ...track, volume, enabled: volume > 0 };
      })
    );
  }

  function formatTime(seconds) {
    if (seconds === null) return "";
    const mins = Math.floor(seconds / 60);
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <div className="brand-row">
            <div className="brand-icon">
              <CloudRain size={22} />
            </div>
            <div>
              <h1>Rainy Cup Corner</h1>
              <p>mix your own cozy ambience</p>
            </div>
          </div>

          <div className="hero-copy">
            <span className="eyebrow">
              <Sparkles size={14} /> soft mode
            </span>
            <h2>Make today a little softer.</h2>
            <p>
              Blend rain, wind, cafe air, and birdsong into one quiet corner.
            </p>
          </div>
        </div>

        <div className="rain-window" aria-hidden="true">
          <div className="window-glass">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className="cup">☕</div>
        </div>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h3>Quick Presets</h3>
          <span>tap to blend</span>
        </div>

        <div className="preset-grid">
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              className={`preset-card ${activePreset === preset.id ? "active" : ""}`}
              onClick={() => applyPreset(preset)}
            >
              <span>{preset.emoji}</span>
              <strong>{preset.name}</strong>
              <small>{preset.description}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="panel mixer-panel">
        <div className="section-heading">
          <h3>Sound Mixer</h3>
          <button
            className="ghost-button"
            onClick={() => {
              setTracks(DEFAULT_TRACKS);
              setActivePreset("rainy-cafe");
              localStorage.removeItem("rainy-cup-corner-tracks-v2");
            }}
          >
            Reset
          </button>
        </div>

        <div className="track-list">
          {tracks.map((track) => (
            <SoundControl
              key={track.id}
              track={track}
              onToggle={() => toggleTrack(track.id)}
              onVolumeChange={(value) => updateVolume(track.id, value)}
            />
          ))}
        </div>
      </section>

      <section className="panel timer-panel">
        <div className="section-heading">
          <h3>
            <Timer size={18} /> Timer
          </h3>
          {timeLeft !== null && <span>{formatTime(timeLeft)}</span>}
        </div>

        <div className="timer-grid">
          {TIMER_OPTIONS.map((option) => (
            <button
              key={option.label}
              className={`timer-button ${
                selectedTimer === option.minutes ? "active" : ""
              }`}
              onClick={() => setSelectedTimer(option.minutes)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <p className="tiny-note">
          <Moon size={14} /> Timer fades out gently before stopping.
        </p>
      </section>

      <section className="panel now-playing">
        <div className="section-heading">
          <h3>Now Playing</h3>
          <span>{activeTracks.length ? "cozy layers" : "silent"}</span>
        </div>

        <div className="active-pills">
          {activeTracks.length ? (
            activeTracks.map((track) => <span key={track.id}>{track.name}</span>)
          ) : (
            <span>No active sounds yet</span>
          )}
        </div>

        <button
          className="play-button"
          onClick={isPlaying ? pausePlayback : startPlayback}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          {isPlaying ? "Pause" : "Start Cozy Mode"}
        </button>

        {audioReadyNote && <p className="audio-note">{audioReadyNote}</p>}
      </section>
    </main>
  );
}

function SoundControl({ track, onToggle, onVolumeChange }) {
  const Icon = track.icon;

  return (
    <article className={`track-card ${track.color}`}>
      <div className="track-main">
        <div className="track-icon">
          <Icon size={20} />
        </div>
        <div>
          <h4>{track.name}</h4>
          <p>{track.enabled ? "enabled" : "muted"}</p>
        </div>
      </div>

      <button
        className={`toggle ${track.enabled ? "on" : ""}`}
        onClick={onToggle}
        aria-label={`Toggle ${track.name}`}
      >
        <span />
      </button>

      <div className="volume-row">
        <Volume2 size={16} />
        <input
          aria-label={`${track.name} volume`}
          type="range"
          min="0"
          max="100"
          value={track.volume}
          onChange={(event) => onVolumeChange(event.target.value)}
        />
        <strong>{track.volume}%</strong>
      </div>
    </article>
  );
}

createRoot(document.getElementById("root")).render(<App />);
