import { GameState, EventResult } from '../types/game';
import { getSkinById } from '../data/skins';

/**
 * Helper to generate random integers inclusive of min and max.
 */
export function getRandomInt(min: number, max: number, randomFn = Math.random): number {
  return Math.floor(randomFn() * (max - min + 1)) + min;
}

/**
 * Random gaming events pool for action_play_games.
 * Generates 15-20 reputation, and occasional tips/tournament spoils.
 * Unlocks specialized regular-themed events when Dominic, Felix, Adrian, or Gomez are discovered.
 */
export function generateGamingEvent(state: GameState, randomFn = Math.random): EventResult {
  const repGained = getRandomInt(15, 20, randomFn);
  const bonusChance = randomFn();
  const moneyGained = bonusChance > 0.65 ? getRandomInt(5, 15, randomFn) : 0;

  const personaName = state.personaName || 'Luna';
  const handle = state.accountName ? `@${state.accountName}` : '@anon';
  const archetype = state.personaType || 'soft';

  // Base gaming events pool
  const events: Array<{
    title: string;
    narrative: string;
    chatLogs: Array<{ sender: string; senderClass?: string; message: string }>;
    involvedRegular?: 'dominic' | 'felix' | 'adrian' | 'gomez';
  }> = [
    {
      title: 'The Overprotective Squad Carry',
      narrative: `You queue into high-tier competitive lobbies under ${handle}. Two high-ranked players immediately notice your profile and spend the entire match acting like personal bodyguards. Whenever an opponent angles toward you, your squadmates rush to tank the damage and ping epic loot for you to pick up.`,
      chatLogs: [
        { sender: 'ApexPredator_9', senderClass: 'sender-stranger', message: `don't worry ${personaName}, I got your back. take the legendary shield!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: archetype === 'soft' ? `omg ty both so much 🥺💕` : archetype === 'goth' ? `...appreciate it.` : `ez carry boys keep it up 💅` },
        { sender: 'ViperSniper', senderClass: 'sender-kev', message: `anything for our queen! add me after the match please!` }
      ]
    },
    {
      title: 'The Sudden Death 1v3 Clutch',
      narrative: `Your entire squad gets wiped out at the final circle, leaving you in a desperate 1-versus-3 scenario. Your heart pounds in your chest as you hold an impossible angle, cleanly eliminating each opponent one by one. The red victory banner erupts on screen and the lobby text chat goes completely feral.`,
      chatLogs: [
        { sender: 'Spectator_X', senderClass: 'sender-stranger', message: `HOLY SHIT SHE ACTUALLY CLUTCHED THAT?!` },
        { sender: 'xX_Shadow_Xx', senderClass: 'sender-felix', message: `GIRL YOU ARE CRACKED!! ${handle} is insane!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: archetype === 'goth' ? `told you not to doubt me.` : archetype === 'egirl' ? `sit down nerds~ 💕` : `i was shaking so hard hehe :3` }
      ]
    },
    {
      title: 'The Simp Bounty & Bodyguard Match',
      narrative: `The opposing team discovers that a cute streamer girl is in the lobby and jokes in all-chat about hunting you down. Your random teammates treat it as a declaration of war. They establish a defensive perimeter around your position and shred every enemy who dares to approach.`,
      chatLogs: [
        { sender: 'EnemyTeam_Captain', senderClass: 'sender-stranger', message: `1000 credits to whoever takes down ${personaName}` },
        { sender: 'SimpKnight_42', senderClass: 'sender-kev', message: `touch one hair on her avatar and we send you back to bronze.` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `you guys are crazy haha 🙈` }
      ]
    },
    {
      title: 'Late Night Screen-Share Coaching',
      narrative: `You stream your gameplay in a private voice lounge. Several server regulars gather to watch you play, enthusiastically praising your aim and offering tips. The chat stream fills with heart emotes and compliments on how comfortable your presence feels.`,
      chatLogs: [
        { sender: 'GamerGuy_Dan', senderClass: 'sender-stranger', message: `Honestly so relaxing watching you play late at night, ${personaName}.` },
        { sender: 'PixelBoy', senderClass: 'sender-stranger', message: `Your crosshair placement is getting so clean! Really proud of you.` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `thank you for keeping me company tonight guys~ ✨` }
      ]
    },
    {
      title: 'Rival Clan Defeat & All-Chat Simping',
      narrative: `A notoriously toxic squad tries to talk trash in the lobby pre-game. You play completely out of your mind, repeatedly shutting down their top player. By round five, the enemy team stops talking trash and starts begging for your Discord tag instead.`,
      chatLogs: [
        { sender: 'ToxicChad_00', senderClass: 'sender-stranger', message: `okay my bad ${personaName}… you're actually cracked. are you single?` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: archetype === 'goth' ? `in your dreams.` : archetype === 'egirl' ? `cry louder lol 💕` : `focus on the game silly :P` },
        { sender: 'Teammate_Z', senderClass: 'sender-kev', message: `LMAOOO she humbled you so fast!` }
      ]
    }
  ];

  // If Dominic has been discovered, add Dominic-specific gaming events
  if (state.discoveredRegulars?.dominic) {
    events.push({
      title: "Dominic's High-Stakes Spectator Wager",
      involvedRegular: 'dominic',
      narrative: `Dominic joins your private Discord stream to watch your ranked tournament match. He observes in calculating silence before placing a high-stakes friendly wager with his peers on your victory. When you secure the win, he sends cold, refined congratulations.`,
      chatLogs: [
        { sender: 'Dominic_V', senderClass: 'sender-dominic', message: `Composed performance, ${personaName}. A woman who represents me must always execute with poise.` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `Thank you, sir… I made sure not to disappoint you.` },
        { sender: 'Dominic_V', senderClass: 'sender-dominic', message: `You didn't. Keep your posture sharp for tomorrow.` }
      ]
    });
    events.push({
      title: "Dominic's Luxury Cosmetic Sponsorship",
      involvedRegular: 'dominic',
      narrative: `Before queuing, a surprise notification pops up on your screen. Dominic has gifted your account a prestige designer weapon skin bundle. A private note attached reads: 'My companion will not use base cosmetics in public lobbies.'`,
      chatLogs: [
        { sender: 'Dominic_V', senderClass: 'sender-dominic', message: `Equip the velvet skin set, ${personaName}. You should look refined from head to toe.` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `It's gorgeous… thank you, Dominic 🖤` }
      ]
    });
  }

  // If Felix has been discovered, add Felix-specific gaming events
  if (state.discoveredRegulars?.felix) {
    events.push({
      title: "Felix Acts as Mistress's Personal Shield",
      involvedRegular: 'felix',
      narrative: `Felix joins your lobby as your submissive support player. He obeys your every command, refusing to take healing items so that you have full reserves, and throwing his character in front of sniper fire so you never take damage.`,
      chatLogs: [
        { sender: 'felix_k', senderClass: 'sender-felix', message: `Mistress ${personaName}! Please let me take the hit for you! Don't let your health bar drop!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `Good boy, Felix. Keep tanking and don't miss your stuns.` },
        { sender: 'felix_k', senderClass: 'sender-felix', message: `Y-Yes Mistress! It's an honor to die for you! 🙇‍♂️` }
      ]
    });
    events.push({
      title: "Felix's Panic Penance Tribute",
      involvedRegular: 'felix',
      narrative: `During an intense firefight, Felix accidentally body-blocks your grenade throw. In a sheer panic over disappointing his Mistress, he stammers apologies in party chat and sends an instant apology tribute before the match even concludes.`,
      chatLogs: [
        { sender: 'felix_k', senderClass: 'sender-felix', message: `[CashApp: +$10.00] MISTRESS I'M SO SORRY! PLEASE PUNISH ME FOR GETTING IN YOUR WAY!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `I'll deal with your punishment later, Felix. Stay behind me.` }
      ]
    });
  }

  // If Adrian has been discovered, add Adrian-specific gaming events
  if (state.discoveredRegulars?.adrian) {
    events.push({
      title: 'Cozy Duo Co-op With Adrian',
      involvedRegular: 'adrian',
      narrative: `Adrian invites you to a cozy co-op session. The two of you laugh over voice as you flank enemy teams together. Adrian's warm, supportive energy puts you completely at ease, making you forget the outside world entirely.`,
      chatLogs: [
        { sender: 'adrian_codes', senderClass: 'sender-adrian', message: `Haha you completely baited them! That was brilliant, ${personaName}!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `Only because you covered my flank so well hehe :3` },
        { sender: 'adrian_codes', senderClass: 'sender-adrian', message: `Always. I'd never let anything happen to you.` }
      ]
    });
    events.push({
      title: "Adrian's Daring Rescue",
      involvedRegular: 'adrian',
      narrative: `You get pinned behind enemy lines with zero health. Without hesitation, Adrian charges through heavy crossfire, deploying smoke grenades and pulling off a daring revival just as the countdown hits zero.`,
      chatLogs: [
        { sender: 'adrian_codes', senderClass: 'sender-adrian', message: `Got you! Nobody touches my favorite girl!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `Adrian, you crazy hero!! 💕` },
        { sender: 'adrian_codes', senderClass: 'sender-adrian', message: `Told you I'd come get you, no matter what! ✨` }
      ]
    });
  }

  // If Gomez has been discovered/is active
  if (state.discoveredRegulars?.gomez) {
    events.push({
      title: "Gomez's Tactical Ambush Drills",
      involvedRegular: 'gomez',
      narrative: `Gomez hops into your voice channel to run drills. He calls out enemy rotations with surgical precision, coaching your reaction speed and discipline. By match end, you wipe the final squad flawlessly under his direction.`,
      chatLogs: [
        { sender: 'Gomez', senderClass: 'sender-gomez', message: `Clean flank. You're reacting like a pro now. Keep that sharp edge.` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `Learned from the best.` }
      ]
    });
  }

  // --- PERSONA-EXCLUSIVE GAMING EVENTS ---
  if (archetype === 'soft') {
    events.push({
      title: '🌸 Soft Persona Exclusive: The Pastel Angel Healer',
      narrative: `You lock in your delicate pastel support champion with angelic wings. Your squad treats keeping you alive as a sacred duty, diving into enemy fire to protect you and spamming blushing heart emotes in chat whenever you drop a healing circle.`,
      chatLogs: [
        { sender: 'KnightErrant', senderClass: 'sender-stranger', message: `nobody touches ${personaName} or you answer to my ultimate` },
        { sender: 'HealerSimp_07', senderClass: 'sender-kev', message: `best heals in the world!! please duo with me again!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `thank you for protecting me hehe, you're all so sweet 🥺💕` }
      ]
    });
    events.push({
      title: '🌸 Soft Persona Exclusive: Cozy Sandbox Palace Co-op',
      narrative: `You stream a cozy sandbox building game to your community. Several regulars spend hours grinding rare materials just to construct a gigantic pastel pink palace with custom cherry blossom gardens in your honor.`,
      chatLogs: [
        { sender: 'BuilderBoy', senderClass: 'sender-stranger', message: `We finished the cherry blossom greenhouse for you ${personaName}!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `omg… it's so gorgeous i might cry!! you guys didn't have to do this 😭🌸` },
        { sender: 'QuietFan', senderClass: 'sender-felix', message: `[Tribute: +$${moneyGained || 8}.00] anything to make you smile!` }
      ]
    });
    events.push({
      title: '🌸 Soft Persona Exclusive: The Flustered Accidental Carry',
      narrative: `You timidly apologize in advance to your team, telling them you're feeling sleepy and nervous. But as the match heats up, your soft reflexes land every crucial shot. The lobby goes wild over your shy, flustered reactions to winning match MVP.`,
      chatLogs: [
        { sender: 'DuoPartner', senderClass: 'sender-stranger', message: `You said you were bad at this!! You literally just won us the round!!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `i-i just got lucky i promise!! my hands are shaking so bad 🙈` }
      ]
    });
  } else if (archetype === 'goth') {
    events.push({
      title: '🖤 Goth Persona Exclusive: The Aloof Sniper Matriarch',
      narrative: `You play the entire high-tier ranked match in complete, icy silence. With terrifying precision, you lock down the mid-lane and rack up an unbroken sniper streak. The enemy squad is completely paralyzed, typing into all-chat begging for your attention and acknowledging your total supremacy.`,
      chatLogs: [
        { sender: 'SubmissiveGamer', senderClass: 'sender-stranger', message: `${personaName} please headshot me again… your aim is terrifying` },
        { sender: 'EnemyCaptain', senderClass: 'sender-stranger', message: `she didn't even type back once. absolute queen.` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `...boring. try aiming next time.` }
      ]
    });
    events.push({
      title: '🖤 Goth Persona Exclusive: Midnight Velvet Hex Lobby',
      narrative: `Queuing at 3:30 AM under ${handle}, you run into an underground squad of edgy regulars who treat your word as law. When an enemy tries to banter casually with you, your squad ruthlessly shuts them down and drops direct tributes to prove their loyalty.`,
      chatLogs: [
        { sender: 'Nocturne_X', senderClass: 'sender-felix', message: `Mistress ${personaName} doesn't waste words on randoms.` },
        { sender: 'CorvidFan', senderClass: 'sender-stranger', message: `[CashApp: +$${moneyGained || 10}.00] Tribute for your late night coffee, queen.` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `Good boys.` }
      ]
    });
    events.push({
      title: '🖤 Goth Persona Exclusive: Cold Victory Execution',
      narrative: `You isolate the enemy team's arrogant leader in a 1v1 duel and dismantle him without taking a single scratch of damage. You finish him off and walk away without even emoting. The entire lobby chat erupts in awe at your cold, unbothered detachment.`,
      chatLogs: [
        { sender: 'HumiliatedGuy', senderClass: 'sender-stranger', message: `i got cooked… she didn't even look back at my box…` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `don't flatter yourself.` }
      ]
    });
  } else if (archetype === 'egirl') {
    events.push({
      title: '💋 E-Girl Persona Exclusive: The Bratty Trash-Talk Riot',
      narrative: `You drop into lobbies with chaotic, unhinged confidence. When an opponent tries to patronize you in all-chat, you hit them with a blistering, bratty roast and eliminate them three rounds in a row. Flustered and desperate to save face, he tips you cash just to stop roasting him.`,
      chatLogs: [
        { sender: 'ClownTarget', senderClass: 'sender-stranger', message: `bro stop targeting me 😭` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `then stop walking into my crosshairs honey, you're embarrassing yourself 💅✨` },
        { sender: 'ClownTarget', senderClass: 'sender-stranger', message: `[CashApp: +$${moneyGained || 12}.00] ok truce please don't clip that!!` }
      ]
    });
    events.push({
      title: '💋 E-Girl Persona Exclusive: High-Stakes 1v1 Bidding War',
      narrative: `You open a custom 1v1 wager room in your server. Several wealthy orbiters place bids for the privilege of facing you on stream. You put on a dramatic, teasing show, laughing playfully as you collect their entrance tributes.`,
      chatLogs: [
        { sender: 'RichFanboy', senderClass: 'sender-kev', message: `[Tribute: +$${moneyGained || 15}.00] Pick me next ${personaName}! I promise I won't disappoint!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `only if you behave~ line up nicely boys 💋` }
      ]
    });
    events.push({
      title: '💋 E-Girl Persona Exclusive: Viral Clip Frenzy',
      narrative: `During an explosive teamfight, you hit an absurd trickshot while teasing your teammates over the microphone. A fan immediately clips the moment and posts it with neon glitter edits. Within twenty minutes, the clip pulls hundreds of views and a flood of new orbiters into your mentions.`,
      chatLogs: [
        { sender: 'ClipMaster', senderClass: 'sender-stranger', message: `THE FLICK WAS NASTY!! ${handle} is going viral on Twitter rn` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `make sure my hair looked cute in the thumbnail at least hehe 💕` }
      ]
    });
  }

  // Check equipped skin stat boost (+1 soft for cute, +1 slutty for lewd, +1 dominance for goth)
  const equippedSkin = state.equippedSkin ? getSkinById(state.equippedSkin) : undefined;
  let skinStatBoost: { stat: 'soft' | 'slutty' | 'dominant'; amount: number } | undefined;
  if (equippedSkin) {
    if (equippedSkin.category === 'cute') {
      skinStatBoost = { stat: 'soft', amount: 1 };
    } else if (equippedSkin.category === 'lewd') {
      skinStatBoost = { stat: 'slutty', amount: 1 };
    } else if (equippedSkin.category === 'goth') {
      skinStatBoost = { stat: 'dominant', amount: 1 };
    }
  }

  const selected = events[getRandomInt(0, events.length - 1, randomFn)];

  let finalNarrative = selected.narrative;
  if (equippedSkin && skinStatBoost) {
    const boostLabel =
      skinStatBoost.stat === 'soft'
        ? '+1 Soft'
        : skinStatBoost.stat === 'slutty'
          ? '+1 Validation (Slutty)'
          : '+1 Dominance';
    finalNarrative += `\n\n<p style="margin-top:0.75rem; color:#f472b6; font-size:0.95rem;"><strong>Equipped Skin Bonus:</strong> ${equippedSkin.icon} ${equippedSkin.name} (<span style="color:#4ade80; font-weight:700;">${boostLabel}</span> stat boost applied to this match!)</p>`;
  }

  return {
    title: selected.title,
    narrative: finalNarrative,
    chatLogs: selected.chatLogs,
    repGained,
    moneyGained,
    involvedRegular: selected.involvedRegular,
    equippedSkinUsed: equippedSkin?.name,
    skinStatBoost
  };
}

/**
 * Random Discord community texting events pool for action_text_discord.
 * Generates 1-5 reputation and 5-10 money.
 * Includes Discovery Events for Dominic, Felix, and Adrian, and regular-specific events once discovered.
 */
export function generateDiscordEvent(state: GameState, randomFn = Math.random): EventResult {
  const repGained = getRandomInt(1, 5, randomFn);
  const moneyGained = getRandomInt(5, 10, randomFn);

  const personaName = state.personaName || 'Luna';
  const archetype = state.personaType || 'soft';

  const discovered = state.discoveredRegulars || {
    dominic: false,
    felix: false,
    adrian: false,
    gomez: true
  };

  // Undiscovered discovery events
  const discoveryEvents: Array<{
    targetRegular: 'dominic' | 'felix' | 'adrian';
    title: string;
    narrative: string;
    chatLogs: Array<{ sender: string; senderClass?: string; message: string }>;
  }> = [];

  if (!discovered.dominic) {
    discoveryEvents.push({
      targetRegular: 'dominic',
      title: 'A Mysterious High-Roller Approaches (Dominic Discovered!)',
      narrative: `While you are chatting in the server, a verified high-roller with an immaculate grey avatar (` +
        `Dominic_V) takes notice of your messages. He observes your phrasing and composure with calculating interest, sending an unsolicited CashApp tribute to test your reaction.`,
      chatLogs: [
        { sender: `${personaName}`, senderClass: 'sender-player', message: archetype === 'goth' ? `someone who knows how to behave in chat for once.` : archetype === 'soft' ? `good evening everyone~ hope your week is treating you kindly ✨` : `vip lounge is lively tonight what are we talking about?` },
        { sender: 'Dominic_V', senderClass: 'sender-dominic', message: `Rare to see genuine composure in an online room. [CashApp: +$${moneyGained}.00] Take it and maintain your dignity, ${personaName}.` },
        { sender: 'Dominic_V', senderClass: 'sender-dominic', message: `I will be watching your progress.` }
      ]
    });
  }

  if (!discovered.felix) {
    discoveryEvents.push({
      targetRegular: 'felix',
      title: 'A Flustered Supporter Stammers (Felix Discovered!)',
      narrative: `A shy user with a flushed anime avatar named felix_k sends a trembling response to your message in #general. Overwhelmed by your aesthetic, he stammers an apology for speaking to you and sends an instant tribute, begging if he may message your coffee fund.`,
      chatLogs: [
        { sender: `${personaName}`, senderClass: 'sender-player', message: archetype === 'goth' ? `stop being so pathetic in my mentions.` : archetype === 'soft' ? `aww don't be nervous silly, you can talk to me! 🥺` : `who told you that you could speak without tribute first? 💅` },
        { sender: 'felix_k', senderClass: 'sender-felix', message: `[CashApp: +$${moneyGained}.00] I-I'M SO SORRY Mistress ${personaName}! You're just so beautiful… please forgive me for speaking out of turn…` },
        { sender: 'felix_k', senderClass: 'sender-felix', message: `May I please serve you more…?` }
      ]
    });
  }

  if (!discovered.adrian) {
    discoveryEvents.push({
      targetRegular: 'adrian',
      title: 'Late Night Indie Dev Connection (Adrian Discovered!)',
      narrative: `An indie game developer named adrian_codes drops into chat sharing a cozy pixel art scene from his upcoming project. When you reply with thoughtful compliments on his lighting and mood, he lights up, tipping you and asking if he can stay in touch.`,
      chatLogs: [
        { sender: 'adrian_codes', senderClass: 'sender-adrian', message: `Working late on this indie shader… what do you guys think of the twilight colors?` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `the lavender twilight gradient is stunning… feels so nostalgic and cozy.` },
        { sender: 'adrian_codes', senderClass: 'sender-adrian', message: `[CashApp: +$${moneyGained}.00] Wow… you actually noticed the color tone?! You have such an artistic eye, ${personaName}. Made my whole week!` }
      ]
    });
  }

  // If there are undiscovered regulars, give a high 60% priority to trigger a discovery event!
  if (discoveryEvents.length > 0 && randomFn() < 0.65) {
    const disc = discoveryEvents[getRandomInt(0, discoveryEvents.length - 1, randomFn)];
    return {
      title: disc.title,
      narrative: disc.narrative,
      chatLogs: disc.chatLogs,
      repGained,
      moneyGained,
      newDiscovery: disc.targetRegular,
      involvedRegular: disc.targetRegular
    };
  }

  // Regular pool of community events
  const events: Array<{
    title: string;
    narrative: string;
    chatLogs: Array<{ sender: string; senderClass?: string; message: string }>;
    involvedRegular?: 'dominic' | 'felix' | 'adrian' | 'gomez';
    unlocksVoiceTraining?: boolean;
    unlocksWorkout?: boolean;
  }> = [
    {
      title: 'The Boba & Coffee Tribute',
      narrative: `You drop into the server's #general chat and mention that you're staying up late feeling a bit drained. Within three minutes, a server regular pings you with a direct CashApp tribute to cheer you up.`,
      chatLogs: [
        { sender: `${personaName}`, senderClass: 'sender-player', message: archetype === 'soft' ? `so sleepy tonight… wish i had some warm tea or iced boba 🥺` : archetype === 'goth' ? `another night awake. living on dark roasts and caffeine.` : `late night grind never stops someone send me boba stat 🧋` },
        { sender: 'SimpLord_01', senderClass: 'sender-stranger', message: `[CashApp: +$${moneyGained}.00] go get your favorite boba tomorrow ${personaName}! you deserve it 💕` },
        { sender: 'Ghosty', senderClass: 'sender-kev', message: `♥♥♥ (reacted with glowing hearts)` }
      ]
    },
    {
      title: 'The Spicy Meme & All-Chat Banter',
      narrative: `You share a witty, aesthetic meme in the community media channel. The server erupts with reactions and lively banter. One of your admirers tips you a quick allowance for making his night.`,
      chatLogs: [
        { sender: `${personaName}`, senderClass: 'sender-player', message: `[Shared an aesthetic meme matching ${personaName}'s archetype]` },
        { sender: 'MemeConnoisseur', senderClass: 'sender-stranger', message: `LMAO this is too accurate. your humor is unmatched` },
        { sender: 'NightSurfer', senderClass: 'sender-stranger', message: `[Tribute: +$${moneyGained}.00] Thanks for the laugh tonight, ${personaName}.` }
      ]
    },
    {
      title: 'The Sweet Night Owl Direct Message',
      narrative: `A quiet server regular reaches out in DMs, thanking you for being so welcoming in the server. He confesses that talking with you is the highlight of his lonely week and sends a modest token of appreciation.`,
      chatLogs: [
        { sender: 'LonelyNightOwl', senderClass: 'sender-stranger', message: `Hey ${personaName}… sorry if this is random, but you're honestly the sweetest girl in the server.` },
        { sender: 'LonelyNightOwl', senderClass: 'sender-stranger', message: `[CashApp: +$${moneyGained}.00] Just wanted to send a little tribute. Hope you sleep well tonight.` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `aww that’s so thoughtful of you… thank you so much 💕` }
      ]
    },
    {
      title: 'VIP Lounge Affection Duel',
      narrative: `You pop into the server's VIP channel. Two chat regulars immediately start competing for your attention, exchanging playful banter over who supports your stream wishlist more. One tips you on the spot to prove his devotion.`,
      chatLogs: [
        { sender: 'OrbitBoy_A', senderClass: 'sender-kev', message: `I was literally the first one to say good morning to ${personaName} today` },
        { sender: 'OrbitBoy_B', senderClass: 'sender-stranger', message: `Yeah but I'm sending tribute right now. [CashApp: +$${moneyGained}.00]` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `be nice to each other you two hehe~ 😌` }
      ]
    },
    {
      title: 'Late Night Affirmation Shower',
      narrative: `You mention in the chat that you've had a long week. Several users jump in with wholesome compliments, telling you how much better the server has been since you joined, and pooling together a sweet tip.`,
      chatLogs: [
        { sender: 'WarmVibes', senderClass: 'sender-stranger', message: `Don't be so hard on yourself ${personaName}, we all love having you here!` },
        { sender: 'LoyalFan_22', senderClass: 'sender-stranger', message: `[CashApp: +$${moneyGained}.00] treat yourself to something nice tomorrow please!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `you guys are genuinely so sweet to me… thank you 💕` }
      ]
    }
  ];

  // If Voice Training is not unlocked yet, add the event where someone asks for a voice note!
  if (!state.unlockedVoiceTraining) {
    events.push({
      title: 'A Simp Begs for a Voice Note (Voice Training Unlocked!)',
      narrative: `While typing in the server voice lounge, a generous member notices your active status. He offers a direct cash bounty if you can record even a 3-second audio clip saying goodnight to the channel. You realize you can't stall forever—you urgently need to begin training your pitch and larynx control before you speak into the microphone!`,
      chatLogs: [
        { sender: 'VoiceLover_99', senderClass: 'sender-stranger', message: `hey ${personaName}… you have such a pretty typing vibe… would you ever send a voice note? 🥺` },
        { sender: 'VoiceLover_99', senderClass: 'sender-stranger', message: `[CashApp: +$${moneyGained}.00] I'll pay double if you can just whisper goodnight to the channel!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `m-maybe soon… need to get my mic set up properly first hehe 🙈` }
      ],
      unlocksVoiceTraining: true
    });
  }

  // If Working Out is not unlocked yet, add the event where someone offers to buy the player clothes!
  if (!state.unlockedWorkout) {
    events.push({
      title: 'A Supporter Offers to Buy You Clothes (Working Out Unlocked!)',
      narrative: `A dedicated supporter messages you asking if you have an online clothing wishlist. He wants to buy you a pleated skirt, thigh-high stockings, and a form-fitting top. Staring down at your male waist and boxy frame, a surge of adrenaline hits you: if you want to look convincing wearing feminine outfits, you need to start training your waist, hips, and curves immediately!`,
      chatLogs: [
        { sender: 'OutfitSimp', senderClass: 'sender-stranger', message: `Do you have an Amazon wishlist ${personaName}? I really want to buy you that pastel skirt and thigh-highs set you mentioned!` },
        { sender: 'OutfitSimp', senderClass: 'sender-stranger', message: `[CashApp: +$${moneyGained}.00] Here's a deposit toward your wardrobe fund! Please let me spoil you!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `omg that’s so sweet of you… let me get my measurements together first 💕` }
      ],
      unlocksWorkout: true
    });
  }

  // If Dominic is discovered, add Dominic-specific Discord texting events
  if (discovered.dominic) {
    events.push({
      title: "Dominic's Posture & Demeanor Check",
      involvedRegular: 'dominic',
      narrative: `Dominic appears in the VIP channel while you are chatting. He evaluates your conversation with other members with an exacting eye, leaving an authoritative tip.`,
      chatLogs: [
        { sender: 'Dominic_V', senderClass: 'sender-dominic', message: `I trust you're sitting with proper posture at your desk, ${personaName}.` },
        { sender: 'Dominic_V', senderClass: 'sender-dominic', message: `[CashApp: +$${moneyGained}.00] A weekly stipend for your personal care. Do not let cheap chatter compromise your grace.` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `Understood, Dominic. Thank you for taking care of me.` }
      ]
    });
    events.push({
      title: "Dominic's Evening Wine & Dining Stipend",
      involvedRegular: 'dominic',
      narrative: `Dominic sends a direct message late in the evening between business dinners, dropping a financial tribute with instructions for your wardrobe.`,
      chatLogs: [
        { sender: 'Dominic_V', senderClass: 'sender-dominic', message: `Finishing late meetings tonight. [CashApp: +$${moneyGained}.00] Keep your skin moisturized and rest well.` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `I will, sir. Have a wonderful rest of your evening 🖤` }
      ]
    });
  }

  // If Felix is discovered, add Felix-specific Discord texting events
  if (discovered.felix) {
    events.push({
      title: "Felix's Daily Obedience Report",
      involvedRegular: 'felix',
      narrative: `Felix nervously pings you in private DMs, submitting his daily obedience log and sending his regular devotional tribute to Mistress.`,
      chatLogs: [
        { sender: 'felix_k', senderClass: 'sender-felix', message: `Mistress ${personaName}… reporting in as commanded… I didn't touch myself today…` },
        { sender: 'felix_k', senderClass: 'sender-felix', message: `[CashApp: +$${moneyGained}.00] Here is my daily worship tribute… please tell me I was a good pet…` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `Good boy, Felix. Keep listening and sending your tribute.` }
      ]
    });
    events.push({
      title: "Felix's Flustered Chastity Worship",
      involvedRegular: 'felix',
      narrative: `Felix reacts with trembling adoration to a photo of your desk fairy lights, confessing how deeply your aesthetic consumes his mind.`,
      chatLogs: [
        { sender: 'felix_k', senderClass: 'sender-felix', message: `[CashApp: +$${moneyGained}.00] Mistress ${personaName}… your fairy lights are so pretty… everything about you is divine…` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `I know, Felix. Make sure you stay locked until I say otherwise.` },
        { sender: 'felix_k', senderClass: 'sender-felix', message: `Yes Mistress!! 🙇‍♂️` }
      ]
    });
  }

  // If Adrian is discovered, add Adrian-specific Discord texting events
  if (discovered.adrian) {
    events.push({
      title: "Adrian's Acoustic Guitar Snippet",
      involvedRegular: 'adrian',
      narrative: `Adrian uploads a 30-second acoustic guitar clip to the music channel, mentioning that he wrote the melody thinking of your aesthetic. He sends a sweet coffee tribute alongside it.`,
      chatLogs: [
        { sender: 'adrian_codes', senderClass: 'sender-adrian', message: `[Audio Upload: indie_melody_for_${personaName}.mp3 🎵]` },
        { sender: 'adrian_codes', senderClass: 'sender-adrian', message: `[CashApp: +$${moneyGained}.00] Tuned my guitar tonight and this riff just came to me thinking about you!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `Adrian… this is so beautiful! You're so talented 💕` }
      ]
    });
    events.push({
      title: "Adrian's Wholesome Game Art Demo",
      involvedRegular: 'adrian',
      narrative: `Adrian DMs you a private preview of a secret character animation from his game, eagerly waiting for your opinion like an excited puppy.`,
      chatLogs: [
        { sender: 'adrian_codes', senderClass: 'sender-adrian', message: `You're the first person I'm showing this to! What do you think of the idle animation?` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `the flower crown detail is adorable! she looks so alive!` },
        { sender: 'adrian_codes', senderClass: 'sender-adrian', message: `[CashApp: +$${moneyGained}.00] YES! That was totally inspired by your vibe. Thank you for being my muse! ✨` }
      ]
    });
  }

  // If Gomez is discovered/active
  if (discovered.gomez) {
    events.push({
      title: "Gomez's Tactical Audit & Tip",
      involvedRegular: 'gomez',
      narrative: `Gomez sends a private encrypted ping analyzing your server engagement metrics, acknowledging your rising influence and dropping a small bonus.`,
      chatLogs: [
        { sender: 'Gomez', senderClass: 'sender-gomez', message: `Reputation and engagement are up 35% this week. [CashApp: +$${moneyGained}.00] Don't let up. They're eating out of your hand.` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `Everything is going according to plan.` }
      ]
    });
  }

  // --- PERSONA-EXCLUSIVE DISCORD TEXTING EVENTS ---
  if (archetype === 'soft') {
    events.push({
      title: '🌸 Soft Persona Exclusive: Bedtime Whispers in General Chat',
      narrative: `You drop into general chat at 1:00 AM typing sleepy, delicate messages with soft heart emojis. Several night-owls instantly stop their debates to check in on you, showering you with wholesome warm wishes and coffee stipends for tomorrow.`,
      chatLogs: [
        { sender: `${personaName}`, senderClass: 'sender-player', message: `rubbing my eyes… so sleepy but don't wanna sleep yet hehe 🥺💤` },
        { sender: 'WarmKnight', senderClass: 'sender-stranger', message: `[CashApp: +$${moneyGained}.00] Please make sure you rest well tonight ${personaName}! Drink some warm water!` },
        { sender: 'LofiLover', senderClass: 'sender-felix', message: `sweet dreams ${personaName}… you make this server so peaceful…` }
      ]
    });
    events.push({
      title: '🌸 Soft Persona Exclusive: Strawberry Milk & Pastel Desk Setup',
      narrative: `You upload a cute aesthetic photo of your pastel desk, featuring a carton of strawberry milk and a small plushie. The community chat erupts into pure adoration, with several users offering to fund more cute desk accessories.`,
      chatLogs: [
        { sender: `${personaName}`, senderClass: 'sender-player', message: `[Photo Upload: pastel_desk_strawberry_milk.png 🍓]` },
        { sender: 'PastelSimp', senderClass: 'sender-stranger', message: `This is literally the cutest thing I've ever seen.` },
        { sender: 'CuteCollector', senderClass: 'sender-kev', message: `[CashApp: +$${moneyGained}.00] Buying you more strawberry milk tomorrow!!` }
      ]
    });
    events.push({
      title: '🌸 Soft Persona Exclusive: The Shy Secret Admirer DM',
      narrative: `A normally quiet member writes a polite, wholesome confession in your direct messages, expressing how your gentle attitude has inspired him to get through a brutal week. He sends a sweet allowance along with his gratitude.`,
      chatLogs: [
        { sender: 'GentleSoul_44', senderClass: 'sender-stranger', message: `I was having such a dark week until I started reading your chats. Thank you for existing ${personaName}.` },
        { sender: 'GentleSoul_44', senderClass: 'sender-stranger', message: `[CashApp: +$${moneyGained}.00] Just a humble thank-you. Have a wonderful day.` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `you have no idea how much this means to me… thank you from the bottom of my heart 💕` }
      ]
    });
  } else if (archetype === 'goth') {
    events.push({
      title: '🖤 Goth Persona Exclusive: Left on Delivered for Four Hours',
      narrative: `An over-eager server member sends you three long messages begging for your attention. You leave him on delivered for four full hours. Panicked that he offended you, he sends an urgent tribute with a humble apology just to coax a single response.`,
      chatLogs: [
        { sender: 'DesperateSimp', senderClass: 'sender-stranger', message: `did I say something wrong? please don't be mad at me…` },
        { sender: 'DesperateSimp', senderClass: 'sender-stranger', message: `[CashApp: +$${moneyGained}.00] I'm so sorry for bothering you Mistress ${personaName}!!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `...be patient next time.` }
      ]
    });
    events.push({
      title: '🖤 Goth Persona Exclusive: Midnight Darkwave Cassette Share',
      narrative: `You post a link to a rare, melancholic darkwave track in the server music channel. The chat goes quiet in reverence of your mysterious, exquisite musical taste. Regulars compete to tell you how cultured you are.`,
      chatLogs: [
        { sender: `${personaName}`, senderClass: 'sender-player', message: `[Link: underground_darkwave_reverie.wav 🥀]` },
        { sender: 'GothEnthusiast', senderClass: 'sender-stranger', message: `Your taste is immaculate… where do you find this stuff?` },
        { sender: 'ShadowAdmirer', senderClass: 'sender-felix', message: `[CashApp: +$${moneyGained}.00] Tribute to my favorite queen of shadows.` }
      ]
    });
    events.push({
      title: '🖤 Goth Persona Exclusive: Cold Velvet Single-Sentence Command',
      narrative: `When someone asks what it takes to get special permissions in your private corner of the server, your cold, uncompromising response commands instant respect and obedience across the room.`,
      chatLogs: [
        { sender: 'HopefulSub', senderClass: 'sender-stranger', message: `how do I earn a role in your private lounge ${personaName}?` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `You don't ask. You send tribute and wait.` },
        { sender: 'HopefulSub', senderClass: 'sender-stranger', message: `[CashApp: +$${moneyGained}.00] Understood Mistress. I will wait.` }
      ]
    });
  } else if (archetype === 'egirl') {
    events.push({
      title: '💋 E-Girl Persona Exclusive: The Midnight Boba & Pizza Bounty',
      narrative: `You post a picture of your empty desk at midnight with the caption 'someone buy your favorite girl late-night snacks or I'm never streaming again 😤💅'. Within three minutes, multiple orbiters rush to foot the bill.`,
      chatLogs: [
        { sender: `${personaName}`, senderClass: 'sender-player', message: `starving and suffering… who is treating me tonight? 💕` },
        { sender: 'SnackDaddy_99', senderClass: 'sender-stranger', message: `[CashApp: +$${moneyGained}.00] DoorDash on me tonight ${personaName}!! Enjoy!` },
        { sender: 'PizzaBoy', senderClass: 'sender-kev', message: `NOOO I wanted to buy it for her first!! 😭` }
      ]
    });
    events.push({
      title: '💋 E-Girl Persona Exclusive: Chaotic VIP Lounge Confessions',
      narrative: `You host a late-night unfiltered Q&A in the VIP patron lounge. You give cheeky, teasing responses that make the male members lose their minds with embarrassment and devotion.`,
      chatLogs: [
        { sender: 'CuriousFan', senderClass: 'sender-stranger', message: `What kind of guys do you actually like IRL ${personaName}?` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `ones with high credit limits who don't ask boring questions 💋` },
        { sender: 'CuriousFan', senderClass: 'sender-stranger', message: `[CashApp: +$${moneyGained}.00] LMAOOO fair enough queen!!` }
      ]
    });
    events.push({
      title: '💋 E-Girl Persona Exclusive: Suggestive Custom Status Tease',
      narrative: `You update your Discord status to a suggestive, playful snippet: 'thinking about someone special… but you have to guess who 👀'. Your direct messages blow up as five different guys desperately try to confirm if it's them.`,
      chatLogs: [
        { sender: 'SimpSquad_1', senderClass: 'sender-stranger', message: `is it me? please tell me it's me` },
        { sender: 'SimpSquad_2', senderClass: 'sender-kev', message: `[CashApp: +$${moneyGained}.00] Hint please?! I need to know!` },
        { sender: `${personaName}`, senderClass: 'sender-player', message: `keep guessing boys~ 😌` }
      ]
    });
  }

  const selected = events[getRandomInt(0, events.length - 1, randomFn)];

  return {
    title: selected.title,
    narrative: selected.narrative,
    chatLogs: selected.chatLogs,
    repGained,
    moneyGained,
    involvedRegular: selected.involvedRegular,
    unlocksVoiceTraining: selected.unlocksVoiceTraining,
    unlocksWorkout: selected.unlocksWorkout
  };
}
