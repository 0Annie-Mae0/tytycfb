import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTransitionProgress,
  advanceTimeOfDay,
  getPortraitInfo,
  createInitialState,
  GameEngine
} from './gameEngine';
import { generateGamingEvent, generateDiscordEvent } from './gameEvents';
import { SCENE_GRAPH } from '../scenes/sceneGraph';

test('calculateTransitionProgress: baseline for unbroken male is 0', () => {
  const state = createInitialState();
  const progress = calculateTransitionProgress(state);
  assert.equal(progress, 0);
});

test('calculateTransitionProgress: computes weighted progress from stages and stats', () => {
  const state = createInitialState();
  state.femStage = 2; // 2 * 20 = 40
  state.voiceLadder = 2; // 2 * 6 = 12
  state.visualLadder = 1; // 1 * 6 = 6
  state.bodyFemininity = 40; // floor(40 * 0.15) = 6
  state.soft = 4;
  state.slutty = 4; // floor((4 + 4) / 2) = 4
  // Sum = 40 + 12 + 6 + 6 + 4 = 68
  const progress = calculateTransitionProgress(state);
  assert.equal(progress, 68);
});

test('calculateTransitionProgress: high bitterness reduces progress and stays within [0, 100]', () => {
  const state = createInitialState();
  state.femStage = 1; // 20
  state.bitter = 10; // > 5 => - (10 * 1.5) = -15
  const progress = calculateTransitionProgress(state);
  assert.equal(progress, 5);

  state.bitter = 100;
  assert.equal(calculateTransitionProgress(state), 0);
});

test('advanceTimeOfDay: cycles correctly from Morning to Late Night', () => {
  assert.equal(advanceTimeOfDay('Morning'), 'Afternoon');
  assert.equal(advanceTimeOfDay('Afternoon'), 'Night');
  assert.equal(advanceTimeOfDay('Night'), 'Late Night');
  assert.equal(advanceTimeOfDay('Late Night'), 'Late Night');
});

test('getPortraitInfo: returns male portrait at Stage 0 and persona portrait at Stage 1+', () => {
  const state = createInitialState();
  state.playerName = 'Alex';
  let info = getPortraitInfo(state);
  assert.equal(info.key, 'portrait_player_boy');
  assert.equal(info.displayName, 'Alex');

  state.femStage = 1;
  state.personaName = 'Lily';
  state.personaType = 'soft';
  info = getPortraitInfo(state);
  assert.equal(info.key, 'portrait_fem_soft');
  assert.equal(info.displayName, 'Lily');

  state.visualLadder = 2;
  info = getPortraitInfo(state);
  assert.equal(info.key, 'portrait_fem_mask');
});

test('GameEngine: can navigate scenes and execute choices', () => {
  const engine = new GameEngine();
  assert.equal(engine.getState().currentScene, 'scene_start');

  // Choice 0 on scene_start is "Yes, I am of legal age." -> scene_character_creation
  engine.executeChoice(0);
  assert.equal(engine.getState().currentScene, 'scene_character_creation');

  // Execute choice on character creation with input
  engine.executeChoice(0, { 'char-name-input': 'Michael' });
  assert.equal(engine.getState().playerName, 'Michael');
  assert.equal(engine.getState().currentScene, 'scene_first_scene');
});

test('generateGamingEvent: produces 15 to 20 reputation', () => {
  const state = createInitialState();
  for (let i = 0; i < 50; i++) {
    const event = generateGamingEvent(state);
    assert.ok(event.title.length > 0);
    assert.ok(event.narrative.length > 0);
    assert.ok(event.repGained >= 15 && event.repGained <= 20, `repGained ${event.repGained} must be between 15 and 20`);
  }
});

test('generateDiscordEvent: produces 1 to 5 reputation and 5 to 10 money', () => {
  const state = createInitialState();
  for (let i = 0; i < 50; i++) {
    const event = generateDiscordEvent(state);
    assert.ok(event.title.length > 0);
    assert.ok(event.narrative.length > 0);
    assert.ok(event.repGained >= 1 && event.repGained <= 5, `repGained ${event.repGained} must be between 1 and 5`);
    assert.ok(event.moneyGained >= 5 && event.moneyGained <= 10, `moneyGained ${event.moneyGained} must be between 5 and 10`);
  }
});

