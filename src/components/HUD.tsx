import React, { useState } from 'react';
import { GameState } from '../types/game';
import {
  STAGE_NAMES,
  VOICE_LABELS,
  VISUAL_LABELS,
  getPortraitInfo
} from '../engine/gameEngine';
import { ASSET_MANIFEST } from '../data/assets';
import { getSkinById } from '../data/skins';

interface HUDProps {
  state: GameState;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  state,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [imageError, setImageError] = useState(false);
  const { key: portraitKey, displayName, subName } = getPortraitInfo(state);
  const portraitAsset = ASSET_MANIFEST[portraitKey];
  const equippedSkinObj = state.equippedSkin ? getSkinById(state.equippedSkin) : null;

  return (
    <aside
      id="sidebar"
      aria-label="Character and status sidebar"
      aria-hidden={isCollapsed}
      className={`sidebar-container bg-[#0d0f17] border-r border-[#262c42] flex flex-col overflow-y-auto max-h-screen sticky top-0 transition-all duration-300 ease-in-out ${
        isCollapsed
          ? 'w-0 p-0 border-r-0 opacity-0 pointer-events-none overflow-hidden select-none md:w-0'
          : 'w-full md:w-[320px] p-6 gap-5 shrink-0 opacity-100'
      }`}
    >
      {/* Sidebar Header with Collapse Button */}
      <div className="flex items-center justify-between pb-1 -mt-1 border-b border-[#262c42]">
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#7c88a8]">
          <span>📊</span>
          <span className="font-semibold uppercase tracking-wider text-[0.7rem]">Status Sidebar</span>
        </div>
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="sidebar-toggle-btn text-[0.72rem] font-mono px-2 py-0.5 rounded border border-[#262c42] text-[#7c88a8] hover:text-white hover:border-[#f472b6] transition-all flex items-center gap-1 cursor-pointer"
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <span>◀</span>
            <span>Hide</span>
          </button>
        )}
      </div>

      {/* Identity */}
      <div className="bg-[#1a1e2e] border border-[#262c42] rounded-md p-4">
        <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[#7c88a8] border-b border-[#262c42] pb-1.5 mb-2.5 font-semibold">
          Identity
        </div>

        <div className="avatar-frame w-full h-[180px] rounded-md overflow-hidden mb-3 flex items-center justify-center relative">
          {portraitAsset && !imageError ? (
            <img
              src={portraitAsset.path}
              alt={portraitAsset.desc}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="avatar-placeholder w-full h-full flex flex-col items-center justify-center p-3 text-center">
              <span className="avatar-placeholder-key">
                {portraitKey}
              </span>
              <span className="avatar-placeholder-name">
                [{displayName}]
              </span>
              <span className="avatar-placeholder-desc">
                {portraitAsset?.desc || 'Character Avatar'}
              </span>
            </div>
          )}
        </div>

        <div className="font-bold text-lg text-white" id="hud-name">
          {displayName}
        </div>
        <div className="text-xs text-[#7c88a8]" id="hud-subname">
          {subName}
        </div>
      </div>

      {/* Schedule & Cycle */}
      <div className="bg-[#1a1e2e] border border-[#262c42] rounded-md p-4">
        <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[#7c88a8] border-b border-[#262c42] pb-1.5 mb-2.5 font-semibold">
          Schedule & Cycle
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#cfd8e8]">Day:</span>
          <strong className="text-[#facc15] font-semibold" id="hud-day-num">
            Day {state.day}
          </strong>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#cfd8e8]">Time:</span>
          <span className="text-[#38bdf8] font-medium" id="hud-time-of-day">
            {state.timeOfDay}
          </span>
        </div>
      </div>

      {/* Feminization & Mindshift */}
      <div className="bg-[#1a1e2e] border border-[#262c42] rounded-md p-4">
        <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[#7c88a8] border-b border-[#262c42] pb-1.5 mb-2.5 font-semibold">
          Feminization & Mindshift
        </div>

        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#cfd8e8]">Stage:</span>
          <strong className="text-[#f472b6] font-semibold text-xs" id="hud-stage-label">
            {STAGE_NAMES[state.femStage] || 'Transitioning'}
          </strong>
        </div>

        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#cfd8e8]">Internal Drift:</span>
          <span className="text-[#f472b6] font-mono font-medium" id="hud-trans-val">
            {state.transitionProgress}%
          </span>
        </div>
        <div className="w-full h-1.5 progress-bar-track rounded-sm overflow-hidden mb-3">
          <div
            className="h-full bg-[#f472b6] transition-all duration-300"
            style={{ width: `${state.transitionProgress}%` }}
          />
        </div>

        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#cfd8e8]">Voice Ladder:</span>
          <span className="text-xs text-[#cfd8e8]" id="hud-voice-ladder">
            {VOICE_LABELS[state.voiceLadder] || `Level ${state.voiceLadder}`}
          </span>
        </div>

        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#cfd8e8]">Body Femininity:</span>
          <span className="text-xs text-[#d946ef] font-mono" id="hud-body-val">
            {state.bodyFemininity} / 100
          </span>
        </div>
        <div className="w-full h-1.5 progress-bar-track rounded-sm overflow-hidden mb-3">
          <div
            className="h-full bg-[#d946ef] transition-all duration-300"
            style={{ width: `${Math.min(state.bodyFemininity, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-[#cfd8e8]">Visual Disguise:</span>
          <span className="text-xs text-[#cfd8e8]" id="hud-visual-ladder">
            {VISUAL_LABELS[state.visualLadder] || `Level ${state.visualLadder}`}
          </span>
        </div>
      </div>

      {/* Psychological Drift */}
      <div className="bg-[#1a1e2e] border border-[#262c42] rounded-md p-4">
        <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[#7c88a8] border-b border-[#262c42] pb-1.5 mb-2.5 font-semibold">
          Psychological Drift
        </div>

        {/* Soft */}
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#cfd8e8]">Soft:</span>
          <span className="font-mono text-[#f472b6]">{state.soft}</span>
        </div>
        <div className="w-full h-1.5 progress-bar-track rounded-sm overflow-hidden mb-2">
          <div
            className="h-full bg-[#f472b6] transition-all duration-300"
            style={{ width: `${Math.min(state.soft * 8, 100)}%` }}
          />
        </div>

        {/* Slutty / Validation */}
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#cfd8e8]">Validation (Slutty):</span>
          <span className="font-mono text-[#d946ef]">{state.slutty}</span>
        </div>
        <div className="w-full h-1.5 progress-bar-track rounded-sm overflow-hidden mb-2">
          <div
            className="h-full bg-[#d946ef] transition-all duration-300"
            style={{ width: `${Math.min(state.slutty * 8, 100)}%` }}
          />
        </div>

        {/* Dominance */}
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#cfd8e8]">Dominance:</span>
          <span className="font-mono text-[#a855f7]">{state.dominant}</span>
        </div>
        <div className="w-full h-1.5 progress-bar-track rounded-sm overflow-hidden mb-2">
          <div
            className="h-full bg-[#a855f7] transition-all duration-300"
            style={{ width: `${Math.min(state.dominant * 8, 100)}%` }}
          />
        </div>

        {/* Bitterness */}
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#cfd8e8]">Bitterness:</span>
          <span className="font-mono text-[#38bdf8]">{state.bitter}</span>
        </div>
        <div className="w-full h-1.5 progress-bar-track rounded-sm overflow-hidden mb-1">
          <div
            className="h-full bg-[#38bdf8] transition-all duration-300"
            style={{ width: `${Math.min(state.bitter * 8, 100)}%` }}
          />
        </div>
      </div>

      {/* Ledger & Affection */}
      <div className="bg-[#1a1e2e] border border-[#262c42] rounded-md p-4">
        <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[#7c88a8] border-b border-[#262c42] pb-1.5 mb-2.5 font-semibold">
          Ledger & Affection
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-[#cfd8e8]">Money:</span>
          <strong className="text-[#facc15] font-semibold" id="hud-money">
            ${state.money}
          </strong>
        </div>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-[#cfd8e8]">Reputation:</span>
          <strong className="text-[#4ade80] font-semibold" id="hud-rep">
            {state.rep}
          </strong>
        </div>

        <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[#7c88a8] border-b border-[#262c42] pb-1 mb-2 font-semibold">
          Core Orbiters
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#94a3b8]">Dominic:</span>
          <span className="font-mono text-white">
            {state.discoveredRegulars?.dominic ? (
              state.dominicPoints
            ) : (
              <span className="text-[#7c88a8] text-[0.7rem]" title="Locked: Discover via Discord texting">🔒 Locked</span>
            )}
          </span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#818cf8]">Felix:</span>
          <span className="font-mono text-white">
            {state.discoveredRegulars?.felix ? (
              state.felixPoints
            ) : (
              <span className="text-[#7c88a8] text-[0.7rem]" title="Locked: Discover via Discord texting">🔒 Locked</span>
            )}
          </span>
        </div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#34d399]">Adrian:</span>
          <span className="font-mono text-white">
            {state.discoveredRegulars?.adrian ? (
              state.adrianPoints
            ) : (
              <span className="text-[#7c88a8] text-[0.7rem]" title="Locked: Discover via Discord texting">🔒 Locked</span>
            )}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-[#a855f7]">Gomez:</span>
          <span className="font-mono text-white">{state.gomezPoints}</span>
        </div>
      </div>

      {/* Operator Wardrobe & Loadout */}
      {Boolean(state.unlockedSkins && state.unlockedSkins.length > 0) && (
        <div className="bg-[#1a1e2e] border border-[#262c42] rounded-md p-4">
          <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[#7c88a8] border-b border-[#262c42] pb-1.5 mb-2.5 font-semibold flex justify-between items-center">
            <span>Operator Wardrobe</span>
            <span className="text-[#f472b6] font-mono text-[0.7rem]">{state.unlockedSkins?.length ?? 0} Unlocked</span>
          </div>
          {equippedSkinObj ? (
            <div className="text-xs">
              <div className="text-[#cfd8e8] mb-1">
                Equipped: <strong className="text-white">{equippedSkinObj.icon} {equippedSkinObj.name}</strong>
              </div>
              <div className="text-[0.7rem] text-[#4ade80] font-mono">
                ⚡ Match Boost: +1 {equippedSkinObj.statBoost === 'soft' ? 'Soft' : equippedSkinObj.statBoost === 'slutty' ? 'Validation (Slutty)' : 'Dominance'}
              </div>
            </div>
          ) : (
            <div className="text-xs text-[#7c88a8] italic">
              Default Operator (no active match boost)
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
