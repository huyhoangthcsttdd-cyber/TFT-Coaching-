// Set 18 player-facing augment catalogue — local source of truth.
// Membership is a UI-filtered local catalogue: 60 Silver + 94 Gold + 57 Prismatic = 211.
// CommunityDragon is used ONLY to enrich descriptions/icons; its 591-record
// internal list is never used to decide which augments belong in the UI.

const EXPECTED_COUNTS = { silver: 60, gold: 94, prismatic: 57 };

// Local filtered catalogue for the UI.
// Intentionally removes repeated +/++ variants except the Heroic Grab Bag (Gói Tăng Cường) family,
// and removes Cybernetic Implants II / Cybernetic Uplink II as requested.
export const SET18_AUGMENT_CATALOGUE = [
  {
    "id": "augmented-power",
    "english": "Augmented Power",
    "tier": "silver"
  },
  {
    "id": "backup-bows",
    "english": "Backup Bows",
    "tier": "silver"
  },
  {
    "id": "band-of-thieves",
    "english": "Band of Thieves",
    "tier": "silver"
  },
  {
    "id": "boxing-lessons",
    "english": "Boxing Lessons",
    "tier": "silver"
  },
  {
    "id": "branching-out",
    "english": "Branching Out",
    "tier": "silver"
  },
  {
    "id": "called-shot",
    "english": "Called Shot",
    "tier": "silver"
  },
  {
    "id": "capital-gains-i",
    "english": "Capital Gains I",
    "tier": "silver"
  },
  {
    "id": "caretaker-s-ally",
    "english": "Caretaker's Ally",
    "tier": "silver"
  },
  {
    "id": "carve-a-path",
    "english": "Carve a Path",
    "tier": "silver"
  },
  {
    "id": "celestial-blessing-i",
    "english": "Celestial Blessing I",
    "tier": "silver"
  },
  {
    "id": "champ-delivery",
    "english": "Champ Delivery",
    "tier": "silver"
  },
  {
    "id": "cognitive-tax",
    "english": "Cognitive Tax",
    "tier": "silver"
  },
  {
    "id": "component-buffet",
    "english": "Component Buffet",
    "tier": "silver"
  },
  {
    "id": "corrosion",
    "english": "Corrosion",
    "tier": "silver"
  },
  {
    "id": "crafted-crafting",
    "english": "Crafted Crafting",
    "tier": "silver"
  },
  {
    "id": "dummify",
    "english": "Dummify",
    "tier": "silver"
  },
  {
    "id": "electrocharge-i",
    "english": "Electrocharge I",
    "tier": "silver"
  },
  {
    "id": "expedition",
    "english": "Expedition",
    "tier": "silver"
  },
  {
    "id": "extra-buckles",
    "english": "Extra Buckles",
    "tier": "silver"
  },
  {
    "id": "feeling-lucky",
    "english": "Feeling Lucky",
    "tier": "silver"
  },
  {
    "id": "find-your-center",
    "english": "Find Your Center",
    "tier": "silver"
  },
  {
    "id": "flame-on",
    "english": "Flame On",
    "tier": "silver"
  },
  {
    "id": "flowing-tears",
    "english": "Flowing Tears",
    "tier": "silver"
  },
  {
    "id": "focused-fire",
    "english": "Focused Fire",
    "tier": "silver"
  },
  {
    "id": "future-focused",
    "english": "Future Focused",
    "tier": "silver"
  },
  {
    "id": "glass-cannon-i",
    "english": "Glass Cannon I",
    "tier": "silver"
  },
  {
    "id": "good-for-something-i",
    "english": "Good For Something I",
    "tier": "silver"
  },
  {
    "id": "group-hug-i",
    "english": "Group Hug I",
    "tier": "silver"
  },
  {
    "id": "healing-orbs-i",
    "english": "Healing Orbs I",
    "tier": "silver"
  },
  {
    "id": "iron-assets",
    "english": "Iron Assets",
    "tier": "silver"
  },
  {
    "id": "item-grab-bag-i",
    "english": "Item Grab Bag I",
    "tier": "silver"
  },
  {
    "id": "kick-start",
    "english": "Kick Start",
    "tier": "silver"
  },
  {
    "id": "kingslayer",
    "english": "Kingslayer",
    "tier": "silver"
  },
  {
    "id": "late-game-specialist",
    "english": "Late Game Specialist",
    "tier": "silver"
  },
  {
    "id": "latent-forge",
    "english": "Latent Forge",
    "tier": "silver"
  },
  {
    "id": "loaded-dice",
    "english": "Loaded Dice",
    "tier": "silver"
  },
  {
    "id": "makeshift-armor-i",
    "english": "Makeshift Armor I",
    "tier": "silver"
  },
  {
    "id": "missed-connections",
    "english": "Missed Connections",
    "tier": "silver"
  },
  {
    "id": "one-two-five",
    "english": "One, Two, Five!",
    "tier": "silver"
  },
  {
    "id": "ones-two-three",
    "english": "Ones Two Three",
    "tier": "silver"
  },
  {
    "id": "pandora-s-bench",
    "english": "Pandora's Bench",
    "tier": "silver"
  },
  {
    "id": "pandora-s-items-i",
    "english": "Pandora's Items I",
    "tier": "silver"
  },
  {
    "id": "partial-ascension",
    "english": "Partial Ascension",
    "tier": "silver"
  },
  {
    "id": "patience-is-a-virtue",
    "english": "Patience Is A Virtue",
    "tier": "silver"
  },
  {
    "id": "quick-streaks",
    "english": "Quick Streaks",
    "tier": "silver"
  },
  {
    "id": "recombobulator",
    "english": "Recombobulator",
    "tier": "silver"
  },
  {
    "id": "residual-magic",
    "english": "Residual Magic",
    "tier": "silver"
  },
  {
    "id": "rolling-for-days",
    "english": "Rolling For Days",
    "tier": "silver"
  },
  {
    "id": "silver-destiny",
    "english": "Silver Destiny",
    "tier": "silver"
  },
  {
    "id": "silver-spoon",
    "english": "Silver Spoon",
    "tier": "silver"
  },
  {
    "id": "slice-of-life",
    "english": "Slice of Life",
    "tier": "silver"
  },
  {
    "id": "slightly-magic-roll",
    "english": "Slightly Magic Roll",
    "tier": "silver"
  },
  {
    "id": "small-grab-bag",
    "english": "Small Grab Bag",
    "tier": "silver"
  },
  {
    "id": "stand-united",
    "english": "Stand United",
    "tier": "silver"
  },
  {
    "id": "team-building",
    "english": "Team Building",
    "tier": "silver"
  },
  {
    "id": "the-tower",
    "english": "The Tower",
    "tier": "silver"
  },
  {
    "id": "twin-guardians",
    "english": "Twin Guardians",
    "tier": "silver"
  },
  {
    "id": "verticality-i",
    "english": "Verticality I",
    "tier": "silver"
  },
  {
    "id": "wisp-rebate",
    "english": "Wisp Rebate",
    "tier": "silver"
  },
  {
    "id": "young-and-wild-and-free",
    "english": "Young and Wild and Free",
    "tier": "silver"
  },
  {
    "id": "advanced-loan",
    "english": "Advanced Loan",
    "tier": "gold"
  },
  {
    "id": "a-magic-roll",
    "english": "A Magic Roll",
    "tier": "gold"
  },
  {
    "id": "arcane-viktor-y",
    "english": "Arcane Viktor-y",
    "tier": "gold"
  },
  {
    "id": "ascension",
    "english": "Ascension",
    "tier": "gold"
  },
  {
    "id": "backline-blueprint",
    "english": "Backline Blueprint",
    "tier": "gold"
  },
  {
    "id": "beast-within",
    "english": "Beast Within",
    "tier": "gold"
  },
  {
    "id": "big-grab-bag",
    "english": "Big Grab Bag",
    "tier": "gold"
  },
  {
    "id": "birthday-reunion",
    "english": "Birthday Reunion",
    "tier": "gold"
  },
  {
    "id": "blossom-s-call",
    "english": "Blossom's Call",
    "tier": "gold"
  },
  {
    "id": "bodyguard-training",
    "english": "Bodyguard Training",
    "tier": "gold"
  },
  {
    "id": "bonus-gifts",
    "english": "Bonus Gifts",
    "tier": "gold"
  },
  {
    "id": "booster-pack",
    "english": "Booster Pack",
    "tier": "gold"
  },
  {
    "id": "bronze-for-life-i",
    "english": "Bronze For Life I",
    "tier": "gold"
  },
  {
    "id": "capital-gains-ii",
    "english": "Capital Gains II",
    "tier": "gold"
  },
  {
    "id": "caretaker-s-favor",
    "english": "Caretaker's Favor",
    "tier": "gold"
  },
  {
    "id": "celestial-blessing-ii",
    "english": "Celestial Blessing II",
    "tier": "gold"
  },
  {
    "id": "chosen-of-the-sun",
    "english": "Chosen of the Sun",
    "tier": "gold"
  },
  {
    "id": "clear-mind",
    "english": "Clear Mind",
    "tier": "gold"
  },
  {
    "id": "clockwork-accelerator",
    "english": "Clockwork Accelerator",
    "tier": "gold"
  },
  {
    "id": "cluttered-mind",
    "english": "Cluttered Mind",
    "tier": "gold"
  },
  {
    "id": "cognitive-overload",
    "english": "Cognitive Overload",
    "tier": "gold"
  },
  {
    "id": "consuming-flora",
    "english": "Consuming Flora",
    "tier": "gold"
  },
  {
    "id": "cooking-pot",
    "english": "Cooking Pot",
    "tier": "gold"
  },
  {
    "id": "coven-acolyte",
    "english": "Coven Acolyte",
    "tier": "gold"
  },
  {
    "id": "cry-me-a-river",
    "english": "Cry Me A River",
    "tier": "gold"
  },
  {
    "id": "duo-queue",
    "english": "Duo Queue",
    "tier": "gold"
  },
  {
    "id": "early-learnings",
    "english": "Early Learnings",
    "tier": "gold"
  },
  {
    "id": "electrocharge-ii",
    "english": "Electrocharge II",
    "tier": "gold"
  },
  {
    "id": "embiggen",
    "english": "Embiggen",
    "tier": "gold"
  },
  {
    "id": "epic-rolldown",
    "english": "Epic Rolldown",
    "tier": "gold"
  },
  {
    "id": "epoch",
    "english": "Epoch",
    "tier": "gold"
  },
  {
    "id": "exclusive-customization",
    "english": "Exclusive Customization",
    "tier": "gold"
  },
  {
    "id": "explosive-growth",
    "english": "Explosive Growth",
    "tier": "gold"
  },
  {
    "id": "fourcing",
    "english": "FOURcing",
    "tier": "gold"
  },
  {
    "id": "frontline-foundation",
    "english": "Frontline Foundation",
    "tier": "gold"
  },
  {
    "id": "gain-21-gold",
    "english": "Gain 21 Gold",
    "tier": "gold"
  },
  {
    "id": "gilded-steel",
    "english": "Gilded Steel",
    "tier": "gold"
  },
  {
    "id": "glass-cannon-ii",
    "english": "Glass Cannon II",
    "tier": "gold"
  },
  {
    "id": "gold-destiny",
    "english": "Gold Destiny",
    "tier": "gold"
  },
  {
    "id": "group-hug-ii",
    "english": "Group Hug II",
    "tier": "gold"
  },
  {
    "id": "hard-bargain",
    "english": "Hard Bargain",
    "tier": "gold"
  },
  {
    "id": "healing-orbs-ii",
    "english": "Healing Orbs II",
    "tier": "gold"
  },
  {
    "id": "heart-of-steel",
    "english": "Heart of Steel",
    "tier": "gold"
  },
  {
    "id": "heroic-grab-bag",
    "english": "Heroic Grab Bag",
    "tier": "gold"
  },
  {
    "id": "heroic-grab-bag",
    "english": "Heroic Grab Bag+",
    "tier": "gold"
  },
  {
    "id": "heroic-grab-bag",
    "english": "Heroic Grab Bag++",
    "tier": "gold"
  },
  {
    "id": "hustler",
    "english": "Hustler",
    "tier": "gold"
  },
  {
    "id": "investment-strategy-i",
    "english": "Investment Strategy I",
    "tier": "gold"
  },
  {
    "id": "item-extraction",
    "english": "Item Extraction",
    "tier": "gold"
  },
  {
    "id": "it-s-me-baby",
    "english": "It's Me, Baby",
    "tier": "gold"
  },
  {
    "id": "jeweled-lotus-i",
    "english": "Jeweled Lotus I",
    "tier": "gold"
  },
  {
    "id": "know-your-enemy",
    "english": "Know Your Enemy",
    "tier": "gold"
  },
  {
    "id": "late-game-scaling",
    "english": "Late Game Scaling",
    "tier": "gold"
  },
  {
    "id": "legion-of-threes",
    "english": "Legion of Threes",
    "tier": "gold"
  },
  {
    "id": "makeshift-armor-ii",
    "english": "Makeshift Armor II",
    "tier": "gold"
  },
  {
    "id": "malicious-monetization",
    "english": "Malicious Monetization",
    "tier": "gold"
  },
  {
    "id": "max-build",
    "english": "Max Build",
    "tier": "gold"
  },
  {
    "id": "money-hungry",
    "english": "Money Hungry",
    "tier": "gold"
  },
  {
    "id": "nature-s-shelter",
    "english": "Nature's Shelter",
    "tier": "gold"
  },
  {
    "id": "no-scout-no-pivot",
    "english": "NO SCOUT NO PIVOT",
    "tier": "gold"
  },
  {
    "id": "omega-riftbeast",
    "english": "Omega Riftbeast",
    "tier": "gold"
  },
  {
    "id": "pandora-s-items-ii",
    "english": "Pandora's Items II",
    "tier": "gold"
  },
  {
    "id": "patient-study",
    "english": "Patient Study",
    "tier": "gold"
  },
  {
    "id": "pilfer",
    "english": "Pilfer",
    "tier": "gold"
  },
  {
    "id": "portable-forge",
    "english": "Portable Forge",
    "tier": "gold"
  },
  {
    "id": "promised-protection",
    "english": "Promised Protection",
    "tier": "gold"
  },
  {
    "id": "replication",
    "english": "Replication",
    "tier": "gold"
  },
  {
    "id": "salvage-bin",
    "english": "Salvage Bin",
    "tier": "gold"
  },
  {
    "id": "seraphim-s-staff",
    "english": "Seraphim's Staff",
    "tier": "gold"
  },
  {
    "id": "slammin",
    "english": "Slammin'",
    "tier": "gold"
  },
  {
    "id": "solo-leveling",
    "english": "Solo Leveling",
    "tier": "gold"
  },
  {
    "id": "solo-plate",
    "english": "Solo Plate",
    "tier": "gold"
  },
  {
    "id": "speedy-double-kill",
    "english": "Speedy Double Kill",
    "tier": "gold"
  },
  {
    "id": "spirit-of-redemption",
    "english": "Spirit of Redemption",
    "tier": "gold"
  },
  {
    "id": "spreading-roots",
    "english": "Spreading Roots",
    "tier": "gold"
  },
  {
    "id": "staffsmith",
    "english": "Staffsmith",
    "tier": "gold"
  },
  {
    "id": "sun-and-moon",
    "english": "Sun and Moon",
    "tier": "gold"
  },
  {
    "id": "swordsmith",
    "english": "Swordsmith",
    "tier": "gold"
  },
  {
    "id": "the-golden-dragon",
    "english": "The Golden Dragon",
    "tier": "gold"
  },
  {
    "id": "time-skip",
    "english": "Time Skip",
    "tier": "gold"
  },
  {
    "id": "tons-of-stats",
    "english": "Tons of Stats!",
    "tier": "gold"
  },
  {
    "id": "trade-sector",
    "english": "Trade Sector",
    "tier": "gold"
  },
  {
    "id": "u-r-f",
    "english": "U.R.F",
    "tier": "gold"
  },
  {
    "id": "unrivaled",
    "english": "Unrivaled",
    "tier": "gold"
  },
  {
    "id": "verticality-ii",
    "english": "Verticality II",
    "tier": "gold"
  },
  {
    "id": "warpath",
    "english": "Warpath",
    "tier": "gold"
  },
  {
    "id": "weight-the-worth",
    "english": "Weight The Worth",
    "tier": "gold"
  },
  {
    "id": "worth-the-wait",
    "english": "Worth the Wait",
    "tier": "gold"
  },
  {
    "id": "woven-magic",
    "english": "Woven Magic",
    "tier": "gold"
  },
  {
    "id": "cybernetic-implants",
    "english": "Cybernetic Implants",
    "tier": "gold"
  },
  {
    "id": "cybernetic-uplink",
    "english": "Cybernetic Uplink",
    "tier": "gold"
  },
  {
    "id": "dark-ritual",
    "english": "Dark Ritual",
    "tier": "gold"
  },
  {
    "id": "calculated-loss",
    "english": "Calculated Loss",
    "tier": "gold"
  },
  {
    "id": "construct-a-companion",
    "english": "Construct a Companion",
    "tier": "gold"
  },
  {
    "id": "band-of-thieves-ii",
    "english": "Band of Thieves II",
    "tier": "prismatic"
  },
  {
    "id": "baron-s-lair",
    "english": "Baron's Lair",
    "tier": "prismatic"
  },
  {
    "id": "belt-overflow",
    "english": "Belt Overflow",
    "tier": "prismatic"
  },
  {
    "id": "birthday-present",
    "english": "Birthday Present",
    "tier": "prismatic"
  },
  {
    "id": "bronze-for-life-ii",
    "english": "Bronze For Life II",
    "tier": "prismatic"
  },
  {
    "id": "build-a-bud",
    "english": "Build A Bud",
    "tier": "prismatic"
  },
  {
    "id": "buried-treasures-iii",
    "english": "Buried Treasures III",
    "tier": "prismatic"
  },
  {
    "id": "call-to-chaos",
    "english": "Call To Chaos",
    "tier": "prismatic"
  },
  {
    "id": "celestial-blessing-iii",
    "english": "Celestial Blessing III",
    "tier": "prismatic"
  },
  {
    "id": "comeback-story",
    "english": "Comeback Story",
    "tier": "prismatic"
  },
  {
    "id": "commerce-core",
    "english": "Commerce Core",
    "tier": "prismatic"
  },
  {
    "id": "component-quest",
    "english": "Component Quest",
    "tier": "prismatic"
  },
  {
    "id": "coronation",
    "english": "Coronation",
    "tier": "prismatic"
  },
  {
    "id": "deadlier-blades",
    "english": "Deadlier Blades",
    "tier": "prismatic"
  },
  {
    "id": "deadlier-caps",
    "english": "Deadlier Caps",
    "tier": "prismatic"
  },
  {
    "id": "expected-unexpectedness",
    "english": "Expected Unexpectedness",
    "tier": "prismatic"
  },
  {
    "id": "flexible",
    "english": "Flexible",
    "tier": "prismatic"
  },
  {
    "id": "forged-in-strength",
    "english": "Forged In Strength",
    "tier": "prismatic"
  },
  {
    "id": "giant-and-mighty",
    "english": "Giant and Mighty",
    "tier": "prismatic"
  },
  {
    "id": "going-long",
    "english": "Going Long",
    "tier": "prismatic"
  },
  {
    "id": "golden-gamble",
    "english": "Golden Gamble",
    "tier": "prismatic"
  },
  {
    "id": "hard-commit",
    "english": "Hard Commit",
    "tier": "prismatic"
  },
  {
    "id": "hedge-fund",
    "english": "Hedge Fund",
    "tier": "prismatic"
  },
  {
    "id": "hold-the-line",
    "english": "Hold the Line",
    "tier": "prismatic"
  },
  {
    "id": "investment-strategy-ii",
    "english": "Investment Strategy II",
    "tier": "prismatic"
  },
  {
    "id": "jeweled-lotus-ii",
    "english": "Jeweled Lotus II",
    "tier": "prismatic"
  },
  {
    "id": "level-up",
    "english": "Level Up!",
    "tier": "prismatic"
  },
  {
    "id": "living-forge",
    "english": "Living Forge",
    "tier": "prismatic"
  },
  {
    "id": "lucky-gloves",
    "english": "Lucky Gloves",
    "tier": "prismatic"
  },
  {
    "id": "luxury-subscription",
    "english": "Luxury Subscription",
    "tier": "prismatic"
  },
  {
    "id": "master-of-all-origins",
    "english": "Master of All Origins",
    "tier": "prismatic"
  },
  {
    "id": "min-max",
    "english": "Min-Max",
    "tier": "prismatic"
  },
  {
    "id": "money-monsoon",
    "english": "Money Monsoon",
    "tier": "prismatic"
  },
  {
    "id": "nesting-anvils",
    "english": "Nesting Anvils",
    "tier": "prismatic"
  },
  {
    "id": "nesting-dolls",
    "english": "Nesting Dolls",
    "tier": "prismatic"
  },
  {
    "id": "one-buff-two-buff",
    "english": "One Buff Two Buff",
    "tier": "prismatic"
  },
  {
    "id": "pandora-s-items-iii",
    "english": "Pandora's Items III",
    "tier": "prismatic"
  },
  {
    "id": "prismatic-destiny",
    "english": "Prismatic Destiny",
    "tier": "prismatic"
  },
  {
    "id": "prismatic-ticket",
    "english": "Prismatic Ticket",
    "tier": "prismatic"
  },
  {
    "id": "radiant-rascal",
    "english": "Radiant Rascal",
    "tier": "prismatic"
  },
  {
    "id": "radiant-relics",
    "english": "Radiant Relics",
    "tier": "prismatic"
  },
  {
    "id": "retribution",
    "english": "Retribution",
    "tier": "prismatic"
  },
  {
    "id": "shimmerscale-essence",
    "english": "Shimmerscale Essence",
    "tier": "prismatic"
  },
  {
    "id": "shopping-spree",
    "english": "Shopping Spree",
    "tier": "prismatic"
  },
  {
    "id": "soul-awakening",
    "english": "Soul Awakening",
    "tier": "prismatic"
  },
  {
    "id": "sweet-treats",
    "english": "Sweet Treats",
    "tier": "prismatic"
  },
  {
    "id": "sword-overflow",
    "english": "Sword Overflow",
    "tier": "prismatic"
  },
  {
    "id": "tactician-s-kitchen",
    "english": "Tactician's Kitchen",
    "tier": "prismatic"
  },
  {
    "id": "the-golden-egg",
    "english": "The Golden Egg",
    "tier": "prismatic"
  },
  {
    "id": "the-trait-tree",
    "english": "The Trait Tree",
    "tier": "prismatic"
  },
  {
    "id": "trait-ladder",
    "english": "Trait Ladder",
    "tier": "prismatic"
  },
  {
    "id": "upward-mobility",
    "english": "Upward Mobility",
    "tier": "prismatic"
  },
  {
    "id": "urf-s-grab-bag",
    "english": "Urf's Grab Bag",
    "tier": "prismatic"
  },
  {
    "id": "verticality-iii",
    "english": "Verticality III",
    "tier": "prismatic"
  },
  {
    "id": "wand-overflow",
    "english": "Wand Overflow",
    "tier": "prismatic"
  },
  {
    "id": "we-stick-together",
    "english": "We Stick Together",
    "tier": "prismatic"
  },
  {
    "id": "worth-the-wait-ii",
    "english": "Worth the Wait II",
    "tier": "prismatic"
  }
];

