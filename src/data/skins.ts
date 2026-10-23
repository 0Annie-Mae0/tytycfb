import { SkinItem } from '../types/game';

export const GAME_SKINS: Record<string, SkinItem> = {
  skin_cute_pastel: {
    id: 'skin_cute_pastel',
    name: 'Pastel Blossom Maiden',
    category: 'cute',
    statBoost: 'soft',
    cost: 45,
    icon: '🌸',
    description: 'A magical girl weapon set with pastel sakura petals, frilly lace charm, and sweet pastel tracers. (+1 Soft when equipped in matches)'
  },
  skin_cute_bunny: {
    id: 'skin_cute_bunny',
    name: 'Sugar Bunny Ribbon Set',
    category: 'cute',
    statBoost: 'soft',
    cost: 60,
    icon: '🐰',
    description: 'Pastel lavender aesthetic operator skin with fluffy bunny ears, pink ribbons, and heart muzzle flashes. (+1 Soft when equipped in matches)'
  },
  skin_lewd_latex: {
    id: 'skin_lewd_latex',
    name: 'Cyber Succubus Bodysuit',
    category: 'lewd',
    statBoost: 'slutty',
    cost: 50,
    icon: '💋',
    description: 'A skin-tight holographic patent bodysuit with translucent cutouts and neon pink horns. (+1 Slutty/Validation when equipped in matches)'
  },
  skin_lewd_fishnet: {
    id: 'skin_lewd_fishnet',
    name: 'Midnight Vixen Lace & Fishnets',
    category: 'lewd',
    statBoost: 'slutty',
    cost: 65,
    icon: '🔥',
    description: 'Daring micro-skirt operator loadout with torn fishnet stockings and high-slit thigh straps. (+1 Slutty/Validation when equipped in matches)'
  },
  skin_goth_empress: {
    id: 'skin_goth_empress',
    name: 'Abyssal Empress Spiked Armor',
    category: 'goth',
    statBoost: 'dominant',
    cost: 50,
    icon: '🖤',
    description: 'Matte obsidian battle corsetry with dark violet spikes, silver chains, and cold regal accents. (+1 Dominance when equipped in matches)'
  },
  skin_goth_vampire: {
    id: 'skin_goth_vampire',
    name: 'Blood Countess Velvet Robes',
    category: 'goth',
    statBoost: 'dominant',
    cost: 65,
    icon: '🍷',
    description: 'Aristocratic deep crimson velvet coat with an antique lace choker and skull ornaments. (+1 Dominance when equipped in matches)'
  }
};

export function getSkinById(id: string): SkinItem | undefined {
  return GAME_SKINS[id];
}

export function getAllSkins(): SkinItem[] {
  return Object.values(GAME_SKINS);
}
