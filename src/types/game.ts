export type PersonaType = 'goth' | 'soft' | 'egirl';

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Night' | 'Late Night';

export interface GameFlags {
  tookHandout: boolean;
  cabTaken: boolean;
  wallpaperFeminized: boolean;
  roomTidied: boolean;
  plushieUnboxed: boolean;
  thighHighsWorn: boolean;
  banteredKev: boolean;
  daveSteakReceived: boolean;
  [key: string]: boolean;
}

export interface GameState {
  playerName: string;
  accountName: string;
  personaName: string;
  personaType: PersonaType;

  day: number;
  timeOfDay: TimeOfDay;

  money: number;
  skins: number;
  suspicion: number;
  trust: number;
  rep: number;

  // Personality Stats
  soft: number;
  slutty: number;
  dominant: number;
  bitter: number;

  // Affection Points (Core Orbiters)
  dominicPoints: number;
  felixPoints: number;
  adrianPoints: number;
  gomezPoints: number;

  // Progression Trackers
  femStage: number;
  voiceLadder: number;
  voiceProgress: number;
  bodyFemininity: number;
  visualLadder: number;
  transitionProgress: number;

  // Core 4 Event Progress Tracker
  dominicStep: number;
  felixStep: number;
  adrianStep: number;
  gomezStep: number;

  flags: GameFlags;
  currentScene: string;

  discoveredRegulars: DiscoveredRegulars;

  unlockedVoiceTraining: boolean;
  unlockedWorkout: boolean;
  unlockedMakeup: boolean;

  unlockedSkins: string[];
  equippedSkin: string | null;

  lastGameEvent?: EventResult;
  lastDiscordEvent?: EventResult;
  lastTip?: number;
  lastTipType?: 'text' | 'voice';
}

export type SkinCategory = 'cute' | 'lewd' | 'goth';

export interface SkinItem {
  id: string;
  name: string;
  category: SkinCategory;
  statBoost: 'soft' | 'slutty' | 'dominant';
  description: string;
  cost: number;
  icon: string;
}

export interface DiscoveredRegulars {
  dominic: boolean;
  felix: boolean;
  adrian: boolean;
  gomez: boolean;
}

export interface EventResult {
  title: string;
  narrative: string;
  chatLogs?: Array<{ sender: string; senderClass?: string; message: string }>;
  repGained: number;
  moneyGained: number;
  newDiscovery?: 'dominic' | 'felix' | 'adrian' | 'gomez';
  involvedRegular?: 'dominic' | 'felix' | 'adrian' | 'gomez';
  unlocksVoiceTraining?: boolean;
  unlocksWorkout?: boolean;
  equippedSkinUsed?: string;
  skinStatBoost?: { stat: 'soft' | 'slutty' | 'dominant'; amount: number };
  giftedSkinId?: string;
}

export interface AssetDefinition {
  path: string;
  category: 'backgrounds' | 'portraits' | 'items' | 'setups' | 'feminization';
  desc: string;
}

export interface SceneChoice {
  text: string;
  target: string;
  hint?: string;
  condition?: (state: GameState) => boolean;
  action?: (state: GameState) => void;
}

export interface SceneInputConfig {
  id: string;
  label: string;
  defaultValue: (state: GameState) => string;
  placeholder?: string;
}

export interface Scene {
  id: string;
  image?: string;
  text: string | ((state: GameState) => string);
  onEnter?: (state: GameState) => void;
  inputs?: SceneInputConfig[];
  choices: SceneChoice[];
}

export type SceneGraph = Record<string, Scene>;
