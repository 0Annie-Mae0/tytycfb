/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useSyncExternalStore } from 'react';
import { engineInstance } from './engine/gameEngine';
import { SCENE_GRAPH } from './scenes/sceneGraph';
import { HUD } from './components/HUD';
import { SceneViewport } from './components/SceneViewport';
import { SystemBar } from './components/SystemBar';
import { NotificationToast } from './components/NotificationToast';

export default function App() {
  const gameState = useSyncExternalStore(
    (onStoreChange) => engineInstance.subscribe(onStoreChange),
    () => engineInstance.getState()
  );

  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'warn' } | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const targetScene = params.get('scene');
    const autostart = params.get('autostart');

    if (targetScene && SCENE_GRAPH[targetScene]) {
      engineInstance.goTo(targetScene);
      return;
    }

    if (autostart === '1') {
      engineInstance.goTo('scene_first_scene');
      return;
    }

    // Attempt auto-load if previous save is present
    const loaded = engineInstance.load();
    if (loaded) {
      setToast({ message: 'Previous session restored from local storage.', type: 'info' });
    }
  }, []);

  const currentScene = SCENE_GRAPH[gameState.currentScene] || SCENE_GRAPH['scene_start'];

  const handleChoice = (index: number, inputValues?: Record<string, string>) => {
    engineInstance.executeChoice(index, inputValues);
  };

  const handleSave = () => {
    const success = engineInstance.save();
    setToast(
      success
        ? { message: 'Progress saved successfully.', type: 'success' }
        : { message: 'Could not save game to local storage.', type: 'warn' }
    );
  };

  const handleLoad = () => {
    const success = engineInstance.load();
    setToast(
      success
        ? { message: 'Game loaded successfully.', type: 'success' }
        : { message: 'No save game found in local storage.', type: 'warn' }
    );
  };

  const handleRestart = () => {
    engineInstance.restart();
    setToast({ message: 'Game reset to the beginning.', type: 'info' });
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#dce3f1] flex justify-center">
      <SystemBar onSave={handleSave} onLoad={handleLoad} onRestart={handleRestart} />

      <div
        id="game-layout"
        className="w-full max-w-[1360px] min-h-screen bg-[#12141f] shadow-2xl flex flex-col md:flex-row"
      >
        <HUD state={gameState} />
        <SceneViewport
          scene={currentScene}
          state={gameState}
          onChoice={handleChoice}
        />
      </div>

      <NotificationToast
        message={toast?.message ?? null}
        type={toast?.type}
        onDismiss={() => setToast(null)}
      />
    </div>
  );
}
