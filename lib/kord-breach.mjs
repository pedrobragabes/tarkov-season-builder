export const globalModifiers = [
  {
    id: "no-insurance",
    mark: "NI",
    name: "NO INSURANCE",
    effects: ["Cannot insure items before raid"]
  },
  {
    id: "black-division",
    mark: "BD",
    name: "BLACK DIVISION",
    effects: ["Black Division operatives can be encountered on specific locations"]
  },
  {
    id: "no-fir-for-hideout",
    mark: "FIR",
    name: "NO FIR FOR HIDEOUT",
    effects: ["Hideout zones don't require the Found in Raid status"]
  },
  {
    id: "armor-shortage",
    mark: "AR",
    name: "ARMOR SHORTAGE",
    effects: ["Traders across Tarkov are experiencing an armor shortage"]
  },
  {
    id: "handyman",
    mark: "HM",
    name: "HANDYMAN",
    effects: ["Item crafting time is reduced by 50%", "Crafting skill starts at level 51"]
  },
  {
    id: "seasoned-pmcs",
    mark: "XP",
    name: "SEASONED PMCS",
    effects: ["Your character gains 25% more raid experience"]
  }
];

export const positiveModifiers = [
  {
    id: "marathon-runner",
    mark: "RUN",
    name: "MARATHON RUNNER",
    value: -3,
    effects: ["Arm and leg stamina is consumed 15% slower"],
    conflicts: ["exhaustion"]
  },
  {
    id: "safecracker",
    mark: "KEY",
    name: "SAFECRACKER",
    value: -6,
    effects: ["Mechanical keys have a 20% chance not to lose durability when used"],
    conflicts: []
  },
  {
    id: "bushborne",
    mark: "BUSH",
    name: "BUSHBORNE",
    value: -5,
    effects: ["Walking in vegetation generates 50% less noise and movement slowdown"],
    conflicts: []
  },
  {
    id: "juice-time",
    mark: "JCE",
    name: "JUICE TIME",
    value: -2,
    effects: ["Consuming a juice drink grants the Painkiller effect for 60 seconds"],
    conflicts: []
  },
  {
    id: "sailors-nostalgia",
    mark: "SEA",
    name: "SAILOR'S NOSTALGIA",
    value: -2,
    effects: ["Consuming canned fish grants the Health Regeneration (+2) effect for 10 seconds"],
    conflicts: []
  },
  {
    id: "youth",
    mark: "YTH",
    name: "YOUTH",
    value: -3,
    effects: ["Energy is consumed 20% slower", "Arm and leg stamina is increased by 10"],
    conflicts: ["exhaustion", "chronic-fatigue-syndrome"]
  },
  {
    id: "street-tax",
    mark: "TAX",
    name: "STREET TAX",
    value: -1,
    effects: ["Once per week, some Scavs pay you protection money"],
    conflicts: []
  },
  {
    id: "the-tarkov-shooter",
    mark: "BOL",
    name: "THE TARKOV SHOOTER",
    value: -3,
    effects: [
      "Bolt-action Rifles skill leveling speed is increased by 100%",
      "Bolt-action Rifles skill starts at level 10"
    ],
    conflicts: []
  },
  {
    id: "diet",
    mark: "DIE",
    name: "DIET",
    value: -1,
    effects: ["All provisions consume 50% less resource"],
    conflicts: []
  },
  {
    id: "hercules",
    mark: "STR",
    name: "HERCULES",
    value: -3,
    effects: ["Strength and Endurance skills start at level 15"],
    conflicts: []
  },
  {
    id: "sprinter",
    mark: "SPD",
    name: "SPRINTER",
    value: -2,
    effects: ["Running speed is increased by 5%"],
    conflicts: ["third-leg"]
  },
  {
    id: "thrombophilia",
    mark: "BLD",
    name: "THROMBOPHILIA",
    value: -2,
    effects: ["Bleeding chance is decreased by 25%"],
    conflicts: ["hemophilia"]
  },
  {
    id: "hypodipsia",
    mark: "H2O",
    name: "HYPODIPSIA",
    value: -2,
    effects: ["Hydration is consumed 15% slower"],
    conflicts: ["polydipsia"]
  },
  {
    id: "polyphagia",
    mark: "NRG",
    name: "POLYPHAGIA",
    value: -2,
    effects: ["Energy is consumed 15% slower"],
    conflicts: ["chronic-fatigue-syndrome"]
  },
  {
    id: "sturdy-bones",
    mark: "BNE",
    name: "STURDY BONES",
    value: -3,
    effects: ["Limb fracture chance is decreased by 15%", "Falling from heights deals 15% less damage"],
    conflicts: ["osteoporosis"]
  },
  {
    id: "average",
    mark: "AVG",
    name: "AVERAGE",
    value: -10,
    effects: [
      "All character skills start at level 25 but cannot be increased further",
      "(Excluding Crafting)"
    ],
    conflicts: ["incompetent"]
  },
  {
    id: "kappa-protocol",
    mark: "KAP",
    name: "KAPPA PROTOCOL",
    value: -21,
    effects: ["Immediately receive Secure container Kappa"],
    conflicts: ["broken-secure-container"]
  }
];