test('GameEngine: action_play_games and action_text_discord award expected random stats', () => {
  const engine = new GameEngine();
  engine.goTo('scene_daily_loop');

  const initialRep = engine.getState().rep;
  const initialMoney = engine.getState().money;

  // Navigate to action_play_games
  engine.goTo('action_play_games');
  const repAfterGame = engine.getState().rep;
  const repDiff = repAfterGame - initialRep;
  assert.ok(repDiff >= 15 && repDiff <= 20, `Gaming rep diff was ${repDiff}, expected 15-20`);

  // Navigate to action_text_discord
  const moneyBeforeDiscord = engine.getState().money;
  const repBeforeDiscord = engine.getState().rep;
  engine.goTo('action_text_discord');
  const discordRepDiff = engine.getState().rep - repBeforeDiscord;
  const discordMoneyDiff = engine.getState().money - moneyBeforeDiscord;

  assert.ok(discordRepDiff >= 1 && discordRepDiff <= 5, `Discord rep diff was ${discordRepDiff}, expected 1-5`);
  assert.ok(discordMoneyDiff >= 5 && discordMoneyDiff <= 10, `Discord money diff was ${discordMoneyDiff}, expected 5-10`);
});

test('Regular Discovery: orbiters start locked and unlock when their discovery event is triggered', () => {
  const state = createInitialState();
  assert.equal(state.discoveredRegulars.dominic, false);
  assert.equal(state.discoveredRegulars.felix, false);
  assert.equal(state.discoveredRegulars.adrian, false);
  assert.equal(state.discoveredRegulars.gomez, true);

  // Discover all through multiple texting actions
  const engine = new GameEngine(state);
  for (let i = 0; i < 30; i++) {
    engine.goTo('action_text_discord');
    engine.goTo('scene_daily_loop');
  }

  const updatedState = engine.getState();
  // Over 30 Discord sessions, at least one regular should be discovered
  const anyDiscovered =
    updatedState.discoveredRegulars.dominic ||
    updatedState.discoveredRegulars.felix ||
    updatedState.discoveredRegulars.adrian;
  assert.equal(anyDiscovered, true);
});

test('Regular-specific events: generateGamingEvent and generateDiscordEvent include regular events once discovered', () => {
  const state = createInitialState();
  state.discoveredRegulars = {
    dominic: true,
    felix: true,
    adrian: true,
    gomez: true
  };

  const gamingInvolved = new Set<string>();
  const discordInvolved = new Set<string>();

  for (let i = 0; i < 100; i++) {
    const gameEv = generateGamingEvent(state);
    if (gameEv.involvedRegular) gamingInvolved.add(gameEv.involvedRegular);

    const discEv = generateDiscordEvent(state);
    if (discEv.involvedRegular) discordInvolved.add(discEv.involvedRegular);
  }

  assert.ok(gamingInvolved.has('dominic') || gamingInvolved.has('felix') || gamingInvolved.has('adrian'));
  assert.ok(discordInvolved.has('dominic') || discordInvolved.has('felix') || discordInvolved.has('adrian'));
});

test('Activity Unlocks: Voice training, Working out, and Make-up are hidden initially and unlocked by events', () => {
  const state = createInitialState();
  assert.equal(state.unlockedVoiceTraining, false);
  assert.equal(state.unlockedWorkout, false);
  assert.equal(state.unlockedMakeup, false);

  const engine = new GameEngine(state);
  engine.goTo('scene_daily_loop');

  // Verify that initially, voice training, workout, and makeup are NOT available in choices
  let availableChoices = SCENE_GRAPH['scene_daily_loop'].choices.filter(
    (c) => !c.condition || c.condition(engine.getState())
  );
  assert.equal(availableChoices.some((c) => c.target === 'action_voice_training'), false);
  assert.equal(availableChoices.some((c) => c.target === 'action_workout'), false);
  assert.equal(availableChoices.some((c) => c.target === 'action_makeup'), false);

  // Unlock voice training (e.g. Felix asks for voice note or Discord event)
  engine.setState((draft) => {
    draft.unlockedVoiceTraining = true;
  });
  availableChoices = SCENE_GRAPH['scene_daily_loop'].choices.filter(
    (c) => !c.condition || c.condition(engine.getState())
  );
  assert.equal(availableChoices.some((c) => c.target === 'action_voice_training'), true);
  assert.equal(availableChoices.some((c) => c.target === 'action_workout'), false);
  assert.equal(availableChoices.some((c) => c.target === 'action_makeup'), false);

  // Unlock working out (e.g. Dominic offers to buy clothes)
  engine.setState((draft) => {
    draft.unlockedWorkout = true;
  });
  availableChoices = SCENE_GRAPH['scene_daily_loop'].choices.filter(
    (c) => !c.condition || c.condition(engine.getState())
  );
  assert.equal(availableChoices.some((c) => c.target === 'action_workout'), true);
  // Makeup still remains hidden
  assert.equal(availableChoices.some((c) => c.target === 'action_makeup'), false);
});

