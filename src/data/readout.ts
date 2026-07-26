import {
  ARRANGEMENT_SCORES,
  PRESENCE_SHARE,
  SEPARATION_CONFIDENCE,
  STEM_ORDER,
  type ArrangementScore,
  type StemName,
} from "./audioAnalysis";

/**
 * Turns measurements into sentences. Every line is generated from a field in
 * audioAnalysis.ts by a fixed rule, so the readout can be regenerated from the
 * data and never drifts from it.
 *
 * Two rules govern what may be said:
 *   1. Describe what was measured, never why. "Piano registers 27 onsets per
 *      minute" is a reading; "the piano is held back for space" is not.
 *   2. A figure that moves when the threshold moves describes the threshold.
 *      Presence is only stated for stems whose presenceRobust flag is set, and
 *      the threshold is named every time it is used.
 *
 * The residual "other" stem is excluded from every sentence: it is whatever the
 * separation model could not assign, not an instrument.
 */

export type ReadoutTag = "tempo" | "presence" | "density" | "spectrum" | "dynamics" | "structure";

export interface ReadoutLine {
  tag: ReadoutTag;
  text: string;
  /** Fields this sentence was generated from, for the method note. */
  basis: string[];
}

const LABELS: Record<StemName, string> = {
  vocals: "Vocals",
  drums: "Drums",
  bass: "Bass",
  guitar: "Guitar",
  piano: "Piano",
  other: "Residual",
};

/** Stems that may appear in sentences at all. */
const NAMED_STEMS = STEM_ORDER.filter((stem) => SEPARATION_CONFIDENCE[stem] !== "residual");

const lower = (stem: StemName) => LABELS[stem].toLowerCase();

