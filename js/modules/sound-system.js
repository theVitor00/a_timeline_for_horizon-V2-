// ========== SISTEMA DE SONS COM WEB AUDIO API ==========

let soundEnabled = true;
let audioContext = null;

// Inicializar sistema de som
function initializeSoundSystem() {
  // Verificar preferência salva
  const savedSoundPreference = localStorage.getItem('horizonTimelineSoundEnabled');
  if (savedSoundPreference !== null) {
    soundEnabled = savedSoundPreference === 'true';
  }

  // Criar controles de som
  createSoundControls();

  // Inicializar Web Audio API
  initializeAudioContext();

  // Configurar event listeners para sons
  setupSoundEventListeners();

  console.log('Sistema de sons inicializado. Sons ativos:', soundEnabled);
}

// Inicializar contexto de áudio
function initializeAudioContext() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
    console.log('Contexto de áudio criado com sucesso');
  } catch (error) {
    console.log('Web Audio API não suportada:', error);
  }
}

// Sons específicos para diferentes interações
function playSound(soundType, volume = 0.3) {
  if (!soundEnabled || !audioContext) return;

  // Garantir que o contexto esteja rodando (necessário para alguns navegadores)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  const sounds = {
    select: () => {
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(460, now + 0.02);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    },

    navigate: () => {
      const now = audioContext.currentTime;
      const osc1 = audioContext.createOscillator();
      const osc2 = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const filter = audioContext.createBiquadFilter();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(523.25, now);
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1046.5, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1500, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume * 0.4, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(audioContext.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    },

    period: () => {
      const now = audioContext.currentTime;

      // Primeira nota - Lá (440Hz)
      const osc1 = audioContext.createOscillator();
      const gain1 = audioContext.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(volume * 0.6, now + 0.1);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(audioContext.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Segunda nota - Dó (523.25Hz) com delay
      setTimeout(() => {
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(523.25, audioContext.currentTime);
        gain2.gain.setValueAtTime(0, audioContext.currentTime);
        gain2.gain.linearRampToValueAtTime(volume * 0.5, audioContext.currentTime + 0.1);
        gain2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.3);
      }, 80);

      // Terceira nota - Mi (659.25Hz) com delay maior
      setTimeout(() => {
        const osc3 = audioContext.createOscillator();
        const gain3 = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(659.25, audioContext.currentTime);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, audioContext.currentTime);
        gain3.gain.setValueAtTime(0, audioContext.currentTime);
        gain3.gain.linearRampToValueAtTime(volume * 0.4, audioContext.currentTime + 0.1);
        gain3.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);

        osc3.connect(filter);
        filter.connect(gain3);
        gain3.connect(audioContext.destination);

        osc3.start(audioContext.currentTime);
        osc3.stop(audioContext.currentTime + 0.4);
      }, 160);
    },

    confirm: () => {
      const now = audioContext.currentTime;
      const frequencies = [440.0, 523.25, 659.25, 880.0];

      frequencies.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        gain.gain.setValueAtTime(0, now + index * 0.02);
        gain.gain.linearRampToValueAtTime(volume * (0.7 - index * 0.1), now + index * 0.02 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(audioContext.destination);

        osc.start(now + index * 0.02);
        osc.stop(now + 0.5);
      });

      setTimeout(() => {
        const pulseOsc = audioContext.createOscillator();
        const pulseGain = audioContext.createGain();

        pulseOsc.type = 'sine';
        pulseOsc.frequency.setValueAtTime(880, audioContext.currentTime);
        pulseGain.gain.setValueAtTime(0, audioContext.currentTime);
        pulseGain.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.05);
        pulseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

        pulseOsc.connect(pulseGain);
        pulseGain.connect(audioContext.destination);

        pulseOsc.start(audioContext.currentTime);
        pulseOsc.stop(audioContext.currentTime + 0.2);
      }, 200);
    }
  };

  if (sounds[soundType]) {
    sounds[soundType]();
  }
}