const normalize = (value) => String(value || "")
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const cdragonAssetUrl = (icon) => {
  if (!icon) return null;
  const p = String(icon)
    .replace(/^\/+/, "")
    .replace(/^lol-game-data\/assets\//i, "")
    .replace(/^game\//i, "")
    .replace(/\.tex$/i, ".png");
  return `https://raw.communitydragon.org/latest/game/${p}`;
};

const ddragonImageUrl = (file) => file
  ? `https://ddragon.leagueoflegends.com/cdn/16.18.1/img/tft-augment/${encodeURIComponent(file)}`
  : null;

// These two Set 18 Prismatic augments were resolving to a gold-looking
// artwork in the generic Riot enrichment. Force their verified Prismatic
// artwork so the card matches the Kim Cương tier visually.
const PRISMATIC_IMAGE_OVERRIDES = {
  "Sword Overflow":
    "https://cdn.mobalytics.gg/assets/tft/images/hextech-augments/set17/bladeoverflow_iii.webp?v=5",
  "Wand Overflow":
    "https://cdn.mobalytics.gg/assets/tft/images/hextech-augments/set17/wandoverflow_iii.webp?v=5",
};

const inferCategory = (augment) => {
  const text = `${augment?.name || ""} ${augment?.description || augment?.desc || ""}`.toLowerCase();
  if (/\b(gold|economy|shop|reroll|xp|interest|coin|gold)\b/.test(text)) return "Kinh tế";
  if (/\b(item|artifact|component|emblem|spatula|sword|bow|rod|tear|belt|glove)\b/.test(text)) return "Trang bị";
  if (/\b(trait|emblem|origins|blossom|primal|coven|solar|lunar|riftbeast|elderwood|fae|sprykin)\b/.test(text)) return "Tộc/Hệ";
  if (/\b(champion|unit|tướng)\b/.test(text)) return "Tướng";
  return "Chiến đấu";
};

export const inferAugmentCategory = inferCategory;

export const loadSet18AugmentCatalogue = async () => {
  const counts = SET18_AUGMENT_CATALOGUE.reduce((acc, item) => {
    acc[item.tier] = (acc[item.tier] || 0) + 1;
    return acc;
  }, {});

  if (SET18_AUGMENT_CATALOGUE.length !== 211 ||
      counts.silver !== EXPECTED_COUNTS.silver ||
      counts.gold !== EXPECTED_COUNTS.gold ||
      counts.prismatic !== EXPECTED_COUNTS.prismatic) {
    throw new Error(`Local Set 18 catalogue is invalid: ${SET18_AUGMENT_CATALOGUE.length}/211 (${counts.silver || 0}/${counts.gold || 0}/${counts.prismatic || 0}).`);
  }

  // Enrichment only. If Riot/CDN data is unavailable, the 211 local records
  // still remain available; network data can never change the catalogue count.
  let cdragonItems = [];
  let ddragon = {};
  let ddragonVi = {};
  try {
    const [cdragonRes, ddragonRes, ddragonViRes] = await Promise.all([
      fetch("https://raw.communitydragon.org/latest/cdragon/tft/en_us.json", { cache: "no-store" }),
      fetch("https://ddragon.leagueoflegends.com/cdn/16.18.1/data/en_US/tft-augments.json", { cache: "no-store" }),
      fetch("https://ddragon.leagueoflegends.com/cdn/16.18.1/data/vi_VN/tft-augments.json", { cache: "no-store" }).catch(() => null),
    ]);
    if (cdragonRes.ok) {
      const data = await cdragonRes.json();
      cdragonItems = Array.isArray(data?.items) ? data.items : [];
    }
    if (ddragonRes.ok) {
      const data = await ddragonRes.json();
      ddragon = data?.data && typeof data.data === "object" ? data.data : {};
    }
    if (ddragonViRes?.ok) {
      const data = await ddragonViRes.json();
      ddragonVi = data?.data && typeof data.data === "object" ? data.data : {};
    }
  } catch {
    // Keep the local catalogue usable even if enrichment endpoints fail.
  }

  const cdragonByName = new Map();
  const cdragonByApi = new Map();
  for (const item of cdragonItems) {
    const key = normalize(item?.name);
    if (key && !cdragonByName.has(key)) cdragonByName.set(key, item);
    if (item?.apiName) cdragonByApi.set(String(item.apiName), item);
  }

  const ddragonByName = new Map();
  for (const item of Object.values(ddragon)) {
    const key = normalize(item?.name);
    if (key && !ddragonByName.has(key)) ddragonByName.set(key, item);
  }

  return SET18_AUGMENT_CATALOGUE.map((row, index) => {
    const key = normalize(row.english);
    // Every player-facing augment needs a unique React key. Some Set 18
    // variants intentionally share the same source id (e.g. branching-out,
    // destiny, grab-bag variants). Using the remote apiName/id here causes
    // React to reuse the previous tier's DOM node, which makes images and
    // names appear to "carry over" when switching Silver/Gold/Prismatic.
    const sourceId = cdragonByName.get(key)?.apiName || ddragonByName.get(key)?.id || row.id;
    const uniqueId = `${row.tier}-${normalize(row.english).replace(/\s+/g, "-")}-${index}`;
    const c = cdragonByName.get(key) || {};
    const d = ddragonByName.get(key) || {};
    const vi = d?.id ? ddragonVi[d.id] || {} : {};
    // Data Dragon is the Set 18 / patch-specific source and is therefore
    // preferred for augment artwork. CommunityDragon is only a fallback.
    // This avoids accidentally showing a same-name augment icon from another
    // tier/set when the live CDragon catalogue contains multiple records.
    const forcedPrismaticImage =
      row.tier === "prismatic" ? PRISMATIC_IMAGE_OVERRIDES[row.english] : null;
    const imageCandidates = Array.from(new Set([
      forcedPrismaticImage,
      ddragonImageUrl(d?.image?.full || vi?.image?.full),
      cdragonAssetUrl(c?.icon),
    ].filter(Boolean)));

    const localizedName = String(vi?.name || d?.name || row.english);
    const englishName = String(d?.name || c?.name || row.english);

    // Riot's Vietnamese localisation can omit the + / ++ suffix, so several
    // distinct augments otherwise render with exactly the same name. Keep the
    // player-facing Vietnamese name but restore the variant suffix from the
    // canonical English catalogue when needed.
    const variantSuffix = /\+{1,2}$/.exec(row.english)?.[0] || "";
    const displayName = variantSuffix && !/[+]+$/.test(localizedName)
      ? `${localizedName}${variantSuffix}`
      : localizedName;

    return {
      id: uniqueId,
      sourceId,
      name: displayName,
      english: englishName,
      tier: row.tier,
      category: inferCategory({ name: englishName, description: vi?.description || d?.description || c?.desc }),
      description: String(vi?.description || d?.description || c?.desc || ""),
      image: imageCandidates[0] || null,
      imageCandidates,
    };
  });
};