function clock(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.round(seconds % 60).toString().padStart(2, "0")}`;
}

function list(items: string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const pct = (value: number) => `${Math.round(value * 100)}%`;

function extremes(pick: (stem: StemName) => number) {
  const ranked = [...NAMED_STEMS].sort((left, right) => pick(right) - pick(left));
  return { highest: ranked[0], lowest: ranked[ranked.length - 1] };
}

export function buildReadout(score: ArrangementScore): ReadoutLine[] {
  const lines: ReadoutLine[] = [];
  const share = pct(PRESENCE_SHARE);

  // ── Tempo ────────────────────────────────────────────────────────────────
  let tempo =
    `Runs ${clock(score.durationS)}. Beat tracking from the drum stem returns ` +
    `${score.tempoBpm.toFixed(1)} BPM across ${score.beatCount} beats, with beat spacing ` +
    `varying by ${(score.tempoStability * 100).toFixed(1)}%.`;
  if (score.tempoAmbiguous) {
    tempo +=
      ` Beat trackers routinely lock an octave from the felt pulse; ` +
      `${score.tempoAlternatesBpm.map((value) => value.toFixed(1)).join(" or ")} BPM ` +
      `fits the same measurement.`;
  }
  lines.push({ tag: "tempo", text: tempo, basis: ["tempoBpm", "beatCount", "tempoStability"] });

  // ── Presence, only where the figure survives a change of threshold ────────
  const robust = NAMED_STEMS.filter((stem) => score.stems[stem].presenceRobust);
  const fragile = NAMED_STEMS.filter((stem) => !score.stems[stem].presenceRobust);

  if (robust.length) {
    const ranked = [...robust].sort((left, right) => score.stems[right].presence - score.stems[left].presence);
    const [first, ...rest] = ranked;
    let presence =
      `Measured against a threshold of ${share} of summed stem energy, ${lower(first)} stays above it ` +
      `for ${pct(score.stems[first].presence)} of the runtime` +
      (rest.length ? `, ${list(rest.map((stem) => `${lower(stem)} for ${pct(score.stems[stem].presence)}`))}` : ``) +
      `.`;
    // A low figure here means a small share of energy, never an absent
    // instrument. Say so rather than leaving the reader to infer it.
    const scarce = ranked.filter((stem) => score.stems[stem].presence < 0.25);
    if (scarce.length) {
      presence +=
        ` A low figure records a small share of the measured energy, not an absence: ` +
        `${list(scarce.map((stem) => `the ${lower(stem)} stem averages ${pct(score.stems[stem].shareMean)} and peaks well above its own ordinary level`))}.`;
    }
    lines.push({ tag: "presence", text: presence, basis: ["presence", "presenceRobust", "shareMean"] });
  }

  if (fragile.length) {
    lines.push({
      tag: "presence",
      text:
        `${list(fragile.map((stem) => LABELS[stem]))} ${fragile.length > 1 ? "are" : "is"} reported by ` +
        `average share instead — ` +
        list(fragile.map((stem) => `${lower(stem)} ${pct(score.stems[stem].shareMean)}`)) +
        ` of measured energy. ${fragile.length > 1 ? "Their" : "Its"} presence figure moves by more than a tenth ` +
        `when the threshold is halved, which makes it a property of the threshold rather than of the recording.`,
      basis: ["shareMean", "presenceDelta"],
    });
  }

  // ── Event density ────────────────────────────────────────────────────────
  const density = extremes((stem) => score.stems[stem].onsetsPerMin);
  const top = score.stems[density.highest].onsetsPerMin;
  const bottom = score.stems[density.lowest].onsetsPerMin;
  lines.push({
    tag: "density",
    text:
      `${LABELS[density.highest]} carries the most detected events at ${top.toFixed(0)} per minute, ` +
      `${lower(density.lowest)} the fewest at ${bottom.toFixed(0)}` +
      (bottom > 0 && top / bottom >= 2 ? ` — a ratio of ${(top / bottom).toFixed(1)} to one.` : `.`),
    basis: ["onsetsPerMin"],
  });

  // ── Spectral placement ───────────────────────────────────────────────────
  const spectrum = extremes((stem) => score.stems[stem].centroidHz);
  lines.push({
    tag: "spectrum",
    text:
      `The stems sit apart by register: ${lower(spectrum.lowest)} centres at ` +
      `${score.stems[spectrum.lowest].centroidHz} Hz and ${lower(spectrum.highest)} at ` +
      `${score.stems[spectrum.highest].centroidHz} Hz.`,
    basis: ["centroidHz"],
  });

  // ── Internal dynamic range ───────────────────────────────────────────────
  const dynamics = extremes((stem) => score.stems[stem].crest);
  lines.push({
    tag: "dynamics",
    text:
      `${LABELS[dynamics.highest]} varies most against its own level ` +
      `(crest ${score.stems[dynamics.highest].crest.toFixed(2)}), ` +
      `${lower(dynamics.lowest)} least (${score.stems[dynamics.lowest].crest.toFixed(2)}): ` +
      `peaks stand furthest above the ordinary level in the ${lower(dynamics.highest)} stem.`,
    basis: ["crest"],
  });

  // ── Thinnest passage, stated with its threshold ──────────────────────────
  // Run-ins and fades are always the thinnest stretch and say nothing about the
  // arrangement, so only an interior passage of some length is reported.
  const span = score.thinnest ? score.thinnest.endS - score.thinnest.startS : 0;
  const interior =
    !!score.thinnest &&
    span >= 6 &&
    score.thinnest.startS >= score.durationS * 0.05 &&
    score.thinnest.endS <= score.durationS * 0.95;
  if (score.thinnest && interior) {
    const named = score.thinnest.stems.filter((stem) => SEPARATION_CONFIDENCE[stem] !== "residual");
    if (named.length) {
      lines.push({
        tag: "structure",
        text:
          `Fewest stems clear the ${share} threshold between ${clock(score.thinnest.startS)} and ` +
          `${clock(score.thinnest.endS)}, where only ${list(named.map(lower))} ` +
          `${named.length > 1 ? "remain" : "remains"} above it.`,
        basis: ["thinnest"],
      });
    }
  }

  return lines;
}

export const READOUT_METHOD_NOTE =
  `Generated from private signal measurements of separated audio. Figures describe measured ` +
  `energy, event onsets and spectral centre, not audibility or intent. Separation is imperfect: ` +
  `vocals, drums and bass are handled reliably, guitar and piano are experimental, and the ` +
  `residual stem is excluded from these readings entirely.`;

export const READOUTS: Record<string, ReadoutLine[]> = Object.fromEntries(
  ARRANGEMENT_SCORES.map((score) => [score.id, buildReadout(score)])
);
