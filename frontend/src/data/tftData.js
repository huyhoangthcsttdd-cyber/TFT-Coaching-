/**
 * TFT Coach — Set 18 Data Layer
 *
 * Single source of truth for:
 * - Champions
 * - Traits
 * - Normal / craftable items
 * - Artifacts
 * - Radiant items
 * - Emblems
 * - Augments
 *
 * Riot/CommunityDragon is used as the live data source so the database
 * stays complete when Riot changes item/augment data between patches.
 *
 * IMPORTANT:
 * - We lock the requested SET to 18. We do NOT blindly use the newest set.
 * - Vietnamese data is preferred.
 * - English data is used as a fallback.
 */

export const TFT_SET = 18;

export const COMMUNITY_DRAGON = {
  tftDataVi:
    "https://raw.communitydragon.org/latest/cdragon/tft/vi_vn.json",
  tftDataEn:
    "https://raw.communitydragon.org/latest/cdragon/tft/en_us.json",
  gameBase:
    "https://raw.communitydragon.org/latest/game/",
  pbeCharacterBase:
    "https://raw.communitydragon.org/pbe/game/assets/characters/",
  pbeChampionSplashBase:
    "https://raw.communitydragon.org/pbe/game/assets/ux/tft/championsplashes/patching/",
};

const CACHE_KEY = "tft-coach-set18-data-v1";
const CACHE_TTL = 1000 * 60 * 60 * 6;

let memoryCache = null;
let loadingPromise = null;

const safeArray = (value) => (Array.isArray(value) ? value : []);

const normalizeName = (value) =>
  String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");

const lower = (value) => normalizeName(value).toLowerCase();

const uniqueBy = (array, keyFn) => {
  const map = new Map();

  for (const item of array) {
    const key = keyFn(item);
    if (!key || map.has(key)) continue;
    map.set(key, item);
  }

  return [...map.values()];
};

/**
 * CommunityDragon JSON stores game asset paths as .tex.
 * The raw/game endpoint exposes the same assets as .png.
 */
