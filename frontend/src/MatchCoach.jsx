import "./ShopIntelligence.css";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import {
  Swords,
  Coins,
  Shield,
  Package,
  Sparkles,
  Users,
  Search,
  X,
  Plus,
  Check,
  TrendingUp,
  HeartPulse,
  ArrowUpCircle,
  AlertTriangle,
  Target,
  RefreshCw,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Minus,
} from "lucide-react";

import "./ItemSelector.css";
import "./AugmentSelector.css";
import "./ChampionBoard.css";
import "./TraitPanel.css";
import "./CoachDecisionEngine.css";
import "./RoundTracker.css";
import PersonalCoach from "./PersonalCoach";
import { createMatch, saveRound } from "./api/coachApi";
import {
  loadTFTData,
  getItemImageCandidates,
} from "./data/tftData";
import { loadSet18AugmentCatalogue, inferAugmentCategory } from "./data/set18AugmentCatalogue";


const ITEM_ICON_BASE =
  "https://raw.communitydragon.org/latest/game/assets/maps/particles/tft/item_icons/standard/";


const ITEMS = [
  {
    id: "bf_sword",
    name: "Kiếm B.F.",
    english: "B.F. Sword",
    icon: "bf_sword.png",
    type: "component",
  },
  {
    id: "recurve_bow",
    name: "Cung Gỗ",
    english: "Recurve Bow",
    icon: "recurve_bow.png",
    type: "component",
  },
  {
    id: "large_rod",
    name: "Gậy Quá Khổ",
    english: "Needlessly Large Rod",
    icon: "needlessly_large_rod.png",
    type: "component",
  },
  {
    id: "tear",
    name: "Nước Mắt Nữ Thần",
    english: "Tear of the Goddess",
    icon: "tear_of_the_goddess.png",
    type: "component",
  },
  {
    id: "chain_vest",
    name: "Giáp Lưới",
    english: "Chain Vest",
    icon: "chain_vest.png",
    type: "component",
  },
  {
    id: "negatron",
    name: "Áo Choàng Bạc",
    english: "Negatron Cloak",
    icon: "negatron_cloak.png",
    type: "component",
  },
  {
    id: "giants_belt",
    name: "Đai Khổng Lồ",
    english: "Giant's Belt",
    icon: "gaints_belt.png",
    type: "component",
  },
  {
    id: "sparring_gloves",
    name: "Găng Đấu Tập",
    english: "Sparring Gloves",
    icon: "sparring_gloves.png",
    type: "component",
  },

  {
    id: "deathblade",
    name: "Kiếm Tử Thần",
    english: "Deathblade",
    icon: "death_blade.png",
    type: "completed",
  },
  {
    id: "edge_of_night",
    name: "Áo Choàng Bóng Tối",
    english: "Edge of Night",
    icon: "edge_of_night_xl.png",
    type: "completed",
  },
  {
    id: "steraks",
    name: "Móng Vuốt Sterak",
    english: "Sterak's Gage",
    icon: "steraksgage_xl.png",
    type: "completed",
  },
  {
    id: "infinity_edge",
    name: "Vô Cực Kiếm",
    english: "Infinity Edge",
    icon: "infinity_edge.png",
    type: "completed",
  },
  {
    id: "jeweled_gauntlet",
    name: "Găng Bảo Thạch",
    english: "Jeweled Gauntlet",
    icon: "jeweled_guantlet.png",
    type: "completed",
  },
  {
    id: "shojin",
    name: "Ngọn Giáo Shojin",
    english: "Spear of Shojin",
    icon: "spear_of_shojin.png",
    type: "completed",
  },
  {
    id: "blue_buff",
    name: "Bùa Xanh",
    english: "Blue Buff",
    icon: "blue_buff.png",
    type: "completed",
  },
  {
    id: "archangel",
    name: "Quyền Trượng Thiên Thần",
    english: "Archangel's Staff",
    icon: "archangel_staff.png",
    type: "completed",
  },
  {
    id: "warmogs",
    name: "Giáp Máu Warmog",
    english: "Warmog's Armor",
    icon: "warmogs_armor.png",
    type: "completed",
  },
  {
    id: "bramble",
    name: "Áo Choàng Gai",
    english: "Bramble Vest",
    icon: "bramble_vest.png",
    type: "completed",
  },
  {
    id: "dragons_claw",
    name: "Vuốt Rồng",
    english: "Dragon's Claw",
    icon: "dragons_claw.png",
    type: "completed",
  },
  {
    id: "gargoyle",
    name: "Thú Tượng Thạch Giáp",
    english: "Gargoyle Stoneplate",
    icon: "gargoyle_stoneplate.png",
    type: "completed",
  },
  {
    id: "sunfire",
    name: "Áo Choàng Lửa",
    english: "Sunfire Cape",
    icon: "sunfire_cape.png",
    type: "completed",
  },
  {
    id: "spirit_visage",
    name: "Giáp Tâm Linh",
    english: "Spirit Visage",
    icon: "spiritvisage_xl.png",
    type: "completed",
  },
  {
    id: "titans_resolve",
    name: "Quyền Năng Khổng Lồ",
    english: "Titan's Resolve",
    icon: "titans_resolve.png",
    type: "completed",
  },
  {
    id: "ionic_spark",
    name: "Nỏ Sét",
    english: "Ionic Spark",
    icon: "ionic_spark.png",
    type: "completed",
  },
  {
    id: "bloodthirster",
    name: "Huyết Kiếm",
    english: "Bloodthirster",
    icon: "bloodthirster.png",
    type: "completed",
  },
  {
    id: "hextech_gunblade",
    name: "Kiếm Súng Hextech",
    english: "Hextech Gunblade",
    icon: "hextech_gunblade.png",
    type: "completed",
  },
  {
    id: "guinsoo",
    name: "Cuồng Đao Guinsoo",
    english: "Guinsoo's Rageblade",
    icon: "guinsoos_rageblade.png",
    type: "completed",
  },
  {
    id: "giant_slayer",
    name: "Diệt Khổng Lồ",
    english: "Giant Slayer",
    icon: "giant_slayer.png",
    type: "completed",
  },
  {
    id: "last_whisper",
    name: "Cung Xanh",
    english: "Last Whisper",
    icon: "last_whisper.png",
    type: "completed",
  },
  {
    id: "morello",
    name: "Quỷ Thư Morello",
    english: "Morellonomicon",
    icon: "morellonomicon.png",
    type: "completed",
  },
  {
    id: "red_buff",
    name: "Bùa Đỏ",
    english: "Red Buff",
    icon: "redbuff.png",
    type: "completed",
  },
  {
    id: "hand_of_justice",
    name: "Bàn Tay Công Lý",
    english: "Hand of Justice",
    icon: "hand_of_justice.png",
    type: "completed",
  },
  {
    id: "quicksilver",
    name: "Áo Choàng Thủy Ngân",
    english: "Quicksilver",
    icon: "quicksilver.png",
    type: "completed",
  },
  {
    id: "protectors_vow",
    name: "Lời Thề Hộ Vệ",
    english: "Protector's Vow",
    icon: "knightsvow_xl.png",
    type: "completed",
  },
  {
    id: "crownguard",
    name: "Vương Miện Hoàng Gia",
    english: "Crownguard",
    icon: "crownguard.png",
    type: "completed",
  },
  {
    id: "adaptive_helm",
    name: "Mũ Thích Nghi",
    english: "Adaptive Helm",
    icon: "adaptive_helm.png",
    type: "completed",
  },
];


const AUGMENT_ILLUSTRATION_BASE = "https://ap.tft.tools/img/augments/";

const AUGMENT_ILLUSTRATIONS = {
  augmented_power: "powerup1.jpgw?=42",
  backup_bows: "backup1.jpgw?=42",
  band_of_thieves: "bandthieves1.jpgw?=42",
  boxing_lessons: "boxinglessons1.jpgw?=42",
  branching_out: "branching-out1.jpgw?=42",
  branching_out_plus: "branching-out1.jpgw?=42",
  early_learnings: "early-learning.tft_set16.jpgw?=42",
  item_payout: "grab-bag-ii.jpgw?=42",
  stand_alone: "solo-plate.jpgw?=42",
  jeweled_lotus: "jeweled-lotus-i.jpgw?=42",
  future_focused: "future-sight-i.jpgw?=42",
  giant_and_mighty: "giantandmighty-iii.jpgw?=42",
  group_hug: "grouphug1-i.tft_set17.jpgw?=42",
  hold_the_line: "holdtheline-iii.tft_set15.jpgw?=42",
  item_extraction: "itemcollector-i.jpgw?=42",
  upward_mobility: "upward-mobility-iii.jpgw?=42",
  heroic_grab_bag: "heroic-grab-bag-ii.jpgw?=42",
  pandoras_bench: "pandoras-bench-i.jpgw?=42",
  diamond_ticket: "prismatic-ticket-iii.jpgw?=42",
  prismatic_pipeline: "prismaticpipeline-iii.jpgw?=42",
  ascension: "ascension2.jpgw?=42",
  cruel_pact: "cruel-pact-iii.jpgw?=42",
};

const getAugmentIllustration = (augment) => {
  const file = AUGMENT_ILLUSTRATIONS[augment?.id];
  return file ? `${AUGMENT_ILLUSTRATION_BASE}${file}` : null;
};

const AUGMENTS = [
  {
    id: "augmented_power",
    image: getAugmentIllustration({ id: "augmented_power" }),
    name: "Nâng Tầm Uy Lực",
    english: "Augmented Power",
    tier: "silver",
    category: "Khác",
    description:
      "Nâng Cấp tiếp theo của bạn được tăng một bậc.",
  },
  {
    id: "backup_bows",
    image: getAugmentIllustration({ id: "backup_bows" }),
    name: "Cung Dự Phòng",
    english: "Backup Bows",
    tier: "silver",
    category: "Trang bị",
    description:
      "Nhận 1 Cung Gỗ. Sau khi các tướng của bạn tấn công 1000 lần, nhận thêm 2 Cung Gỗ.",
  },
  {
    id: "band_of_thieves",
    image: getAugmentIllustration({ id: "band_of_thieves" }),
    name: "Băng Trộm",
    english: "Band of Thieves",
    tier: "silver",
    category: "Trang bị",
    description:
      "Nhận 1 Găng Đạo Tặc.",
  },
  {
    id: "boxing_lessons",
    image: getAugmentIllustration({ id: "boxing_lessons" }),
    name: "Tập Chịu Đòn",
    english: "Boxing Lessons",
    tier: "silver",
    category: "Chiến đấu",
    description:
      "Đội của bạn nhận 30 Máu với mỗi tướng bắt đầu giao tranh ở hàng đầu.",
  },
  {
    id: "branching_out",
    image: getAugmentIllustration({ id: "branching_out" }),
    name: "Phân Nhánh",
    english: "Branching Out",
    tier: "silver",
    category: "Ấn",
    description:
      "Nhận 1 Ấn ngẫu nhiên.",
  },
  {
    id: "branching_out_plus",
    image: getAugmentIllustration({ id: "branching_out_plus" }),
    name: "Phân Nhánh+",
    english: "Branching Out+",
    tier: "silver",
    category: "Ấn",
    description:
      "Nhận 1 Ấn ngẫu nhiên và 1 Búa Rèn.",
  },
  {
    id: "early_learnings",
    image: getAugmentIllustration({ id: "early_learnings" }),
    name: "Bài Học Sơ Khai",
    english: "Early Learnings",
    tier: "silver",
    category: "Chiến đấu",
    description:
      "Đội của bạn nhận 3% Sức Mạnh Công Kích và Sức Mạnh Phép Thuật. Lượng này tăng thêm sau mỗi giao tranh người chơi.",
  },
  {
    id: "item_payout",
    image: getAugmentIllustration({ id: "item_payout" }),
    name: "Túi Đồ Cỡ Đại",
    english: "Item Payout",
    tier: "silver",
    category: "Trang bị",
    description:
      "Nhận 3 trang bị thành phần ngẫu nhiên, 2 vàng và 1 Búa Rèn.",
  },
  {
    id: "stand_alone",
    image: getAugmentIllustration({ id: "stand_alone" }),
    name: "Đơn Độc",
    english: "Stand Alone",
    tier: "silver",
    category: "Chiến đấu",
    description:
      "Các tướng không đứng cạnh đồng minh nhận thêm sức mạnh.",
  },

  {
    id: "jeweled_lotus",
    image: getAugmentIllustration({ id: "jeweled_lotus" }),
    name: "Hoa Sen Châu Báu",
    english: "Jeweled Lotus",
    tier: "gold",
    category: "Chiến đấu",
    description:
      "Các đòn đánh và kỹ năng của đội có thể chí mạng. Nhận thêm Tỷ Lệ Chí Mạng.",
  },
  {
    id: "future_focused",
    image: getAugmentIllustration({ id: "future_focused" }),
    name: "Tập Trung Tương Lai",
    english: "Future Focused",
    tier: "gold",
    category: "Kinh tế",
    description:
      "Nhận vàng và phần thưởng bổ sung theo tiến trình của bạn.",
  },
  {
    id: "giant_and_mighty",
    image: getAugmentIllustration({ id: "giant_and_mighty" }),
    name: "Khổng Lồ và Hùng Mạnh",
    english: "Giant and Mighty",
    tier: "gold",
    category: "Chiến đấu",
    description:
      "Đội của bạn nhận thêm Máu tối đa.",
  },
  {
    id: "group_hug",
    image: getAugmentIllustration({ id: "group_hug" }),
    name: "Cùng Nhau",
    english: "Group Hug",
    tier: "gold",
    category: "Chiến đấu",
    description:
      "Các đồng minh nhận thêm chỉ số phòng thủ.",
  },
  {
    id: "hold_the_line",
    image: getAugmentIllustration({ id: "hold_the_line" }),
    name: "Giữ Vững Tuyến",
    english: "Hold the Line",
    tier: "gold",
    category: "Chiến đấu",
    description:
      "Các tướng ở hàng đầu nhận thêm sức mạnh.",
  },
  {
    id: "item_extraction",
    image: getAugmentIllustration({ id: "item_extraction" }),
    name: "Chiết Xuất Trang Bị",
    english: "Item Extraction",
    tier: "gold",
    category: "Trang bị",
    description:
      "Nhận phần thưởng dựa trên việc tách và sử dụng trang bị.",
  },
  {
    id: "upward_mobility",
    image: getAugmentIllustration({ id: "upward_mobility" }),
    name: "Thăng Tiến",
    english: "Upward Mobility",
    tier: "gold",
    category: "Kinh tế",
    description:
      "Nhận thêm lượt làm mới cửa hàng khi tăng cấp.",
  },
  {
    id: "heroic_grab_bag",
    image: getAugmentIllustration({ id: "heroic_grab_bag" }),
    name: "Túi Anh Hùng",
    english: "Heroic Grab Bag",
    tier: "gold",
    category: "Khác",
    description:
      "Nhận một gói phần thưởng gồm vàng và các tài nguyên hỗ trợ đội hình.",
  },

  {
    id: "pandoras_bench",
    image: getAugmentIllustration({ id: "pandoras_bench" }),
    name: "Hàng Chờ Pandora",
    english: "Pandora's Bench",
    tier: "prismatic",
    category: "Kinh tế",
    description:
      "Tướng trên hàng chờ được thay đổi theo cơ chế của Pandora.",
  },
  {
    id: "diamond_ticket",
    image: getAugmentIllustration({ id: "diamond_ticket" }),
    name: "Vé Kim Cương",
    english: "Diamond Ticket",
    tier: "prismatic",
    category: "Kinh tế",
    description:
      "Nhận phần thưởng đặc biệt khi làm mới cửa hàng.",
  },
  {
    id: "prismatic_pipeline",
    image: getAugmentIllustration({ id: "prismatic_pipeline" }),
    name: "Đường Ống Kim Cương",
    english: "Prismatic Pipeline",
    tier: "prismatic",
    category: "Khác",
    description:
      "Nhận các phần thưởng mạnh theo tiến trình trận đấu.",
  },
  {
    id: "ascension",
    image: getAugmentIllustration({ id: "ascension" }),
    name: "Bán Thăng Hoa",
    english: "Ascension",
    tier: "prismatic",
    category: "Chiến đấu",
    description:
      "Sau 12 giây giao tranh, các tướng của bạn nhận thêm 20% Khuếch Đại Sát Thương.",
  },
  {
    id: "cruel_pact",
    image: getAugmentIllustration({ id: "cruel_pact" }),
    name: "Khế Ước Tàn Khốc",
    english: "Cruel Pact",
    tier: "prismatic",
    category: "Kinh tế",
    description:
      "Thay đổi cách sử dụng Máu và Vàng để tăng tốc tiến trình.",
  },
];


const fetchCurrentSet18Augments = async () => {
  const augments = await loadSet18AugmentCatalogue();
  return augments.map((augment) => ({
    ...augment,
    category: inferAugmentCategory(augment),
  }));
};

const apiNameOrText = (item) =>
  `${item?.apiName || ""} ${item?.name || ""} ${item?.desc || ""}`;

