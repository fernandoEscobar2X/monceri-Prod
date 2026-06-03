import { create } from "zustand";
import { persist } from "zustand/middleware";

const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000;

type PopupState = {
  dismiss: () => void;
  dismissedUntil: number | null;
  shouldShow: () => boolean;
};

export const usePopupStore = create<PopupState>()(
  persist(
    (set, get) => ({
      dismiss: () => set({ dismissedUntil: Date.now() + DISMISS_DURATION_MS }),
      dismissedUntil: null,
      shouldShow: () => {
        const dismissedUntil = get().dismissedUntil;
        return dismissedUntil === null || dismissedUntil < Date.now();
      },
    }),
    {
      name: "monceri-popup-v1",
      partialize: (state) => ({ dismissedUntil: state.dismissedUntil }),
    },
  ),
);
