"use client";

import { memo, useMemo } from "react";

type PreviewWord = {
  label: string;
  colorId: string;
};

type NeonShowroomCanvasProps = {
  lines: PreviewWord[][];
  fontId: string;
  fitBias: number;
  isMobile?: boolean;
  widthCm: number;
};

type FontProfile = {
  family: string;
  fontStyle?: "italic" | "normal";
  fontWeight: number;
  letterSpacing: string;
  lineHeight: number;
  sizeBoost: number;
  textTransform?: "uppercase";
  outerBlur: number;
  innerBlur: number;
  wordGapEm: number;
};

type NeonPalette = {
  base: string;
  glow: string;
  core: string;
};

const FONT_PROFILES: Record<string, FontProfile> = {
  "electric-1": {
    family: '"Monceri Electric 1", cursive',
    fontStyle: "normal",
    fontWeight: 400,
    letterSpacing: "-0.03em",
    lineHeight: 0.92,
    sizeBoost: 1.08,
    outerBlur: 18,
    innerBlur: 7,
    wordGapEm: 0.2,
  },
  "electric-2": {
    family: '"Monceri Electric 2", cursive',
    fontStyle: "normal",
    fontWeight: 400,
    letterSpacing: "-0.035em",
    lineHeight: 0.93,
    sizeBoost: 1.06,
    outerBlur: 17,
    innerBlur: 6,
    wordGapEm: 0.18,
  },
  "electric-3": {
    family: '"Monceri Electric 3", cursive',
    fontWeight: 400,
    letterSpacing: "-0.03em",
    lineHeight: 0.93,
    sizeBoost: 1.05,
    outerBlur: 16,
    innerBlur: 6,
    wordGapEm: 0.18,
  },
  "electric-4": {
    family: '"Monceri Electric 4", serif',
    fontWeight: 400,
    letterSpacing: "-0.025em",
    lineHeight: 0.95,
    sizeBoost: 1,
    outerBlur: 15,
    innerBlur: 5,
    wordGapEm: 0.17,
  },
  "electric-5": {
    family: '"Monceri Electric 5", serif',
    fontWeight: 400,
    letterSpacing: "-0.02em",
    lineHeight: 0.95,
    sizeBoost: 0.99,
    outerBlur: 14,
    innerBlur: 5,
    wordGapEm: 0.16,
  },
  "electric-6": {
    family: '"Monceri Electric 6", serif',
    fontStyle: "normal",
    fontWeight: 400,
    letterSpacing: "-0.055em",
    lineHeight: 0.88,
    sizeBoost: 1.16,
    outerBlur: 20,
    innerBlur: 5,
    wordGapEm: 0.12,
  },
  "electric-7": {
    family: '"Monceri Electric 7", sans-serif',
    fontWeight: 400,
    letterSpacing: "-0.015em",
    lineHeight: 0.98,
    sizeBoost: 0.92,
    outerBlur: 12,
    innerBlur: 4,
    wordGapEm: 0.16,
  },
  "electric-8": {
    family: '"Monceri Electric 8", sans-serif',
    fontStyle: "normal",
    fontWeight: 400,
    letterSpacing: "0.045em",
    lineHeight: 0.98,
    sizeBoost: 0.98,
    outerBlur: 12,
    innerBlur: 4,
    wordGapEm: 0.22,
  },
  "electric-9": {
    family: '"Monceri Electric 9", sans-serif',
    fontStyle: "normal",
    fontWeight: 800,
    letterSpacing: "0.03em",
    lineHeight: 0.98,
    sizeBoost: 0.95,
    outerBlur: 12,
    innerBlur: 4,
    wordGapEm: 0.22,
  },
  "electric-10": {
    family: '"Monceri Electric 10", monospace',
    fontStyle: "normal",
    fontWeight: 400,
    letterSpacing: "0.015em",
    lineHeight: 1,
    sizeBoost: 0.94,
    outerBlur: 11,
    innerBlur: 4,
    wordGapEm: 0.2,
  },
  "electric-11": {
    family: '"Monceri Electric 11", sans-serif',
    fontStyle: "normal",
    fontWeight: 400,
    letterSpacing: "0.02em",
    lineHeight: 1,
    sizeBoost: 0.92,
    outerBlur: 10,
    innerBlur: 4,
    wordGapEm: 0.18,
  },
};