const handleAugmentImageError = (event, augment) => {
  const image = event.currentTarget;
  const candidates = Array.isArray(augment?.imageCandidates)
    ? augment.imageCandidates
    : [augment?.image].filter(Boolean);
  const currentIndex = Number(image.dataset.imageIndex || 0);
  const nextIndex = currentIndex + 1;

  if (nextIndex < candidates.length) {
    image.dataset.imageIndex = String(nextIndex);
    image.src = candidates[nextIndex];
    return;
  }

  image.style.display = "none";
  const fallback = image.nextElementSibling;
  if (fallback) fallback.style.display = "flex";
};

const TIER_LABELS = {
  all: "Tất cả",
  silver: "Bạc",
  gold: "Vàng",
  prismatic: "Kim Cương",
};


const CHAMPIONS = [
  {
    id: "akali",
    name: "Akali",
    cost: 1,
    traits: ["Inferno", "Adaptor", "Ravager"],
  },
  {
    id: "camille",
    name: "Camille",
    cost: 1,
    traits: ["Coven", "Ravager"],
  },
  {
    id: "cinderling",
    name: "Mầm Non",
    cost: 1,
    traits: ["Riftbeast", "Hunter"],
  },
  {
    id: "karma",
    name: "Karma",
    cost: 1,
    traits: ["Blossom", "Spellweaver"],
  },
  {
    id: "kobuko",
    name: "Kobuko",
    cost: 1,
    traits: ["Sprykin", "Brawler"],
  },
  {
    id: "leona",
    name: "Leona",
    cost: 1,
    traits: ["Solar", "Defender"],
  },
  {
    id: "ornn",
    name: "Ornn",
    cost: 1,
    traits: ["Elderwood", "Defender"],
  },
  {
    id: "pebbles",
    assetId: "brock",
    name: "Sỏi",
    cost: 1,
    traits: ["Riftbeast", "Invoker"],
  },  
  {
    id: "rakan",
    name: "Rakan",
    cost: 1,
    traits: ["Fae", "Juggernaut", "Vanguard"],
  },
  {
    id: "reksai",
    name: "Rek'Sai",
    cost: 1,
    traits: ["Blackthorn", "Brawler"],
  },
  {
    id: "varus",
    name: "Varus",
    cost: 1,
    traits: ["Inferno", "Rapidfire"],
  },
  {
    id: "veigar",
    name: "Veigar",
    cost: 1,
    traits: ["Blackthorn", "Sprykin", "Spellweaver"],
  },
  {
    id: "xayah",
    name: "Xayah",
    cost: 1,
    traits: ["Elderwood", "Fae", "Rapidfire"],
  },
  {
    id: "yorick",
    name: "Yorick",
    cost: 1,
    traits: ["Blossom", "Juggernaut", "Summoner"],
  },
  {
    id: "alistar",
    name: "Alistar",
    cost: 2,
    traits: ["Elderwood", "Brawler"],
  },
  {
    id: "caitlyn",
    name: "Caitlyn",
    cost: 2,
    traits: ["Coven", "Hunter"],
  },
  {
    id: "elise",
    name: "Elise",
    cost: 2,
    traits: ["Coven", "Vanguard"],
  },
  {
    id: "gromp",
    name: "Gromp",
    cost: 2,
    traits: ["Riftbeast", "Adaptor"],
  },
  {
    id: "kayle",
    name: "Kayle",
    cost: 2,
    traits: ["Solar", "Rapidfire"],
  },
  {
    id: "leblanc",
    name: "LeBlanc",
    cost: 2,
    traits: ["Elderwood", "Spellweaver"],
  },
  {
    id: "murkwolf",
    name: "Sói Hắc Ám",
    cost: 2,
    traits: ["Riftbeast", "Ravager"],
  },
  {
    id: "scuttlecrab",
    name: "Cua Kỳ Cục",
    cost: 2,
    traits: ["Riftbeast", "Juggernaut"],
  },
  {
    id: "sejuani",
    name: "Sejuani",
    cost: 2,
    traits: ["Solar", "Juggernaut"],
  },
  {
    id: "shen",
    name: "Shen",
    cost: 2,
    traits: ["Inferno", "Defender"],
  },
  {
    id: "teemo",
    name: "Teemo",
    cost: 2,
    traits: ["Sprykin", "Invoker"],
  },
  {
    id: "warwick",
    name: "Warwick",
    cost: 2,
    traits: ["Blackthorn", "Ravager"],
  },
  {
    id: "yunara",
    name: "Yunara",
    cost: 2,
    traits: ["Blossom", "Executioner"],
  },
  {
    id: "azir",
    name: "Azir",
    cost: 3,
    traits: ["Blackthorn", "Executioner", "Summoner"],
  },
  {
    id: "cassiopeia",
    name: "Cassiopeia",
    cost: 3,
    traits: ["Coven", "Spellweaver"],
  },
  {
    id: "diana",
    name: "Diana",
    cost: 3,
    traits: ["Lunar", "Ravager", "Vanguard"],
  },
  {
    id: "fiddlesticks",
    name: "Fiddlesticks",
    cost: 3,
    traits: ["Flora Fatalis", "Defender", "Spellweaver"],
  },
  {
    id: "hecarim",
    name: "Hecarim",
    cost: 3,
    traits: ["Elderwood", "Vanguard"],
  },
  {
    id: "khazix",
    name: "Kha'Zix",
    cost: 3,
    traits: ["Rival"],
  },
  {
    id: "kogmaw",
    name: "Kog'Maw",
    cost: 3,
    traits: ["Caustic", "Invoker", "Adaptor"],
  },
  {
    id: "krug",
    name: "Quái Đá Krug",
    cost: 3,
    traits: ["Riftbeast", "Brawler"],
  },
  {
    id: "mamabeak",
    assetId: "raptor",
    name: "Chim Mẹ",
    cost: 3,
    traits: ["Riftbeast", "Summoner", "Rapidfire"],
  },
  {
    id: "masteryi",
    name: "Master Yi",
    cost: 3,
    traits: ["Blossom", "Adaptor"],
  },
  {
    id: "rammus",
    name: "Rammus",
    cost: 3,
    traits: ["Sprykin", "Defender"],
  },
  {
    id: "rengar",
    name: "Rengar",
    cost: 3,
    traits: ["Rival"],
  },
  {
    id: "tristana",
    name: "Tristana",
    cost: 3,
    traits: ["Fae", "Sprykin", "Hunter"],
  },
  {
    id: "vi",
    name: "Vi",
    cost: 3,
    traits: ["Primal", "Juggernaut"],
  },
  {
    id: "ahri",
    name: "Ahri",
    cost: 4,
    traits: ["Blossom", "Spellweaver"],
  },
  {
    id: "amumu",
    name: "Amumu",
    cost: 4,
    traits: ["Inferno", "Juggernaut"],
  },
  {
    id: "aphelios",
    name: "Aphelios",
    cost: 4,
    traits: ["Lunar", "Rapidfire"],
  },
  {
    id: "brambleback",
    name: "Bụi Gai Đỏ",
    cost: 4,
    traits: ["Riftbeast", "Ravager"],
  },
  {
    id: "ezreal",
    name: "Ezreal",
    cost: 4,
    traits: ["Elderwood", "Executioner"],
  },
  {
    id: "lillia",
    name: "Lillia",
    cost: 4,
    traits: ["Fae", "Defender"],
  },
  {
    id: "malphite",
    name: "Malphite",
    cost: 4,
    traits: ["Blackthorn", "Monolith"],
  },
  {
    id: "morgana",
    name: "Morgana",
    cost: 4,
    traits: ["Coven", "Invoker"],
  },
  {
    id: "nidalee",
    name: "Nidalee",
    cost: 4,
    traits: ["Primal", "Adaptor"],
  },
  {
    id: "sentinel",
    name: "Người Đá",
    cost: 4,
    traits: ["Riftbeast", "Vanguard", "Invoker"],
  },
  {
    id: "sett",
    name: "Sett",
    cost: 4,
    traits: ["Blossom", "Brawler"],
  },
  {
    id: "sivir",
    name: "Sivir",
    cost: 4,
    traits: ["Primal", "Hunter"],
  },
  {
    id: "soraka",
    name: "Soraka",
    cost: 4,
    traits: ["Flora Fatalis", "Executioner"],
  },
  {
    id: "zyra",
    name: "Zyra",
    cost: 4,
    traits: ["Thornmaiden", "Summoner"],
  },
  {
    id: "alune",
    name: "Alune",
    cost: 5,
    traits: ["Attuned", "Lunar", "Spellweaver"],
  },
  {
    id: "ashe",
    name: "Ashe",
    cost: 5,
    traits: ["Blossom", "Hunter"],
  },
  {
    id: "draven",
    name: "Draven",
    cost: 5,
    traits: ["Bounty Seeker"],
  },
  {
    id: "elderdragon",
    name: "Rồng Ngàn Tuổi",
    cost: 5,
    traits: ["Apex Predator", "Riftbeast"],
  },
  {
    id: "gnar",
    name: "Gnar",
    cost: 5,
    traits: ["Elderwood", "Sprykin", "Brawler"],
  },
  {
    id: "ivern",
    name: "Ivern",
    cost: 5,
    traits: ["Greenfather"],
  },
  {
    id: "kennen",
    name: "Kennen",
    cost: 5,
    traits: ["Inferno", "Executioner"],
  },
  {
    id: "lux",
    name: "Lux",
    cost: 5,
    traits: ["Avatar"],
  },
  {
    id: "maokai",
    name: "Maokai",
    cost: 5,
    traits: ["Old Growth", "Juggernaut"],
  },
  {
    id: "taric",
    name: "Taric",
    cost: 5,
    traits: ["Emerald Aspect", "Vanguard"],
  },
];

const CHAMPION_PBE_CHARACTER_BASE =
  "https://raw.communitydragon.org/pbe/game/assets/characters/";

const CHAMPION_PBE_SPLASH_BASE =
  "https://raw.communitydragon.org/pbe/game/assets/ux/tft/championsplashes/patching/";

const CHAMPION_LIVE_CHARACTER_BASE =
  "https://raw.communitydragon.org/latest/game/assets/characters/";

/*
 * Set 18 uses dedicated TFT character assets.
 * Most units map directly to tft18_<id>.
 * Pebbles is internally represented by tft18_brock.
 * Mama Beak is internally represented by tft18_raptor.
 */
const getChampionAssetKey = (champion) =>
  champion.assetId || champion.id;

const getChampionImageCandidates = (champion) => {
  const assetKey = getChampionAssetKey(champion);
  const tftAsset = `tft18_${assetKey}`;

  const candidates = [
    `${CHAMPION_PBE_CHARACTER_BASE}${tftAsset}/${tftAsset}_square.png`,
    `${CHAMPION_PBE_CHARACTER_BASE}${tftAsset}/hud/${tftAsset}_square.png`,
    `${CHAMPION_PBE_CHARACTER_BASE}${tftAsset}/skins/base/${tftAsset}.png`,
    `${CHAMPION_PBE_SPLASH_BASE}${tftAsset}_teamplanner_splash.png`,
    `${CHAMPION_LIVE_CHARACTER_BASE}${assetKey}/skins/base/${assetKey}.png`,
    `${CHAMPION_LIVE_CHARACTER_BASE}${assetKey}/${assetKey}_square.png`,
  ];

  /*
   * Pebbles (Sỏi) uses Brock internally and its reliable TFT portrait
   * is stored in the character HUD folder.
   */
  if (assetKey === "brock") {
    return [
      `${CHAMPION_PBE_CHARACTER_BASE}tft18_brock/hud/tft18_brock_square.png`,
      ...candidates,
    ];
  }

  return candidates;
};

const getChampionIcon = (champion) =>
  getChampionImageCandidates(champion)[0];

const handleChampionImageError = (event, champion) => {
  const image = event.currentTarget;
  const candidates = getChampionImageCandidates(champion);
  const currentIndex = Number(image.dataset.imageIndex || 0);
  const nextIndex = currentIndex + 1;

  if (nextIndex < candidates.length) {
    image.dataset.imageIndex = String(nextIndex);
    image.src = candidates[nextIndex];
    return;
  }

  image.style.display = "none";

  const fallback = image.nextElementSibling;
  if (fallback) {
    fallback.style.display = "flex";
  }
};

const getUnifiedItemIcon = (item) => {
  if (!item) return "";

  const candidates = getItemImageCandidates(item);

  const resolveCandidate = (candidate) => {
    if (!candidate) return "";
    const value = String(candidate);

    if (/^https?:\/\//i.test(value)) {
      return value;
    }

    return `${ITEM_ICON_BASE}${value.replace(/^\/+/, "")}`;
  };

  return candidates.map(resolveCandidate).find(Boolean) || "";
};

const normalizeRemoteItem = (item) => {
  const composition = Array.isArray(item?.composition)
    ? item.composition
    : [];

  let type = item?.kind || "item";

  if (type === "item") {
    type = composition.length === 0 ? "component" : "completed";
  }

  return {
    ...item,
    id: item.apiName || item.id || item.name,
    english: item.englishName || item.name,
    type,
    icon: getUnifiedItemIcon(item),
  };
};

const COST_LABELS = {
  all: "Tất cả",
  1: "1 vàng",
  2: "2 vàng",
  3: "3 vàng",
  4: "4 vàng",
  5: "5 vàng",
};

const BOARD_CELLS = Array.from({ length: 28 }, (_, index) => index);




const getVietnameseTraitName = (traitName, tftData) => {
  const raw = String(traitName || "").trim();
  if (!raw) return "";

  const found = tftData?.traits?.find((trait) =>
    [trait.name, trait.englishName, trait.apiName, trait.id]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase() === raw.toLowerCase())
  );

  return found?.name || raw;
};

const getTraitBreakpoints = (trait) => {
  const values = Array.isArray(trait?.breakpoints)
    ? trait.breakpoints
        .map(Number)
        .filter((value) => Number.isFinite(value) && value > 0)
    : [];

  return [...new Set(values)].sort((a, b) => a - b);
};



// Vai trò vị trí chiến thuật của Set 18.
// Đây là lớp ưu tiên vị trí, không thay thế dữ liệu chiến đấu của game.
const CHAMPION_POSITION_PROFILE = {
  // Đỡ đòn tuyến đầu: đứng hàng 1 và chia đều quanh trung tâm.
  leona: "tank", ornn: "tank", rakan: "tank", reksai: "tank",
  alistar: "tank", elise: "tank", sejuani: "tank", shen: "tank",
  scuttlecrab: "tank", rammus: "tank", amumu: "tank", malphite: "tank",
  maokai: "tank", taric: "tank", gnar: "tank", vi: "tank",
  hecarim: "tank", yorick: "tank", fiddlesticks: "tank",

  // Đấu sĩ/carry cận chiến: hàng 2, phía sau lớp chống chịu.
  akali: "melee", camille: "melee", kobuko: "melee",
  murkwolf: "melee", warwick: "melee", diana: "melee",
  khazix: "melee", krug: "melee", masteryi: "melee", rengar: "melee",
  brambleback: "melee", elderdragon: "melee", sett: "melee",
  kennen: "melee",

  // Carry tầm xa: ưu tiên hàng cuối và vị trí ít bị chạm trực tiếp.
  cinderling: "carry", karma: "carry", varus: "carry", veigar: "carry",
  xayah: "carry", caitlyn: "carry", kayle: "carry", leblanc: "carry",
  teemo: "carry", yunara: "carry", azir: "carry", cassiopeia: "carry",
  kogmaw: "carry", mamabeak: "carry", tristana: "carry", ahri: "carry",
  aphelios: "carry", ezreal: "carry", morgana: "carry", sivir: "carry",
  zyra: "carry", alune: "carry", ashe: "carry", draven: "carry",
  lux: "carry", nidalee: "carry",

  // Tiện ích/triệu hồi: hàng 3, không tranh vị trí với carry chính.
  gromp: "utility", pebbles: "utility", ivern: "utility", sentinel: "utility",
};

const STRATEGIC_COLUMN_ORDERS = {
  tank: [3, 2, 4, 1, 5, 0, 6],
  melee: [2, 4, 3, 1, 5, 0, 6],
  utility: [1, 5, 3, 2, 4, 0, 6],
  carry: [0, 6, 2, 4, 1, 5, 3],
};

const STRATEGIC_ROW_BY_ROLE = {
  tank: 0,
  melee: 1,
  utility: 2,
  carry: 3,
};


/* =========================================================
   ITEM -> CHAMPION STRATEGY ENGINE
   ---------------------------------------------------------
   Mục tiêu: khi người dùng thêm thành phần / trang bị hoàn chỉnh,
   Coach tự tìm tướng phù hợp nhất trong bàn cờ và không vượt quá
   3 trang bị / tướng.
   ========================================================= */