// Toggle de som
function toggleSound() {
  soundEnabled = !soundEnabled;
  const soundToggle = document.getElementById('soundToggle');
  const soundIcon = document.getElementById('soundIcon');

  if (soundToggle && soundIcon) {
    if (soundEnabled) {
      soundToggle.classList.remove('muted');
      soundIcon.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E";
      setTimeout(() => playSound('confirm', 0.2), 100);
    } else {
      soundToggle.classList.add('muted');
      soundIcon.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3.63 3.63a.996.996 0 0 0 0 1.41L7.29 9H6c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1.29l3.66 3.66c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L5.05 5.05a.996.996 0 0 0-1.41 0l-1.01 1.01zm13.61 2.96c.49.25 1.02.48 1.59.66.18.06.31.23.31.42v2c0 .38-.31.71-.69.66-.95-.2-1.85-.52-2.69-.94l1.48-1.48zm-3.97-1.4c.33.14.65.29.96.46.17.09.31.26.31.46v2c0 .38-.31.71-.69.66-.32-.06-.64-.15-.94-.27l1.36-1.36zm-3.27 1.36L13 9.17V7h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1v1.17l1.23 1.23zM7.34 10.84l-2-2H6c.55 0 1 .45 1 1v2c0 .55-.45 1-1 1h-.66l2 2H11v2.17l2 2V12h2l4 4h1.17l2 2a.996.996 0 1 0 1.41-1.41L4.41 2.86a.996.996 0 0 0-1.41 0c-.39.39-.39 1.03 0 1.42l2.34 2.34z'/%3E%3C/svg%3E";
    }
  }

  localStorage.setItem('horizonTimelineSoundEnabled', soundEnabled.toString());
  console.log('Som ' + (soundEnabled ? 'ativado' : 'desativado'));
}

// Criar controles de som na interface
function createSoundControls() {
  const soundControls = document.createElement('div');
  soundControls.className = 'sound-controls';
  soundControls.innerHTML = `
    <button id="soundToggle" class="sound-toggle ${soundEnabled ? '' : 'muted'}" title="${soundEnabled ? 'Desativar sons' : 'Ativar sons'}">
      <img id="soundIcon" class="sound-icon" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z'/%3E%3C/svg%3E" alt="Sound">
    </button>
  `;

  document.body.appendChild(soundControls);

  document.getElementById('soundToggle').addEventListener('click', function () {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        toggleSound();
      });
    } else {
      toggleSound();
    }
  });
}

// Configurar event listeners para sons
function setupSoundEventListeners() {
  console.log('Configurando event listeners de som...');

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const carouselPrev = document.getElementById('carouselPrev');
  const carouselNext = document.getElementById('carouselNext');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => playSound('navigate', 0.2));
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', () => playSound('navigate', 0.2));
  }
  if (carouselPrev) {
    carouselPrev.addEventListener('click', () => playSound('navigate', 0.2));
  }
  if (carouselNext) {
    carouselNext.addEventListener('click', () => playSound('navigate', 0.2));
  }

  document.addEventListener('click', (e) => {
    const timelineEvent = e.target.closest('.timeline-event');
    if (timelineEvent && !timelineEvent.classList.contains('active')) {
      playSound('select', 0.3);
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.period-marker')) {
      playSound('period', 0.4);
    }
  });

  document.addEventListener('click', (e) => {
    if (e.target.closest('.year-marker')) {
      playSound('select', 0.25);
    }
  });

  const acknowledgeBtn = document.getElementById('acknowledgeButton');
  if (acknowledgeBtn) {
    acknowledgeBtn.addEventListener('click', () => playSound('confirm', 0.3));
  }

  const activateAudio = () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume().then(() => {
        console.log('Áudio ativado pelo usuário');
        document.removeEventListener('click', activateAudio);
        document.removeEventListener('touchstart', activateAudio);
      });
    }
  };

  document.addEventListener('click', activateAudio);
  document.addEventListener('touchstart', activateAudio);
}

