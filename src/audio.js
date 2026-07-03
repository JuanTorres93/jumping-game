/* ---------- Configuration ---------- */

const SOUND_SOURCES = {
  backgroundMusic: new URL(
    '../assets/audio/background-music.mp3',
    import.meta.url,
  ).href,
  jump: new URL('../assets/audio/jump.mp3', import.meta.url).href,
  doubleJump: new URL('../assets/audio/double-jump.mp3', import.meta.url).href,
  hit: new URL('../assets/audio/hit.mp3', import.meta.url).href,
  heart: new URL('../assets/audio/heart.mp3', import.meta.url).href,
  gameOver: new URL('../assets/audio/game-over.mp3', import.meta.url).href,
};

const DEFAULT_MUSIC_VOLUME = 0.5;
const DEFAULT_SFX_VOLUME = 0.7;

/* ---------- State ---------- */

const audioState = {
  muted: false,
  musicVolume: DEFAULT_MUSIC_VOLUME,
  sfxVolume: DEFAULT_SFX_VOLUME,
};

/* ---------- Helpers ---------- */

function createAudio(src, loop = false, volume = 1) {
  const audio = new Audio(src);

  audio.loop = loop;
  audio.volume = volume;

  return audio;
}

function playSfx(sound) {
  if (audioState.muted) {
    return;
  }

  const instance = sound.cloneNode();
  instance.volume = audioState.sfxVolume;
  instance.play();
}

function clampVolume(value) {
  return Math.min(1, Math.max(0, value));
}

/* ---------- Audio ---------- */

const backgroundMusic = createAudio(
  SOUND_SOURCES.backgroundMusic,
  true,
  DEFAULT_MUSIC_VOLUME,
);

const jumpSound = createAudio(SOUND_SOURCES.jump);
const doubleJumpSound = createAudio(SOUND_SOURCES.doubleJump);
const hitSound = createAudio(SOUND_SOURCES.hit);
const heartSound = createAudio(SOUND_SOURCES.heart);
const gameOverSound = createAudio(SOUND_SOURCES.gameOver);

/* ---------- Music ---------- */

function startBackgroundMusic() {
  if (audioState.muted || !backgroundMusic.paused) {
    return;
  }

  backgroundMusic.currentTime = 0;
  backgroundMusic.play();
}

function stopBackgroundMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

/* ---------- Sound effects ---------- */

function playJumpSound() {
  playSfx(jumpSound);
}

function playDoubleJumpSound() {
  playSfx(doubleJumpSound);
}

function playHitSound() {
  playSfx(hitSound);
}

function playHeartSound() {
  playSfx(heartSound);
}

function playGameOverSound() {
  playSfx(gameOverSound);
}

/* ---------- Audio controls ---------- */

function toggleMute() {
  audioState.muted = !audioState.muted;

  if (audioState.muted) {
    backgroundMusic.pause();
  } else {
    backgroundMusic.play();
  }

  return audioState.muted;
}

function isMuted() {
  return audioState.muted;
}

function setMusicVolume(value) {
  audioState.musicVolume = clampVolume(value);
  backgroundMusic.volume = audioState.musicVolume;
}

function setSfxVolume(value) {
  audioState.sfxVolume = clampVolume(value);
}

/* ---------- Exports ---------- */

export {
  startBackgroundMusic,
  stopBackgroundMusic,
  playJumpSound,
  playDoubleJumpSound,
  playHitSound,
  playHeartSound,
  playGameOverSound,
  toggleMute,
  isMuted,
  setMusicVolume,
  setSfxVolume,
};
