// Web Audio API Sound Synthesizer
// Provides Minecraft-style Wood Chest opens, XP pickup chimes, and C418-inspired ambient piano

class SoundFXManager {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.padOsc1 = null;
    this.padOsc2 = null;
    this.padGain = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.ctx = new AudioContext();
      this.isInitialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  resumeContext() {
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (!muted) {
      this.init();
      this.resumeContext();
      this.startAmbientPad();
    } else {
      this.stopAmbientPad();
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // Wooden Chest Open Sound (Wood creak pitch shift + pop)
  playChestOpen() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

    try {
      // Wood creak resonance
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
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.23);

      // Gold Sparkle Chime
      this.playBlip(1046.5, "triangle", 0.12);
    } catch (e) {}
  }

  // UI Button Click / Item Pop
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
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  // Minecraft Experience Orb Pickup Ding Chime
  playCheckpointChime(level = 1) {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

    const xpNotes = [
      [523.25, 659.25, 783.99, 1046.5],
      [587.33, 739.99, 880.00, 1174.66],
      [659.25, 830.61, 987.77, 1318.51],
      [698.46, 880.00, 1046.50, 1396.91],
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
          gain.connect(this.ctx.destination);

          osc.start();
          osc.stop(this.ctx.currentTime + 0.48);
        } catch (e) {}
      }, i * 65);
    });
  }

  // Soft Footstep Pip
  updateEngineSound(speed = 0) {
    // Footsteps handled smoothly via animations
  }

  // Calm C418-Inspired Ambient Piano Synth
  startAmbientPad() {
    if (this.isMuted || !this.ctx || this.padGain) return;
    try {
      this.padGain = this.ctx.createGain();
      this.padGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.padGain.gain.linearRampToValueAtTime(0.018, this.ctx.currentTime + 2.0);

      // Soothing base note
      this.padOsc1 = this.ctx.createOscillator();
      this.padOsc1.type = "sine";
      this.padOsc1.frequency.setValueAtTime(110, this.ctx.currentTime); // A2 - deeper, more soothing

      // Harmonic pad layer
      this.padOsc2 = this.ctx.createOscillator();
      this.padOsc2.type = "triangle";
      this.padOsc2.frequency.setValueAtTime(164.81, this.ctx.currentTime); // E3 - fifth interval

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(480, this.ctx.currentTime); // Smoother, warmer filter

      this.padOsc1.connect(filter);
      this.padOsc2.connect(filter);
      filter.connect(this.padGain);
      this.padGain.connect(this.ctx.destination);

      this.padOsc1.start();
      this.padOsc2.start();
    } catch (e) {}
  }

  // Soothing meditation tone for calm moments
  playSoothingTone() {
    if (this.isMuted || !this.ctx) return;
    this.resumeContext();

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(128, this.ctx.currentTime); // Low, soothing frequency

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(300, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.2);
    } catch (e) {}
  }

  stopAmbientPad() {
    if (this.padGain && this.ctx) {
      try {
        this.padGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
        setTimeout(() => {
          if (this.padOsc1) {
            this.padOsc1.stop();
            this.padOsc1.disconnect();
            this.padOsc1 = null;
          }
          if (this.padOsc2) {
            this.padOsc2.stop();
            this.padOsc2.disconnect();
            this.padOsc2 = null;
          }
          this.padGain = null;
        }, 600);
      } catch (e) {}
    }
  }
}

export const soundFX = new SoundFXManager();
