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

const personalModifiers = [...positiveModifiers, ...negativeModifiers];
const modifierById = new Map(personalModifiers.map((modifier) => [modifier.id, modifier]));

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

  function renderModifierCard(modifier, type) {
    const isSelected = selected.has(modifier.id);
    const blockReason = isSelected ? "" : getBlockReason(modifier, selected);
    const isBlocked = Boolean(blockReason);

    return (
      <button
        key={modifier.id}
        type="button"
        data-modifier-id={modifier.id}
        className={[
          "modifier-card",
          type,
          isSelected ? "is-selected" : "",
          isBlocked ? "is-blocked" : ""
        ].join(" ")}
        aria-pressed={isSelected}
        aria-disabled={isBlocked}
        onClick={() => toggleModifier(modifier)}
      >
        <span className="modifier-icon" aria-hidden="true">
          {modifier.mark}
        </span>
        <span className="modifier-copy">
          <span className="modifier-title-row">
            <strong>{modifier.name}</strong>
            <span>{formatValue(modifier.value)}</span>
          </span>
          <ul>
            {modifier.effects.map((effect) => (
              <li key={effect}>{effect}</li>
            ))}
          </ul>
          {blockReason ? <span className="block-label">{blockReason}</span> : null}
        </span>
        <span className="toggle-rail" aria-hidden="true">
          <span className="toggle-knob"></span>
        </span>
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

        <aside className="reference-panel" aria-label="Official reference image">
          <Image
            src="/kord-breach-reference.png"
            alt="Official Kord Breach modifiers reference"
            width={560}
            height={500}
            priority
          />
          <span>Official reference image</span>
        </aside>
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
          <button className="tool-button" type="button" onClick={handleCopyBuild}>
            Copy build
          </button>
          <button className="tool-button ghost" type="button" onClick={resetBuild}>
            Reset
          </button>
        </div>
      </section>

      <p className="status-message" role="status" aria-live="polite">
        {status}
      </p>

      <section className="modifier-section global-section" aria-labelledby="global-title">
        <div className="section-heading global-heading">
          <span></span>
          <h2 id="global-title">Global Modifiers</h2>
          <span></span>
        </div>
        <div className="modifier-grid globals">
          {globalModifiers.map((modifier) => (
            <article
              className="modifier-card global-card is-selected"
              data-modifier-id={modifier.id}
              key={modifier.id}
            >
              <span className="modifier-icon" aria-hidden="true">
                {modifier.mark}
              </span>
              <span className="modifier-copy">
                <span className="modifier-title-row">
                  <strong>{modifier.name}</strong>
                  <span className="lock-badge">ACTIVE</span>
                </span>
                <ul>
                  {modifier.effects.map((effect) => (
                    <li key={effect}>{effect}</li>
                  ))}
                </ul>
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="modifier-section positive-section" aria-labelledby="positive-title">
        <div className="section-heading positive-heading">
          <span></span>
          <h2 id="positive-title">Personal Positive</h2>
          <span></span>
        </div>
        <div className="modifier-grid">
          {positiveModifiers.map((modifier) => renderModifierCard(modifier, "positive"))}
        </div>
      </section>

      <section className="modifier-section negative-section" aria-labelledby="negative-title">
        <div className="section-heading negative-heading">
          <span></span>
          <h2 id="negative-title">Personal Negative</h2>
          <span></span>
        </div>
        <div className="modifier-grid">
          {negativeModifiers.map((modifier) => renderModifierCard(modifier, "negative"))}
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
        <p>Unofficial fan planner. Escape from Tarkov and related names belong to Battlestate Games.</p>
      </footer>
    </main>
  );
}
