import { CONFIGURATOR_SIZES } from "@monceri/shared";
import type {
  EnvironmentOption,
  FontOption,
  NeonColor,
  SizeOption,
} from "@/components/configurator/configurator-types";

export const fontOptions: FontOption[] = [
  {
    id: "electric-1",
    label: "Electric 1",
    previewFamily: '"Monceri Electric 1", cursive',
    previewClassName: "font-normal tracking-[-0.03em]",
    fitBias: 0.08,
  },
  {
    id: "electric-2",
    label: "Electric 2",
    previewFamily: '"Monceri Electric 2", cursive',
    previewClassName: "font-normal tracking-[-0.035em]",
    fitBias: 0.1,
  },
  {
    id: "electric-3",
    label: "Electric 3",
    previewFamily: '"Monceri Electric 3", cursive',
    previewClassName: "font-normal tracking-[-0.03em]",
    fitBias: 0.1,
  },
  {
    id: "electric-4",
    label: "Electric 4",
    previewFamily: '"Monceri Electric 4", serif',
    previewClassName: "font-normal tracking-[-0.025em]",
    fitBias: 0.08,
  },
  {
    id: "electric-5",
    label: "Electric 5",
    previewFamily: '"Monceri Electric 5", serif',
    previewClassName: "font-normal tracking-[-0.02em]",
    fitBias: 0.08,
  },
  {
    id: "electric-6",
    label: "Electric 6",
    previewFamily: '"Monceri Electric 6", serif',
    previewClassName: "font-normal tracking-[-0.055em]",
    fitBias: 0.15,
  },
  {
    id: "electric-7",
    label: "Electric 7",
    previewFamily: '"Monceri Electric 7", sans-serif',
    previewClassName: "font-normal tracking-[-0.015em]",
    fitBias: 0.05,
  },
  {
    id: "electric-8",
    label: "Electric 8",
    previewFamily: '"Monceri Electric 8", sans-serif',
    previewClassName: "font-normal uppercase tracking-[0.045em]",
    fitBias: 0.05,
  },
  {
    id: "electric-9",
    label: "Electric 9",
    previewFamily: '"Monceri Electric 9", sans-serif',
    previewClassName: "font-black uppercase tracking-[0.03em]",
    fitBias: 0.05,
  },
  {
    id: "electric-10",
    label: "Electric 10",
    previewFamily: '"Monceri Electric 10", monospace',
    previewClassName: "font-normal tracking-[0.015em]",
    fitBias: 0.06,
  },
  {
    id: "electric-11",
    label: "Electric 11",
    previewFamily: '"Monceri Electric 11", sans-serif',
    previewClassName: "font-normal lowercase tracking-[0.02em]",
    fitBias: 0.04,
  },
];

const sizeVisualMetadata: Record<
  string,
  Pick<SizeOption, "previewMaxWidth" | "singleLineClassName" | "multiLineClassName">
> = {
  "50cm": {
    previewMaxWidth: "320px",
    singleLineClassName: "text-[2.2rem] sm:text-4xl xl:text-5xl",
    multiLineClassName: "text-[1.8rem] sm:text-3xl xl:text-4xl",
  },
  "70cm": {
    previewMaxWidth: "360px",
    singleLineClassName: "text-[2.45rem] sm:text-5xl xl:text-6xl",
    multiLineClassName: "text-[1.95rem] sm:text-4xl xl:text-5xl",
  },
  "90cm": {
    previewMaxWidth: "420px",
    singleLineClassName: "text-[2.65rem] sm:text-5xl xl:text-6xl",
    multiLineClassName: "text-[2.05rem] sm:text-4xl xl:text-5xl",
  },
  "100cm": {
    previewMaxWidth: "450px",
    singleLineClassName: "text-[2.8rem] sm:text-5xl xl:text-6xl",
    multiLineClassName: "text-[2.15rem] sm:text-4xl xl:text-5xl",
  },
  "120cm": {
    previewMaxWidth: "510px",
    singleLineClassName: "text-[3rem] sm:text-6xl xl:text-7xl",
    multiLineClassName: "text-[2.35rem] sm:text-5xl xl:text-6xl",
  },
  "150cm": {
    previewMaxWidth: "580px",
    singleLineClassName: "text-[3.1rem] sm:text-6xl xl:text-7xl",
    multiLineClassName: "text-[2.5rem] sm:text-5xl xl:text-6xl",
  },
  "200cm": {
    previewMaxWidth: "660px",
    singleLineClassName: "text-[3.3rem] sm:text-7xl xl:text-[5.5rem]",
    multiLineClassName: "text-[2.7rem] sm:text-6xl xl:text-7xl",
  },
};

export const sizeOptions: SizeOption[] = CONFIGURATOR_SIZES.map((size) => ({
  ...size,
  ...sizeVisualMetadata[size.id],
}));

const showroomBackgroundStyle = {
  backgroundImage: "url('/monceri-brick-showroom.svg')",
} as const;

const simulatorPhotoBackgroundStyle = {
  backgroundImage: "url('/simulator-window-loft.png')",
} as const;

export const environmentOptions: EnvironmentOption[] = [
  {
    id: "lounge",
    label: "Sala urbana",
    helper: "Ambiente lifestyle",
    style: {
      ...simulatorPhotoBackgroundStyle,
      backgroundPosition: "center center",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    },
  },
  {
    id: "showroom",
    label: "Showroom",
    helper: "Paneles premium",
    style: {
      ...showroomBackgroundStyle,
      backgroundPosition: "center 60%",
      backgroundRepeat: "no-repeat",
      backgroundSize: "auto 100%",
    },
  },
];

export const neonColors: NeonColor[] = [
  {
    id: "red",
    label: "Rojo",
    hex: "#ff2a2a",
    swatchBackground: "#ff2a2a",
  },
  {
    id: "white",
    label: "Blanco",
    hex: "#ffffff",
    swatchBackground: "#ffffff",
  },
  {
    id: "green",
    label: "Verde",
    hex: "#49ff15",
    swatchBackground: "#49ff15",
  },
  {
    id: "yellow",
    label: "Amarillo",
    hex: "#ffd400",
    swatchBackground: "#ffd400",
  },
  {
    id: "sky",
    label: "Azul cielo",
    hex: "#5ad8ff",
    swatchBackground: "#5ad8ff",
  },
  {
    id: "pink",
    label: "Rosa",
    hex: "#ff38b8",
    swatchBackground: "#ff38b8",
  },
  {
    id: "warm-white",
    label: "Warm white",
    hex: "#fff6ae",
    swatchBackground: "#fff6ae",
  },
  {
    id: "purple",
    label: "Morado",
    hex: "#931bff",
    swatchBackground: "#931bff",
  },
  {
    id: "orange",
    label: "Naranja",
    hex: "#ffa62b",
    swatchBackground: "#ffa62b",
  },
  {
    id: "blue",
    label: "Azul",
    hex: "#4625ff",
    swatchBackground: "#4625ff",
  },
  {
    id: "rainbow",
    label: "Multicolor",
    hex: "#ffffff",
    swatchBackground:
      "conic-gradient(from 180deg at 50% 50%, #ff2a2a 0deg, #ffd400 72deg, #49ff15 150deg, #5ad8ff 228deg, #4625ff 300deg, #ff38b8 360deg)",
    isMulticolor: true,
  },
];