export const assetPathToUrl = (assetPath) => {
  if (!assetPath) return "";

  const path = String(assetPath)
    .replace(/^\/+/, "")
    .replace(/^lol-game-data\/assets\//i, "")
    .replace(/^game\//i, "")
    .replace(/\\/g, "/")
    .replace(/\.tex$/i, ".png");

  return `${COMMUNITY_DRAGON.gameBase}${path}`;
};

const getItemApiName = (item) =>
  item?.apiName || item?.api_name || item?.id || "";

const getItemKind = (item) => {
  const apiName = getItemApiName(item).toLowerCase();
  const name = lower(item?.name);

  if (item?.isAugment || apiName.includes("augment")) {
    return "augment";
  }

  if (
    apiName.includes("artifact") ||
    apiName.includes("ornn") ||
    apiName.includes("forged")
  ) {
    return "artifact";
  }

  if (
    apiName.includes("radiant") ||
    apiName.includes("tft5_item_")
  ) {
    return "radiant";
  }

  if (
    apiName.includes("emblem") ||
    apiName.includes("traitemblem") ||
    apiName.includes("trait_emblem")
  ) {
    return "emblem";
  }

  if (
    name.includes("emblem") ||
    name.includes("ấn ")
  ) {
    return "emblem";
  }

  return "item";
};

const getTraitId = (trait) =>
  trait?.apiName || trait?.id || trait?.name || "";

const getChampionId = (champion) =>
  champion?.apiName ||
  champion?.characterName ||
  champion?.name ||
  "";

const toLocalizedItem = (item) => ({
  id: item?.id ?? null,
  apiName: getItemApiName(item),
  name: normalizeName(item?.name),
  description: normalizeName(item?.desc || item?.description),
  icon: assetPathToUrl(item?.icon),
  kind: getItemKind(item),
  isAugment: Boolean(item?.isAugment),
  unique: Boolean(item?.unique),
  composition: safeArray(item?.composition),
  associatedTraits: safeArray(item?.associatedTraits),
  incompatibleTraits: safeArray(item?.incompatibleTraits),
  effects: item?.effects || {},
  tags: safeArray(item?.tags),
});

const toChampion = (champion) => ({
  id: getChampionId(champion),
  apiName: champion?.apiName || "",
  characterName: champion?.characterName || "",
  name: normalizeName(champion?.name),
  cost: Number(champion?.cost || 0),
  role: champion?.role || null,
  traits: safeArray(champion?.traits),
  icon: assetPathToUrl(champion?.icon),
  squareIcon: assetPathToUrl(champion?.squareIcon),
  tileIcon: assetPathToUrl(champion?.tileIcon),
  ability: champion?.ability || null,
  stats: champion?.stats || {},
});

const toTrait = (trait) => ({
  id: getTraitId(trait),
  apiName: trait?.apiName || "",
  name: normalizeName(trait?.name),
  description: normalizeName(trait?.desc || trait?.description),
  icon: assetPathToUrl(trait?.icon),
  effects: safeArray(trait?.effects),
  breakpoints: safeArray(trait?.effects)
    .map((effect) => Number(effect?.minUnits))
    .filter((value) => Number.isFinite(value) && value > 0),
});

const buildItemIndexes = (items) => {
  const byApiName = new Map();
  const byName = new Map();

  for (const item of items) {
    if (item.apiName) byApiName.set(item.apiName, item);
    if (item.name) byName.set(lower(item.name), item);
  }

  return { byApiName, byName };
};

const getSet18 = (raw) => {
  const candidates = safeArray(raw?.setData).filter(
    (set) => Number(set?.number) === TFT_SET
  );

  if (!candidates.length) {
    throw new Error(`CommunityDragon does not contain Set ${TFT_SET}.`);
  }

  /*
   * CommunityDragon can expose more than one data variant for a set.
   * Prefer the last populated Set 18 entry because it is normally the
   * current/live variant in the feed.
   */
  return candidates[candidates.length - 1];
};

const getSetItems = (set18, allItems) => {
  /*
   * In CommunityDragon, setData[].items is primarily a list of internal
   * item apiNames (mName), not translated display names.
   *
   * Match against BOTH apiName and display name so this remains safe across
   * data-format changes and locales.
   */
  const setItemKeys = new Set(
    safeArray(set18?.items)
      .map((value) => normalizeName(value))
      .filter(Boolean)
  );

  const matched = allItems.filter((item) => {
    const apiName = normalizeName(item.apiName);
    const displayName = normalizeName(item.name);

    return (
      setItemKeys.has(apiName) ||
      setItemKeys.has(displayName) ||
      setItemKeys.has(item.apiName?.toLowerCase?.() || "")
    );
  });

  return uniqueBy(
    matched,
    (item) => item.apiName || `${item.kind}:${lower(item.name)}`
  );
};

const buildDatabase = (viRaw, enRaw) => {
  const viSet = getSet18(viRaw);
  const enSet = getSet18(enRaw);

  const viItems = safeArray(viRaw?.items).map(toLocalizedItem);
  const enItems = safeArray(enRaw?.items).map(toLocalizedItem);

  const viItemIndex = buildItemIndexes(viItems);
  const enItemIndex = buildItemIndexes(enItems);

  const getEnglishItem = (item) =>
    enItemIndex.byApiName.get(item.apiName) ||
    enItemIndex.byName.get(lower(item.name));

  const localizedItems = viItems.map((item) => {
    const english = getEnglishItem(item);

    return {
      ...item,
      englishName: english?.name || item.name,
      englishDescription: english?.description || item.description,
      icon: item.icon || english?.icon || "",
    };
  });

  const setItems = getSetItems(viSet, localizedItems);

  const viChampions = safeArray(viSet?.champions).map(toChampion);
  const enChampions = safeArray(enSet?.champions).map(toChampion);

  const enChampionIndex = new Map(
    enChampions.map((champion) => [champion.apiName || champion.id, champion])
  );

  const champions = uniqueBy(
    viChampions.map((champion) => {
      const english =
        enChampionIndex.get(champion.apiName) ||
        enChampionIndex.get(champion.id);

      return {
        ...champion,
        englishName: english?.name || champion.name,
        traits: safeArray(champion.traits),
      };
    }),
    (champion) => champion.apiName || champion.id
  );

  const viTraits = safeArray(viSet?.traits).map(toTrait);
  const enTraits = safeArray(enSet?.traits).map(toTrait);

  const enTraitIndex = new Map(
    enTraits.map((trait) => [trait.apiName || trait.id, trait])
  );

  const traits = uniqueBy(
    viTraits.map((trait) => {
      const english =
        enTraitIndex.get(trait.apiName) ||
        enTraitIndex.get(trait.id);

      return {
        ...trait,
        englishName: english?.name || trait.name,
        englishDescription:
          english?.description || trait.description,
      };
    }),
    (trait) => trait.apiName || trait.id
  );

  const items = uniqueBy(
    setItems,
    (item) => item.apiName || `${item.kind}:${lower(item.name)}`
  );

  const normalItems = items.filter((item) => item.kind === "item");
  const artifacts = items.filter((item) => item.kind === "artifact");
  const radiantItems = items.filter((item) => item.kind === "radiant");
  const emblems = items.filter((item) => item.kind === "emblem");
  const augments = items.filter((item) => item.kind === "augment");

  return {
    set: TFT_SET,
    setName: viSet?.name || enSet?.name || "Set 18",
    patchSource: "CommunityDragon latest",
    champions,
    traits,
    items,
    normalItems,
    artifacts,
    radiantItems,
    emblems,
    augments,
    counts: {
      champions: champions.length,
      traits: traits.length,
      items: normalItems.length,
      artifacts: artifacts.length,
      radiantItems: radiantItems.length,
      emblems: emblems.length,
      augments: augments.length,
    },
  };
};

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);

    if (!raw) return null;

    const cached = JSON.parse(raw);

    if (
      !cached?.timestamp ||
      Date.now() - cached.timestamp > CACHE_TTL ||
      !cached?.data
    ) {
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      })
    );
  } catch {
    // Cache is optional. The application still works without localStorage.
  }
};

