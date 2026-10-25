import React from 'react';

interface SystemBarProps {
  onSave: () => void;
  onLoad: () => void;
  onRestart: () => void;
  onBack: () => void;
  canGoBack: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const SystemBar: React.FC<SystemBarProps> = ({
  onSave,
  onLoad,
  onRestart,
  onBack,
  canGoBack,
  theme,
  onToggleTheme,
  sidebarCollapsed,
  onToggleSidebar
}) => {
  return (
    <header className="fixed top-0 right-0 p-2 md:p-3 flex items-center gap-2 z-50">
      {onToggleSidebar && (
        <button
          type="button"
          onClick={onToggleSidebar}
          className="system-bar-btn bg-[#0d0f17]/85 hover:text-white hover:border-[#f472b6] border border-[#262c42] text-[#7c88a8] text-xs font-mono px-3 py-1.5 rounded cursor-pointer backdrop-blur-sm transition-all flex items-center gap-1.5"
          title={sidebarCollapsed ? 'Expand character status sidebar' : 'Collapse character status sidebar'}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span>📊</span>
          <span>{sidebarCollapsed ? 'Show HUD' : 'Hide HUD'}</span>
        </button>
      )}

      <button
        type="button"
        onClick={onBack}
        disabled={!canGoBack}
        className={`system-bar-btn border text-xs font-mono px-3 py-1.5 rounded cursor-pointer backdrop-blur-sm transition-all flex items-center gap-1.5 ${
          canGoBack
            ? 'bg-[#0d0f17]/85 hover:text-white hover:border-[#f472b6] border-[#262c42] text-[#7c88a8]'
            : 'bg-[#0d0f17]/40 border-[#1f2437] text-[#475569] cursor-not-allowed opacity-50'
        }`}
        title={canGoBack ? 'Retract choice and return to previous state' : 'No previous choice to undo'}
        aria-label="Back button"
      >
        <span>←</span>
        <span>Back</span>
      </button>

      <button
        type="button"
        onClick={onToggleTheme}
        className="system-bar-btn bg-[#0d0f17]/85 hover:text-white hover:border-[#f472b6] border border-[#262c42] text-[#7c88a8] text-xs font-mono px-3 py-1.5 rounded cursor-pointer backdrop-blur-sm transition-all flex items-center gap-1.5"
        title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        aria-label="Toggle light/dark theme"
      >
        <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
        <span className="capitalize">{theme === 'dark' ? 'Light' : 'Dark'}</span>
      </button>

      <button
        type="button"
        onClick={onSave}
        className="system-bar-btn bg-[#0d0f17]/85 hover:text-white hover:border-[#f472b6] border border-[#262c42] text-[#7c88a8] text-xs font-mono px-3 py-1.5 rounded cursor-pointer backdrop-blur-sm transition-all"
        title="Save progress to local storage"
      >
        Save
      </button>
      <button
        type="button"
        onClick={onLoad}
        className="system-bar-btn bg-[#0d0f17]/85 hover:text-white hover:border-[#f472b6] border border-[#262c42] text-[#7c88a8] text-xs font-mono px-3 py-1.5 rounded cursor-pointer backdrop-blur-sm transition-all"
        title="Load saved game from local storage"
      >
        Load
      </button>
      <button
        type="button"
        onClick={onRestart}
        className="system-bar-btn bg-[#0d0f17]/85 hover:text-rose-400 hover:border-rose-500 border border-[#262c42] text-[#7c88a8] text-xs font-mono px-3 py-1.5 rounded cursor-pointer backdrop-blur-sm transition-all"
        title="Reset game to beginning"
      >
        Restart
      </button>
    </header>
  );
};

