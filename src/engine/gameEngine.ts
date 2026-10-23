import { GameState, TimeOfDay } from '../types/game';
import { SCENE_GRAPH } from '../scenes/sceneGraph';

export const STORAGE_KEY = 'catfishing_custom_save';

export const STAGE_NAMES = [
  'Stage 0: Unbroken Male',
  'Stage 1: Online Habits & Speech',
  'Stage 2: Environment Shift',
  'Stage 3: Body & Voice Integration',
  'Stage 4: Complete Internalization'
];

export const VOICE_LABELS = [
  '0 - Male',
  '1 - Feminine Typing',
  '2 - Breathy Whisper',
  '3 - Head Voice',
  '4 - Siren Control'
];

export const VISUAL_LABELS = [
  '0 - Raw Male',
  '1 - Cropped Angles',
  '2 - Wig + Mask',
  '3 - Full Makeup Wig',
  '4 - Fully Feminine'
];

/**
 * Pure calculation for the player's internal feminization transition progress (0 - 100%).
 */
export function calculateTransitionProgress(state: GameState): number {
  let calc =
    state.femStage * 20 +
    state.voiceLadder * 6 +
    state.visualLadder * 6 +
    Math.floor(state.bodyFemininity * 0.15) +
    Math.floor((state.soft + state.slutty) / 2);

  if (state.bitter > 5) {
    calc -= state.bitter * 1.5;
  }

  return Math.max(0, Math.min(Math.round(calc), 100));
}

/**
 * Pure function to advance the time of day.
 */
export function advanceTimeOfDay(current: TimeOfDay): TimeOfDay {
  if (current === 'Morning') return 'Afternoon';
  if (current === 'Afternoon') return 'Night';
  return 'Late Night';
}

/**
 * Retrieves the portrait asset key, display name, and subtitle based on progression state.
 */
export function getPortraitInfo(state: GameState): { key: string; displayName: string; subName: string } {
  let portraitKey = 'portrait_player_boy';
  let displayName = state.playerName || 'Mark';
  let subName = 'Former Delivery Boy';

  if (state.femStage >= 1 && state.personaName) {
    displayName = state.personaName;
    subName = `@${state.accountName || 'anon'} · ${state.personaType.toUpperCase()}`;

    if (state.visualLadder >= 2) {
      portraitKey = 'portrait_fem_mask';
    } else if (state.personaType === 'goth') {
      portraitKey = 'portrait_fem_goth';
    } else if (state.personaType === 'egirl') {
      portraitKey = 'portrait_fem_egirl';
    } else {
      portraitKey = 'portrait_fem_soft';
    }
  }

  return { key: portraitKey, displayName, subName };
}

export function createInitialState(): GameState {
  return {
    playerName: 'Mark',
    accountName: '',
    personaName: 'Luna',
    personaType: 'soft',

    day: 1,
    timeOfDay: 'Morning',

    money: 100,
    skins: 0,
    suspicion: 0,
    trust: 0,
    rep: 0,

    soft: 0,
    slutty: 0,
    dominant: 0,
    bitter: 0,

    dominicPoints: 0,
    felixPoints: 0,
    adrianPoints: 0,
    gomezPoints: 0,

    femStage: 0,
    voiceLadder: 0,
    voiceProgress: 0,
    bodyFemininity: 0,
    visualLadder: 0,
    transitionProgress: 0,

    dominicStep: 0,
    felixStep: 0,
    adrianStep: 0,
    gomezStep: 0,

    discoveredRegulars: {
      dominic: false,
      felix: false,
      adrian: false,
      gomez: true
    },

    unlockedVoiceTraining: false,
    unlockedWorkout: false,
    unlockedMakeup: false,

    unlockedSkins: [],
    equippedSkin: null,

    flags: {
      tookHandout: false,
      cabTaken: false,
      wallpaperFeminized: false,
      roomTidied: false,
      plushieUnboxed: false,
      thighHighsWorn: false,
      banteredKev: false,
      daveSteakReceived: false
    },

    currentScene: 'scene_start'
  };
}

type StateListener = (state: GameState) => void;

/**
 * Game Engine: Central controller managing game state, scenes, transitions, and persistence.
 */
export class GameEngine {
  private state: GameState;
  private listeners: Set<StateListener> = new Set();
  private history: GameState[] = [];
  private isUndoing = false;