/**
 * Load the complete Set 18 database.
 *
 * Usage:
 * const data = await loadTFTData();
 * console.log(data.artifacts);
 */
export const loadTFTData = async ({
  forceRefresh = false,
} = {}) => {
  if (!forceRefresh && memoryCache) {
    return memoryCache;
  }

  if (!forceRefresh) {
    const cached = readCache();

    if (cached) {
      memoryCache = cached;
      return cached;
    }
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    const [viResponse, enResponse] = await Promise.all([
      fetch(COMMUNITY_DRAGON.tftDataVi, {
        cache: "no-store",
      }),
      fetch(COMMUNITY_DRAGON.tftDataEn, {
        cache: "no-store",
      }),
    ]);

    if (!viResponse.ok) {
      throw new Error(
        `Vietnamese TFT data request failed: ${viResponse.status}`
      );
    }

    if (!enResponse.ok) {
      throw new Error(
        `English TFT data request failed: ${enResponse.status}`
      );
    }

    const [viRaw, enRaw] = await Promise.all([
      viResponse.json(),
      enResponse.json(),
    ]);

    const data = buildDatabase(viRaw, enRaw);

    memoryCache = data;
    writeCache(data);

    return data;
  })();

  try {
    return await loadingPromise;
  } finally {
    loadingPromise = null;
  }
};

/**
 * Convert the complete data layer into the exact categories used by the UI.
 */
export const getTFTCategories = async (options = {}) => {
  const data = await loadTFTData(options);

  return {
    champions: data.champions,
    traits: data.traits,
    items: data.normalItems,
    artifacts: data.artifacts,
    radiantItems: data.radiantItems,
    emblems: data.emblems,
    augments: data.augments,
  };
};

/**
 * Generic search across all selectable game objects.
 */
export const searchTFTData = async (
  query,
  options = {}
) => {
  const data = await loadTFTData(options);
  const q = lower(query);

  if (!q) return [];

  const groups = [
    ...data.champions.map((x) => ({
      ...x,
      category: "champion",
    })),
    ...data.traits.map((x) => ({
      ...x,
      category: "trait",
    })),
    ...data.items.map((x) => ({
      ...x,
      category: "item",
    })),
    ...data.artifacts.map((x) => ({
      ...x,
      category: "artifact",
    })),
    ...data.radiantItems.map((x) => ({
      ...x,
      category: "radiant",
    })),
    ...data.emblems.map((x) => ({
      ...x,
      category: "emblem",
    })),
    ...data.augments.map((x) => ({
      ...x,
      category: "augment",
    })),
  ];

  return groups.filter((entry) => {
    const searchable = [
      entry.name,
      entry.englishName,
      entry.apiName,
      entry.description,
      ...(entry.traits || []),
    ]
      .filter(Boolean)
      .join(" ");

    return lower(searchable).includes(q);
  });
};

