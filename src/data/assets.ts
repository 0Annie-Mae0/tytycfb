import { AssetDefinition } from '../types/game';

export const ASSET_MANIFEST: Record<string, AssetDefinition> = {
  // Backgrounds
  "bg_car_rain": {
    path: "images/backgrounds/car_rain_dashboard.png",
    category: "backgrounds",
    desc: "Inside a beat-up 2004 sedan at night. Rain streams down the windshield, dashboard glowing dim amber."
  },
  "bg_messy_room": {
    path: "images/backgrounds/messy_bedroom.png",
    category: "backgrounds",
    desc: "A cramped, dusty male apartment bedroom. Piles of laundry, unmade bed, cords tangled across the carpet."
  },
  "bg_discord_night": {
    path: "images/backgrounds/discord_night_ambient.png",
    category: "backgrounds",
    desc: "Dark room illuminated only by the harsh slate and violet glow of a Discord window on a desktop monitor."
  },
  "bg_stage1_lights": {
    path: "images/backgrounds/bedroom_stage1_lights.png",
    category: "backgrounds",
    desc: "Cleaned bedroom bathed in a warm violet and amber glow from fairy lights hung over the curtain rod."
  },
  "bg_stage2_feminized": {
    path: "images/backgrounds/bedroom_stage2_feminized.png",
    category: "backgrounds",
    desc: "Feminine haven: pastel plushies on pillows, lavender diffuser misting, scented soy candles."
  },

  // Portraits - Men
  "portrait_gomez": {
    path: "images/portraits/gomez_normal.png",
    category: "portraits",
    desc: "Gomez's avatar: sleek neon mask, sharp designer jawline, cyber-hustler demeanor."
  },
  "portrait_dominic": {
    path: "images/portraits/dominic_avatar.png",
    category: "portraits",
    desc: "Dominic's avatar: older man in a charcoal suit, silver hair, heavy calculating gaze."
  },
  "portrait_felix": {
    path: "images/portraits/felix_avatar.png",
    category: "portraits",
    desc: "Felix's avatar: ink sketch of an anime boy burying his face in his hands with flushed cheeks."
  },
  "portrait_adrian": {
    path: "images/portraits/adrian_avatar.png",
    category: "portraits",
    desc: "Adrian's avatar: warm indie game developer portrait, wireframe glasses, cozy knitted scarf."
  },

  // Portraits - Player Progression
  "portrait_player_boy": {
    path: "images/portraits/player/player_boy_base.png",
    category: "portraits",
    desc: "Mark: exhausted delivery guy with dark circles under his eyes, hollow cheeks, and rough stubble."
  },
  "portrait_fem_goth": {
    path: "images/portraits/player/goth_stage1.png",
    category: "portraits",
    desc: "Raven: dark choppy bangs, tight silver choker, smoky eyeliner framing heavy, magnetic eyes."
  },
  "portrait_fem_soft": {
    path: "images/portraits/player/soft_stage1.png",
    category: "portraits",
    desc: "Lily: soft caramel bob wig, glossy pink lips, oversized cream knit sweater collar."
  },
  "portrait_fem_egirl": {
    path: "images/portraits/player/egirl_stage1.png",
    category: "portraits",
    desc: "Neko: bubblegum pink pigtails, tiny heart stamped under left eye, teasing pout."
  },
  "portrait_fem_mask": {
    path: "images/feminization/fem_wig_mask.png",
    category: "feminization",
    desc: "Silky synthetic lace-front wig, winged eyeliner, black cloth mask hiding the masculine jawline."
  },

  // Items & Setups
  "item_receipt": {
    path: "images/items/delivery_uniform.png",
    category: "items",
    desc: "Crumpled blue polyester pizza polo shirt tossed onto a greasy counter with a twenty and a five."
  },
  "item_desk_glow": {
    path: "images/setups/desk_night_glow.png",
    category: "setups",
    desc: "Desktop mechanical keyboard glowing with custom pastel keycaps, Discord open, mug of herbal tea."
  },
  "item_plushie": {
    path: "images/items/plushie_cat.png",
    category: "items",
    desc: "A massive, soft lavender plush cat with closed sleeping eyes and blushing pink cheeks."
  },
  "item_thigh_highs": {
    path: "images/items/thigh_highs_package.png",
    category: "items",
    desc: "Pair of charcoal knit over-the-knee socks laid out across clean sheets under fairy lights."
  },
  "item_pitch_graph": {
    path: "images/feminization/voice_pitch_graph.png",
    category: "feminization",
    desc: "Audio spectrum analysis tool on screen, pitch graph straining into the 220Hz feminine zone."
  },
  "item_workout_mat": {
    path: "images/feminization/workout_mat.png",
    category: "feminization",
    desc: "A rolled-out yoga mat next to the bed with resistance bands and a water bottle."
  }
};
