"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const globalModifiers = [
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

const positiveModifiers = [
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

const negativeModifiers = [
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

const boardSize = {
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

const boardRegions = {
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

const personalModifiers = [...positiveModifiers, ...negativeModifiers];
const modifierById = new Map(personalModifiers.map((modifier) => [modifier.id, modifier]));

function getRegionStyle(region) {
  return {
    left: `${(region.x / boardSize.width) * 100}%`,
    top: `${(region.y / boardSize.height) * 100}%`,
    width: `${(region.w / boardSize.width) * 100}%`,
    height: `${(region.h / boardSize.height) * 100}%`
  };
}

function formatValue(value) {
  return value > 0 ? `(+${value})` : `(${value})`;
}

function getBalance(selection) {
  return [...selection].reduce((total, id) => total + (modifierById.get(id)?.value ?? 0), 0);
}

function getBlockingModifier(modifier, selection) {
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

function getBlockReason(modifier, selection) {
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

function normalizeSelection(ids) {
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

function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  return Promise.resolve();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getShareUrl(selected) {
  const selectedIds = [...selected].sort().join(",");
  const hash = selectedIds ? `#${selectedIds}` : "";

  return `${window.location.origin}${window.location.pathname}${window.location.search}${hash}`;
}

function buildShareText({ balance, positives, negatives }) {
  const positiveText = positives.length
    ? positives.map((modifier) => `${modifier.name} ${formatValue(modifier.value)}`).join(", ")
    : "none";
  const negativeText = negatives.length
    ? negatives.map((modifier) => `${modifier.name} ${formatValue(modifier.value)}`).join(", ")
    : "none";
  const url = typeof window === "undefined" ? "" : `\nLink: ${window.location.href}`;

  return [
    "Kord Breach build",
    `Available points: ${balance}`,
    `Positive: ${positiveText}`,
    `Negative: ${negativeText}`,
    "Global modifiers: all active"
  ].join("\n") + url;
}

function loadCanvasImage(src) {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

export default function Home() {
  const [selected, setSelected] = useState(new Set());
  const [status, setStatus] = useState("Global modifiers are always active for every player.");
  const [hasLoadedHash, setHasLoadedHash] = useState(false);

  useEffect(() => {
    const hashIds = window.location.hash
      .replace("#", "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (hashIds.length) {
      setSelected(normalizeSelection(hashIds));
      setStatus("Build loaded from URL.");
    }

    setHasLoadedHash(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedHash) {
      return;
    }

    const selectedIds = [...selected].sort().join(",");
    const nextUrl = selectedIds
      ? `${window.location.pathname}${window.location.search}#${selectedIds}`
      : `${window.location.pathname}${window.location.search}`;

    window.history.replaceState(null, "", nextUrl);
  }, [hasLoadedHash, selected]);

  const selectedModifiers = useMemo(
    () => personalModifiers.filter((modifier) => selected.has(modifier.id)),
    [selected]
  );

  const selectedPositiveModifiers = useMemo(
    () => positiveModifiers.filter((modifier) => selected.has(modifier.id)),
    [selected]
  );

  const selectedNegativeModifiers = useMemo(
    () => negativeModifiers.filter((modifier) => selected.has(modifier.id)),
    [selected]
  );

  const balance = useMemo(() => getBalance(selected), [selected]);
  const positiveCost = selectedPositiveModifiers.reduce(
    (total, modifier) => total + Math.abs(modifier.value),
    0
  );
  const negativeGain = selectedNegativeModifiers.reduce((total, modifier) => total + modifier.value, 0);

  function toggleModifier(modifier) {
    const next = new Set(selected);

    if (next.has(modifier.id)) {
      if (modifier.value > 0 && getBalance(next) - modifier.value < 0) {
        setStatus("Remove enough positive traits before dropping this debuff.");
        return;
      }

      next.delete(modifier.id);
      setSelected(next);
      setStatus(`${modifier.name} removed.`);
      return;
    }

    const reason = getBlockReason(modifier, next);
    if (reason) {
      setStatus(`${modifier.name}: ${reason}.`);
      return;
    }

    next.add(modifier.id);
    setSelected(next);
    setStatus(`${modifier.name} selected.`);
  }

  function resetBuild() {
    setSelected(new Set());
    setStatus("Build reset. Start with 0 points.");
  }

  async function handleCopyBuild() {
    try {
      await copyToClipboard(
        buildShareText({
          balance,
          positives: selectedPositiveModifiers,
          negatives: selectedNegativeModifiers
        })
      );
      setStatus("Build copied to clipboard.");
    } catch {
      setStatus("Could not copy automatically.");
    }
  }

  async function handleCopyLink() {
    try {
      await copyToClipboard(getShareUrl(selected));
      setStatus("Share link copied to clipboard.");
    } catch {
      setStatus("Could not copy the share link automatically.");
    }
  }

  async function handleDownloadPng() {
    try {
      const image = await loadCanvasImage("/kord-breach-reference.png");
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = boardSize.width;
      canvas.height = boardSize.height;

      context.drawImage(image, 0, 0, boardSize.width, boardSize.height);

      selectedModifiers.forEach((modifier) => {
        const region = boardRegions[modifier.id];
        if (!region) {
          return;
        }

        const isPositive = modifier.value < 0;
        context.save();
        context.fillStyle = isPositive ? "rgba(80, 220, 130, 0.34)" : "rgba(220, 92, 88, 0.34)";
        context.strokeStyle = isPositive ? "rgba(125, 255, 170, 0.98)" : "rgba(255, 145, 140, 0.98)";
        context.lineWidth = 5;
        context.fillRect(region.x, region.y, region.w, region.h);
        context.strokeRect(region.x + 2, region.y + 2, region.w - 4, region.h - 4);

        context.fillStyle = "rgba(0, 0, 0, 0.76)";
        context.fillRect(region.x + region.w - 210, region.y + 10, 190, 34);
        context.fillStyle = isPositive ? "#c6ffd9" : "#ffd5d2";
        context.font = "700 22px Arial";
        context.textAlign = "right";
        context.textBaseline = "middle";
        context.fillText("SELECTED", region.x + region.w - 32, region.y + 28);
        context.restore();
      });

      context.save();
      context.fillStyle = "rgba(5, 8, 8, 0.82)";
      context.fillRect(24, boardSize.height - 92, 640, 62);
      context.fillStyle = "#eef3ee";
      context.font = "700 26px Arial";
      context.textBaseline = "top";
      context.fillText(`Selected: ${selectedModifiers.length} | Points: ${balance}`, 44, boardSize.height - 76);
      context.font = "18px Arial";
      context.fillStyle = "#9da8a1";
      context.fillText("Generated by Tarkov Season Builder", 44, boardSize.height - 44);
      context.restore();

      canvas.toBlob((blob) => {
        if (!blob) {
          setStatus("Could not generate the PNG.");
          return;
        }

        const suffix = selectedModifiers.length ? selectedModifiers.length : "empty";
        downloadBlob(blob, `kord-breach-build-${suffix}-selected.png`);
        setStatus("Selected build PNG downloaded.");
      }, "image/png");
    } catch {
      setStatus("Could not generate the PNG download.");
    }
  }

  function renderBoardHotspot(modifier, type) {
    const isSelected = selected.has(modifier.id);
    const blockReason = isSelected ? "" : getBlockReason(modifier, selected);
    const isBlocked = Boolean(blockReason);
    const region = boardRegions[modifier.id];

    if (!region) {
      return null;
    }

    return (
      <button
        key={modifier.id}
        type="button"
        data-modifier-id={modifier.id}
        style={getRegionStyle(region)}
        className={[
          "image-hotspot",
          type,
          isSelected ? "is-selected" : "",
          isBlocked ? "is-blocked" : ""
        ].join(" ")}
        aria-pressed={isSelected}
        aria-disabled={isBlocked}
        title={`${modifier.name} ${formatValue(modifier.value)}${blockReason ? ` - ${blockReason}` : ""}`}
        onClick={() => toggleModifier(modifier)}
      >
        <span className="sr-only">
          {modifier.name} {formatValue(modifier.value)}
        </span>
        {isSelected ? <span className="hotspot-chip">Selected</span> : null}
        {blockReason ? <span className="hotspot-chip">{blockReason}</span> : null}
      </button>
    );
  }

  function renderGlobalHotspot(modifier) {
    const region = boardRegions[modifier.id];

    return (
      <button
        key={modifier.id}
        type="button"
        data-modifier-id={modifier.id}
        style={getRegionStyle(region)}
        className="image-hotspot global is-selected"
        aria-pressed="true"
        title={`${modifier.name} - global modifier always active`}
        onClick={() => setStatus(`${modifier.name} is a global modifier and is always active.`)}
      >
        <span className="sr-only">{modifier.name} global modifier always active</span>
        <span className="hotspot-chip">Active</span>
      </button>
    );
  }

  return (
    <main className="shell">
      <header className="site-header">
        <section className="hero-copy" aria-labelledby="page-title">
          <p className="season-label">Season 1</p>
          <h1 id="page-title">
            <span>KORD</span> BREACH
          </h1>
          <p className="subtitle">
            Unofficial Escape from Tarkov modifier build planner. Start with 0 points, earn points
            from debuffs, then spend them on buffs.
          </p>
        </section>
      </header>

      <section className="builder-bar" aria-label="Build status">
        <div className="score-block">
          <span className="score-label">Available points</span>
          <strong>{balance}</strong>
          <span>{balance === 0 ? "Balanced" : "Spendable"}</span>
        </div>
        <div className="stat-strip" aria-live="polite">
          <span>
            <strong>{selectedPositiveModifiers.length}</strong> positive selected
          </span>
          <span>
            <strong>{selectedNegativeModifiers.length}</strong> negative selected
          </span>
          <span>
            <strong>{positiveCost}</strong> spent
          </span>
          <span>
            <strong>{negativeGain}</strong> earned
          </span>
        </div>
        <div className="toolbar-actions">
          <button className="tool-button" type="button" onClick={handleCopyLink}>
            Copy link
          </button>
          <button className="tool-button secondary" type="button" onClick={handleCopyBuild}>
            Copy text
          </button>
          <button className="tool-button secondary" type="button" onClick={handleDownloadPng}>
            Download PNG
          </button>
          <button className="tool-button ghost" type="button" onClick={resetBuild}>
            Reset
          </button>
        </div>
      </section>

      <p className="status-message" role="status" aria-live="polite">
        {status}
      </p>

      <section className="official-board-section" aria-labelledby="board-title">
        <div className="section-heading board-heading">
          <span></span>
          <h2 id="board-title">Clickable Official Board</h2>
          <span></span>
        </div>
        <div className="board-scroll">
          <div className="official-board">
            <Image
              className="board-image"
              src="/kord-breach-reference.png"
              alt="Official Kord Breach modifier board"
              width={boardSize.width}
              height={boardSize.height}
              priority
            />
            <div className="board-overlays" aria-label="Clickable modifier regions">
              {globalModifiers.map((modifier) => renderGlobalHotspot(modifier))}
              {positiveModifiers.map((modifier) => renderBoardHotspot(modifier, "positive"))}
              {negativeModifiers.map((modifier) => renderBoardHotspot(modifier, "negative"))}
            </div>
          </div>
        </div>
      </section>

      <section className="summary-band" aria-labelledby="summary-title">
        <div>
          <h2 id="summary-title">Selected Build</h2>
          <p>
            {selectedModifiers.length
              ? selectedModifiers
                  .map((modifier) => `${modifier.name} ${formatValue(modifier.value)}`)
                  .join(" | ")
              : "No personal modifiers selected yet."}
          </p>
        </div>
      </section>

      <footer className="footer-note">
        <p>Modifier values may change before the start of the season for balancing reasons.</p>
        <p>
          Unofficial fan planner. Escape from Tarkov and related names belong to Battlestate Games.
        </p>
        <p>
          Like the project?{" "}
          <a href="https://github.com/pedrobragabes/tarkov-season-builder" target="_blank" rel="noreferrer">
            Star it on GitHub or open an issue
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