/**
 * Special Set 18 asset mapping.
 *
 * Most Set 18 champions have a direct tft18_<assetId> directory.
 * Pebbles is internally represented by Brock.
 * Mama Beak is internally represented by Raptor.
 */
export const getChampionAssetKey = (champion) => {
  const api = String(
    champion?.apiName || ""
  ).toLowerCase();

  const name = lower(champion?.name);

  if (
    api.includes("pebbles") ||
    name === "sỏi" ||
    name === "pebbles"
  ) {
    return "brock";
  }

  if (
    api.includes("mamabeak") ||
    name === "chim mẹ" ||
    name === "mama beak"
  ) {
    return "raptor";
  }

  const raw =
    champion?.assetId ||
    champion?.characterName ||
    champion?.apiName ||
    champion?.id ||
    "";

  return String(raw)
    .replace(/^tft18_/i, "")
    .replace(/^tft18/i, "")
    .replace(/[^a-z0-9_]/gi, "")
    .toLowerCase();
};

export const getChampionImageCandidates = (
  champion
) => {
  const assetKey = getChampionAssetKey(champion);
  const tftAsset = `tft18_${assetKey}`;

  return [
    champion?.squareIcon,
    champion?.tileIcon,
    `${COMMUNITY_DRAGON.pbeCharacterBase}${tftAsset}/${tftAsset}_square.png`,
    `${COMMUNITY_DRAGON.pbeCharacterBase}${tftAsset}/hud/${tftAsset}_square.png`,
    `${COMMUNITY_DRAGON.pbeCharacterBase}${tftAsset}/skins/base/${tftAsset}.png`,
    `${COMMUNITY_DRAGON.pbeChampionSplashBase}${tftAsset}_teamplanner_splash.png`,
  ].filter(Boolean);
};

export const getItemImageCandidates = (item) => {
  if (!item) return [];

  const rawIcon = item.icon ? String(item.icon) : "";
  const candidates = rawIcon
    ? [
        /^https?:\/\//i.test(rawIcon)
          ? rawIcon
          : `${COMMUNITY_DRAGON.gameBase}${rawIcon.replace(/^\/+/, "")}`,
      ]
    : [];

  const apiName = getItemApiName(item);

  /*
   * CDragon's item data already contains the canonical icon path.
   * The additional standard path is a safety fallback for legacy items.
   */
  if (apiName) {
    candidates.push(
      `${COMMUNITY_DRAGON.gameBase}assets/maps/particles/tft/item_icons/standard/${apiName}.png`,
      `${COMMUNITY_DRAGON.gameBase}assets/maps/particles/tft/item_icons/standard/${apiName
        .replace(/^TFT[0-9]*_Item_/i, "")
        .replace(/^TFT[0-9]*_/i, "")}.png`
    );
  }

  return uniqueBy(
    candidates,
    (url) => url
  );
};

export const getTraitImageCandidates = (
  trait
) => {
  if (!trait) return [];

  const candidates = [
    trait.icon,
  ].filter(Boolean);

  if (trait.apiName) {
    const shortName = String(trait.apiName)
      .replace(/^TFT\d*_?/i, "")
      .replace(/^TFT_/i, "")
      .replace(/[^a-z0-9_]/gi, "")
      .toLowerCase();

    candidates.push(
      `${COMMUNITY_DRAGON.gameBase}assets/ux/traiticons/trait_icon_${shortName}.png`
    );
  }

  return uniqueBy(
    candidates,
    (url) => url
  );
};

export const getAsset = (
  entry,
  category
) => {
  switch (category) {
    case "champion":
      return getChampionImageCandidates(entry);

    case "trait":
      return getTraitImageCandidates(entry);

    case "item":
    case "artifact":
    case "radiant":
    case "emblem":
    case "augment":
      return getItemImageCandidates(entry);

    default:
      return [];
  }
};

export const clearTFTDataCache = () => {
  memoryCache = null;

  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // Ignore storage errors.
  }
};