const ITEM_STRATEGY_PROFILES = {
  "Deathblade": ["ad"],
  "Infinity Edge": ["ad", "crit"],
  "Giant Slayer": ["ad", "crit", "as"],
  "Last Whisper": ["ad", "crit", "as"],
  "Guinsoo's Rageblade": ["as", "ad"],
  "Red Buff": ["as", "ad"],
  "Bloodthirster": ["ad", "sustain", "melee"],
  "Hand of Justice": ["ad", "ap", "crit", "sustain", "melee"],
  "Titan's Resolve": ["melee", "tank", "sustain"],
  "Sterak's Gage": ["melee", "tank", "sustain"],
  "Edge of Night": ["melee", "ad", "survival"],
  "Quicksilver": ["as", "survival"],
  "Jeweled Gauntlet": ["ap", "crit"],
  "Archangel's Staff": ["ap", "mana"],
  "Spear of Shojin": ["mana", "ad", "ap"],
  "Blue Buff": ["mana", "ap"],
  "Morellonomicon": ["ap", "mana", "utility"],
  "Hextech Gunblade": ["ap", "ad", "sustain", "support"],
  "Adaptive Helm": ["ap", "mana", "tank"],
  "Crownguard": ["tank", "ap"],
  "Warmog's Armor": ["tank", "hp"],
  "Bramble Vest": ["tank", "armor"],
  "Dragon's Claw": ["tank", "mr"],
  "Gargoyle Stoneplate": ["tank", "armor", "mr"],
  "Sunfire Cape": ["tank", "hp", "utility"],
  "Spirit Visage": ["tank", "mr", "sustain"],
  "Protector's Vow": ["tank", "armor", "mana"],
  "Ionic Spark": ["tank", "ap", "utility"],
  "Radiant Deathblade": ["ad"],
  "Radiant Infinity Edge": ["ad", "crit"],
  "Radiant Giant Slayer": ["ad", "crit", "as"],
  "Radiant Last Whisper": ["ad", "crit", "as"],
  "Radiant Guinsoo's Rageblade": ["as", "ad"],
  "Radiant Red Buff": ["as", "ad"],
  "Radiant Bloodthirster": ["ad", "sustain", "melee"],
  "Radiant Hand of Justice": ["ad", "ap", "crit", "sustain", "melee"],
  "Radiant Titan's Resolve": ["melee", "tank", "sustain"],
  "Radiant Sterak's Gage": ["melee", "tank", "sustain"],
  "Radiant Edge of Night": ["melee", "ad", "survival"],
  "Radiant Quicksilver": ["as", "survival"],
  "Radiant Jeweled Gauntlet": ["ap", "crit"],
  "Radiant Archangel's Staff": ["ap", "mana"],
  "Radiant Spear of Shojin": ["mana", "ad", "ap"],
  "Radiant Blue Buff": ["mana", "ap"],
  "Radiant Morellonomicon": ["ap", "mana", "utility"],
  "Radiant Hextech Gunblade": ["ap", "ad", "sustain", "support"],
  "Radiant Adaptive Helm": ["ap", "mana", "tank"],
  "Radiant Crownguard": ["tank", "ap"],
  "Radiant Warmog's Armor": ["tank", "hp"],
  "Radiant Bramble Vest": ["tank", "armor"],
  "Radiant Dragon's Claw": ["tank", "mr"],
  "Radiant Gargoyle Stoneplate": ["tank", "armor", "mr"],
  "Radiant Sunfire Cape": ["tank", "hp", "utility"],
  "Radiant Spirit Visage": ["tank", "mr", "sustain"],
  "Radiant Protector's Vow": ["tank", "armor", "mana"],
  "Radiant Ionic Spark": ["tank", "ap", "utility"],
};

const COMPONENT_STRATEGY = {
  "B.F. Sword": ["ad", "melee"],
  "Recurve Bow": ["as", "ad"],
  "Needlessly Large Rod": ["ap"],
  "Tear of the Goddess": ["mana", "ap"],
  "Chain Vest": ["tank", "armor"],
  "Negatron Cloak": ["tank", "mr", "sustain"],
  "Giant's Belt": ["tank", "hp", "utility"],
  "Sparring Gloves": ["crit", "ad", "ap", "survival"],
  "Spatula": ["emblem"],
  "Frying Pan": ["emblem", "tank"],
};