// Música Harmônica (código completo da classe HarmonicThemeMusic)
class HarmonicThemeMusic {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.isPlaying = false;
    this.currentStep = 0;
    this.mainVolume = 0.3;
  }

  createHarmonicOscillator(freq, type, duration, volume, detune = 0, fadeIn = 0.1) {
    const now = this.audioContext.currentTime;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.detune.setValueAtTime(detune, now);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(1, now);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + fadeIn);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playHarmonicPad() {
    if (this.currentStep % 16 === 0) {
      const amChord = [220.0, 261.63, 329.63, 440.0];
      amChord.forEach((freq, index) => {
        setTimeout(() => {
          this.createHarmonicOscillator(freq, 'sine', 4.0, this.mainVolume * 0.4, index * 2);
        }, index * 100);
      });
    }
  }

  playMainMelody() {
    const melodyNotes = [
      { step: 0, freq: 440.0, duration: 1.5, vol: 0.6 },
      { step: 4, freq: 523.25, duration: 1.0, vol: 0.5 },
      { step: 8, freq: 493.88, duration: 1.0, vol: 0.5 },
      { step: 12, freq: 440.0, duration: 2.0, vol: 0.4 },
      { step: 16, freq: 392.0, duration: 1.5, vol: 0.5 },
      { step: 20, freq: 349.23, duration: 1.0, vol: 0.5 },
      { step: 24, freq: 329.63, duration: 1.0, vol: 0.6 },
      { step: 28, freq: 293.66, duration: 2.0, vol: 0.4 },
    ];

    const currentNote = melodyNotes.find((note) => note.step === this.currentStep % 32);
    if (currentNote) {
      this.createHarmonicOscillator(currentNote.freq, 'triangle', currentNote.duration, this.mainVolume * currentNote.vol, Math.random() * 4 - 2, 0.3);
    }
  }

  playCounterMelody() {
    const counterNotes = [
      { step: 8, freq: 659.25, duration: 2.0, vol: 0.3 },
      { step: 16, freq: 587.33, duration: 1.5, vol: 0.3 },
      { step: 24, freq: 523.25, duration: 2.0, vol: 0.3 },
    ];

    const currentNote = counterNotes.find((note) => note.step === this.currentStep % 32);
    if (currentNote) {
      this.createHarmonicOscillator(currentNote.freq, 'sine', currentNote.duration, this.mainVolume * currentNote.vol, 5, 0.4);
    }
  }

  playBassLine() {
    const bassNotes = [
      { step: 0, freq: 110.0, duration: 4.0 },
      { step: 16, freq: 98.0, duration: 4.0 },
    ];

    const currentNote = bassNotes.find((note) => note.step === this.currentStep % 32);
    if (currentNote) {
      this.createHarmonicOscillator(currentNote.freq, 'sine', currentNote.duration, this.mainVolume * 0.3, 0, 0.5);
    }
  }

  playAtmosphericTextures() {
    if (this.currentStep % 8 === 0 && Math.random() < 0.4) {
      const harmonics = [880.0, 1318.51, 1760.0];
      const randomHarmonic = harmonics[Math.floor(Math.random() * harmonics.length)];
      this.createHarmonicOscillator(randomHarmonic, 'sine', 3.0, this.mainVolume * 0.15, 10, 0.8);
    }
  }

  playChordProgression() {
    const progressions = [
      { step: 0, chord: [220.0, 261.63, 329.63, 440.0] },
      { step: 8, chord: [196.0, 246.94, 293.66, 392.0] },
      { step: 16, chord: [174.61, 220.0, 261.63, 349.23] },
      { step: 24, chord: [164.81, 196.0, 246.94, 329.63] },
    ];

    const currentProgression = progressions.find((prog) => prog.step === this.currentStep % 32);
    if (currentProgression) {
      currentProgression.chord.forEach((freq, index) => {
        setTimeout(() => {
          this.createHarmonicOscillator(freq, 'sine', 8.0, this.mainVolume * 0.25, index * 3, 0.6);
        }, index * 150);
      });
    }
  }

  playStep() {
    if (!this.isPlaying) return;
    this.playHarmonicPad();
    this.playMainMelody();
    this.playCounterMelody();
    this.playBassLine();
    this.playChordProgression();
    this.playAtmosphericTextures();
    this.currentStep++;
    setTimeout(() => this.playStep(), 500);
  }

  start() {
    if (this.isPlaying) return;
    this.audioContext.resume();
    this.isPlaying = true;
    this.currentStep = 0;
    this.playStep();
    console.log('🎵 Música Harmônica Iniciada');
  }

  stop() {
    this.isPlaying = false;
    console.log('🎵 Música Harmônica Parada');
  }

  setVolume(level) {
    this.mainVolume = Math.max(0, Math.min(1, level));
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
    return this.isPlaying;
  }
}