export const negativeModifiers = [
  {
    id: "hemophilia",
    mark: "HEM",
    name: "HEMOPHILIA",
    value: 2,
    effects: ["Bleeding chance is increased by 25%"],
    conflicts: ["thrombophilia"]
  },
  {
    id: "osteoporosis",
    mark: "OST",
    name: "OSTEOPOROSIS",
    value: 3,
    effects: ["Limb fracture chance is increased by 15%", "Falling from heights deals 15% more damage"],
    conflicts: ["sturdy-bones"]
  },
  {
    id: "exhaustion",
    mark: "STM",
    name: "EXHAUSTION",
    value: 4,
    effects: ["Arm and leg stamina recovers 15% slower", "Arm and leg stamina is reduced by 10"],
    conflicts: ["marathon-runner", "youth"]
  },
  {
    id: "well-that-hurt",
    mark: "MED",
    name: "WELL THAT HURT!",
    value: 2,
    effects: ["All medkit uses consume 25% more resource"],
    conflicts: []
  },
  {
    id: "incompetent",
    mark: "SKL",
    name: "INCOMPETENT",
    value: 4,
    effects: [
      "All character skills are leveled 25% slower (Excluding Bolt-action Rifles)",
      "All character skills can only be increased up to level 30 (Excluding Crafting)"
    ],
    conflicts: ["average"]
  },
  {
    id: "polydipsia",
    mark: "DRY",
    name: "POLYDIPSIA",
    value: 1,
    effects: ["Hydration is consumed 15% faster"],
    conflicts: ["hypodipsia"]
  },
  {
    id: "chronic-fatigue-syndrome",
    mark: "NRG",
    name: "CHRONIC FATIGUE SYNDROME",
    value: 1,
    effects: ["Energy is consumed 15% faster"],
    conflicts: ["polyphagia", "youth"]
  },
  {
    id: "personality-vacuum",
    mark: "CHA",
    name: "PERSONALITY VACUUM",
    value: 2,
    effects: ["Charisma skill cannot be increased", "All trader items cost 20% more"],
    conflicts: []
  },
  {
    id: "dr-jekyll",
    mark: "WND",
    name: "DR. JEKYLL",
    value: 1,
    effects: ["After gaining the Fresh Wound status, it cannot be removed until the end of the raid"],
    conflicts: []
  },
  {
    id: "allergic",
    mark: "ALG",
    name: "ALLERGIC",
    value: 3,
    effects: ["Become allergic to 2 random items from the Provisions or Medication category"],
    conflicts: []
  },
  {
    id: "broken-secure-container",
    mark: "BOX",
    name: "BROKEN SECURE CONTAINER",
    value: 4,
    effects: [
      "Secure container is restricted to cash, keys, dogtags, special equipment, and certain containers"
    ],
    conflicts: ["kappa-protocol"]
  },
  {
    id: "no-flea-market",
    mark: "FLEA",
    name: "NO FLEA MARKET",
    value: 6,
    effects: ["Trading with players on the Flea Market is disabled"],
    conflicts: []
  },
  {
    id: "third-leg",
    mark: "LEG",
    name: "THIRD LEG",
    value: 1,
    effects: ["Movement speed is decreased by 1%", "Buying items at Therapist is 5% cheaper"],
    conflicts: ["sprinter"]
  }
];

export const boardSize = {
  width: 2397,
  height: 2149
};

const column = {
  left: 16,
  middle: 805,
  right: 1605,
  width: 776
};

const globalRows = [307, 423];
const positiveRows = [624, 740, 856, 973, 1089, 1205];
const negativeRows = [1404, 1521, 1637, 1754, 1871];
const cardHeight = 99;