  constructor(initialState?: GameState) {
    this.state = initialState ? { ...initialState } : createInitialState();
    this.syncCalculations();
  }

  public getState(): Readonly<GameState> {
    return this.state;
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private pushHistorySnapshot(): void {
    if (this.isUndoing) return;
    try {
      const snapshot: GameState = JSON.parse(JSON.stringify(this.state));
      this.history.push(snapshot);
      if (this.history.length > 50) {
        this.history.shift();
      }
    } catch {
      // In case of parsing issues
    }
  }

  public canGoBack(): boolean {
    return this.history.length > 0;
  }

  public goBack(): boolean {
    if (this.history.length === 0) return false;
    const previous = this.history.pop();
    if (!previous) return false;

    this.isUndoing = true;
    try {
      this.state = previous;
      this.syncCalculations();
      this.notify();
      return true;
    } finally {
      this.isUndoing = false;
    }
  }

  private notify(): void {
    this.syncCalculations();
    if (this.state.unlockedSkins) {
      this.state.skins = this.state.unlockedSkins.length;
    }
    this.state = {
      ...this.state,
      flags: { ...this.state.flags },
      discoveredRegulars: { ...this.state.discoveredRegulars },
      unlockedSkins: [...(this.state.unlockedSkins || [])]
    };
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }

  public syncCalculations(): void {
    this.state.transitionProgress = calculateTransitionProgress(this.state);
  }

  public advanceTime(): void {
    this.pushHistorySnapshot();
    this.state.timeOfDay = advanceTimeOfDay(this.state.timeOfDay);
    this.notify();
  }

  public goTo(sceneId: string): void {
    const scene = SCENE_GRAPH[sceneId];
    if (!scene) {
      console.error(`Target scene '${sceneId}' not found in SCENE_GRAPH.`);
      return;
    }

    this.state.currentScene = sceneId;
    if (typeof scene.onEnter === 'function') {
      scene.onEnter(this.state);
    }

    this.notify();
  }

  public executeChoice(choiceIndex: number, inputValues?: Record<string, string>): void {
    const scene = SCENE_GRAPH[this.state.currentScene];
    if (!scene) return;

    // Record snapshot prior to making choice so player can retract choice or view previous scene
    this.pushHistorySnapshot();

    // Apply any pending inputs first
    if (inputValues) {
      if (inputValues['char-name-input']) {
        const val = inputValues['char-name-input'].trim();
        if (val) this.state.playerName = val;
      }
      if (inputValues['acc-name']) {
        const val = inputValues['acc-name'].trim();
        if (val) this.state.accountName = val;
      }
      if (inputValues['per-name']) {
        const val = inputValues['per-name'].trim();
        if (val) this.state.personaName = val;
      }
    }

    const availableChoices = scene.choices.filter(c => !c.condition || c.condition(this.state));
    const chosen = availableChoices[choiceIndex];

    if (!chosen) {
      console.warn(`Choice at index ${choiceIndex} not available.`);
      return;
    }

    if (chosen.action) {
      chosen.action(this.state);
    }

    this.goTo(chosen.target);
  }

  public save(): boolean {
    try {
      this.syncCalculations();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      return true;
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
      return false;
    }
  }

  public load(): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const loaded = JSON.parse(raw) as GameState;
      if (!loaded.discoveredRegulars) {
        loaded.discoveredRegulars = { dominic: false, felix: false, adrian: false, gomez: true };
      }
      if (loaded.unlockedVoiceTraining === undefined) loaded.unlockedVoiceTraining = false;
      if (loaded.unlockedWorkout === undefined) loaded.unlockedWorkout = false;
      if (loaded.unlockedMakeup === undefined) loaded.unlockedMakeup = false;
      if (!loaded.unlockedSkins) loaded.unlockedSkins = [];
      if (loaded.equippedSkin === undefined) loaded.equippedSkin = null;
      loaded.skins = loaded.unlockedSkins.length;

      this.state = loaded;
      this.history = [];
      this.syncCalculations();
      this.goTo(this.state.currentScene || 'scene_start');
      return true;
    } catch (err) {
      console.error('Failed to load from localStorage:', err);
      return false;
    }
  }

  public restart(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.history = [];
    this.state = createInitialState();
    this.goTo('scene_start');
  }

  public setState(updater: (draft: GameState) => void): void {
    updater(this.state);
    this.notify();
  }
}

// Singleton engine instance for UI usage
export const engineInstance = new GameEngine();