// Instância global da música harmônica
const harmonicMusic = new HarmonicThemeMusic();

// Controles automáticos para o site
function initHarmonicMusicControls() {
  if (!document.getElementById('harmonicMusicToggle')) {
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'harmonicMusicToggle';
    toggleBtn.innerHTML = '🎵 Play Music';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '20px';
    toggleBtn.style.right = '20px';
    toggleBtn.style.zIndex = '1000';
    toggleBtn.style.padding = '10px 15px';
    toggleBtn.style.background = 'linear-gradient(45deg, #2a2a2a, #4a4a4a)';
    toggleBtn.style.color = 'white';
    toggleBtn.style.border = '1px solid #666';
    toggleBtn.style.borderRadius = '8px';
    toggleBtn.style.cursor = 'pointer';
    toggleBtn.style.fontFamily = 'Arial, sans-serif';
    toggleBtn.style.fontSize = '14px';
    toggleBtn.style.transition = 'all 0.3s ease';

    toggleBtn.addEventListener('mouseenter', () => {
      toggleBtn.style.transform = 'scale(1.05)';
      toggleBtn.style.background = 'linear-gradient(45deg, #3a3a3a, #5a5a5a)';
    });

    toggleBtn.addEventListener('mouseleave', () => {
      toggleBtn.style.transform = 'scale(1)';
      toggleBtn.style.background = 'linear-gradient(45deg, #2a2a2a, #4a4a4a)';
    });

    toggleBtn.addEventListener('click', () => {
      const isPlaying = harmonicMusic.toggle();
      toggleBtn.innerHTML = isPlaying ? '🎵 Stop Music' : '🎵 Play Music';
      toggleBtn.style.background = isPlaying
        ? 'linear-gradient(45deg, #4a7a4a, #6a9a6a)'
        : 'linear-gradient(45deg, #2a2a2a, #4a4a4a)';
    });

    document.body.appendChild(toggleBtn);

    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = '0';
    volumeSlider.max = '100';
    volumeSlider.value = '30';
    volumeSlider.style.position = 'fixed';
    volumeSlider.style.bottom = '60px';
    volumeSlider.style.right = '20px';
    volumeSlider.style.width = '100px';
    volumeSlider.style.zIndex = '1000';

    volumeSlider.addEventListener('input', (e) => {
      harmonicMusic.setVolume(e.target.value / 100);
    });

    document.body.appendChild(volumeSlider);
  }
}

// Iniciar sistema de música
function initHarmonicMusic() {
  document.addEventListener('click', function startMusicOnClick() {
    harmonicMusic.start();
    const toggleBtn = document.getElementById('harmonicMusicToggle');
    if (toggleBtn) {
      toggleBtn.innerHTML = '🎵 Stop Music';
      toggleBtn.style.background = 'linear-gradient(45deg, #4a7a4a, #6a9a6a)';
    }
    document.removeEventListener('click', startMusicOnClick);
  }, { once: true });
}

