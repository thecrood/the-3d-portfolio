// Web Audio API Sound Synthesizer & Open-Source Audio Engine
// Features: Real-time Procedural Birdsong, Ocean Lake Waves, Polyphonic Open-Source Music (Satie, Buckley, Debussy, MacLeod)
import { MUSIC_DISCS } from "@/data/musicDiscs";

function noteToFreq(note) {
  if (!note || typeof note !== "string") return 440;
  const match = note.match(/^([A-G])([#b]?)(-?\d+)$/i);
  if (!match) return 440;

  const noteMap = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let semitone = noteMap[match[1].toUpperCase()] || 0;
  if (match[2] === "#") semitone += 1;
  if (match[2] === "b") semitone -= 1;

  const octave = parseInt(match[3], 10);
  const midi = (octave + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
}

class SoundFXManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false; // Enabled by default!
    this.volume = 0.85;
    this.isInitialized = false;

    // Ambient Nature Sound Generator (Birds + Waves + Wind)
    this.natureActive = false;
    this.birdInterval = null;
    this.waveNoise = null;
    this.waveGain = null;
    this.windNoise = null;
    this.windGain = null;

    // Jukebox Sequencer state
    this.activeDisc = null;
    this.isPlayingDisc = false;
    this.sequencerTimeout = null;

    // Master Gains & Analyser for Visualizer
    this.masterGain = null;
    this.fxGain = null;
    this.natureGain = null;
    this.musicMasterGain = null;
    this.analyser = null;
    this.freqDataArray = null;

    // Custom HTML5 audio player
    this.customAudio = null;

    // State listeners
    this.onTrackChange = null;
    this.onPlayStateChange = null;

    // Auto-started flag
    this.hasAutoStarted = false;
  }

  init() {
    if (this.isInitialized && this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();

      // Master Output Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Sound FX Gain (Clicks, Chest, Footsteps)
      this.fxGain = this.ctx.createGain();
      this.fxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.fxGain.connect(this.masterGain);

      // Nature & Birds Gain
      this.natureGain = this.ctx.createGain();
      this.natureGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.natureGain.connect(this.masterGain);

      // Music Master Gain with Visualizer Analyser
      this.musicMasterGain = this.ctx.createGain();
      this.musicMasterGain.gain.setValueAtTime(this.volume * 0.38, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;
      this.freqDataArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.musicMasterGain.connect(this.analyser);
      this.analyser.connect(this.masterGain);

      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  resumeContext() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Called on first user interaction to guarantee audio plays without browser block
  startExperienceAudio() {
    if (this.hasAutoStarted) return;
    this.hasAutoStarted = true;
    this.resumeContext();

    // Start ambient birds and ocean shoreline
    this.startAmbientNature();

    // Auto-play a random track from the full disc collection on every page load
    if (!this.isPlayingDisc) {
      const randomDisc = MUSIC_DISCS[Math.floor(Math.random() * MUSIC_DISCS.length)];
      this.playMusicDisc(randomDisc.id);
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    this.resumeContext();

    if (this.masterGain && this.ctx) {
      const targetGain = muted ? 0 : 1.0;
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
    }

    if (this.customAudio) {
      this.customAudio.muted = muted;
    }

    if (this.onPlayStateChange) {
      this.onPlayStateChange({ isPlaying: this.isPlayingDisc, isMuted: this.isMuted });
    }

    return this.isMuted;
  }

  toggleMute() {
    return this.setMuted(!this.isMuted);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.musicMasterGain && this.ctx) {
      this.musicMasterGain.gain.setTargetAtTime(this.volume * 0.38, this.ctx.currentTime, 0.05);
    }
    if (this.customAudio) {
      this.customAudio.volume = this.volume;
    }
  }

  // =========================================================================
  // PROCEDURAL BIRD SONGS & AMBIENT NATURE (BIRDS, SEA WAVES, BREEZE)
  // =========================================================================

  startAmbientNature() {
    if (this.natureActive || !this.ctx) return;
    this.natureActive = true;

    // Schedule regular wild bird singing
    const scheduleNextBird = () => {
      if (!this.natureActive) return;
      const delay = 2500 + Math.random() * 4500; // chirp every 2.5 - 7 seconds
      this.birdInterval = setTimeout(() => {
        this.playBirdSong();
        scheduleNextBird();
      }, delay);
    };

    // Play initial chirp right away
    setTimeout(() => this.playBirdSong(), 800);
    scheduleNextBird();

    // Start soft ocean waves / lake water wash
    this.startOceanWaves();
  }

  stopAmbientNature() {
    this.natureActive = false;
    if (this.birdInterval) {
      clearTimeout(this.birdInterval);
      this.birdInterval = null;
    }
    this.stopOceanWaves();
  }

  // Procedural Realistic Birdsong Generator (Multi-species calls & trills)
  playBirdSong() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

    try {
      const now = this.ctx.currentTime;
      const pattern = Math.floor(Math.random() * 4);

      // Stereo panner so birds sound localized in trees around you!
      let dest = this.natureGain || this.ctx.destination;
      if (this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime((Math.random() * 2 - 1) * 0.8, now);
        panner.connect(this.natureGain || this.ctx.destination);
        dest = panner;
      }

      if (pattern === 0) {
        // Pattern 0: Three sweet rapid sparrow chirps
        for (let i = 0; i < 3; i++) {
          const start = now + i * 0.11;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "sine";
          const baseFreq = 3400 + Math.random() * 500;
          osc.frequency.setValueAtTime(baseFreq, start);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, start + 0.035);
          osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.88, start + 0.08);

          gain.gain.setValueAtTime(0.0001, start);
          gain.gain.linearRampToValueAtTime(0.06, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);

          osc.connect(gain);
          gain.connect(dest);
          osc.start(start);
          osc.stop(start + 0.09);
        }
      } else if (pattern === 1) {
        // Pattern 1: Robin long whistle then high vibrato trill
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(4100, now);
        osc1.frequency.exponentialRampToValueAtTime(3500, now + 0.16);

        gain1.gain.setValueAtTime(0.001, now);
        gain1.gain.linearRampToValueAtTime(0.055, now + 0.03);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

        osc1.connect(gain1);
        gain1.connect(dest);
        osc1.start(now);
        osc1.stop(now + 0.17);

        // High Trill
        const start2 = now + 0.22;
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        const vibrato = this.ctx.createOscillator();
        const vGain = this.ctx.createGain();

        osc2.type = "sine";
        osc2.frequency.setValueAtTime(4500, start2);
        vibrato.frequency.setValueAtTime(22, start2); // 22Hz warble
        vGain.gain.setValueAtTime(320, start2);
        vibrato.connect(osc2.frequency);

        gain2.gain.setValueAtTime(0.001, start2);
        gain2.gain.linearRampToValueAtTime(0.065, start2 + 0.04);
        gain2.gain.exponentialRampToValueAtTime(0.0001, start2 + 0.32);

        vibrato.start(start2);
        vibrato.stop(start2 + 0.34);
        osc2.connect(gain2);
        gain2.connect(dest);
        osc2.start(start2);
        osc2.stop(start2 + 0.34);
      } else if (pattern === 2) {
        // Pattern 2: Forest Warbler 4-note ascending meadow call
        const notes = [3100, 3600, 4300, 4900];
        notes.forEach((f, idx) => {
          const start = now + idx * 0.08;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(f, start);
          osc.frequency.exponentialRampToValueAtTime(f * 1.15, start + 0.05);

          gain.gain.setValueAtTime(0.001, start);
          gain.gain.linearRampToValueAtTime(0.048, start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.075);

          osc.connect(gain);
          gain.connect(dest);
          osc.start(start);
          osc.stop(start + 0.08);
        });
      } else {
        // Pattern 3: Bluejay bell whistle drop
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(5200, now);
        osc.frequency.exponentialRampToValueAtTime(2800, now + 0.22);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.06, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        osc.connect(gain);
        gain.connect(dest);
        osc.start(now);
        osc.stop(now + 0.23);
      }
    } catch (e) {}
  }

  // Gentle Shoreline Ocean / Lake Water Waves
  startOceanWaves() {
    if (!this.ctx || this.waveNoise) return;
    try {
      // Generate 2 seconds of pink/brown noise in a looping buffer
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      }

      this.waveNoise = this.ctx.createBufferSource();
      this.waveNoise.buffer = buffer;
      this.waveNoise.loop = true;

      // Lowpass filter undulating with waves
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);

      // Wave swell LFO
      const waveLfo = this.ctx.createOscillator();
      const waveLfoGain = this.ctx.createGain();
      waveLfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second wave cycle
      waveLfoGain.gain.setValueAtTime(140, this.ctx.currentTime);
      waveLfo.connect(filter.frequency);

      this.waveGain = this.ctx.createGain();
      this.waveGain.gain.setValueAtTime(0.018, this.ctx.currentTime);

      this.waveNoise.connect(filter);
      filter.connect(this.waveGain);
      this.waveGain.connect(this.natureGain);

      this.waveNoise.start();
      waveLfo.start();
    } catch (e) {}
  }

  stopOceanWaves() {
    if (this.waveNoise) {
      try {
        this.waveNoise.stop();
        this.waveNoise.disconnect();
        this.waveNoise = null;
      } catch (e) {}
    }
  }

  // Footstep sound when moving
  playFootstep() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      const freq = 120 + Math.random() * 40;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.06);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.fxGain || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {}
  }

  // =========================================================================
  // OPEN SOURCE MUSIC DISC SEQUENCER
  // =========================================================================

  playMusicDisc(discId, customUrl = null) {
    this.resumeContext();

    // Stop current track cleanly
    this.stopMusicDisc(false);

    // Custom audio
    if (customUrl) {
      try {
        if (this.customAudio) {
          this.customAudio.pause();
          this.customAudio.src = "";
        }
        this.customAudio = new Audio(customUrl);
        this.customAudio.loop = true;
        this.customAudio.volume = this.volume;
        this.customAudio.muted = this.isMuted;
        this.customAudio.play();
        this.activeDisc = {
          id: "custom",
          title: "Custom Stream",
          artist: "User Uploaded",
          color: "#f59e0b",
          mood: "Custom Audio Stream",
          badge: "CUSTOM AUDIO",
        };
        this.isPlayingDisc = true;
        this.playDiscInsert();
        if (this.onTrackChange) this.onTrackChange(this.activeDisc);
        if (this.onPlayStateChange) this.onPlayStateChange({ isPlaying: true, isMuted: this.isMuted });
        return;
      } catch (e) {}
    }

    const disc = MUSIC_DISCS.find((d) => d.id === discId) || MUSIC_DISCS[0];
    this.activeDisc = disc;
    this.isPlayingDisc = true;

    this.playDiscInsert();
    this.startSequencerLoop(disc);

    if (this.onTrackChange) this.onTrackChange(this.activeDisc);
    if (this.onPlayStateChange) this.onPlayStateChange({ isPlaying: true, isMuted: this.isMuted });
  }

  startSequencerLoop(disc) {
    if (!this.ctx) return;
    this.clearScheduledNotes();

    const loop = () => {
      if (!this.isPlayingDisc || this.activeDisc?.id !== disc.id) return;
      const startTime = this.ctx.currentTime + 0.05;
      this.scheduleDiscNotes(disc, startTime);

      const loopDurationMs = disc.loopLength * 1000;
      this.sequencerTimeout = setTimeout(loop, loopDurationMs);
    };

    loop();
  }

  scheduleDiscNotes(disc, startTime) {
    if (!this.ctx || !this.musicMasterGain) return;

    if (disc.melody) {
      disc.melody.forEach(({ note, dur, time }) => {
        const noteStart = startTime + time;
        const noteFreq = noteToFreq(note);
        this.scheduleMelodyNote(noteFreq, noteStart, dur, disc.id);
      });
    }

    if (disc.chords) {
      disc.chords.forEach(({ notes, dur, time }) => {
        const chordStart = startTime + time;
        notes.forEach((note) => {
          const noteFreq = noteToFreq(note);
          this.schedulePadNote(noteFreq, chordStart, dur, disc.id);
        });
      });
    }

    if (disc.bass) {
      disc.bass.forEach(({ note, dur, time }) => {
        const bassStart = startTime + time;
        const noteFreq = noteToFreq(note);
        this.scheduleBassNote(noteFreq, bassStart, dur, disc.id);
      });
    }
  }

  scheduleMelodyNote(freq, startTime, duration, discId) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      if (discId === "gymnopedie" || discId === "clair-de-lune") {
        // Pure acoustic piano hammer tone with gentle damper resonance
        osc.type = "sine";
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1400, startTime);
        filter.frequency.exponentialRampToValueAtTime(320, startTime + duration);
      } else if (discId === "horizon-bloom") {
        // Shimmering ambient bells & synth flute
        osc.type = "triangle";
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(2000, startTime);
      } else if (discId === "carefree-meadow") {
        // Upbeat folk whistle & acoustic harmonics
        osc.type = "triangle";
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(freq * 1.4, startTime);
      } else if (discId === "canon-ambient") {
        // Heavenly chime bells
        osc.type = "sine";
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(2200, startTime);
      } else {
        osc.type = "sine";
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1200, startTime);
      }

      osc.frequency.setValueAtTime(freq, startTime);

      // Subtle natural vibrato on sustained notes
      if (duration > 0.6) {
        const vibrato = this.ctx.createOscillator();
        const vibratoGain = this.ctx.createGain();
        vibrato.frequency.setValueAtTime(5.0, startTime);
        vibratoGain.gain.setValueAtTime(freq * 0.014, startTime);
        vibrato.connect(osc.frequency);
        vibrato.start(startTime + 0.1);
        vibrato.stop(startTime + duration);
      }

      const attack = discId === "carefree-meadow" ? 0.015 : 0.05;
      const peakGain = discId === "carefree-meadow" ? 0.22 : 0.18;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(peakGain, startTime + attack);
      gain.gain.exponentialRampToValueAtTime(peakGain * 0.55, startTime + attack + duration * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicMasterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.2);
    } catch (e) {}
  }

  schedulePadNote(freq, startTime, duration, discId) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = discId === "midnight-echoes" ? "sawtooth" : "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(580, startTime);

      const attack = 0.35;
      const peakGain = 0.075;
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(peakGain, startTime + attack);
      gain.gain.setValueAtTime(peakGain * 0.85, startTime + duration - 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicMasterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.4);
    } catch (e) {}
  }

  scheduleBassNote(freq, startTime, duration, discId) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(240, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.16, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration + 0.08);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicMasterGain);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    } catch (e) {}
  }

  stopMusicDisc(playEjectSound = true) {
    this.isPlayingDisc = false;
    this.clearScheduledNotes();

    if (this.customAudio) {
      this.customAudio.pause();
      this.customAudio.currentTime = 0;
    }

    if (playEjectSound) {
      this.playDiscEject();
    }

    if (this.onPlayStateChange) {
      this.onPlayStateChange({ isPlaying: false, isMuted: this.isMuted });
    }
  }

  ejectDisc() {
    this.stopMusicDisc(true);
    const prev = this.activeDisc;
    this.activeDisc = null;
    if (this.onTrackChange) this.onTrackChange(null);
    return prev;
  }

  togglePlayPause() {
    if (this.isPlayingDisc) {
      this.stopMusicDisc(false);
    } else if (this.activeDisc) {
      this.playMusicDisc(this.activeDisc.id);
    } else {
      this.playMusicDisc(MUSIC_DISCS[0].id);
    }
  }

  clearScheduledNotes() {
    if (this.sequencerTimeout) {
      clearTimeout(this.sequencerTimeout);
      this.sequencerTimeout = null;
    }
  }

  getFrequencyData() {
    if (!this.analyser || !this.freqDataArray) {
      return new Uint8Array(16);
    }
    this.analyser.getByteFrequencyData(this.freqDataArray);
    return this.freqDataArray;
  }

  // =========================================================================
  // MECHANICAL & INTERACTIVE SOUND FX
  // =========================================================================

  playDiscInsert() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.fxGain || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);

      setTimeout(() => {
        if (!this.ctx) return;
        this.playBlip(880, "triangle", 0.08);
      }, 100);
    } catch (e) {}
  }

  playDiscEject() {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.fxGain || this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  playChestOpen() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(160, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.18);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.fxGain || this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.23);

      this.playBlip(1046.5, "triangle", 0.12);
    } catch (e) {}
  }

  playBlip(freq = 980, type = "sine", duration = 0.08) {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.fxGain || this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playCheckpointChime(level = 1) {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

    const xpNotes = [
      [523.25, 659.25, 783.99, 1046.5],
      [587.33, 739.99, 880.0, 1174.66],
      [659.25, 830.61, 987.77, 1318.51],
      [698.46, 880.0, 1046.5, 1396.91],
      [783.99, 987.77, 1174.66, 1567.98],
    ];

    const notes = xpNotes[(level - 1) % xpNotes.length];

    notes.forEach((freq, i) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

          gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.45);

          osc.connect(gain);
          gain.connect(this.fxGain || this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.48);
        } catch (e) {}
      }, i * 65);
    });
  }
}

export const soundFX = new SoundFXManager();
