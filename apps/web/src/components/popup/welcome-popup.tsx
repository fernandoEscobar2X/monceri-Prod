"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Collection } from "@monceri/shared";
import { collectionImageUrl, fetchPopupCollection } from "@/lib/collections";
import { usePopupStore } from "@/stores/popup";

const focusableSelector =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function WelcomePopup() {
  const [collection, setCollection] = useState<Collection | null>(null);
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const dismiss = usePopupStore((state) => state.dismiss);
  const shouldShow = usePopupStore((state) => state.shouldShow);

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(() => {
      if (!shouldShow()) {
        return;
      }

      fetchPopupCollection()
        .then((nextCollection) => {
          if (!cancelled && nextCollection) {
            setCollection(nextCollection);
            setOpen(true);
          }
        })
        .catch(() => undefined);
    }, 1500);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [shouldShow]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    if (open) {
      const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(focusableSelector);
      firstFocusable?.focus();
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function closePopup() {
    dismiss();
    setOpen(false);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      closePopup();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);

    if (focusable.length === 0) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  if (!collection) {
    return null;
  }

  const image = collectionImageUrl(collection.popupImageUrl ?? collection.bannerImageUrl);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#111827]/60 px-4 py-6"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closePopup();
            }
          }}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-labelledby="welcome-popup-title"
            aria-modal="true"
            className="relative grid max-h-[92vh] w-full max-w-4xl overflow-hidden border-2 border-[#111827] bg-white shadow-[8px_8px_0_#111827] md:grid-cols-[1fr_1fr]"
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            onKeyDown={handleKeyDown}
            ref={dialogRef}
            role="dialog"
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <button
              aria-label="Cerrar bienvenida"
              className="absolute right-4 top-4 z-10 inline-flex size-11 items-center justify-center rounded-full border-2 border-[#111827] bg-white text-[#111827] shadow-[3px_3px_0_#111827]"
              onClick={closePopup}
              type="button"
            >
              <X className="size-5" />
            </button>
            <div className="relative min-h-[260px] bg-[#111827] md:min-h-[520px]">
              <Image alt={collection.name} className="object-cover" fill sizes="(min-width: 768px) 50vw, 100vw" src={image} />
            </div>
            <div className="flex flex-col justify-center px-6 py-8 sm:px-8">
              {collection.tagline ? (
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[#E63946]">
                  {collection.tagline}
                </p>
              ) : null}
              <h2
                className="font-display mt-3 text-4xl font-black leading-none tracking-tight text-[#111827] sm:text-5xl"
                id="welcome-popup-title"
              >
                {collection.name}
              </h2>
              {collection.description ? (
                <p className="mt-5 text-base leading-7 text-gray-600">{collection.description}</p>
              ) : null}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#E63946] px-5 text-sm font-black uppercase tracking-[0.16em] text-white"
                  href={`/temporada/${collection.slug}`}
                  onClick={closePopup}
                >
                  {collection.ctaLabel ?? "Ver temporada"}
                </Link>
                <button
                  className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[#111827] bg-white px-5 text-sm font-black uppercase tracking-[0.16em] text-[#111827]"
                  onClick={closePopup}
                  type="button"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
