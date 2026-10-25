import React, { useState, useEffect } from 'react';
import { GameState, Scene } from '../types/game';
import { ASSET_MANIFEST } from '../data/assets';

interface SceneViewportProps {
  scene: Scene;
  state: GameState;
  onChoice: (choiceIndex: number, inputValues?: Record<string, string>) => void;
}

export const SceneViewport: React.FC<SceneViewportProps> = ({
  scene,
  state,
  onChoice
}) => {
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  // Initialize inputs whenever scene changes
  useEffect(() => {
    setImageFailed(false);
    if (scene.inputs && scene.inputs.length > 0) {
      const initial: Record<string, string> = {};
      scene.inputs.forEach((inp) => {
        initial[inp.id] = inp.defaultValue(state);
      });
      setInputValues(initial);
    } else {
      setInputValues({});
    }
  }, [scene.id, state]);

  const asset = scene.image ? ASSET_MANIFEST[scene.image] : null;
  const renderedText = typeof scene.text === 'function' ? scene.text(state) : scene.text;

  const handleInputChange = (id: string, val: string) => {
    setInputValues((prev) => ({ ...prev, [id]: val }));
  };

  const handleChoiceClick = (index: number) => {
    onChoice(index, inputValues);
    // Smooth scroll top on navigation
    const vp = document.getElementById('viewport');
    if (vp) {
      vp.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const availableChoices = scene.choices.filter(
    (c) => !c.condition || c.condition(state)
  );

  return (
    <main
      id="viewport"
      tabIndex={-1}
      className="p-6 md:p-12 flex flex-col max-w-[960px] w-full mx-auto md:mx-0 overflow-y-auto flex-1 transition-all duration-300"
    >
      {/* Scene Image Frame */}
      {scene.image && (
        <div className="scene-image-frame w-full h-[280px] md:h-[320px] rounded-lg overflow-hidden mb-7 relative shrink-0">
          {asset && !imageFailed ? (
            <img
              src={asset.path}
              alt={asset.desc}
              onError={() => setImageFailed(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="scene-placeholder w-full h-full flex flex-col items-center justify-center p-6 text-center border border-dashed">
              <span className="placeholder-path">
                {asset?.path || `/${scene.image}`}
              </span>
              {asset && (
                <span className="placeholder-category">
                  {asset.category}
                </span>
              )}
              <span className="placeholder-desc">
                &ldquo;{asset?.desc || `Scene asset: ${scene.image}`}&rdquo;
              </span>
            </div>
          )}
        </div>
      )}

      {/* Prose Text Narrative */}
      <div
        className="prose mb-6"
        id="scene-text-slot"
        dangerouslySetInnerHTML={{ __html: renderedText }}
      />

      {/* Inputs (if any for this scene) */}
      {scene.inputs && scene.inputs.length > 0 && (
        <div className="bg-[#1a1e2e] border border-[#262c42] rounded-md p-5 mb-5 flex flex-col gap-3">
          {scene.inputs.map((input) => (
            <div key={input.id} className="flex flex-col gap-1.5">
              <label htmlFor={input.id} className="text-sm text-[#7c88a8] font-medium">
                {input.label}
              </label>
              <input
                type="text"
                id={input.id}
                value={inputValues[input.id] ?? ''}
                onChange={(e) => handleInputChange(input.id, e.target.value)}
                placeholder={input.placeholder}
                className="bg-[#090a10] border border-[#262c42] rounded px-3.5 py-2.5 text-white font-inherit focus:outline-none focus:border-[#f472b6] transition-colors"
              />
            </div>
          ))}
        </div>
      )}

      {/* Choice Stack */}
      <nav aria-label="Scene choices" className="flex flex-col gap-3 mt-3 pb-8" id="scene-choices-slot">
        {availableChoices.map((choice, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleChoiceClick(idx)}
            className="choice-button group bg-[#1a1e2e] hover:bg-[#232940] hover:border-[#f472b6] hover:translate-x-1 border border-[#262c42] text-[#dce3f1] rounded-md px-5 py-3.5 text-left text-base cursor-pointer transition-all flex justify-between items-center gap-3"
          >
            <span className="choice-text font-medium group-hover:text-white transition-colors">
              {choice.text}
            </span>
            {choice.hint && (
              <span className="choice-hint text-xs text-[#f472b6] font-mono tracking-tight shrink-0 bg-[#f472b6]/10 px-2 py-0.5 rounded">
                {choice.hint}
              </span>
            )}
          </button>
        ))}
      </nav>
    </main>
  );
};