// Tocar som de teste
function playTestSound() {
    if (!soundEnabled || !audioContext) return;
  
    // Sequência de tons para teste
    const tones = [523.25, 659.25, 783.99]; // C5, E5, G5
    tones.forEach((freq, index) => {
      setTimeout(() => {
        // Usar a função playSound existente
        playSound('select', 0.2);
      }, index * 250);
    });
  }
  
  // Adicione esta função ao seu código de sons
  const cardClickSound = () => {
    if (!soundEnabled || !audioContext) return;
    
    const now = audioContext.currentTime;
    const volume = 0.3;
  
    // Camada principal - Dó (523.25Hz) para harmonia com a música
    const mainOsc = audioContext.createOscillator();
    const mainGain = audioContext.createGain();
    const mainFilter = audioContext.createBiquadFilter();
  
    mainOsc.type = 'triangle';
    mainOsc.frequency.setValueAtTime(523.25, now);
    mainOsc.frequency.linearRampToValueAtTime(587.33, now + 0.15); // Transição suave para Ré
  
    mainFilter.type = 'lowpass';
    mainFilter.frequency.setValueAtTime(1200, now);
  
    mainGain.gain.setValueAtTime(0, now);
    mainGain.gain.linearRampToValueAtTime(volume * 0.5, now + 0.08);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  
    // Camada harmônica - oitava acima para riqueza
    const harmonicOsc = audioContext.createOscillator();
    const harmonicGain = audioContext.createGain();
  
    harmonicOsc.type = 'sine';
    harmonicOsc.frequency.setValueAtTime(1046.5, now); // Dó uma oitava acima
  
    harmonicGain.gain.setValueAtTime(0, now);
    harmonicGain.gain.linearRampToValueAtTime(volume * 0.2, now + 0.05);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  
    // Camada de "impacto" sutil
    const impactOsc = audioContext.createOscillator();
    const impactGain = audioContext.createGain();
    const impactFilter = audioContext.createBiquadFilter();
  
    impactOsc.type = 'sine';
    impactOsc.frequency.setValueAtTime(392.0, now); // Sol mais grave
    impactOsc.frequency.exponentialRampToValueAtTime(523.25, now + 0.1);
  
    impactFilter.type = 'highpass';
    impactFilter.frequency.setValueAtTime(200, now);
  
    impactGain.gain.setValueAtTime(0, now);
    impactGain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.02);
    impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
  
    // Conectar tudo
    mainOsc.connect(mainFilter);
    mainFilter.connect(mainGain);
    mainGain.connect(audioContext.destination);
  
    harmonicOsc.connect(harmonicGain);
    harmonicGain.connect(audioContext.destination);
  
    impactOsc.connect(impactFilter);
    impactFilter.connect(impactGain);
    impactGain.connect(audioContext.destination);
  
    // Iniciar os osciladores
    mainOsc.start(now);
    harmonicOsc.start(now);
    impactOsc.start(now);
  
    // Parar os osciladores
    mainOsc.stop(now + 0.35);
    harmonicOsc.stop(now + 0.25);
    impactOsc.stop(now + 0.15);
  };
  
  // Adicione ao objeto sounds para manter organização
  // Nota: Como estamos usando funções separadas, vamos adicionar cardClick como um tipo de som
  function playCardClickSound() {
    cardClickSound();
  }
  
  // Função para adicionar o evento de clique aos cards
  function initCardSounds() {
    const cards = document.querySelectorAll('.card, [class*="card"], [data-card]');
    
    cards.forEach((card) => {
      card.removeEventListener('click', handleCardClick);
      card.addEventListener('click', handleCardClick);
    });
    
    console.log(`🎵 Sons de card aplicados a ${cards.length} elementos`);
  }
  
  // Handler para o clique no card
  function handleCardClick(event) {
    playCardClickSound();
  }
  
  // Inicializar automaticamente quando a página carregar
  document.addEventListener('DOMContentLoaded', function() {
    initCardSounds();
    setTimeout(initCardSounds, 2000);
    
    const observer = new MutationObserver(function(mutations) {
      let shouldReinit = false;
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          shouldReinit = true;
        }
      });
      if (shouldReinit) {
        setTimeout(initCardSounds, 100);
      }
    });
  
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
  
  // Também pode ser chamada manualmente se você adicionar cards dinamicamente
  window.reinitCardSounds = initCardSounds;
  
  export { 
    initializeSoundSystem, 
    playSound, 
    toggleSound, 
    soundEnabled,
    harmonicMusic,
    initHarmonicMusicControls,
    initHarmonicMusic,
    playTestSound,
    initCardSounds,
    playCardClickSound
  };