const PALETTES: Record<string, NeonPalette> = {
  red: { base: "#ff4d55", glow: "#ff6b72", core: "#fff7f8" },
  white: { base: "#f5fbff", glow: "#dceeff", core: "#ffffff" },
  green: { base: "#58ff73", glow: "#8fff9a", core: "#f5fff7" },
  yellow: { base: "#ffe063", glow: "#fff0a1", core: "#fffce8" },
  cyan: { base: "#61dfff", glow: "#8defff", core: "#f2feff" },
  pink: { base: "#ff54ca", glow: "#ff88da", core: "#fff3fb" },
  "warm-white": { base: "#fff2b0", glow: "#fff7d5", core: "#fffef6" },
  purple: { base: "#a15dff", glow: "#bf90ff", core: "#f7f0ff" },
  orange: { base: "#ff9b47", glow: "#ffbb7f", core: "#fff5ea" },
  blue: { base: "#6073ff", glow: "#8b97ff", core: "#f0f3ff" },
  rainbow: { base: "#6ea2ff", glow: "#93bbff", core: "#f5f9ff" },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const parsed = Number.parseInt(normalized, 16);

  if (Number.isNaN(parsed)) {
    return { r: 255, g: 255, b: 255 };
  }

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function rgba(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function NeonWord({
  colorId,
  fontSize,
  isMobile,
  label,
  profile,
}: {
  colorId: string;
  fontSize: number;
  isMobile: boolean;
  label: string;
  profile: FontProfile;
}) {
  const palette = PALETTES[colorId] ?? PALETTES.red;
  const isRgb = colorId === "rainbow";
  const softGlow = Math.max(isMobile ? 8 : 10, profile.outerBlur * (fontSize / 62)) * (isMobile ? 0.82 : 1);
  const tightGlow = Math.max(isMobile ? 3 : 4, profile.innerBlur * (fontSize / 62)) * (isMobile ? 0.9 : 1);

  return (
    <span
      className={`relative inline-block whitespace-nowrap ${isRgb ? "neon-rgb-cycle" : ""}`}
      style={{
        fontFamily: profile.family,
        fontStyle: profile.fontStyle ?? "normal",
        fontWeight: profile.fontWeight,
        fontSize: `${fontSize}px`,
        letterSpacing: profile.letterSpacing,
        lineHeight: profile.lineHeight,
        textTransform: profile.textTransform,
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none"
        style={{
          color: palette.glow,
          filter: `blur(${softGlow}px)`,
          opacity: isMobile ? 0.24 : 0.34,
          transform: "scale(1.02)",
        }}
      >
        {label}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 select-none"
        style={{
          color: palette.base,
          filter: `blur(${tightGlow}px)`,
          opacity: isMobile ? 0.88 : 0.82,
        }}
      >
        {label}
      </span>
      <span
        className="relative"
        style={{
          color: palette.core,
          textShadow: `0 0 ${isMobile ? 2 : 1}px rgba(255,255,255,0.98), 0 0 ${Math.round(fontSize * (isMobile ? 0.16 : 0.12))}px ${rgba(
            palette.base,
            isMobile ? 0.62 : 0.52,
          )}, 0 0 ${Math.round(fontSize * (isMobile ? 0.28 : 0.22))}px ${rgba(palette.base, isMobile ? 0.28 : 0.22)}`,
        }}
      >
        {label}
      </span>
    </span>
  );
}

function NeonShowroomCanvas({ lines, fontId, fitBias, isMobile = false, widthCm }: NeonShowroomCanvasProps) {
  const profile = FONT_PROFILES[fontId] ?? FONT_PROFILES["electric-1"];
  const longestLineLength = useMemo(
    () => Math.max(...lines.map((line) => line.map((word) => word.label).join(" ").length), 3),
    [lines],
  );
  const lineCount = Math.max(lines.length, 1);
  const fontSize = clamp(
    (widthCm / Math.max(longestLineLength + fitBias * 8, 3)) *
      (lineCount > 1 ? (isMobile ? 8.4 : 7.2) : isMobile ? 10 : 8.2) *
      profile.sizeBoost,
    isMobile ? 48 : 40,
    isMobile ? 132 : 118,
  );
  const lineGap = Math.max(isMobile ? 10 : 8, fontSize * (isMobile ? 0.18 : 0.16));

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-visible">
      <div className={`w-full max-w-full ${isMobile ? "px-0 py-1" : "px-2 py-2 sm:px-3 sm:py-3"}`}>
        <div
          className="flex flex-col items-center justify-center"
          style={{
            gap: `${lineGap}px`,
          }}
        >
          {lines.map((line, lineIndex) => (
            <div
              key={`${lineIndex}-${line.map((item) => item.label).join("-")}`}
              className="flex max-w-full flex-wrap items-center justify-center overflow-visible"
              style={{
                columnGap: `${profile.wordGapEm}em`,
                rowGap: `${Math.max(4, fontSize * 0.12)}px`,
                lineHeight: profile.lineHeight,
              }}
            >
              {line.map((item) => (
                <NeonWord
                  key={`${lineIndex}-${item.label}-${item.colorId}`}
                  colorId={item.colorId}
                  fontSize={fontSize}
                  isMobile={isMobile}
                  label={item.label}
                  profile={profile}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(NeonShowroomCanvas);