test('Undo / History: canGoBack returns true after choices and goBack retracts choice', () => {
  const engine = new GameEngine();
  assert.equal(engine.canGoBack(), false);

  // Execute choice on start scene
  engine.executeChoice(0);
  assert.equal(engine.getState().currentScene, 'scene_character_creation');
  assert.equal(engine.canGoBack(), true);

  // Retract choice
  const reverted = engine.goBack();
  assert.equal(reverted, true);
  assert.equal(engine.getState().currentScene, 'scene_start');
});

test('Skin Stat Boosts: cute skins grant +1 soft, lewd skins grant +1 slutty, goth skins grant +1 dominance', () => {
  // Test cute skin boost (+1 soft)
  const engineCute = new GameEngine();
  engineCute.setState((draft) => {
    draft.unlockedSkins = ['skin_cute_pastel'];
    draft.equippedSkin = 'skin_cute_pastel';
    draft.soft = 0;
  });
  engineCute.goTo('action_play_games');
  assert.equal(engineCute.getState().soft, 1);

  // Test lewd skin boost (+1 slutty)
  const engineLewd = new GameEngine();
  engineLewd.setState((draft) => {
    draft.unlockedSkins = ['skin_lewd_latex'];
    draft.equippedSkin = 'skin_lewd_latex';
    draft.slutty = 0;
  });
  engineLewd.goTo('action_play_games');
  assert.equal(engineLewd.getState().slutty, 1);

  // Test goth skin boost (+1 dominance)
  const engineGoth = new GameEngine();
  engineGoth.setState((draft) => {
    draft.unlockedSkins = ['skin_goth_empress'];
    draft.equippedSkin = 'skin_goth_empress';
    draft.dominant = 0;
  });
  engineGoth.goTo('action_play_games');
  assert.equal(engineGoth.getState().dominant, 1);
});

test('Random Skin Gifting: players can be gifted unowned skins in gaming and Discord events', () => {
  const state = createInitialState();
  state.unlockedSkins = [];

  let giftedGamingSkinFound = false;
  let giftedDiscordSkinFound = false;

  for (let i = 0; i < 200; i++) {
    const gameEv = generateGamingEvent(state);
    if (gameEv.giftedSkinId) giftedGamingSkinFound = true;

    const discEv = generateDiscordEvent(state);
    if (discEv.giftedSkinId) giftedDiscordSkinFound = true;

    if (giftedGamingSkinFound && giftedDiscordSkinFound) break;
  }

  assert.equal(giftedGamingSkinFound, true, 'Expected at least one skin gift in gaming events');
  assert.equal(giftedDiscordSkinFound, true, 'Expected at least one skin gift in Discord events');
});

test('Persona Exclusive Scenes: soft, goth, and e-girl archetypes generate exclusive gaming and Discord scenes', () => {
  const testArchetype = (type: 'soft' | 'goth' | 'egirl', expectedSubstring: string) => {
    const s = createInitialState();
    s.personaType = type;
    s.unlockedSkins = ['skin_cute_pastel', 'skin_cute_bunny', 'skin_lewd_latex', 'skin_lewd_fishnet', 'skin_goth_empress', 'skin_goth_vampire'];
    let foundExclusiveGaming = false;
    let foundExclusiveDiscord = false;

    for (let i = 0; i < 150; i++) {
      const g = generateGamingEvent(s);
      if (g.title.includes(expectedSubstring)) foundExclusiveGaming = true;

      const d = generateDiscordEvent(s);
      if (d.title.includes(expectedSubstring)) foundExclusiveDiscord = true;
    }

    assert.ok(foundExclusiveGaming, `Expected exclusive gaming event for ${type}`);
    assert.ok(foundExclusiveDiscord, `Expected exclusive Discord event for ${type}`);
  };

  testArchetype('soft', 'Soft Persona Exclusive');
  testArchetype('goth', 'Goth Persona Exclusive');
  testArchetype('egirl', 'E-Girl Persona Exclusive');
});

test('Scene Graph: all scenes render text successfully with valid string output', () => {
  const state = createInitialState();
  state.unlockedSkins = ['skin_cute_pastel'];
  state.equippedSkin = 'skin_cute_pastel';
  state.discoveredRegulars = { dominic: true, felix: true, adrian: true, gomez: true };

  for (const [sceneId, scene] of Object.entries(SCENE_GRAPH)) {
    const text = typeof scene.text === 'function' ? scene.text(state) : scene.text;
    assert.ok(typeof text === 'string' && text.length > 0, `Scene ${sceneId} should return non-empty string`);
  }
});

