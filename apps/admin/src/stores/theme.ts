import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
  toggleMode: () => void;
};

function getPreferredMode(): ThemeMode {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: getPreferredMode(),
      toggleMode: () =>
        set((state) => ({
          mode: state.mode === "dark" ? "light" : "dark",
        })),
    }),
    {
      name: "monceri-admin-theme-v1",
      partialize: (state) => ({ mode: state.mode }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
