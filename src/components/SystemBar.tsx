import React from 'react';

interface SystemBarProps {
  onSave: () => void;
  onLoad: () => void;
  onRestart: () => void;
}

export const SystemBar: React.FC<SystemBarProps> = ({
  onSave,
  onLoad,
  onRestart
}) => {
  return (
    <div className="fixed top-0 right-0 p-2 md:p-3 flex items-center gap-2 z-50">
      <button
        type="button"
        onClick={onSave}
        className="bg-[#0d0f17]/85 hover:text-white hover:border-[#f472b6] border border-[#262c42] text-[#7c88a8] text-xs font-mono px-3 py-1.5 rounded cursor-pointer backdrop-blur-sm transition-all"
        title="Save progress to local storage"
      >
        Save
      </button>
      <button
        type="button"
        onClick={onLoad}
        className="bg-[#0d0f17]/85 hover:text-white hover:border-[#f472b6] border border-[#262c42] text-[#7c88a8] text-xs font-mono px-3 py-1.5 rounded cursor-pointer backdrop-blur-sm transition-all"
        title="Load saved game from local storage"
      >
        Load
      </button>
      <button
        type="button"
        onClick={onRestart}
        className="bg-[#0d0f17]/85 hover:text-rose-400 hover:border-rose-500 border border-[#262c42] text-[#7c88a8] text-xs font-mono px-3 py-1.5 rounded cursor-pointer backdrop-blur-sm transition-all"
        title="Reset game to beginning"
      >
        Restart
      </button>
    </div>
  );
};