export const boardRegions = {
  "no-insurance": { x: column.left, y: globalRows[0], w: column.width, h: cardHeight, type: "global" },
  "black-division": { x: column.middle, y: globalRows[0], w: column.width, h: cardHeight, type: "global" },
  "no-fir-for-hideout": { x: column.right, y: globalRows[0], w: column.width, h: cardHeight, type: "global" },
  "armor-shortage": { x: column.left, y: globalRows[1], w: column.width, h: cardHeight, type: "global" },
  handyman: { x: column.middle, y: globalRows[1], w: column.width, h: cardHeight, type: "global" },
  "seasoned-pmcs": { x: column.right, y: globalRows[1], w: column.width, h: cardHeight, type: "global" },

  "marathon-runner": { x: column.left, y: positiveRows[0], w: column.width, h: cardHeight, type: "positive" },
  safecracker: { x: column.middle, y: positiveRows[0], w: column.width, h: cardHeight, type: "positive" },
  bushborne: { x: column.right, y: positiveRows[0], w: column.width, h: cardHeight, type: "positive" },
  "juice-time": { x: column.left, y: positiveRows[1], w: column.width, h: cardHeight, type: "positive" },
  "sailors-nostalgia": { x: column.middle, y: positiveRows[1], w: column.width, h: cardHeight, type: "positive" },
  youth: { x: column.right, y: positiveRows[1], w: column.width, h: cardHeight, type: "positive" },
  "street-tax": { x: column.left, y: positiveRows[2], w: column.width, h: cardHeight, type: "positive" },
  "the-tarkov-shooter": { x: column.middle, y: positiveRows[2], w: column.width, h: cardHeight, type: "positive" },
  diet: { x: column.right, y: positiveRows[2], w: column.width, h: cardHeight, type: "positive" },
  hercules: { x: column.left, y: positiveRows[3], w: column.width, h: cardHeight, type: "positive" },
  sprinter: { x: column.middle, y: positiveRows[3], w: column.width, h: cardHeight, type: "positive" },
  thrombophilia: { x: column.right, y: positiveRows[3], w: column.width, h: cardHeight, type: "positive" },
  hypodipsia: { x: column.left, y: positiveRows[4], w: column.width, h: cardHeight, type: "positive" },
  polyphagia: { x: column.middle, y: positiveRows[4], w: column.width, h: cardHeight, type: "positive" },
  "sturdy-bones": { x: column.right, y: positiveRows[4], w: column.width, h: cardHeight, type: "positive" },
  average: { x: column.left, y: positiveRows[5], w: column.width, h: cardHeight, type: "positive" },
  "kappa-protocol": { x: column.middle, y: positiveRows[5], w: column.width, h: cardHeight, type: "positive" },

  hemophilia: { x: column.left, y: negativeRows[0], w: column.width, h: cardHeight, type: "negative" },
  osteoporosis: { x: column.middle, y: negativeRows[0], w: column.width, h: cardHeight, type: "negative" },
  exhaustion: { x: column.right, y: negativeRows[0], w: column.width, h: cardHeight, type: "negative" },
  "well-that-hurt": { x: column.left, y: negativeRows[1], w: column.width, h: cardHeight, type: "negative" },
  incompetent: { x: column.middle, y: negativeRows[1], w: column.width, h: cardHeight, type: "negative" },
  polydipsia: { x: column.right, y: negativeRows[1], w: column.width, h: cardHeight, type: "negative" },
  "chronic-fatigue-syndrome": { x: column.left, y: negativeRows[2], w: column.width, h: cardHeight, type: "negative" },
  "personality-vacuum": { x: column.middle, y: negativeRows[2], w: column.width, h: cardHeight, type: "negative" },
  "dr-jekyll": { x: column.right, y: negativeRows[2], w: column.width, h: cardHeight, type: "negative" },
  allergic: { x: column.left, y: negativeRows[3], w: column.width, h: cardHeight, type: "negative" },
  "broken-secure-container": { x: column.middle, y: negativeRows[3], w: column.width, h: cardHeight, type: "negative" },
  "no-flea-market": { x: column.right, y: negativeRows[3], w: column.width, h: cardHeight, type: "negative" },
  "third-leg": { x: column.left, y: negativeRows[4], w: column.width, h: cardHeight, type: "negative" }
};

export const personalModifiers = [...positiveModifiers, ...negativeModifiers];
const modifierById = new Map(personalModifiers.map((modifier) => [modifier.id, modifier]));

export function getBalance(selection) {
  return [...selection].reduce((total, id) => total + (modifierById.get(id)?.value ?? 0), 0);
}

export function getBlockingModifier(modifier, selection) {
  return personalModifiers.find((selectedModifier) => {
    if (!selection.has(selectedModifier.id)) {
      return false;
    }

    return (
      selectedModifier.conflicts.includes(modifier.id) ||
      modifier.conflicts.includes(selectedModifier.id)
    );
  });
}

export function getBlockReason(modifier, selection) {
  const blockingModifier = getBlockingModifier(modifier, selection);
  if (blockingModifier) {
    return `Blocked by ${blockingModifier.name}`;
  }

  if (modifier.value < 0) {
    const cost = Math.abs(modifier.value);
    const balance = getBalance(selection);
    if (balance < cost) {
      return `Need ${cost - balance} more pt`;
    }
  }

  return "";
}

export function normalizeSelection(ids) {
  if (!Array.isArray(ids)) return new Set();
  const selected = new Set();
  const orderedIds = [
    ...negativeModifiers.map((modifier) => modifier.id),
    ...positiveModifiers.map((modifier) => modifier.id)
  ];

  orderedIds.forEach((id) => {
    if (!ids.includes(id)) {
      return;
    }

    const modifier = modifierById.get(id);
    if (!modifier || getBlockReason(modifier, selected)) {
      return;
    }

    selected.add(id);
  });

  return selected;
}

export function parseBuildHash(hash) {
  if (typeof hash !== "string" || hash.length > 4096) return new Set();
  return normalizeSelection(hash.replace(/^#/, "").split(",").map(id => id.trim()).filter(Boolean));
}