const normalizeStrategyText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/radiant\s+/g, "")
    .replace(/[^a-z0-9à-ỹ\s']/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const getChampionItemTags = (champion) => {
  const traits = new Set(champion?.traits || []);
  const role = getChampionPositionRoleStatic(champion);
  const tags = new Set([role]);

  if (role === "tank") tags.add("tank");
  if (role === "melee") tags.add("melee");
  if (role === "carry") tags.add("carry");
  if (role === "utility") tags.add("utility");

  if (["Rapidfire", "Hunter", "Executioner"].some((t) => traits.has(t))) {
    tags.add("ad");
    tags.add("as");
  }

  if (["Spellweaver", "Invoker"].some((t) => traits.has(t))) {
    tags.add("ap");
    tags.add("mana");
  }

  if (["Ravager", "Adaptor"].some((t) => traits.has(t))) {
    tags.add("melee");
    tags.add("sustain");
  }

  if (["Defender", "Juggernaut", "Vanguard", "Brawler"].some((t) => traits.has(t))) {
    tags.add("tank");
    tags.add("hp");
  }

  if (traits.has("Summoner")) tags.add("utility");

  return tags;
};

const getItemStrategyTags = (item) => {
  const english = String(item?.english || item?.englishName || item?.name || "");
  const normalized = normalizeStrategyText(english);

  if (ITEM_STRATEGY_PROFILES[english]) {
    return new Set(ITEM_STRATEGY_PROFILES[english]);
  }

  const componentTags = COMPONENT_STRATEGY[english];
  if (componentTags) return new Set(componentTags);

  const tags = new Set();

  if (normalized.includes("emblem")) tags.add("emblem");
  if (/deathblade|infinity edge|giant slayer|last whisper|red buff|kraken|striker/.test(normalized)) {
    tags.add("ad");
  }
  if (/guinsoo|nashor|rapidfire|red buff/.test(normalized)) tags.add("as");
  if (/jeweled|archangel|morello|void staff|rabadon|nashor/.test(normalized)) tags.add("ap");
  if (/shojin|blue buff|adaptive|protector/.test(normalized)) tags.add("mana");
  if (/warmog|bramble|dragon|gargoyle|sunfire|spirit visage|crownguard|steadfast|stoneplate/.test(normalized)) {
    tags.add("tank");
  }
  if (/bloodthirster|hand of justice|sterak|titan|edge of night|quicksilver/.test(normalized)) {
    tags.add("melee");
    tags.add("sustain");
  }
  if (/gunblade|ionic|morello|sunfire/.test(normalized)) tags.add("utility");

  return tags;
};

const getItemChampionScore = (item, champion, alreadyAssigned = 0) => {
  if (!champion) return -Infinity;

  const itemTags = getItemStrategyTags(item);
  const championTags = getChampionItemTags(champion);
  const english = String(item?.english || item?.englishName || item?.name || "");
  const normalized = normalizeStrategyText(english);
  let score = 0;

  itemTags.forEach((tag) => {
    if (championTags.has(tag)) score += 20;
  });

  if (itemTags.has("tank") && championTags.has("tank")) score += 30;
  if (itemTags.has("melee") && championTags.has("melee")) score += 24;
  if (itemTags.has("ad") && championTags.has("ad")) score += 25;
  if (itemTags.has("ap") && championTags.has("ap")) score += 25;
  if (itemTags.has("mana") && championTags.has("ap")) score += 10;
  if (itemTags.has("support") && championTags.has("utility")) score += 12;

  if (normalized.includes("emblem")) {
    const emblemName = normalized.replace(/radiant\s+/, "").replace(/emblem/, "").trim();
    const exactTrait = (champion.traits || []).some(
      (trait) => normalizeStrategyText(trait) === emblemName
    );
    if (exactTrait) score += 120;
    else score -= 20;
  }

  // Ưu tiên tướng 3 sao / tướng giá trị cao làm carry hoặc tank chính,
  // nhưng không để giá vàng lấn át mức phù hợp của trang bị.
  if (champion.cost >= 5) score += 4;
  if (alreadyAssigned === 0) score += 5;
  if (alreadyAssigned === 1) score += 2;
  if (alreadyAssigned >= 3) score -= 1000;

  return score;
};

const buildItemAssignments = (units, items) => {
  const activeUnits = units.filter(Boolean);
  const assignments = {};

  activeUnits.forEach((unit) => {
    assignments[unit.instanceId] = [];
  });

  if (!activeUnits.length || !items.length) return assignments;

  const orderedItems = [...items].sort((a, b) => {
    const typeWeight = (item) => {
      if (item.type === "completed" || item.type === "radiant" || item.type === "artifact" || item.type === "emblem") return 3;
      if (item.type === "component") return 2;
      return 1;
    };
    return typeWeight(b) - typeWeight(a);
  });

  orderedItems.forEach((item) => {
    let bestUnit = null;
    let bestScore = -Infinity;

    activeUnits.forEach((unit) => {
      const assignedCount = assignments[unit.instanceId]?.length || 0;
      const score = getItemChampionScore(item, unit, assignedCount);
      if (score > bestScore) {
        bestScore = score;
        bestUnit = unit;
      }
    });

    if (bestUnit && bestScore > -500) {
      assignments[bestUnit.instanceId].push(item);
    }
  });


  return assignments;
};


/* =========================================================
   COACH DECISION ENGINE
   ---------------------------------------------------------
   Rule-based engine: chuyển trạng thái trận đấu thành hành động
   cụ thể. Engine chỉ đọc state và đưa ra khuyến nghị, không tự
   thay đổi vàng / XP / bàn cờ của người chơi.
   ========================================================= */

const getStageLevelTarget = (stageNumber) => {
  if (stageNumber <= 2) return 5;
  if (stageNumber === 3) return 6;
  if (stageNumber === 4) return 7;
  if (stageNumber === 5) return 8;
  return 9;
};

const buildCoachDecision = ({
  hp,
  gold,
  level,
  stage,
  roundType,
  streak,
  xp,
  board,
  selectedItems,
  selectedAugment,
  itemAssignments,
  boardTraits,
}) => {
  const numericHp = Math.max(0, Number(hp) || 0);
  const numericGold = Math.max(0, Number(gold) || 0);
  const numericLevel = Math.max(1, Number(level) || 1);
  const numericStreak = Number(streak) || 0;
  const boardUnits = board.filter(Boolean);
  const boardCount = boardUnits.length;
  const stageNumber = Number(String(stage).split("-")[0]) || 2;
  const stageRound = Number(String(stage).split("-")[1]) || 1;
  const targetLevel = getStageLevelTarget(stageNumber);

  const tanks = boardUnits.filter(
    (unit) => getChampionPositionRoleStatic(unit) === "tank"
  );
  const carries = boardUnits.filter(
    (unit) => getChampionPositionRoleStatic(unit) === "carry"
  );
  const melees = boardUnits.filter(
    (unit) => getChampionPositionRoleStatic(unit) === "melee"
  );

  const oneStarUnits = boardUnits.filter((unit) => Number(unit.stars || 1) === 1);
  const threeStarUnits = boardUnits.filter((unit) => Number(unit.stars || 1) >= 3);
  const assignedItems = Object.values(itemAssignments || {}).reduce(
    (sum, items) => sum + items.length,
    0
  );
  const unassignedItems = Math.max(0, selectedItems.length - assignedItems);

  const nearTraits = boardTraits
    .filter((trait) => trait.nextBreakpoint && trait.nextBreakpoint - trait.count <= 1)
    .sort((a, b) => {
      const aGap = a.nextBreakpoint - a.count;
      const bGap = b.nextBreakpoint - b.count;
      return aGap - bGap || b.count - a.count;
    });

  const traitText = nearTraits[0]
    ? `${nearTraits[0].name} ${nearTraits[0].nextBreakpoint}`
    : null;

  const carryTarget = [...carries, ...melees]
    .filter((unit) => !threeStarUnits.includes(unit))
    .sort((a, b) =>
      (Number(b.stars || 1) - Number(a.stars || 1)) ||
      (b.cost || 0) - (a.cost || 0)
    )[0];

  const frontlineTarget = tanks
    .filter((unit) => !threeStarUnits.includes(unit))
    .sort((a, b) =>
      (Number(b.stars || 1) - Number(a.stars || 1)) ||
      (b.cost || 0) - (a.cost || 0)
    )[0];

  const weakestUpgradeTarget =
    carryTarget || frontlineTarget || oneStarUnits[0] || null;

  let economyDecision = {
    title: "Giữ kinh tế",
    detail: "Chưa có áp lực đủ lớn để phá nhịp vàng.",
    tone: "positive",
  };

  if (numericHp <= 25) {
    economyDecision = {
      title: "Không greed vàng",
      detail: "Máu nguy cấp: ưu tiên chuyển vàng thành sức mạnh ngay thay vì cố giữ mốc lãi.",
      tone: "danger",
    };
  } else if (numericHp <= 40) {
    economyDecision = {
      title: "Giảm greed",
      detail: "Máu đang thấp; chỉ giữ vàng nếu bàn cờ đã đủ mạnh để sống qua các round PvP.",
      tone: "warning",
    };
  } else if (numericGold >= 50) {
    economyDecision = {
      title: "Giữ mốc 50",
      detail: "Đang có đủ vàng cho 5 bậc lãi. Chỉ phá mốc khi đổi lấy nâng cấp rõ ràng.",
      tone: "positive",
    };
  } else if (numericGold >= 30) {
    economyDecision = {
      title: "Tích lên 50",
      detail: `Còn ${50 - numericGold} vàng để đạt mốc 50; tránh tiêu lẻ nếu bàn cờ chưa có nguy cơ thua lớn.`,
      tone: "neutral",
    };
  } else if (stageNumber <= 2 && numericHp > 60) {
    economyDecision = {
      title: "Greed có kiểm soát",
      detail: "Giai đoạn đầu và Máu còn tốt; ưu tiên tích vàng trước khi roll sâu.",
      tone: "positive",
    };
  }

  let levelDecision = {
    title: `Giữ cấp ${numericLevel}`,
    detail: `Cấp ${numericLevel} đang phù hợp với mốc tham khảo của giai đoạn ${stage}.`,
    tone: "neutral",
  };

  if (numericHp <= 25 && numericLevel < targetLevel) {
    levelDecision = {
      title: `Ưu tiên lên cấp ${targetLevel}`,
      detail: "Máu nguy cấp và cấp đang dưới mốc tham khảo; dùng XP để tăng số quân và tìm sức mạnh ngay.",
      tone: "danger",
    };
  } else if (numericLevel < targetLevel && numericGold >= 30 && numericHp > 45) {
    levelDecision = {
      title: `Cân nhắc lên cấp ${targetLevel}`,
      detail: `Đang dưới mốc tham khảo ${targetLevel}; có thể đầu tư XP nếu việc thêm một unit giúp kích hoạt trait hoặc tăng frontline/carry.`,
      tone: "warning",
    };
  } else if (numericLevel > targetLevel) {
    levelDecision = {
      title: "Không cần ép cấp",
      detail: "Đã vượt mốc tham khảo; ưu tiên hoàn thiện board hoặc kinh tế.",
      tone: "positive",
    };
  }

  let rollDecision = {
    title: "Không roll sâu",
    detail: "Giữ vàng và chờ thời điểm có giá trị hơn.",
    tone: "positive",
  };

  if (numericHp <= 25) {
    rollDecision = {
      title: "Roll để ổn định",
      detail: weakestUpgradeTarget
        ? `Ưu tiên nâng sao cho ${weakestUpgradeTarget.name}; đây là mục tiêu nâng cấp hiện có rõ nhất trên bàn.`
        : "Không có mục tiêu cụ thể trên bàn; cần thêm dữ liệu shop để Coach xác định unit cần roll.",
      tone: "danger",
    };
  } else if (numericHp <= 40 && (oneStarUnits.length >= 2 || tanks.length === 0)) {
    rollDecision = {
      title: "Roll vừa phải",
      detail: weakestUpgradeTarget
        ? `Tìm nâng sao cho ${weakestUpgradeTarget.name} hoặc bổ sung frontline trước khi tiếp tục greed.`
        : "Bàn cờ có dấu hiệu yếu; nên dùng một phần vàng để ổn định.",
      tone: "warning",
    };
  } else if (stageNumber >= 4 && oneStarUnits.length >= 3 && numericGold >= 30) {
    rollDecision = {
      title: "Roll có mục tiêu",
      detail: "Board còn nhiều unit 1★ ở giai đoạn giữa/cuối; nên ưu tiên nâng sao thay vì giữ vàng tuyệt đối.",
      tone: "warning",
    };
  }

  let boardDecision = {
    title: "Giữ cấu trúc board",
    detail: "Cấu trúc tuyến trước / tuyến sau hiện chưa có tín hiệu thiếu lớn.",
    tone: "positive",
  };

  if (boardCount < numericLevel) {
    boardDecision = {
      title: `Bổ sung quân ${numericLevel}`,
      detail: "Số unit đang thấp hơn cấp hiện tại; ưu tiên thêm unit thay vì để trống slot.",
      tone: "warning",
    };
  } else if (tanks.length === 0 && boardCount > 0) {
    boardDecision = {
      title: "Bổ sung tuyến trước",
      detail: "Bàn cờ chưa có unit được Coach phân loại là tank; carry dễ bị tiếp cận trực tiếp.",
      tone: "danger",
    };
  } else if (carries.length === 0 && boardCount >= 3) {
    boardDecision = {
      title: "Tìm nguồn sát thương chính",
      detail: "Bàn hiện chưa có carry được nhận diện; nên ưu tiên một unit gây sát thương ổn định.",
      tone: "warning",
    };
  } else if (roundType === "PvP" && boardCount > 0) {
    boardDecision = {
      title: "Giữ frontline / backline",
      detail: "PvP đang yêu cầu cấu trúc đội hình rõ: tank phía trước, carry phía sau. Có thể dùng Sắp xếp chiến thuật nếu vừa thay đổi board.",
      tone: "positive",
    };
  }

  let itemDecision = {
    title: "Chờ thêm trang bị",
    detail: "Chưa có trang bị được nhập.",
    tone: "neutral",
  };

  if (selectedItems.length > 0) {
    if (unassignedItems > 0) {
      itemDecision = {
        title: `Gán ${unassignedItems} trang bị còn lại`,
        detail: "Một số trang bị chưa được gán vào tướng; ưu tiên carry chính và frontline trước.",
        tone: "warning",
      };
    } else {
      const assignedEntries = boardUnits
        .map((unit) => ({
          unit,
          items: itemAssignments[unit.instanceId] || [],
        }))
        .filter((entry) => entry.items.length)
        .sort((a, b) => b.items.length - a.items.length);

      const top = assignedEntries[0];

      itemDecision = {
        title: top
          ? `Ưu tiên ${top.unit.name}`
          : "Hoàn thiện trang bị",
        detail: top
          ? `${top.unit.name} đang nhận ${top.items.length} trang bị theo engine. Không cần đổi nếu chưa có item mới tốt hơn.`
          : "Engine chưa tìm được tướng phù hợp với các trang bị hiện có.",
        tone: "positive",
      };
    }
  }

  let traitDecision = {
    title: "Giữ Tộc / Hệ hiện tại",
    detail: "Chưa có breakpoint gần để ưu tiên thay đổi đội hình.",
    tone: "neutral",
  };

  if (traitText) {
    traitDecision = {
      title: `Nhắm mốc ${traitText}`,
      detail: "Chỉ đổi unit nếu unit bổ sung vừa kích hoạt mốc vừa không làm board mất cân bằng tuyến trước/sát thương.",
      tone: "positive",
    };
  }

  let primaryAction = {
    label: "Ổn định và giữ nhịp",
    detail: "Không có cảnh báo khẩn cấp. Ưu tiên duy trì cấu trúc board và kinh tế.",
    tone: "positive",
    icon: "stable",
  };

  if (numericHp <= 25) {
    primaryAction = {
      label: "STABILIZE — ƯU TIÊN SỨC MẠNH",
      detail: "Máu nguy cấp. Hãy chuyển tài nguyên thành sức mạnh ngay: thêm quân, lên cấp hoặc roll nâng sao tùy mục tiêu hiện có.",
      tone: "danger",
      icon: "stabilize",
    };
  } else if (boardCount < numericLevel) {
    primaryAction = {
      label: "BỔ SUNG BOARD TRƯỚC",
      detail: `Bạn đang có ${boardCount} unit ở cấp ${numericLevel}. Một slot trống làm giảm sức mạnh giao tranh trực tiếp.`,
      tone: "warning",
      icon: "board",
    };
  } else if (numericHp <= 40) {
    primaryAction = {
      label: "STABILIZE — GIẢM GREED",
      detail: "Máu đã vào vùng rủi ro. Ưu tiên nâng chất lượng board trước khi tiếp tục tích vàng.",
      tone: "warning",
      icon: "stabilize",
    };
  } else if (numericLevel < targetLevel && numericGold >= 30) {
    primaryAction = {
      label: `CÂN NHẮC LÊN CẤP ${targetLevel}`,
      detail: "Có đủ nền kinh tế để cân nhắc đầu tư XP nếu slot mới tạo ra sức mạnh hoặc breakpoint đáng kể.",
      tone: "neutral",
      icon: "level",
    };
  } else if (numericGold >= 50 && numericHp > 60) {
    primaryAction = {
      label: "GREED — GIỮ MỐC 50",
      detail: "Máu an toàn và đã đạt mốc lãi tối đa. Không phá mốc nếu chưa có lý do sức mạnh rõ ràng.",
      tone: "positive",
      icon: "greed",
    };
  }

  const reasons = [];
  if (numericHp <= 25) reasons.push("Máu ≤ 25: ưu tiên sống sót trước kinh tế.");
  else if (numericHp <= 40) reasons.push("Máu ≤ 40: mức rủi ro cao, cần giảm greed.");
  else if (numericHp > 60) reasons.push("Máu > 60: còn dư địa để giữ kinh tế.");

  if (boardCount < numericLevel) {
    reasons.push(`Board ${numericLevel}: đang thiếu unit theo cấp.`);
  } else {
    reasons.push(`Board ${numericLevel}: đủ slot theo cấp hiện tại.`);
  }

  if (numericGold >= 50) reasons.push("Đã đạt mốc 50 vàng.");
  else if (numericGold >= 30) reasons.push(`Còn ${50 - numericGold} vàng để đạt mốc 50.`);

  if (oneStarUnits.length) {
    reasons.push(`${oneStarUnits.length} unit đang ở 1★; có mục tiêu để nâng sao.`);
  }

  if (selectedAugment) {
    reasons.push(`Nâng cấp hiện tại: ${selectedAugment.name}.`);
  }

  if (numericStreak !== 0) {
    reasons.push(
      `Chuỗi hiện tại: ${numericStreak}.`
    );
  }

  const warnings = [];
  if (!boardUnits.length) warnings.push("Chưa có board nên các quyết định về nâng sao, frontline và item còn hạn chế.");
  if (!selectedItems.length) warnings.push("Chưa nhập trang bị nên chưa thể đánh giá item-to-champion.");
  if (roundType === "PvP" && boardUnits.length && tanks.length === 0) {
    warnings.push("PvP nhưng chưa có tuyến trước được nhận diện.");
  }
  if (stageRound >= 5 && numericHp <= 40) {
    warnings.push("Giai đoạn cuối round: không nên giữ economy nếu điều đó làm mất quá nhiều Máu.");
  }

  return {
    primaryAction,
    economyDecision,
    levelDecision,
    rollDecision,
    boardDecision,
    itemDecision,
    traitDecision,
    reasons,
    warnings,
    meta: {
      targetLevel,
      boardCount,
      tanks: tanks.length,
      carries: carries.length,
      oneStar: oneStarUnits.length,
      assignedItems,
      unassignedItems,
      nearTrait: traitText,
      stage,
      hp: numericHp,
      gold: numericGold,
      level: numericLevel,
      xp: Number(xp) || 0,
      streak: numericStreak,
    },
  };
};

// Engine dùng cùng profile vị trí hiện có nhưng tách thành hàm độc lập
// để có thể gọi trước khi component render.
const getChampionPositionRoleStatic = (champion) => {
  const explicit = CHAMPION_POSITION_PROFILE[champion?.id];
  if (explicit) return explicit;

  const traits = new Set(champion?.traits || []);

  if (["Defender", "Juggernaut", "Vanguard"].some((trait) => traits.has(trait))) {
    return "tank";
  }

  if (traits.has("Brawler") && !traits.has("Rapidfire")) return "tank";
  if (traits.has("Rapidfire") || traits.has("Hunter")) return "carry";
  if (traits.has("Spellweaver") && !traits.has("Defender")) return "carry";
  if (traits.has("Ravager") || traits.has("Adaptor")) return "melee";

  return "utility";
};

function MatchCoach() {

  const [hp, setHp] = useState(100);

  const [gold, setGold] = useState(0);

  const [level, setLevel] = useState(1);

  const [shop, setShop] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);

  const [stage, setStage] = useState("2-1");

  const [roundType, setRoundType] = useState("PvE");

  const [streak, setStreak] = useState(0);

  const [xp, setXp] = useState(0);

  const [analysisRun, setAnalysisRun] = useState(true);
  /* =========================================================
     MATCH STATE
     ---------------------------------------------------------
     Người chơi xác nhận kết quả round và tự nhập state mới.
     Coach không tự cộng/trừ HP, vàng hoặc XP.
     ========================================================= */
  const [roundResult, setRoundResult] = useState("pending");

  const [showItems, setShowItems] = useState(false);
  const [searchItem, setSearchItem] = useState("");
  const [itemType, setItemType] = useState("all");

  const [selectedItems, setSelectedItems] = useState([]);

  const [tftData, setTftData] = useState(null);
  const [dataStatus, setDataStatus] = useState("Đang tải dữ liệu Set 18...");

  const [showAugments, setShowAugments] = useState(false);
  const [searchAugment, setSearchAugment] = useState("");
  const [augmentTier, setAugmentTier] = useState("all");

  const [selectedAugment, setSelectedAugment] = useState(null);
  const [liveAugments, setLiveAugments] = useState([]);
  const [augmentDataStatus, setAugmentDataStatus] = useState("Đang tải toàn bộ lõi Set 18...");

  const [showChampions, setShowChampions] = useState(false);
  const [searchChampion, setSearchChampion] = useState("");
  const [championCost, setChampionCost] = useState("all");
  const [board, setBoard] = useState(Array(28).fill(null));

  /* =========================================================
   ROUND / MATCH TRACKING
   ---------------------------------------------------------
   Người chơi tự xác nhận khi muốn lưu trạng thái round.
   Coach không tự thay đổi vàng, XP hoặc bàn cờ.
   ========================================================= */

/* =========================================================
   USER-SCOPED MATCH STORAGE
   ---------------------------------------------------------
   Mỗi tài khoản có storage riêng.
   Match ID và round history không dùng chung giữa các user.
   ========================================================= */

const [authUserId, setAuthUserId] = useState("");
const [matchId, setMatchId] = useState("");
const [roundHistory, setRoundHistory] = useState([]);

/* =========================================================
   LẤY SUPABASE USER HIỆN TẠI
   ========================================================= */

useEffect(() => {
  let active = true;

  supabase.auth.getSession().then(({ data }) => {
    if (!active) return;

    const userId = data?.session?.user?.id || "";

    setAuthUserId(userId);
  });

  return () => {
    active = false;
  };
}, []);

/* =========================================================
   STORAGE KEY RIÊNG CHO TỪNG USER
   ========================================================= */

const matchStorageKey = authUserId
  ? `tft-coach-match-id:${authUserId}`
  : "";

const roundHistoryStorageKey = authUserId
  ? `tft-coach-round-history:${authUserId}`
  : "";

const matchCreationLockKey = authUserId
  ? `tft-coach-match-creating:${authUserId}`
  : "";

/* =========================================================
   LOAD DỮ LIỆU LOCAL CỦA ĐÚNG USER
   ========================================================= */

useEffect(() => {
  if (!authUserId) return;

  try {
    const savedMatchId = localStorage.getItem(
      matchStorageKey
    );

    const savedRoundHistory = localStorage.getItem(
      roundHistoryStorageKey
    );

    setMatchId(savedMatchId || "");

    setRoundHistory(
      savedRoundHistory
        ? JSON.parse(savedRoundHistory)
        : []
    );
  } catch {
    setMatchId("");
    setRoundHistory([]);
  }
}, [
  authUserId,
  matchStorageKey,
  roundHistoryStorageKey,
]);

/* =========================================================
   TẠO MATCH MỚI KHI USER CHƯA CÓ MATCH LOCAL
   ---------------------------------------------------------
   Cơ chế:
   1. Kiểm tra user.
   2. Kiểm tra Match ID đã lưu.
   3. Kiểm tra creation lock.
   4. Đặt lock TRƯỚC khi gọi API.
   5. Gọi createMatch() chỉ một lần.
   6. Luôn lưu Match ID vào localStorage khi API trả về.
   7. Xóa lock sau khi hoàn tất.
   ========================================================= */

useEffect(() => {
  if (!authUserId || matchId) {
    return;
  }

  /*
   * Kiểm tra xem Match ID đã được một component
   * hoặc request khác tạo ra hay chưa.
   */
  try {
    const savedMatchId = localStorage.getItem(
      matchStorageKey
    );

    if (savedMatchId) {
      setMatchId(savedMatchId);
      return;
    }
  } catch {
    return;
  }

  /*
   * Kiểm tra creation lock.
   *
   * Lock được lưu bằng timestamp để tránh việc
   * một lock cũ bị giữ vĩnh viễn nếu trình duyệt
   * hoặc request bị crash.
   */
  let existingLock = null;

  try {
    existingLock = localStorage.getItem(
      matchCreationLockKey
    );
  } catch {
    return;
  }

  if (existingLock) {
    const lockTime = Number(existingLock);
    const lockAge = Date.now() - lockTime;

    /*
     * Lock còn mới → một request khác đang tạo Match.
     * Không gửi thêm POST /api/matches.
     */
    if (
      Number.isFinite(lockTime) &&
      lockAge < 30000
    ) {
      return;
    }

    /*
     * Lock quá 30 giây → coi như request cũ
     * đã bị lỗi hoặc trình duyệt bị đóng.
     */
    try {
      localStorage.removeItem(
        matchCreationLockKey
      );
    } catch {
      return;
    }
  }

  /*
   * Đặt lock TRƯỚC createMatch().
   *
   * localStorage tồn tại qua React remount,
   * khác với useRef().
   */
  try {
    localStorage.setItem(
      matchCreationLockKey,
      String(Date.now())
    );
  } catch {
    return;
  }

  createMatch({
    mode: "normal",
    set_name: "Set 18",
  })
    .then((data) => {
      if (!data?.id) {
        return;
      }

      /*
       * Luôn lưu Match ID.
       *
       * Không phụ thuộc vào biến `active`,
       * vì component có thể đã remount trong
       * lúc request đang chạy.
       */
      try {
        localStorage.setItem(
          matchStorageKey,
          data.id
        );
      } catch {}

      /*
       * Cập nhật React state.
       */
      setMatchId(data.id);
    })
    .catch(() => {
      /*
       * Nếu API lỗi, cho phép tạo lại Match
       * trong lần thử tiếp theo.
       */
    })
    .finally(() => {
      try {
        localStorage.removeItem(
          matchCreationLockKey
        );
      } catch {}
    });
}, [
  authUserId,
  matchId,
  matchStorageKey,
  matchCreationLockKey,
]);

/* =========================================================
   LƯU ROUND HISTORY THEO ĐÚNG USER
   ========================================================= */

useEffect(() => {
  if (
    !authUserId ||
    !roundHistoryStorageKey
  ) {
    return;
  }

  try {
    localStorage.setItem(
      roundHistoryStorageKey,
      JSON.stringify(roundHistory)
    );
  } catch {}
}, [
  authUserId,
  roundHistory,
  roundHistoryStorageKey,
]);

/* =========================================================
   STAGE / ROUND HELPERS
   ========================================================= */

const getStageParts = (value) => {
  const [stageNumber, roundNumber] = String(
    value || "1-1"
  )
    .split("-")
    .map((part) => Number(part));

  return {
    stage: Number.isFinite(stageNumber)
      ? stageNumber
      : 1,

    round: Number.isFinite(roundNumber)
      ? roundNumber
      : 1,
  };
};

const getNextStage = (value) => {
  const current = getStageParts(value);

  const maxRound =
    current.stage >= 3
      ? 7
      : 6;

  if (current.round >= maxRound) {
    return `${current.stage + 1}-1`;
  }

  return `${current.stage}-${current.round + 1}`;
};

const getPreviousStage = (value) => {
  const current = getStageParts(value);

  if (
    current.stage <= 1 &&
    current.round <= 1
  ) {
    return "1-1";
  }

  if (current.round <= 1) {
    const previousStage = Math.max(
      1,
      current.stage - 1
    );

    return `${previousStage}-${
      previousStage >= 3
        ? 7
        : 6
    }`;
  }

  return `${current.stage}-${current.round - 1}`;
};

const getRoundResultLabel = (result) => {
  if (result === "win") return "Thắng";
  if (result === "loss") return "Thua";
  if (result === "neutral") return "Trung lập";

  return "Chưa xác nhận";
};

const getRoundResultTone = (result) => {
  if (result === "win") return "win";
  if (result === "loss") return "loss";
  if (result === "neutral") return "neutral";

  return "pending";
};

  const createRoundSnapshot = () => ({
    id: `${Date.now()}-${stage}`,
    savedAt: new Date().toISOString(),
    stage,
    roundType,
    result: roundResult,
    resultLabel: getRoundResultLabel(roundResult),
    hp: Number(hp) || 0,
    gold: Number(gold) || 0,
    level: Number(level) || 1,
    xp: Number(xp) || 0,
    streak: Number(streak) || 0,
    board: board.filter(Boolean).map((unit) => ({
      ...unit,
      traits: [...(unit.traits || [])],
    })),
    selectedItems: selectedItems.map((item) => ({ ...item })),
    selectedAugment: selectedAugment ? { ...selectedAugment } : null,
    boardTraits: boardTraits.map((trait) => ({
      key: trait.key,
      name: trait.name,
      count: trait.count,
      activeBreakpoint: trait.activeBreakpoint,
      nextBreakpoint: trait.nextBreakpoint,
    })),
    coachDecision: coachDecision
      ? {
          primaryAction: { ...coachDecision.primaryAction },
          economyDecision: { ...coachDecision.economyDecision },
          levelDecision: { ...coachDecision.levelDecision },
          rollDecision: { ...coachDecision.rollDecision },
          boardDecision: { ...coachDecision.boardDecision },
        }
      : null,
  });

  const saveCurrentRound = () => {
    const snapshot = createRoundSnapshot();

    if (matchId) {
      saveRound(matchId, snapshot).catch(() => {});
    }

    setRoundHistory((current) => {
      const sameStageIndex = current.findIndex(
        (entry) => entry.stage === snapshot.stage
      );

      if (sameStageIndex >= 0) {
        const next = [...current];
        next[sameStageIndex] = {
          ...snapshot,
          id: next[sameStageIndex].id,
        };
        return next.sort((a, b) =>
          String(a.stage).localeCompare(String(b.stage), undefined, {
            numeric: true,
          })
        );
      }

      return [...current, snapshot]
        .sort((a, b) =>
          String(a.stage).localeCompare(String(b.stage), undefined, {
            numeric: true,
          })
        )
        .slice(-40);
    });

    setAnalysisRun(true);
  };

  const advanceToNextRound = () => {
    saveCurrentRound();
    setStage(getNextStage(stage));
    setRoundResult("pending");
    setAnalysisRun(true);
  };

  const goToPreviousRound = () => {
    setStage(getPreviousStage(stage));
    setRoundResult("pending");
    setAnalysisRun(true);
  };

  const clearMatchHistory = () => {
    setRoundHistory([]);
    setRoundResult("pending");
    try {
      localStorage.removeItem("tft-coach-round-history");
    } catch {}
  };

  const matchSummary = (() => {
    const sorted = [...roundHistory].sort((a, b) =>
      String(a.stage).localeCompare(String(b.stage), undefined, {
        numeric: true,
      })
    );

    const wins = sorted.filter((entry) => entry.result === "win").length;
    const losses = sorted.filter((entry) => entry.result === "loss").length;
    const neutral = sorted.filter((entry) => entry.result === "neutral").length;
    const first = sorted[0];
    const latest = sorted.at(-1);
    const hpDelta = first && latest ? latest.hp - first.hp : 0;
    const goldDelta = first && latest ? latest.gold - first.gold : 0;

    let currentResultStreak = 0;
    let currentStreakType = null;

    for (let i = sorted.length - 1; i >= 0; i -= 1) {
      const result = sorted[i].result;
      if (result !== "win" && result !== "loss") break;
      if (!currentStreakType) currentStreakType = result;
      if (result !== currentStreakType) break;
      currentResultStreak += 1;
    }

    return {
      total: sorted.length,
      wins,
      losses,
      neutral,
      hpDelta,
      goldDelta,
      currentResultStreak,
      currentStreakType,
      latest,
    };
  })();

  const getRoundDelta = (current, previous) => {
    if (!previous) return null;

    return {
      hp: current.hp - previous.hp,
      gold: current.gold - previous.gold,
      level: current.level - previous.level,
      xp: current.xp - previous.xp,
      board: current.board.length - previous.board.length,
    };
  };


  /* =========================================================
   SHOP INTELLIGENCE
   ---------------------------------------------------------
   Shop gồm 5 ô. Coach chỉ phân tích, không tự mua/roll.
   ========================================================= */

const [shopPickerSlot, setShopPickerSlot] = useState(null);

  // Tự động tính Tộc/Hệ từ các tướng đang có trên bàn.
  const boardTraitCounts = board.reduce((counts, unit) => {
    if (!unit) return counts;

    (unit.traits || []).forEach((trait) => {
      const key = String(trait).trim();
      if (!key) return;
      counts[key] = (counts[key] || 0) + 1;
    });

    return counts;
  }, {});

  const boardTraits = Object.entries(boardTraitCounts)
    .map(([traitName, count]) => {
      const meta = tftData?.traits?.find((trait) =>
        [trait.name, trait.englishName, trait.apiName, trait.id]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase() === traitName.toLowerCase())
      );

      const breakpoints = getTraitBreakpoints(meta);
      const activeBreakpoint = breakpoints
        .filter((value) => count >= value)
        .at(-1) || 0;
      const nextBreakpoint = breakpoints.find((value) => value > count) || null;

      return {
        key: traitName,
        name: meta?.name || getVietnameseTraitName(traitName, tftData),
        count,
        breakpoints,
        activeBreakpoint,
        nextBreakpoint,
        active: Boolean(tftData) && (activeBreakpoint > 0 || breakpoints.length === 0),
        meta,
      };
    })
    .sort((a, b) => {
      if (a.active !== b.active) return a.active ? -1 : 1;
      if (a.count !== b.count) return b.count - a.count;
      return a.name.localeCompare(b.name, "vi");
    });


  useEffect(() => {
    let active = true;

    loadTFTData()
      .then((data) => {
        if (!active) return;
        setTftData(data);
        setDataStatus(
          `Set ${data.set} · ${data.counts.artifacts} Tạo Tác · 16 Ấn ghép · 36 Ánh Sáng`
        );
      })
      .catch(() => {
        if (!active) return;
        setDataStatus("Dữ liệu online lỗi · đang dùng dữ liệu dự phòng");
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    fetchCurrentSet18Augments()
      .then((augments) => {
        if (!active) return;
        setLiveAugments(augments);
        setAugmentDataStatus(`Đã tải ${augments.length} lõi Set 18 · 69 Bạc · 110 Vàng · 67 Kim Cương · có ảnh`);
      })
      .catch((error) => {
        if (!active) return;
        setLiveAugments([]);
        setAugmentDataStatus(`Lỗi tải lõi Set 18: ${error?.message || "không xác định"}`);
      });

    return () => {
      active = false;
    };
  }, []);

  /*
   * IMPORTANT: The Item Selector must show only real player-facing TFT items.
   * We deliberately DO NOT expose every object returned by CommunityDragon
   * because that feed also contains internal/utility/game objects.
   *
   * Keep the original component + completed-item list, then add only the
   * two special components for Set 18: Spatula and Golden Frying Pan.
   */
  const baseItems = ITEMS;

  const findRemoteItem = (englishName) => {
    if (!tftData) return null;

    const target = englishName.toLowerCase();

    return (
      tftData.items.find(
        (item) =>
          String(item.englishName || item.name || "")
            .toLowerCase() === target
      ) || null
    );
  };

  const specialComponents = [
    {
      id: "spatula",
      name: "Xẻng Vàng",
      english: "Spatula",
      type: "component",
      icon:
        findRemoteItem("Spatula")?.icon ||
        `${ITEM_ICON_BASE}spatula.png`,
    },
    {
      id: "frying_pan",
      name: "Chảo Vàng",
      english: "Frying Pan",
      type: "component",
      icon:
        findRemoteItem("Frying Pan")?.icon ||
        `${ITEM_ICON_BASE}frying_pan.png`,
    },
  ];

  // Chỉ giữ đúng các Artifact đang có trong TFT Set 18 / Patch 18.3.
  // CommunityDragon chứa cả item legacy của nhiều mùa cũ, nên KHÔNG lấy
  // toàn bộ tftData.artifacts trực tiếp.
  const CURRENT_SET18_ARTIFACTS = new Set([
    "Aegis of Dawn",
    "Aegis of Dusk",
    "Blighting Jewel",
    "Dawncore",
    "Eternal Pact",
    "Fishbones",
    "Flickerblades",
    "Forbidden Idol",
    "Gambler's Blade",
    "Gold Collector",
    "Hellfire Hatchet",
    "Horizon Focus",
    "Hullcrusher",
    "Infinity Force",
    "Lich Bane",
    "Lightshield Crest",
    "Luden's Tempest",
    "Manazane",
    "Mittens",
    "Mogul'sMail",
    "Rapid Firecannon",
    "Seeker's Armguard",
    "Silvermere Dawn",
    "Statikk Shiv",
    "Talisman of Ascension",
    "The Indomitable",
    "Titanic Hydra",
    "Unending Despair",
    "Void Gauntlet",
    "Wit's End",
    "Zhonya's Paradox",
  ]);

  const CRAFTABLE_EMBLEMS = new Set([
    "Blackthorn Emblem",
    "Blossom Emblem",
    "Brawler Emblem",
    "Elderwood Emblem",
    "Executioner Emblem",
    "Fae Emblem",
    "Hunter Emblem",
    "Inferno Emblem",
    "Invoker Emblem",
    "Lunar Emblem",
    "Primal Emblem",
    "Rapidfire Emblem",
    "Ravager Emblem",
    "Spellweaver Emblem",
    "Sprykin Emblem",
    "Vanguard Emblem",
  ]);

  const RADIANT_ITEMS = new Set([
    "Radiant Adaptive Helm",
    "Radiant Archangel's Staff",
    "Radiant Blue Buff",
    "Radiant Bramble Vest",
    "Radiant Bloodthirster",
    "Radiant Crownguard",
    "Radiant Deathblade",
    "Radiant Dragon's Claw",
    "Radiant Edge of Night",
    "Radiant Evenshroud",
    "Radiant Gargoyle Stoneplate",
    "Radiant Giant Slayer",
    "Radiant Guinsoo's Rageblade",
    "Radiant Hand of Justice",
    "Radiant Hextech Gunblade",
    "Radiant Infinity Edge",
    "Radiant Ionic Spark",
    "Radiant Jeweled Gauntlet",
    "Radiant Kraken's Fury",
    "Radiant Last Whisper",
    "Radiant Morellonomicon",
    "Radiant Nashor's Tooth",
    "Radiant Protector's Vow",
    "Radiant Quicksilver",
    "Radiant Rabadon's Deathcap",
    "Radiant Red Buff",
    "Radiant Spear of Shojin",
    "Radiant Spirit Visage",
    "Radiant Steadfast Heart",
    "Radiant Sterak's Gage",
    "Radiant Striker's Flail",
    "Radiant Sunfire Cape",
    "Radiant Thief's Gloves",
    "Radiant Titan's Resolve",
    "Radiant Void Staff",
    "Radiant Warmog's Armor",
  ]);

  const getRemoteItemsByNames = (source, names) => {
    if (!tftData) return [];

    const normalizedSource = Array.isArray(source) ? source : [];
    const sourceItems = normalizedSource.map(normalizeRemoteItem);
    const sourceByName = new Map(
      sourceItems.map((item) => [item.english, item])
    );

    // Fallback qua toàn bộ Set 18 item list giúp tránh trường hợp
    // CommunityDragon phân loại một item vào nhóm khác.
    const allItems = Array.isArray(tftData.items)
      ? tftData.items.map(normalizeRemoteItem)
      : [];
    const allByName = new Map(
      allItems.map((item) => [item.english, item])
    );

    return Array.from(names)
      .map((name) => sourceByName.get(name) || allByName.get(name))
      .filter(Boolean);
  };

  const remoteArtifacts = getRemoteItemsByNames(
    tftData?.artifacts,
    CURRENT_SET18_ARTIFACTS
  );

  const remoteEmblems = getRemoteItemsByNames(
    tftData?.emblems,
    CRAFTABLE_EMBLEMS
  );

  const remoteRadiants = getRemoteItemsByNames(
    tftData?.radiantItems,
    RADIANT_ITEMS
  );

  const COMPONENT_ITEM_NAMES = new Set([
    "B.F. Sword",
    "Recurve Bow",
    "Needlessly Large Rod",
    "Tear of the Goddess",
    "Chain Vest",
    "Negatron Cloak",
    "Giant's Belt",
    "Sparring Gloves",
  ]);

  const remoteStandardItems = (Array.isArray(tftData?.normalItems) ? tftData.normalItems : [])
    .filter((item) => {
      const name = String(item?.englishName || item?.name || "").trim();
      const composition = Array.isArray(item?.composition) ? item.composition : [];
      const isComponent = COMPONENT_ITEM_NAMES.has(name);
      const isCompleted = composition.length >= 2;

      return (
        name &&
        !/(debug|test|dummy|placeholder|internal|training)/i.test(name) &&
        (isComponent || isCompleted)
      );
    })
    .map(normalizeRemoteItem);

  const itemMap = new Map();
  [
    ...specialComponents,
    ...remoteStandardItems,
    ...baseItems,
    ...remoteArtifacts,
    ...remoteEmblems,
    ...remoteRadiants,
  ].forEach((item) => {
    const key = String(
      item?.english || item?.englishName || item?.name || item?.id || ""
    )
      .trim()
      .toLowerCase();

    if (!key) return;

    const existing = itemMap.get(key);

    // Prefer the live CommunityDragon object when it has a canonical URL.
    if (
      !existing ||
      (
        String(item?.icon || "").startsWith("http") &&
        !String(existing?.icon || "").startsWith("http")
      )
    ) {
      itemMap.set(key, item);
    }
  });

  const unifiedItems = Array.from(itemMap.values());

  const filteredItems = unifiedItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchItem.toLowerCase()) ||
      item.english.toLowerCase().includes(searchItem.toLowerCase());

    const matchesType =
      itemType === "all" || item.type === itemType;

    return matchesSearch && matchesType;
  });


  const filteredAugments = liveAugments.filter((augment) => {
    const query = searchAugment.toLowerCase();

    const matchesSearch =
      augment.name.toLowerCase().includes(query) ||
      augment.english.toLowerCase().includes(query) ||
      augment.category.toLowerCase().includes(query);

    const matchesTier =
      augmentTier === "all" ||
      augment.tier === augmentTier;

    return matchesSearch && matchesTier;
  });


  const filteredChampions = CHAMPIONS.filter((champion) => {
    const query = searchChampion.toLowerCase().trim();

    const matchesSearch =
      champion.name.toLowerCase().includes(query) ||
      champion.traits.some((trait) =>
        trait.toLowerCase().includes(query)
      );

    const matchesCost =
      championCost === "all" ||
      champion.cost === Number(championCost);

    return matchesSearch && matchesCost;
  });


  // Phân loại vị trí theo vai trò thực chiến thay vì chỉ nhìn Tộc/Hệ.
  const getChampionPositionRole = (champion) => {
    const explicit = CHAMPION_POSITION_PROFILE[champion?.id];
    if (explicit) return explicit;

    const traits = new Set(champion?.traits || []);

    if (
      ["Defender", "Juggernaut", "Vanguard"].some((trait) =>
        traits.has(trait)
      )
    ) {
      return "tank";
    }

    if (traits.has("Brawler") && !traits.has("Rapidfire")) {
      return "tank";
    }

    if (traits.has("Rapidfire") || traits.has("Hunter")) {
      return "carry";
    }

    if (traits.has("Spellweaver") && !traits.has("Defender")) {
      return "carry";
    }

    if (traits.has("Ravager") || traits.has("Adaptor")) {
      return "melee";
    }

    return "utility";
  };

  // Tìm ô chiến thuật phù hợp cho một tướng mới.
  const getAutoPlacementIndex = (currentBoard, champion) => {
    const occupied = new Set(
      currentBoard
        .map((unit, index) => (unit ? index : null))
        .filter((index) => index !== null)
    );

    if (occupied.size >= 28) return -1;

    const role = getChampionPositionRole(champion);
    const row = STRATEGIC_ROW_BY_ROLE[role];
    const columns = STRATEGIC_COLUMN_ORDERS[role];

    for (const column of columns) {
      const index = row * 7 + column;
      if (!occupied.has(index)) return index;
    }

    // Nếu hàng ưu tiên đã đầy, mở rộng sang hàng kế cận theo vai trò.
    const fallbackRows = {
      tank: [1, 2, 3],
      melee: [0, 2, 3],
      utility: [3, 1, 0],
      carry: [2, 1, 0],
    };

    for (const fallbackRow of fallbackRows[role]) {
      for (const column of columns) {
        const index = fallbackRow * 7 + column;
        if (!occupied.has(index)) return index;
      }
    }

    return -1;
  };

  // Sắp xếp lại toàn bộ đội hình theo cấu trúc: Đỡ đòn → Cận chiến →
  // Tiện ích → Carry. Không thay đổi tướng hay số sao.
  const getStrategicBoard = (units, inventory = selectedItems) => {
    const groups = {
      tank: [],
      melee: [],
      utility: [],
      carry: [],
    };

    units.filter(Boolean).forEach((unit) => {
      const role = getChampionPositionRole(unit);
      groups[role].push(unit);
    });

    // Trong cùng một vai trò, tướng đang nhận nhiều trang bị phù hợp được
    // ưu tiên vị trí chiến thuật tốt hơn; sau đó mới xét giá vàng.
    const previewAssignments = buildItemAssignments(units, inventory);
    const itemPriority = (unit) => previewAssignments[unit.instanceId]?.length || 0;

    groups.tank.sort((a, b) =>
      itemPriority(b) - itemPriority(a) || b.cost - a.cost
    );
    groups.melee.sort((a, b) =>
      itemPriority(b) - itemPriority(a) || b.cost - a.cost
    );
    groups.utility.sort((a, b) =>
      itemPriority(b) - itemPriority(a) || b.cost - a.cost
    );
    groups.carry.sort((a, b) =>
      itemPriority(b) - itemPriority(a) || b.cost - a.cost
    );

    const next = Array(28).fill(null);

    Object.entries(groups).forEach(([role, roleUnits]) => {
      const row = STRATEGIC_ROW_BY_ROLE[role];
      const columns = STRATEGIC_COLUMN_ORDERS[role];

      roleUnits.forEach((unit, index) => {
        let targetIndex =
          index < columns.length ? row * 7 + columns[index] : -1;

        // Nếu hàng chính đã đầy hoặc vai trò có hơn 7 tướng, tìm hàng dự phòng.
        if (targetIndex < 0 || next[targetIndex]) {
          const fallbackRows = {
            tank: [1, 2, 3],
            melee: [0, 2, 3],
            utility: [3, 1, 0],
            carry: [2, 1, 0],
          };

          targetIndex = -1;
          for (const fallbackRow of fallbackRows[role]) {
            const candidate = columns
              .map((column) => fallbackRow * 7 + column)
              .find((cell) => !next[cell]);
            if (candidate !== undefined) {
              targetIndex = candidate;
              break;
            }
          }
        }

        if (targetIndex >= 0) next[targetIndex] = unit;
      });
    });

    return next;
  };

  const addChampionToBoard = (champion) => {
    setBoard((current) => {
      if (current.filter(Boolean).length >= 28) {
        return current;
      }

      const index = getAutoPlacementIndex(current, champion);
      if (index < 0) return current;

      const next = [...current];
      next[index] = {
        ...champion,
        instanceId: `${Date.now()}-${index}`,
        stars: 1,
      };

      return getStrategicBoard(next, selectedItems);
    });
  };

  /* =========================================================
   SHOP ACTIONS
   ========================================================= */

