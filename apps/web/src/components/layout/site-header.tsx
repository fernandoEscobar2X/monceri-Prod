"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, MessageCircle, Search, ShoppingCart, X } from "lucide-react";
import Link from "next/link";

type SiteHeaderProps = {
  cartCount: number;
  categories: string[];
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  onOpenCart: () => void;
  onScrollToSection: (sectionId: string) => void;
  onToggleMobileMenu: () => void;
};

export function SiteHeader({
  cartCount,
  mobileMenuOpen,
  onCloseMobileMenu,
  onOpenCart,
  onScrollToSection,
  onToggleMobileMenu,
}: SiteHeaderProps) {
  return (
    <>
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
              aria-controls="mobile-site-menu"
              aria-expanded={mobileMenuOpen}
              onClick={onToggleMobileMenu}
              className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-gray-300 lg:hidden"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <a href="#inicio" className="font-display text-2xl font-black tracking-tight text-[#111827]">
              M<span className="text-[#E63946]">O</span>NCERI
            </a>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-gray-600 lg:flex">
            <Link href="/#configurador" className="transition hover:text-[#111827]">
              Configurador
            </Link>
            <Link href="/catalogo" className="transition hover:text-[#111827]">
              Catalogo
            </Link>
            <Link href="/#contacto" className="transition hover:text-[#111827]">
              Contacto
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Buscar"
              onClick={() => onScrollToSection("catalogo")}
              className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-[#111827]"
            >
              <Search className="size-4.5" />
            </button>
            <button
              type="button"
              aria-label="Contacto"
              onClick={() => onScrollToSection("contacto")}
              className="inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-[#111827]"
            >
              <MessageCircle className="size-4.5" />
            </button>
            <button
              type="button"
              onClick={onOpenCart}
              aria-label="Abrir carrito"
              className="relative inline-flex size-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:text-[#111827]"
            >
              <ShoppingCart className="size-4.5" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex size-5 items-center justify-center rounded-full bg-[#E63946] text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Cerrar menu"
              className="fixed inset-0 z-40 bg-[#111827]/45 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobileMenu}
            />
            <motion.aside
              id="mobile-site-menu"
              className="absolute inset-x-0 top-full z-50 border-b border-gray-200 bg-white px-4 pb-5 pt-4 shadow-[0_24px_48px_rgba(17,24,39,0.12)] lg:hidden"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onScrollToSection("configurador")}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#111827] px-4 text-sm font-semibold text-white"
                  >
                    Cotizar
                  </button>
                  <button
                    type="button"
                    onClick={onOpenCart}
                    className="inline-flex min-h-11 items-center justify-center rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-[#111827]"
                  >
                    Carrito {cartCount > 0 ? `(${cartCount})` : ""}
                  </button>
                </div>

                <nav className="grid gap-2 text-left">
                  {[
                    { href: "/#configurador", label: "Configurador" },
                    { href: "/catalogo", label: "Catalogo" },
                    { href: "/#contacto", label: "Contacto" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onCloseMobileMenu}
                      className="flex items-center justify-between rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-3 text-sm font-semibold text-[#111827]"
                    >
                      {item.label}
                      <ArrowRight className="size-4 text-[#E63946]" />
                    </Link>
                  ))}
                </nav>

                <div className="rounded-2xl border border-gray-200 bg-[#FAFAFA] px-4 py-4 text-left">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E63946]">
                    Atencion directa
                  </p>
                  <a
                    href="https://wa.me/message/66WQ7VIAYOOZB1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 block text-sm font-semibold text-[#111827]"
                  >
                    WhatsApp: +52 228 411 31 48
                  </a>
                  <p className="mt-1 text-sm text-gray-500">
                    Avenida Miguel Aleman #13, Xalapa, Veracruz
                  </p>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
