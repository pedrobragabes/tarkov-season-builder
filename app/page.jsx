"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { globalModifiers, positiveModifiers, negativeModifiers, personalModifiers,
  boardSize, boardRegions, getBalance, getBlockReason, parseBuildHash } from "../lib/kord-breach.mjs";

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

function copyToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  const previousFocus = document.activeElement;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    if (!document.execCommand("copy")) return Promise.reject(new Error("Clipboard rejected the copy."));
    return Promise.resolve();
  } finally {
    document.body.removeChild(textarea);
    if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
  }
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

function SelectedModifierList({ emptyText, modifiers }) {
  if (!modifiers.length) {
    return <p className="summary-empty">{emptyText}</p>;
  }

  return (
    <ul className="summary-list">
      {modifiers.map((modifier) => (
        <li key={modifier.id}>
          <span className="summary-item-title">
            <strong>{modifier.name}</strong>
            <span>{formatValue(modifier.value)}</span>
          </span>
          <span className="summary-item-effects">{modifier.effects.join(" | ")}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Home() {
  const [selected, setSelected] = useState(new Set());
  const [status, setStatus] = useState("Global modifiers are always active for every player.");
  const [hasLoadedHash, setHasLoadedHash] = useState(false);

  useEffect(() => {
    const load = () => {
      setSelected(parseBuildHash(window.location.hash));
      setStatus(window.location.hash ? "Build loaded from URL." : "Global modifiers are always active for every player.");
      setHasLoadedHash(true);
    };
    load();
    window.addEventListener("hashchange", load);
    return () => window.removeEventListener("hashchange", load);
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

      if (!context) throw new Error("Canvas unavailable.");
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
        aria-label={`${modifier.name} ${formatValue(modifier.value)}. ${modifier.effects.join(". ")}${blockReason ? `. ${blockReason}` : ""}`}
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
        aria-label={`${modifier.name}: always active. ${modifier.effects.join(". ")}`}
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
      <header className="planner-intro"><h1>Kord Breach Build Planner</h1>
        <p>Season 1 board supplied with this project. Verify current values in-game before using a build.</p></header>
      <noscript><p>Enable JavaScript to select modifiers, calculate points, copy a build or export it.</p></noscript>
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
        <div className="board-scroll" role="region" tabIndex={0} aria-label="Scrollable modifier board">
          <div className="official-board">
            <Image
              className="board-image"
              src="/kord-breach-reference.png"
              alt="Official Kord Breach modifier board"
              width={boardSize.width}
              height={boardSize.height}
              preload
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
        <div className="summary-header">
          <h2 id="summary-title">Selected Build</h2>
          <p>{selectedModifiers.length ? `${selectedModifiers.length} personal modifiers selected.` : "No personal modifiers selected yet."}</p>
        </div>
        <div className="summary-columns">
          <section className="summary-column positive-summary" aria-labelledby="positive-summary-title">
            <h3 id="positive-summary-title">Positive Buffs</h3>
            <SelectedModifierList
              emptyText="No buffs selected."
              modifiers={selectedPositiveModifiers}
            />
          </section>
          <section className="summary-column negative-summary" aria-labelledby="negative-summary-title">
            <h3 id="negative-summary-title">Negative Debuffs</h3>
            <SelectedModifierList
              emptyText="No debuffs selected."
              modifiers={selectedNegativeModifiers}
            />
          </section>
        </div>
      </section>

      <footer className="footer-note">
        <p>Snapshot of the board supplied with this project; modifier values may change. Current in-game values are not verified automatically.</p>
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
