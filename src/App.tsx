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
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem('streamer_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('streamer_theme', theme);
    } catch {
      // Ignore local storage restrictions
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  const handleBack = () => {
    const success = engineInstance.goBack();
    if (success) {
      setToast({ message: 'Retracted choice / restored previous scene.', type: 'info' });
      const current = engineInstance.getState().currentScene;
      if (current === 'scene_start' || current === 'scene_character_creation' || current === 'scene_puppy') {
        setSidebarCollapsed(true);
      }
    } else {
      setToast({ message: 'No previous choice to retract.', type: 'warn' });
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const targetScene = params.get('scene');
    const autostart = params.get('autostart');

    if (targetScene && SCENE_GRAPH[targetScene]) {
      engineInstance.goTo(targetScene);
      if (targetScene !== 'scene_start' && targetScene !== 'scene_puppy' && targetScene !== 'scene_character_creation') {
        setSidebarCollapsed(false);
      }
      return;
    }

    if (autostart === '1') {
      engineInstance.goTo('scene_first_scene');
      setSidebarCollapsed(false);
      return;
    }

    // Attempt auto-load if previous save is present
    const loaded = engineInstance.load();
    if (loaded) {
      setToast({ message: 'Previous session restored from local storage.', type: 'info' });
      const current = engineInstance.getState().currentScene;
      if (current !== 'scene_start' && current !== 'scene_puppy' && current !== 'scene_character_creation') {
        setSidebarCollapsed(false);
      }
    }
  }, []);

  const currentScene = SCENE_GRAPH[gameState.currentScene] || SCENE_GRAPH['scene_start'];

  const handleChoice = (index: number, inputValues?: Record<string, string>) => {
    const isChoosingName = currentScene.id === 'scene_character_creation';
    engineInstance.executeChoice(index, inputValues);
    if (isChoosingName) {
      setSidebarCollapsed(false);
      setToast({ message: 'Character Identity & Status sidebar unlocked!', type: 'success' });
    }
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
    if (success) {
      setToast({ message: 'Game loaded successfully.', type: 'success' });
      const current = engineInstance.getState().currentScene;
      if (current !== 'scene_start' && current !== 'scene_puppy' && current !== 'scene_character_creation') {
        setSidebarCollapsed(false);
      }
    } else {
      setToast({ message: 'No save game found in local storage.', type: 'warn' });
    }
  };

  const handleRestart = () => {
    engineInstance.restart();
    setSidebarCollapsed(true);
    setToast({ message: 'Game reset to the beginning.', type: 'info' });
  };

  return (
    <div
      className={`min-h-screen flex justify-center transition-colors duration-200 ${
        theme === 'light' ? 'bg-[#f1f4f9] text-[#1e293b]' : 'bg-[#090a0f] text-[#dce3f1]'
      }`}
    >
      <SystemBar
        onSave={handleSave}
        onLoad={handleLoad}
        onRestart={handleRestart}
        onBack={handleBack}
        canGoBack={engineInstance.canGoBack()}
        theme={theme}
        onToggleTheme={toggleTheme}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={toggleSidebar}
      />

      {sidebarCollapsed && (
        <button
          type="button"
          onClick={() => setSidebarCollapsed(false)}
          className="floating-sidebar-toggle fixed left-3 top-14 md:top-14 z-40 bg-[#1a1e2e]/90 hover:bg-[#232940] border border-[#262c42] hover:border-[#f472b6] text-[#dce3f1] hover:text-white px-3 py-1.5 rounded-md shadow-xl backdrop-blur-md font-mono text-xs cursor-pointer transition-all flex items-center gap-1.5 group"
          title="Expand character & status sidebar"
          aria-label="Expand character sidebar"
        >
          <span className="toggle-icon text-[#f472b6] font-bold group-hover:translate-x-0.5 transition-transform">▶</span>
          <span className="font-semibold">HUD</span>
          {gameState.playerName && (
            <span className="toggle-sub text-[0.7rem] text-[#7c88a8] font-normal">
              ({gameState.playerName})
            </span>
          )}
        </button>
      )}

      <div
        id="game-layout"
        className={`w-full max-w-[1360px] min-h-screen shadow-2xl flex flex-col md:flex-row transition-colors duration-200 ${
          theme === 'light' ? 'bg-[#ffffff]' : 'bg-[#12141f]'
        }`}
      >
        <HUD
          state={gameState}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(true)}
        />
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
