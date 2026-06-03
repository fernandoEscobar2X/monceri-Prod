import Image from "next/image";
import type { SVGProps } from "react";
import { MessageCircle, Music2 } from "lucide-react";

export type PaymentMethod = {
  id: string;
  label: string;
  src: string;
  slotWidth: number;
  slotHeight: number;
  badgeClassName: string;
};

type SiteFooterProps = {
  categories: string[];
  paymentMethods: PaymentMethod[];
};

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M14 8.5h2V5.2c-.35-.05-1.55-.15-2.95-.15-2.92 0-4.92 1.78-4.92 5.05v2.85H5v3.7h3.13V24h3.85v-7.35h3.01l.48-3.7h-3.49v-2.48c0-1.07.29-1.97 2.02-1.97Z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect width="17" height="17" x="3.5" y="3.5" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.35" cy="6.65" r="1.1" fill="currentColor" />
    </svg>
  );
}

const socialLinks = [
  {
    href: "https://www.facebook.com/monceridps",
    icon: FacebookIcon,
    label: "Facebook",
  },
  {
    href: "https://www.instagram.com/monceridps",
    icon: InstagramIcon,
    label: "Instagram",
  },
  {
    href: "https://www.tiktok.com/@monceridps",
    icon: Music2,
    label: "TikTok",
  },
];

function PaymentMethodBadge({ method }: { method: PaymentMethod }) {
  return (
    <li>
      <div
        className={`group inline-flex min-h-12 items-center justify-center rounded-2xl border border-white/18 bg-white/92 px-4 py-3 shadow-[0_14px_34px_rgba(17,24,39,0.18)] transition-[transform,background-color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-white/28 hover:bg-white ${method.badgeClassName}`}
      >
        <span className="sr-only">{method.label}</span>
        <span
          aria-hidden
          className="relative block shrink-0"
          style={{ width: method.slotWidth, height: method.slotHeight }}
        >
          <Image
            src={method.src}
            alt=""
            fill
            aria-hidden
            sizes={`${method.slotWidth}px`}
            className="object-contain opacity-100 grayscale-0 brightness-100 contrast-100 transition-[opacity,filter,transform] duration-200 md:opacity-90 md:grayscale md:brightness-[0.42] md:contrast-[1.2] md:group-hover:scale-[1.02] md:group-hover:opacity-100 md:group-hover:grayscale-0 md:group-hover:brightness-100 md:group-hover:contrast-100"
          />
        </span>
      </div>
    </li>
  );
}

export function SiteFooter({ categories, paymentMethods }: SiteFooterProps) {
  return (
    <footer className="bg-[#E63946] text-white">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/16 pb-10 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.9fr]">
          <div className="max-w-md text-left">
            <p className="font-display text-4xl font-black tracking-tight">Monceri</p>
            <p className="mt-4 text-base leading-7 text-white/82">
              Neon, acrilico, corte laser y piezas visuales con presencia comercial real.
            </p>
            <ul className="mt-6 flex flex-wrap gap-3 sm:gap-4">
              {paymentMethods.map((method) => (
                <PaymentMethodBadge key={method.id} method={method} />
              ))}
            </ul>
          </div>

          <div className="text-left">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/75">Categorias</p>
            <div className="mt-4 space-y-3 text-sm text-white/86">
              {categories.map((item) => (
                <a key={item} href="#catalogo" className="block">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div className="text-left">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/75">Ayuda</p>
            <div className="mt-4 space-y-3 text-sm text-white/86">
              {["Preguntas frecuentes", "Envios", "Instalacion", "Politicas"].map((item) => (
                <a key={item} href="#contacto" className="block">
                  {item}
                </a>
              ))}
            </div>
          </div>

          <div id="contacto" className="text-left">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/75">Contacto</p>
            <div className="mt-4 space-y-3 text-sm text-white/86">
              <p>WhatsApp: +52 228 411 31 48</p>
              <p>Avenida Miguel Aleman #13, Xalapa, Veracruz</p>
              <a
                href="https://maps.app.goo.gl/fs5UqUDzZ4WJuph99?g_st=ipc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex text-white/86 transition hover:text-white"
              >
                Ver en Google Maps
              </a>
            </div>
            <div className="mt-5 flex items-center gap-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                    className="text-white/82 transition hover:text-white"
                  >
                    <Icon className="size-5" />
                  </a>
                );
              })}
            </div>
            <a
              href="#configurador"
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-white/14 bg-[#111827] px-5 text-sm font-bold text-white shadow-[0_14px_28px_rgba(17,24,39,0.24)] transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-black hover:shadow-[0_18px_34px_rgba(17,24,39,0.32)]"
            >
              <MessageCircle className="size-4" />
              Empezar cotizacion
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 text-sm text-white/72 lg:flex-row lg:items-center lg:justify-between">
          <p>VisibleMX x Monceri. Prototipo storefront v1.</p>
          <p>Pedido preparado para WhatsApp, fabricacion y seguimiento manual.</p>
        </div>
      </div>
    </footer>
  );
}