const setShopChampion = (slotIndex, champion) => {
  setShop((current) => {
    const next = [...current];

    next[slotIndex] = {
      ...champion,
      shopInstanceId: `${Date.now()}-${slotIndex}`,
    };

    return next;
  });

  setShopPickerSlot(null);
  setShowChampions(false);
};

const clearShopSlot = (slotIndex) => {
  setShop((current) => {
    const next = [...current];
    next[slotIndex] = null;
    return next;
  });
};

const clearShop = () => {
  setShop(Array(5).fill(null));
};

/* =========================================================
   SHOP INTELLIGENCE ENGINE
   ========================================================= */

const buildShopAnalysis = ({
  shop,
  board,
  boardTraits,
  hp,
  gold,
  level,
  stage,
}) => {
  const boardUnits = board.filter(Boolean);

  const normalized = (value) =>
    String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

  const countBoardCopies = (championId) =>
    boardUnits.filter(
      (unit) => normalized(unit.id) === normalized(championId)
    ).length;

  const getBoardStars = (championId) => {
    const units = boardUnits.filter(
      (unit) => normalized(unit.id) === normalized(championId)
    );

    if (!units.length) return 0;

    return Math.max(
      ...units.map((unit) => Number(unit.stars || 1))
    );
  };

  const activeTraitNames = new Set(
    boardTraits
      .filter((trait) => trait.active)
      .map((trait) => normalized(trait.name))
  );

  const nearTraitNames = new Set(
    boardTraits
      .filter(
        (trait) =>
          trait.nextBreakpoint &&
          trait.nextBreakpoint - trait.count <= 1
      )
      .map((trait) => normalized(trait.name))
  );

  const analyzeChampion = (champion) => {
    if (!champion) return null;

    const copies = countBoardCopies(champion.id);
    const currentStars = getBoardStars(champion.id);

    const championTraits = (champion.traits || []).map(normalized);

    const matchingActiveTraits = championTraits.filter((trait) =>
      activeTraitNames.has(trait)
    ).length;

    const matchingNearTraits = championTraits.filter((trait) =>
      nearTraitNames.has(trait)
    ).length;

    const role = getChampionPositionRoleStatic(champion);

    let score = 0;
    const reasons = [];

    /* -----------------------------------------
       STAR-UP VALUE
       ----------------------------------------- */

    if (currentStars === 1 && copies >= 1) {
      score += 55;
      reasons.push(`Đang có ${copies} bản trên bàn`);
    }

    if (currentStars === 2) {
      score += 75;
      reasons.push("Đang ở 2★ và có thể hướng tới 3★");
    }

    if (copies >= 2) {
      score += 35;
      reasons.push("Có nhiều bản trùng để hoàn thiện nâng sao");
    }

    /* -----------------------------------------
       TRAIT SYNERGY
       ----------------------------------------- */

    if (matchingActiveTraits > 0) {
      score += matchingActiveTraits * 18;
      reasons.push(
        `Khớp ${matchingActiveTraits} Tộc/Hệ đang kích hoạt`
      );
    }

    if (matchingNearTraits > 0) {
      score += matchingNearTraits * 24;
      reasons.push(
        `Có thể hỗ trợ breakpoint Tộc/Hệ sắp đạt`
      );
    }

    /* -----------------------------------------
       ROLE VALUE
       ----------------------------------------- */

    const tanks = boardUnits.filter(
      (unit) => getChampionPositionRoleStatic(unit) === "tank"
    );

    const carries = boardUnits.filter(
      (unit) => getChampionPositionRoleStatic(unit) === "carry"
    );

    if (role === "tank" && tanks.length === 0) {
      score += 50;
      reasons.push("Bổ sung tuyến trước đang thiếu");
    }

    if (role === "carry" && carries.length === 0) {
      score += 45;
      reasons.push("Bổ sung nguồn sát thương chính");
    }

    if (role === "tank" && tanks.length > 0) {
      score += 8;
    }

    if (role === "carry" && carries.length > 0) {
      score += 10;
    }

    /* -----------------------------------------
       COST
       ----------------------------------------- */

    if (champion.cost >= 4) {
      score += 10;
    }

    if (champion.cost === 5) {
      score += 15;
    }

    /* -----------------------------------------
       BOARD CAPACITY
       ----------------------------------------- */

    if (boardUnits.length < Number(level)) {
      if (role === "tank" || role === "carry") {
        score += 15;
        reasons.push("Có thể lấp slot còn thiếu trên board");
      }
    }

    /* -----------------------------------------
       DECISION
       ----------------------------------------- */

    let action = "skip";
    let label = "BỎ QUA";
    let tone = "neutral";

    if (score >= 75) {
      action = "buy";
      label = "MUA";
      tone = "positive";
    } else if (score >= 35) {
      action = "consider";
      label = "CÂN NHẮC";
      tone = "warning";
    }

    if (!reasons.length) {
      reasons.push("Chưa có synergy hoặc mục tiêu nâng sao rõ ràng");
    }

    return {
      champion,
      score,
      action,
      label,
      tone,
      role,
      copies,
      currentStars,
      reasons: reasons.slice(0, 3),
    };
  };

  const analyses = shop
    .filter(Boolean)
    .map(analyzeChampion)
    .sort((a, b) => b.score - a.score);

  const buyTargets = analyses
    .filter((entry) => entry.action === "buy")
    .slice(0, 3);

  const strongestTarget =
    analyses.length > 0 ? analyses[0] : null;

  /* -----------------------------------------
     ROLL PLAN
     ----------------------------------------- */

  const numericHp = Math.max(0, Number(hp) || 0);
  const numericGold = Math.max(0, Number(gold) || 0);
  const numericLevel = Math.max(1, Number(level) || 1);
  const stageNumber =
    Number(String(stage).split("-")[0]) || 2;

  const upgradeTargets = boardUnits
    .filter((unit) => Number(unit.stars || 1) < 3)
    .sort(
      (a, b) =>
        Number(b.stars || 1) - Number(a.stars || 1) ||
        (b.cost || 0) - (a.cost || 0)
    )
    .slice(0, 3);

  let rollPlan = {
    level: "NONE",
    label: "KHÔNG ROLL",
    detail:
      "Giữ vàng và chờ shop có mục tiêu rõ ràng hơn.",
    tone: "positive",
    range: "0 vàng",
  };

  if (numericHp <= 25) {
    rollPlan = {
      level: "STABILIZE",
      label: "ROLL ỔN ĐỊNH",
      detail:
        "Máu nguy cấp: ưu tiên chuyển vàng thành sức mạnh và nâng sao.",
      tone: "danger",
      range:
        numericGold >= 30
          ? "20–30+ vàng tùy board"
          : `${numericGold} vàng có thể sử dụng`,
    };
  } else if (
    numericHp <= 40 &&
    (upgradeTargets.length >= 2 ||
      analyses.some((entry) => entry.action === "buy"))
  ) {
    rollPlan = {
      level: "MEDIUM",
      label: "ROLL VỪA",
      detail:
        "Máu thấp và đã có mục tiêu nâng sao/synergy rõ.",
      tone: "warning",
      range:
        numericGold >= 30
          ? "10–20 vàng"
          : `${Math.max(0, numericGold - 10)} vàng`,
    };
  } else if (
    analyses.some((entry) => entry.action === "buy") &&
    numericGold >= 30
  ) {
    rollPlan = {
      level: "LIGHT",
      label: "ROLL NHẸ",
      detail:
        "Có mục tiêu trong shop nhưng chưa cần phá economy sâu.",
      tone: "warning",
      range: "10–20 vàng",
    };
  } else if (
    stageNumber >= 4 &&
    upgradeTargets.length >= 2 &&
    numericGold >= 30
  ) {
    rollPlan = {
      level: "LIGHT",
      label: "ROLL CÓ MỤC TIÊU",
      detail:
        "Đang ở giai đoạn giữa/cuối và còn nhiều unit chưa nâng sao.",
      tone: "warning",
      range: "10–20 vàng",
    };
  }

  const targetNames = [
    ...buyTargets.map((entry) => entry.champion.name),
    ...upgradeTargets.map((unit) => unit.name),
  ];

  return {
    analyses,
    buyTargets,
    strongestTarget,
    rollPlan,
    upgradeTargets,
    targetNames: [...new Set(targetNames)].slice(0, 4),
  };
};

  const autoArrangeBoard = () => {
    setBoard((current) => getStrategicBoard(current, selectedItems));
  };


  const removeChampion = (index) => {
    setBoard((current) => {
      const next = [...current];
      next[index] = null;
      return next;
    });
  };


  const cycleStars = (index) => {
    setBoard((current) => {
      const next = [...current];
      const unit = next[index];

      if (!unit) {
        return current;
      }

      next[index] = {
        ...unit,
        stars: unit.stars >= 3 ? 1 : unit.stars + 1,
      };

      return next;
    });
  };


  const toggleItem = (item) => {
    const exists = selectedItems.some((x) => x.id === item.id);
    const nextItems = exists
      ? selectedItems.filter((x) => x.id !== item.id)
      : [...selectedItems, item];

    setSelectedItems(nextItems);

    // Khi thêm / bỏ trang bị, sắp xếp lại nhẹ để tướng mang item chính
    // nằm ở vị trí hợp lý trong tuyến của nó.
    setBoard((currentBoard) =>
      getStrategicBoard(currentBoard, nextItems)
    );
  };


  const removeItem = (itemId) => {
    setSelectedItems((current) => {
      const nextItems = current.filter((x) => x.id !== itemId);
      setBoard((currentBoard) =>
        getStrategicBoard(currentBoard, nextItems)
      );
      return nextItems;
    });
  };


  const selectAugment = (augment) => {
    setSelectedAugment(augment);
  };

  const itemAssignments = buildItemAssignments(board, selectedItems);

  const numericGold = Math.max(0, Number(gold) || 0);
  const numericHp = Math.max(0, Number(hp) || 0);
  const numericLevel = Math.max(1, Number(level) || 1);
  const numericStreak = Number(streak) || 0;
  const boardCount = board.filter(Boolean).length;
  const currentInterest = Math.min(5, Math.floor(numericGold / 10));
  const goldTo50 = Math.max(0, 50 - numericGold);

  const stageNumber = Number(String(stage).split("-")[0]) || 2;
  const stageRound = Number(String(stage).split("-")[1]) || 1;

  // Đây là lớp hướng dẫn kinh tế, không tự thay đổi vàng/XP của người chơi.
  // Coach chỉ đưa ra trạng thái và hành động đề xuất dựa trên dữ liệu đã nhập.
  const economyProfile = (() => {
    let risk = "ổn định";
    let riskClass = "stable";

    if (numericHp <= 25) {
      risk = "nguy cấp";
      riskClass = "critical";
    } else if (numericHp <= 40) {
      risk = "rủi ro cao";
      riskClass = "danger";
    } else if (numericHp <= 60) {
      risk = "cần ổn định";
      riskClass = "warning";
    }

    let economyAction = "Duy trì kinh tế";
    let economyDetail = "Ưu tiên giữ vàng và không tiêu quá mức khi chưa có áp lực lớn.";

    if (numericHp <= 40) {
      economyAction = "Ưu tiên ổn định bàn cờ";
      economyDetail = "Máu thấp nên giảm ưu tiên tích vàng; dùng tài nguyên để tăng sức mạnh đội hình khi cần.";
    } else if (numericStreak >= 3 && numericHp > 55) {
      economyAction = "Bảo toàn chuỗi";
      economyDetail = "Đang có chuỗi thắng/thua mạnh; cân nhắc giữ nhịp kinh tế nhưng không để bàn cờ quá yếu.";
    } else if (numericGold >= 50) {
      economyAction = "Giữ mốc 50 vàng";
      economyDetail = "Đã đạt mức vàng tạo đủ 5 bậc lãi; chỉ phá mốc khi đổi lấy sức mạnh hoặc nhịp lên cấp rõ ràng.";
    } else if (numericGold >= 30) {
      economyAction = "Tích vàng lên 50";
      economyDetail = `Đang có ${numericGold} vàng, còn ${goldTo50} vàng để đạt mốc 50.`;
    } else if (stageNumber <= 2 && numericHp > 60) {
      economyAction = "Ưu tiên tích kinh tế";
      economyDetail = "Giai đoạn đầu và Máu còn tốt; hạn chế roll sâu nếu bàn cờ chưa cần ổn định.";
    } else {
      economyAction = "Cân bằng sức mạnh và kinh tế";
      economyDetail = "Giữ lượng vàng hợp lý nhưng sẵn sàng chi tài nguyên nếu bàn cờ đang yếu.";
    }

    const targetLevelByStage =
      stageNumber <= 2 ? 5 :
      stageNumber === 3 ? 6 :
      stageNumber === 4 ? 7 :
      stageNumber === 5 ? 8 : 9;

    let levelAction = `Cấp hiện tại ${numericLevel}`;
    let levelDetail = `Mốc tham khảo của giai đoạn ${stage} là khoảng cấp ${targetLevelByStage}.`;

    if (numericLevel < targetLevelByStage) {
      levelAction = "Cân nhắc lên cấp";
      levelDetail = `Đang thấp hơn mốc tham khảo cấp ${targetLevelByStage}; chỉ lên cấp khi lượng vàng và sức mạnh bàn cờ cho phép.`;
    } else if (numericLevel > targetLevelByStage) {
      levelAction = "Không cần ép cấp";
      levelDetail = "Đã ở trên mốc tham khảo; ưu tiên hoàn thiện đội hình hoặc tích kinh tế tùy tình trạng trận.";
    }

    const boardAction =
      boardCount < numericLevel
        ? `Bổ sung tướng (${numericLevel})`
        : boardCount === numericLevel
          ? "Đủ quân theo cấp"
          : "Kiểm tra giới hạn bàn cờ";

    return {
      risk,
      riskClass,
      economyAction,
      economyDetail,
      targetLevelByStage,
      levelAction,
      levelDetail,
      boardAction,
    };
  })();

  const assignedItemCount = Object.values(itemAssignments).reduce(
    (total, items) => total + items.length,
    0
  );

  const coachDecision = buildCoachDecision({
    hp,
    gold,
    level,
    stage,
    roundType,
    streak,
    xp,
    board,
    selectedItems,
    selectedAugment,
    itemAssignments,
    boardTraits,
  });

  const shopAnalysis = buildShopAnalysis({
  shop,
  board,
  boardTraits,
  hp,
  gold,
  level,
  stage,
});

  return (
    <div className="coach-page">

      {/* HEADER */}

      <div className="coach-header">

        <div>
          <div className="badge">
            MATCH COACH
          </div>

          <h2>
            Trung tâm quyết định trận đấu
          </h2>

          <p>
            Nhập trạng thái trận đấu hiện tại để Coach phân tích.
          </p>
        </div>

        <div className="round-box">
          <span>VÒNG</span>
          <strong>{stage}</strong>
        </div>


      </div>


      {/* MAIN GRID */}

      <div className="coach-grid">

        {/* INPUT PANEL */}

        <section className="input-panel">

          <h3>
            Trạng thái trận đấu hiện tại
          </h3>


          {/* BASIC STATS */}

          <div className="stat-grid">

            <div className="input-card">

              <Shield size={18} />

              <label>
                Máu
              </label>

              <input
                type="number"
                value={hp}
                min="1"
                max="100"
                onChange={(e) =>
                  setHp(e.target.value)
                }
              />

            </div>


            <div className="input-card">

              <Coins size={18} />

              <label>
                Vàng
              </label>

              <input
                type="number"
                value={gold}
                min="0"
                onChange={(e) =>
                  setGold(e.target.value)
                }
              />

            </div>


            <div className="input-card">

              <Users size={18} />

              <label>
                Cấp độ
              </label>

              <input
                type="number"
                value={level}
                min="1"
                max="11"
                onChange={(e) =>
                  setLevel(e.target.value)
                }
              />

            </div>

          </div>


          {/* GAME CONTEXT */}

          <div className="decision-section">

            <h3>
              Bối cảnh trận đấu
            </h3>

            <div className="stat-grid game-context-grid">

              <div className="input-card">
                <Swords size={18} />
                <label>Vòng đấu</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                >
                  {[
                    "2-1", "2-2", "2-3", "2-5",
                    "3-1", "3-2", "3-3", "3-5",
                    "4-1", "4-2", "4-3", "4-5",
                    "5-1", "5-2", "5-3", "5-5",
                    "6-1", "6-2", "6-3", "6-5",
                  ].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-card">
                <Users size={18} />
                <label>Loại vòng</label>
                <select
                  value={roundType}
                  onChange={(e) => setRoundType(e.target.value)}
                >
                  <option value="PvP">PvP</option>
                  <option value="PvE">PvE</option>
                  <option value="Carousel">Đi chợ</option>
                  <option value="Augment">Chọn Nâng Cấp</option>
                </select>
              </div>

              <div className="input-card">
                <Coins size={18} />
                <label>Chuỗi thắng/thua</label>
                <input
                  type="number"
                  value={streak}
                  min={-10}
                  max={10}
                  onChange={(e) => setStreak(e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="input-card">
                <Sparkles size={18} />
                <label>XP hiện tại</label>
                <input
                  type="number"
                  value={xp}
                  min={0}
                  onChange={(e) => setXp(e.target.value)}
                  placeholder="0"
                />
              </div>

            </div>

          </div>


          {/* AVAILABLE INFORMATION */}

          <div className="decision-section">

            <h3>
              Thông tin hiện có
            </h3>


            {/* ITEMS */}

            <div className="decision-row">

              <Package size={18} />

              <div className="decision-content">

                <span>
                  Trang bị
                </span>

                {selectedItems.length > 0 && (
                  <small>
                    {selectedItems.length} đã thêm · {assignedItemCount} đã gán
                  </small>
                )}

              </div>

              <button
                onClick={() => setShowItems(true)}
              >
                <Plus size={13} />
                Thêm trang bị
              </button>

            </div>


            {/* AUGMENT */}

            <div className="decision-row">

              <Sparkles size={18} />

              <div className="decision-content">

                <span>
                  Nâng cấp
                </span>

                {selectedAugment && (
                  <small>
                    {selectedAugment.name}
                  </small>
                )}

              </div>

              <button
                onClick={() => setShowAugments(true)}
              >
                <Plus size={13} />
                {selectedAugment
                  ? "Đổi nâng cấp"
                  : "Thêm nâng cấp"}
              </button>

            </div>


            {/* BOARD */}

            <div className="decision-row">

              <Users size={18} />

              <div className="decision-content">

                <span>
                  Bàn cờ
                </span>

                {board.filter(Boolean).length > 0 && (
                  <small>
                    {board.filter(Boolean).length} / 28 ô
                  </small>
                )}

              </div>

              <button
                onClick={() => setShowChampions(true)}
              >
                <Plus size={13} />
                Thêm tướng
              </button>

            </div>

            {/* TỘC / HỆ */}
            <div className="decision-row">

              <Shield size={18} />

              <div className="decision-content">
                <span>Tộc / Hệ</span>
                <small>
                  {boardTraits.filter((trait) => trait.active).length > 0
                    ? `${boardTraits.filter((trait) => trait.active).length} đang kích hoạt`
                    : "Chưa kích hoạt"}
                </small>
              </div>

            </div>

          </div>


          {/* BOARD PREVIEW */}

          <div className="board-section">

            <div className="selected-title">
              Sắp xếp đội hình
            </div>

            <div className="board-toolbar">

              <span>
                {board.filter(Boolean).length} / 28 tướng
              </span>

              <div className="board-toolbar-actions">

                <button
                  onClick={() => setShowChampions(true)}
                >
                  <Plus size={12} />
                  Thêm tướng
                </button>

                {board.some(Boolean) && (
                  <>
                    <button
                      onClick={autoArrangeBoard}
                      title="Tự động xếp Đỡ đòn → Cận chiến → Tiện ích → Carry"
                    >
                      Sắp xếp chiến thuật
                    </button>
                    <button
                      className="board-clear"
                      onClick={() => setBoard(Array(28).fill(null))}
                    >
                      Xóa bàn cờ
                    </button>
                  </>
                )}

              </div>

            </div>

            <div className="tft-board">

              {BOARD_CELLS.map((cellIndex) => {
                const unit = board[cellIndex];

                return (
                  <button
                    key={cellIndex}
                    className={`board-cell ${unit ? "occupied" : ""}`}
                    onClick={() => {
                      if (unit) {
                        cycleStars(cellIndex);
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      if (unit) {
                        removeChampion(cellIndex);
                      }
                    }}
                    title={
                      unit
                        ? `${unit.name} · Bấm để đổi sao · Chuột phải để xóa`
                        : "Ô trống · Tướng sẽ tự sắp xếp vào vị trí phù hợp"
                    }
                  >
                    {unit ? (
                      <>
                        <div className={`board-unit cost-${unit.cost}`}>
                          <div className="board-unit-art">
                            <img
                              src={getChampionIcon(unit)}
                              alt={unit.name}
                              className="board-unit-image"
                              onError={(e) =>
                                handleChampionImageError(e, unit)
                              }
                            />

                            <div
                              className="board-unit-fallback"
                              style={{ display: "none" }}
                            >
                              {unit.name.charAt(0)}
                            </div>
                          </div>

                          <div className="board-stars">
                            {"★".repeat(unit.stars)}
                          </div>

                          <div className="board-unit-name">
                            {unit.name}
                          </div>

                          <div className="board-cost">
                            {unit.cost}
                          </div>

                          {itemAssignments[unit.instanceId]?.length > 0 && (
                            <div className="board-unit-items">
                              {itemAssignments[unit.instanceId].slice(0, 3).map((item) => (
                                <div
                                  className="board-unit-item"
                                  key={item.id}
                                  title={`${item.name} → ${unit.name}`}
                                >
                                  <img
                                    src={getUnifiedItemIcon(item)}
                                    alt={item.name}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <Plus size={13} />
                    )}
                  </button>
                );
              })}

            </div>


          </div>

          {board.some(Boolean) && selectedItems.length > 0 && (
            <div className="item-strategy-panel">
              <div className="item-strategy-header">
                <div>
                  <div className="selected-title">Gợi ý gán trang bị</div>
                  <p>
                    Coach tự ghép logic theo vai trò, sát thương và tuyến đứng; mỗi tướng tối đa 3 trang bị.
                  </p>
                </div>
                <span className="item-strategy-badge">{assignedItemCount}/{selectedItems.length}</span>
              </div>

              <div className="item-strategy-list">
                {board.filter(Boolean).map((unit) => {
                  const assigned = itemAssignments[unit.instanceId] || [];
                  if (!assigned.length) return null;

                  return (
                    <div className="item-strategy-row" key={unit.instanceId}>
                      <div className="item-strategy-champion">
                        <img src={getChampionIcon(unit)} alt={unit.name} />
                        <div>
                          <strong>{unit.name}</strong>
                          <span>{getChampionPositionRole(unit) === "tank" ? "Tuyến trước" : getChampionPositionRole(unit) === "melee" ? "Cận chiến" : getChampionPositionRole(unit) === "carry" ? "Carry" : "Tiện ích"}</span>
                        </div>
                      </div>

                      <div className="item-strategy-items">
                        {assigned.map((item) => (
                          <div className="item-strategy-chip" key={item.id}>
                            <img src={getUnifiedItemIcon(item)} alt={item.name} />
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* TỘC / HỆ */}
          <div className="trait-panel">

            <div className="trait-panel-header">
              <div>
                <div className="selected-title">Tộc / Hệ</div>
                <p>
                  Tự động tính từ các tướng đang có trên bàn cờ.
                </p>
              </div>

              <span className="trait-count-badge">
                {boardTraits.filter((trait) => trait.active).length} kích hoạt
              </span>
            </div>

            {boardTraits.length === 0 ? (
              <div className="trait-empty">
                Thêm tướng vào bàn cờ để xem Tộc / Hệ.
              </div>
            ) : (
              <div className="trait-list">
                {boardTraits.map((trait) => (
                  <div
                    key={trait.key}
                    className={`trait-row ${trait.active ? "active" : "inactive"}`}
                  >
                    <div className="trait-main">
                      <div className="trait-name">
                        {trait.name}
                      </div>
                      <div className="trait-progress">
                        <span className="trait-current">
                          {trait.count}
                        </span>
                        {trait.nextBreakpoint ? (
                          <span>
                            / {trait.nextBreakpoint}
                          </span>
                        ) : (
                          <span className="trait-maxed">
                            Đã đạt mốc cao nhất
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="trait-breakpoints">
                      {trait.breakpoints.length > 0 ? (
                        trait.breakpoints.map((point) => (
                          <span
                            key={point}
                            className={point <= trait.count ? "reached" : ""}
                          >
                            {point}
                          </span>
                        ))
                      ) : (
                        <span className="unique-trait">Độc nhất</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>


          {/* SELECTED ITEMS */}

          {selectedItems.length > 0 && (

            <div className="selected-items">

              <div className="selected-title">
                Trang bị đang có
              </div>

              <div className="selected-list">

                {selectedItems.map((item) => (

                  <div
                    className="selected-item"
                    key={item.id}
                  >

                    <img
                      src={getUnifiedItemIcon(item)}
                      alt={item.name}
                    />

                    <span>
                      {item.name}
                    </span>

                    <button
                      onClick={() =>
                        removeItem(item.id)
                      }
                    >
                      <X size={12} />
                    </button>

                  </div>

                ))}

              </div>

            </div>

          )}


          {/* SELECTED AUGMENT */}

          {selectedAugment && (

            <div className="selected-augment">

              <div className="selected-title">
                Nâng cấp đang chọn
              </div>

              <div className="selected-augment-card">

                <div
                  className={`augment-tier-icon ${selectedAugment.tier}`}
                >
                  {selectedAugment.image ? (
                    <img
                      src={selectedAugment.image}
                      alt={selectedAugment.name}
                      className="augment-illustration"
                      loading="lazy"
                      onError={(event) => handleAugmentImageError(event, selectedAugment)}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
                    />
                  ) : (
                    <Sparkles size={17} />
                  )}
                </div>

                <div className="selected-augment-info">

                  <strong>
                    {selectedAugment.name}
                  </strong>

                  <span>
                    {selectedAugment.category}
                  </span>

                </div>

                <button
                  onClick={() =>
                    setSelectedAugment(null)
                  }
                >
                  <X size={13} />
                </button>

              </div>

            </div>

          )}


          {/* ECONOMY / TEMPO COACH */}

          <div className="economy-panel">

            <div className="economy-header">
              <div>
                <span>ECONOMY & TEMPO</span>
                <h3>Đánh giá kinh tế hiện tại</h3>
              </div>
              <div className={`economy-risk ${economyProfile.riskClass}`}>
                {economyProfile.risk}
              </div>
            </div>

            <div className="economy-metrics">
              <div className="economy-metric">
                <Coins size={16} />
                <span>Vàng</span>
                <strong>{numericGold}</strong>
                <small>Lãi +{currentInterest}/vòng</small>
              </div>

              <div className="economy-metric">
                <HeartPulse size={16} />
                <span>Máu</span>
                <strong>{numericHp}</strong>
                <small>{economyProfile.risk}</small>
              </div>

              <div className="economy-metric">
                <ArrowUpCircle size={16} />
                <span>Cấp</span>
                <strong>{numericLevel}</strong>
                <small>Mốc tham khảo {economyProfile.targetLevelByStage}</small>
              </div>

              <div className="economy-metric">
                <Users size={16} />
                <span>Bàn cờ</span>
                <strong>{boardCount}</strong>
                <small>{economyProfile.boardAction}</small>
              </div>
            </div>

            <div className="economy-plan">
              <div className="economy-plan-main">
                <TrendingUp size={17} />
                <div>
                  <strong>{economyProfile.economyAction}</strong>
                  <p>{economyProfile.economyDetail}</p>
                </div>
              </div>

              <div className="economy-plan-level">
                <ArrowUpCircle size={15} />
                <div>
                  <strong>{economyProfile.levelAction}</strong>
                  <p>{economyProfile.levelDetail}</p>
                </div>
              </div>
            </div>

            {goldTo50 > 0 && numericHp > 40 && (
              <div className="economy-interest">
                <Coins size={14} />
                Còn <strong>{goldTo50} vàng</strong> để đạt mốc 50 vàng và tối đa hóa lãi.
              </div>
            )}

            {numericHp <= 40 && (
              <div className="economy-warning">
                <AlertTriangle size={14} />
                Máu đang thấp: không nên hy sinh sức mạnh bàn cờ chỉ để giữ kinh tế.
              </div>
            )}

          </div>


          {/* CURRENT CONTEXT SUMMARY */}

          <div className="context-summary">
            <div className="context-summary-title">
              Bối cảnh đã nhập
            </div>
            <div className="context-summary-grid">
              <span>Vòng <strong>{stage}</strong></span>
              <span><strong>{roundType}</strong></span>
              <span>Máu <strong>{hp}</strong></span>
              <span>Vàng <strong>{gold}</strong></span>
              <span>Cấp <strong>{level}</strong></span>
              <span>XP <strong>{xp}</strong></span>
              <span>Chuỗi <strong>{Number(streak) > 0 ? `+${streak}` : streak}</strong></span>
              <span>Nâng cấp <strong>{selectedAugment ? selectedAugment.name : "Chưa chọn"}</strong></span>
            </div>
          </div>


          {/* ANALYSE */}

          <button
            className="analyse-button"
            onClick={() => setAnalysisRun(true)}
          >
            <Swords size={18} />
            {analysisRun ? "Cập nhật quyết định của Coach" : "Phân tích trạng thái trận đấu"}
          </button>

        </section>


        {/* ANALYSIS PANEL */}

        <section className="analysis-panel">

          <div className="analysis-header">

            <div>
              <span>COACH DECISION ENGINE</span>
              <h3>{analysisRun ? "Quyết định trận đấu hiện tại" : "Sẵn sàng phân tích"}</h3>
            </div>

            <div className="decision-engine-status">
              <span className="decision-engine-dot"></span>
              Rule-based Coach
            </div>
          </div>

          <div className={`coach-primary-decision ${coachDecision.primaryAction.tone}`}>
            <div className="coach-primary-icon">
              {coachDecision.primaryAction.icon === "stabilize" ? (
                <ShieldCheck size={22} />
              ) : coachDecision.primaryAction.icon === "level" ? (
                <ArrowUpCircle size={22} />
              ) : coachDecision.primaryAction.icon === "board" ? (
                <Users size={22} />
              ) : coachDecision.primaryAction.icon === "greed" ? (
                <TrendingUp size={22} />
              ) : (
                <Target size={22} />
              )}
            </div>
            <div className="coach-primary-content">
              <span>ƯU TIÊN #1</span>
              <strong>{coachDecision.primaryAction.label}</strong>
              <p>{coachDecision.primaryAction.detail}</p>
            </div>
          </div>

          <div className="decision-grid">

            <div className={`decision-card ${coachDecision.economyDecision.tone}`}>
              <div className="decision-card-icon"><Coins size={17} /></div>
              <div>
                <span>KINH TẾ</span>
                <strong>{coachDecision.economyDecision.title}</strong>
                <p>{coachDecision.economyDecision.detail}</p>
              </div>
            </div>

            <div className={`decision-card ${coachDecision.levelDecision.tone}`}>
              <div className="decision-card-icon"><ArrowUpCircle size={17} /></div>
              <div>
                <span>LÊN CẤP</span>
                <strong>{coachDecision.levelDecision.title}</strong>
                <p>{coachDecision.levelDecision.detail}</p>
              </div>
            </div>

            <div className={`decision-card ${coachDecision.rollDecision.tone}`}>
              <div className="decision-card-icon"><RefreshCw size={17} /></div>
              <div>
                <span>ROLL</span>
                <strong>{coachDecision.rollDecision.title}</strong>
                <p>{coachDecision.rollDecision.detail}</p>
              </div>
            </div>

            <div className={`decision-card ${coachDecision.boardDecision.tone}`}>
              <div className="decision-card-icon"><Users size={17} /></div>
              <div>
                <span>BÀN CỜ</span>
                <strong>{coachDecision.boardDecision.title}</strong>
                <p>{coachDecision.boardDecision.detail}</p>
              </div>
            </div>

            <div className={`decision-card ${coachDecision.itemDecision.tone}`}>
              <div className="decision-card-icon"><Package size={17} /></div>
              <div>
                <span>TRANG BỊ</span>
                <strong>{coachDecision.itemDecision.title}</strong>
                <p>{coachDecision.itemDecision.detail}</p>
              </div>
            </div>

            <div className={`decision-card ${coachDecision.traitDecision.tone}`}>
              <div className="decision-card-icon"><Shield size={17} /></div>
              <div>
                <span>TỘC / HỆ</span>
                <strong>{coachDecision.traitDecision.title}</strong>
                <p>{coachDecision.traitDecision.detail}</p>
              </div>
            </div>

          </div>

          <div className="decision-reason-panel">
            <div className="decision-reason-header">
              <div>
                <span>CƠ SỞ QUYẾT ĐỊNH</span>
                <h4>Coach đang nhìn vào</h4>
              </div>
              <span className="decision-engine-badge">
                {coachDecision.meta.boardCount} quân · {coachDecision.meta.gold} vàng · {coachDecision.meta.hp} HP
              </span>
            </div>

            <div className="decision-reason-list">
              {coachDecision.reasons.map((reason, index) => (
                <div key={index} className="decision-reason-item">
                  <Check size={14} />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {coachDecision.warnings.length > 0 && (
            <div className="decision-warning-panel">
              <div className="decision-warning-title">
                <AlertTriangle size={16} />
                CẢNH BÁO
              </div>
              <div className="decision-warning-list">
                {coachDecision.warnings.map((warning, index) => (
                  <div key={index}>{warning}</div>
                ))}
              </div>
            </div>
          )}

          <div className="decision-engine-footer">
            <span>
              Coach hiện dùng luật quyết định từ state đã nhập, board, item, Tộc/Hệ và Nâng cấp.
            </span>
            <span>Không tự động tiêu vàng hoặc thay đổi bàn cờ.</span>
          </div>

        </section>

      </div>



      {/* =====================================================
          ROUND / MATCH STATE
          ===================================================== */}

      <section className="round-tracker-panel">
        <div className="round-tracker-header">
          <div>
            <span className="round-tracker-kicker">MATCH STATE</span>
            <h3>Trạng thái trận đấu</h3>
            <p>
              Xác nhận kết quả round, lưu state hiện tại và chuyển sang round
              tiếp theo. Coach không tự thay đổi HP, vàng hoặc XP.
            </p>
          </div>

          <div className="round-tracker-actions">
            <button
              className="round-tracker-primary"
              onClick={saveCurrentRound}
            >
              <Check size={16} />
              Lưu {stage}
            </button>

            <button
              className="round-tracker-next"
              onClick={advanceToNextRound}
            >
              Sang {getNextStage(stage)}
              <ArrowRight size={16} />
            </button>

            {roundHistory.length > 0 && (
              <button
                className="round-tracker-danger"
                onClick={clearMatchHistory}
              >
                <X size={16} />
                Xóa lịch sử
              </button>
            )}
          </div>
        </div>

        <div className="match-state-control-grid">
          <div className="match-state-stage-card">
            <span>ROUND HIỆN TẠI</span>
            <strong>{stage}</strong>
            <small>{roundType}</small>
            <div className="match-stage-actions">
              <button onClick={goToPreviousRound} title="Về round trước">
                <ArrowLeft size={14} />
              </button>
              <button onClick={advanceToNextRound} title="Sang round sau">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div className="match-result-card">
            <div className="match-result-heading">
              <span>KẾT QUẢ ROUND</span>
              <strong className={`match-result-badge ${getRoundResultTone(roundResult)}`}>
                {getRoundResultLabel(roundResult)}
              </strong>
            </div>
            <div className="match-result-buttons">
              <button
                className={roundResult === "win" ? "active win" : ""}
                onClick={() => setRoundResult("win")}
              >
                <Check size={14} /> Thắng
              </button>
              <button
                className={roundResult === "loss" ? "active loss" : ""}
                onClick={() => setRoundResult("loss")}
              >
                <X size={14} /> Thua
              </button>
              <button
                className={roundResult === "neutral" ? "active neutral" : ""}
                onClick={() => setRoundResult("neutral")}
              >
                <Minus size={14} /> Trung lập
              </button>
            </div>
          </div>

          <div className="match-state-live-card">
            <span>LIVE STATE</span>
            <div>
              <strong>{Number(hp) || 0}</strong>
              <small>HP</small>
            </div>
            <div>
              <strong>{Number(gold) || 0}</strong>
              <small>GOLD</small>
            </div>
            <div>
              <strong>{Number(level) || 1}</strong>
              <small>LEVEL</small>
            </div>
          </div>
        </div>

        <div className="round-tracker-summary">
          <div className="round-tracker-stat">
            <span>ROUND ĐÃ LƯU</span>
            <strong>{matchSummary.total}</strong>
          </div>
          <div className="round-tracker-stat">
            <span>THẮNG</span>
            <strong>{matchSummary.wins}</strong>
          </div>
          <div className="round-tracker-stat">
            <span>THUA</span>
            <strong>{matchSummary.losses}</strong>
          </div>
          <div className="round-tracker-stat">
            <span>HP THAY ĐỔI</span>
            <strong className={matchSummary.hpDelta < 0 ? "stat-negative" : "stat-positive"}>
              {matchSummary.hpDelta > 0 ? "+" : ""}{matchSummary.hpDelta}
            </strong>
          </div>
          <div className="round-tracker-stat">
            <span>GOLD THAY ĐỔI</span>
            <strong className={matchSummary.goldDelta < 0 ? "stat-negative" : "stat-positive"}>
              {matchSummary.goldDelta > 0 ? "+" : ""}{matchSummary.goldDelta}
            </strong>
          </div>
        </div>

        {matchSummary.currentResultStreak > 0 && (
          <div className="match-current-streak">
            <Target size={15} />
            Chuỗi hiện tại: <strong>{matchSummary.currentResultStreak} {matchSummary.currentStreakType === "win" ? "thắng" : "thua"}</strong>
          </div>
        )}

        {roundHistory.length === 0 ? (
          <div className="round-tracker-empty">
            <Target size={18} />
            <div>
              <strong>Chưa có round nào được lưu</strong>
              <p>
                Chọn Thắng / Thua / Trung lập rồi bấm “Lưu {stage}”. Sau đó
                dùng “Sang {getNextStage(stage)}” để tiếp tục trận.
              </p>
            </div>
          </div>
        ) : (
          <div className="round-history-list">
            {[...roundHistory].reverse().map((entry, index, reversed) => {
              const previous = reversed[index + 1];
              const delta = getRoundDelta(entry, previous);
              const result = entry.result || "pending";

              return (
                <div className="round-history-card" key={entry.id}>
                  <div className="round-history-main">
                    <div className="round-history-stage">
                      <span>ROUND</span>
                      <strong>{entry.stage}</strong>
                      <em className={`match-result-badge ${getRoundResultTone(result)}`}>
                        {entry.resultLabel || getRoundResultLabel(result)}
                      </em>
                    </div>

                    <div className="round-history-values">
                      <span>
                        <HeartPulse size={14} />
                        {entry.hp} HP
                      </span>
                      <span>
                        <Coins size={14} />
                        {entry.gold} vàng
                      </span>
                      <span>
                        <Users size={14} />
                        Cấp {entry.level}
                      </span>
                      <span>{entry.board.length} quân</span>
                    </div>
                  </div>

                  {entry.coachDecision && (
                    <div className="round-history-decision">
                      <span>COACH</span>
                      <strong>{entry.coachDecision.primaryAction.label}</strong>
                      <p>{entry.coachDecision.primaryAction.detail}</p>
                    </div>
                  )}

                  {delta && (
                    <div className="round-history-delta">
                      <span className={delta.hp < 0 ? "negative" : "positive"}>
                        HP {delta.hp > 0 ? "+" : ""}{delta.hp}
                      </span>
                      <span className={delta.gold < 0 ? "negative" : "positive"}>
                        Gold {delta.gold > 0 ? "+" : ""}{delta.gold}
                      </span>
                      <span className={delta.level > 0 ? "positive" : ""}>
                        Level {delta.level > 0 ? "+" : ""}{delta.level}
                      </span>
                      <span className={delta.board < 0 ? "negative" : "positive"}>
                        Board {delta.board > 0 ? "+" : ""}{delta.board}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="round-tracker-footer">
          <span>
            Lịch sử được lưu trên trình duyệt hiện tại bằng LocalStorage.
          </span>
          <span>{roundHistory.length}/40 round tối đa · {matchSummary.neutral} round trung lập</span>
        </div>
      </section>

      <PersonalCoach matchId={matchId} roundHistory={roundHistory} />

      {/* =====================================================
          ITEM MODAL
          ===================================================== */}

      {showItems && (

        <div
          className="modal-overlay"
          onClick={() => setShowItems(false)}
        >

          <div
            className="item-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span>
                  DỮ LIỆU TRẬN ĐẤU
                </span>

                <h3>
                  Chọn trang bị
                </h3>

                <small className="data-status">
                  {dataStatus}
                </small>

              </div>

              <button
                className="close-button"
                onClick={() =>
                  setShowItems(false)
                }
              >
                <X size={18} />
              </button>

            </div>


            <div className="item-search">

              <Search size={17} />

              <input
                autoFocus
                value={searchItem}
                onChange={(e) =>
                  setSearchItem(e.target.value)
                }
                placeholder="Tìm kiếm trang bị..."
              />

            </div>


            <div className="item-filter-bar">

              {[
                ["all", "Tất cả"],
                ["component", "Thành phần"],
                ["completed", "Trang bị hoàn chỉnh"],
                ["artifact", "Tạo Tác"],
                ["emblem", "Ấn ghép"],
                ["radiant", "Trang bị Ánh Sáng"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={itemType === key ? "active" : ""}
                  onClick={() => setItemType(key)}
                >
                  {label}
                </button>
              ))}

            </div>

            <div className="selection-info">

              <span>
                Đã chọn {selectedItems.length} trang bị
              </span>

              {selectedItems.length > 0 && (

                <button
                  onClick={() => {
                    setSelectedItems([]);
                    setBoard((currentBoard) =>
                      getStrategicBoard(currentBoard, [])
                    );
                  }}
                >
                  Xóa tất cả
                </button>

              )}

            </div>


            <div className="item-list">

              {filteredItems.length === 0 ? (

                <div className="item-empty">
                  Không tìm thấy trang bị phù hợp.
                </div>

              ) : (

                filteredItems.map((item) => {

                  const selected =
                    selectedItems.some(
                      (x) => x.id === item.id
                    );

                  return (

                    <button
                      key={item.id}
                      className={`item-option ${
                        selected
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        toggleItem(item)
                      }
                    >

                      <div className="item-icon">

                        <img
                          src={getUnifiedItemIcon(item)}
                          alt={item.name}
                        />

                        {selected && (

                          <div className="item-check">
                            <Check size={11} />
                          </div>

                        )}

                      </div>


                      <div className="item-info">

                        <strong>
                          {item.name}
                        </strong>


                      </div>

                    </button>

                  );

                })

              )}

            </div>


            <div className="modal-footer">

              <span>
                Chọn trang bị, Tạo Tác, Ấn hoặc Ánh Sáng đang có trong trận.
              </span>

              <button
                className="confirm-button"
                onClick={() =>
                  setShowItems(false)
                }
              >
                Xác nhận
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          CHAMPION MODAL
          ===================================================== */}

      {showChampions && (

        <div
          className="champion-overlay"
          onClick={() => setShowChampions(false)}
        >

          <div
            className="champion-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="champion-modal-header">

              <div>
                <span>
                  DỮ LIỆU TRẬN ĐẤU · MÙA 18
                </span>

                <h3>
                  Chọn tướng
                </h3>
              </div>

              <button
                className="champion-close"
                onClick={() => setShowChampions(false)}
              >
                <X size={18} />
              </button>

            </div>


            <div className="champion-search">

              <Search size={17} />

              <input
                autoFocus
                value={searchChampion}
                onChange={(e) => setSearchChampion(e.target.value)}
                placeholder="Tìm kiếm champion hoặc trait..."
              />

            </div>


            <div className="champion-cost-filter">

              {Object.entries(COST_LABELS).map(
                ([key, label]) => (

                  <button
                    key={key}
                    className={championCost === key ? "active" : ""}
                    onClick={() => setChampionCost(key)}
                  >
                    {label}
                  </button>

                )
              )}

            </div>


            <div className="champion-count">

              <span>
                {filteredChampions.length} tướng
              </span>

              <span>
                Bấm vào tướng để thêm vào bàn cờ
              </span>

            </div>


            <div className="champion-list">

              {filteredChampions.length === 0 ? (

                <div className="champion-empty">
                  Không tìm thấy champion phù hợp.
                </div>

              ) : (

                filteredChampions.map((champion) => (

                  <button
                    key={champion.id}
                    className={`champion-option cost-${champion.cost}`}
                    onClick={() => {
  if (shopPickerSlot !== null) {
    setShopChampion(shopPickerSlot, champion);
  } else {
    addChampionToBoard(champion);
  }
}}
                  >

                    <div className="champion-portrait">

                      <img
                        src={getChampionIcon(champion)}
                        alt={champion.name}
                        className="champion-image"
                        onError={(e) =>
                          handleChampionImageError(e, champion)
                        }
                      />

                      <div
                        className="champion-fallback"
                        style={{ display: "none" }}
                      >
                        {champion.name.charAt(0)}
                      </div>

                      <div className="champion-cost-badge">
                        {champion.cost}
                      </div>

                    </div>


                    <div className="champion-info">

                      <strong>
                        {champion.name}
                      </strong>

                      <div className="champion-traits">

                        {champion.traits.map((trait) => (
                          <span key={trait}>
                            {trait}
                          </span>
                        ))}

                      </div>

                    </div>


                    <Plus size={15} />

                  </button>

                ))

              )}

            </div>


            <div className="champion-footer">

              <span>
                Sau khi thêm, bấm ô trên bàn cờ để đổi sao.
              </span>

              <button
                className="champion-confirm"
                onClick={() => setShowChampions(false)}
              >
                Xong
              </button>

            </div>

          </div>

        </div>

      )}


      {/* =====================================================
          AUGMENT MODAL
          ===================================================== */}

      {showAugments && (

        <div
          className="augment-overlay"
          onClick={() =>
            setShowAugments(false)
          }
        >

          <div
            className="augment-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="augment-modal-header">

              <div>

                <span>
                  DỮ LIỆU TRẬN ĐẤU · MÙA 18
                </span>

                <h3>
                  Chọn nâng cấp
                </h3>

              </div>

              <button
                className="augment-close"
                onClick={() =>
                  setShowAugments(false)
                }
              >
                <X size={18} />
              </button>

            </div>


            {/* SEARCH */}

            <div className="augment-search">

              <Search size={17} />

              <input
                autoFocus
                value={searchAugment}
                onChange={(e) =>
                  setSearchAugment(
                    e.target.value
                  )
                }
                placeholder="Tìm kiếm nâng cấp..."
              />

            </div>


            {/* TIER FILTER */}

            <div className="augment-filter">

              {Object.entries(TIER_LABELS).map(
                ([key, label]) => (

                  <button
                    key={key}
                    className={
                      augmentTier === key
                        ? `active ${key}`
                        : ""
                    }
                    onClick={() =>
                      setAugmentTier(key)
                    }
                  >

                    {label}

                  </button>

                )
              )}

            </div>


            {/* COUNT */}

            <div className="augment-count">

              <span>
                {filteredAugments.length} nâng cấp
              </span>

              {selectedAugment && (

                <button
                  onClick={() =>
                    setSelectedAugment(null)
                  }
                >
                  Bỏ chọn
                </button>

              )}

            </div>


            {/* AUGMENT LIST */}

            <div className="augment-list">

              {filteredAugments.length === 0 ? (

                <div className="augment-empty">
                  Không tìm thấy nâng cấp phù hợp.
                </div>

              ) : (

                filteredAugments.map(
                  (augment) => {

                    const selected =
                      selectedAugment?.id ===
                      augment.id;

                    return (

                      <button
                        key={`${augment.tier}-${augment.id}`}
                        className={`augment-option ${
                          selected
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          selectAugment(
                            augment
                          )
                        }
                      >

                        <div
                          className={`augment-icon ${augment.tier}`}
                        >
                          {selected ? (
                            <Check size={17} />
                          ) : augment.image ? (
                            <img
                              src={augment.image}
                              alt={augment.name}
                              className="augment-illustration"
                              loading="lazy"
                              onError={(event) => handleAugmentImageError(event, augment)}
                              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
                            />
                          ) : (
                            <Sparkles size={17} />
                          )}
                        </div>


                        <div className="augment-content">

                          <div className="augment-title-row">

                            <strong>
                              {augment.name}
                            </strong>

                            <span
                              className={`augment-tier ${augment.tier}`}
                            >
                              {
                                TIER_LABELS[
                                  augment.tier
                                ]
                              }
                            </span>

                          </div>


                          <span className="augment-category">
                            {augment.category}
                          </span>


                          <p>
                            {augment.description}
                          </p>



                        </div>

                      </button>

                    );
                  }
                )

              )}

            </div>


            {/* FOOTER */}

            <div className="augment-footer">

              <span>
                {augmentDataStatus}
              </span>

              <button
                className="augment-confirm"
                onClick={() =>
                  setShowAugments(false)
                }
              >
                Xác nhận
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default MatchCoach;
