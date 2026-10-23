import React, { useState } from 'react';
import { GameState } from '../types/game';
import {
  STAGE_NAMES,
  VOICE_LABELS,
  VISUAL_LABELS,
  getPortraitInfo
} from '../engine/gameEngine';
import { ASSET_MANIFEST } from '../data/assets';

interface HUDProps {
  state: GameState;
}

export const HUD: React.FC<HUDProps> = ({ state }) => {
  const [imageError, setImageError] = useState(false);
  const { key: portraitKey, displayName, subName } = getPortraitInfo(state);
  const portraitAsset = ASSET_MANIFEST[portraitKey];

  return (
    <aside
      id="sidebar"
      aria-label="Character and status sidebar"
      className="bg-[#0d0f17] border-r border-[#262c42] p-6 flex flex-col gap-5 overflow-y-auto max-h-screen sticky top-0 w-full md:w-[320px] shrink-0"
    >
      {/* Identity */}
      <div className="bg-[#1a1e2e] border border-[#262c42] rounded-md p-4">
        <div className="text-[0.72rem] uppercase tracking-[0.12em] text-[#7c88a8] border-b border-[#262c42] pb-1.5 mb-2.5 font-semibold">
          Identity
        </div>

        <div className="w-full h-[180px] bg-[#050608] border border-[#262c42] rounded-md overflow-hidden mb-3 flex items-center justify-center relative">
          {portraitAsset && !imageError ? (
            <img
              src={portraitAsset.path}
              alt={portraitAsset.desc}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-radial from-[#181d30] to-[#0d0f18] p-3 text-center">
              <span className="font-mono text-[0.7rem] text-[#f472b6] bg-[#f472b6]/10 px-2 py-0.5 rounded uppercase mb-1">
                {portraitKey}
              </span>
              <span className="text-xs text-[#cfd8e8] font-medium">
                [{displayName}]
              </span>
              <span className="text-[0.7rem] text-[#7c88a8] mt-1 line-clamp-2">
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
        <div className="w-full h-1.5 bg-[#090a10] rounded-sm overflow-hidden mb-3">
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
        <div className="w-full h-1.5 bg-[#090a10] rounded-sm overflow-hidden mb-3">
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
        <div className="w-full h-1.5 bg-[#090a10] rounded-sm overflow-hidden mb-2">
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
        <div className="w-full h-1.5 bg-[#090a10] rounded-sm overflow-hidden mb-2">
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
        <div className="w-full h-1.5 bg-[#090a10] rounded-sm overflow-hidden mb-2">
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
        <div className="w-full h-1.5 bg-[#090a10] rounded-sm overflow-hidden mb-1">
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
          <span className="text-[#cfd8e8]">Simp Rep:</span>
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
    </aside>
  );
};
