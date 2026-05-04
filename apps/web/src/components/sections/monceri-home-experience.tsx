"use client";

import { useEffect, useState } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Configurator } from "@/components/configurator/configurator";
import { useConfigurator } from "@/components/configurator/use-configurator";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { CasesSection } from "@/components/sections/cases-section";
import { ConfiguratorPreviewSection } from "@/components/sections/configurator-preview-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProductLinesSection } from "@/components/sections/product-lines-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import {
  anatomyDetailStyle,
  announcementItems,
  categories,
  heroInstallationStyle,
  marqueeImages,
  paymentMethods,
  promoBannerStyle,
  reviewCards,
  suggestedProducts,
} from "@/lib/data/storefront-data";
import { formatPrice } from "@/lib/formatters/price";
import { useCartStore } from "@/stores/cart";

export function MonceriHomePrototype() {
  const [isMobileViewport, setIsMobileViewport] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.qty, 0),
  );
  const isMobileLayout = isMobileViewport === true;
  const isPreviewDraggable = isMobileViewport === false;
  const configurator = useConfigurator({
    isMobileLayout,
    isPreviewDraggable,
    onAddedToCart: () => setCartOpen(true),
  });
  const marqueeCards = [...marqueeImages, ...marqueeImages];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleViewportChange = (event?: MediaQueryListEvent) => {
      const nextIsMobileViewport = event ? event.matches : mediaQuery.matches;

      setIsMobileViewport(nextIsMobileViewport);

      if (!nextIsMobileViewport) {
        setMobileMenuOpen(false);
      }
    };

    handleViewportChange();
    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = cartOpen || mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, mobileMenuOpen]);

  function scrollToSection(sectionId: string) {
    setMobileMenuOpen(false);

    const section = document.getElementById(sectionId);

    if (!section) {
      return;
    }

    const stickyOffset = isMobileLayout ? 116 : 132;
    const targetTop = section.getBoundingClientRect().top + window.scrollY - stickyOffset;

    window.scrollTo({
      top: Math.max(targetTop, 0),
      behavior: "smooth",
    });
  }

  function openCart() {
    setMobileMenuOpen(false);
    setCartOpen(true);
  }

  function handleProductDetail(productName: string) {
    configurator.setSuggestedPhrase(productName);
    scrollToSection("configurador");
  }

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-[#111827]">
      <div className="sticky top-0 z-50">
        <AnnouncementBar isMobileLayout={isMobileLayout} items={announcementItems} />
        <SiteHeader
          cartCount={cartCount}
          categories={categories}
          mobileMenuOpen={mobileMenuOpen}
          onCloseMobileMenu={() => setMobileMenuOpen(false)}
          onOpenCart={openCart}
          onScrollToSection={scrollToSection}
          onToggleMobileMenu={() => setMobileMenuOpen((currentOpen) => !currentOpen)}
        />
      </div>

      <HeroSection heroInstallationStyle={heroInstallationStyle} />
      <ConfiguratorPreviewSection promoBannerStyle={promoBannerStyle} />
      <Configurator {...configurator} />
      <CasesSection anatomyDetailStyle={anatomyDetailStyle} />
      <GallerySection isMobileLayout={isMobileLayout} marqueeCards={marqueeCards} />
      <ProductLinesSection
        formatPrice={formatPrice}
        onProductDetail={handleProductDetail}
        products={suggestedProducts}
      />
      <TestimonialsSection reviews={reviewCards} />
      <SiteFooter categories={categories} paymentMethods={paymentMethods} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </main>
  );
}
