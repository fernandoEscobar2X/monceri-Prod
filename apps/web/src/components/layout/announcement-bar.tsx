"use client";

import { motion } from "framer-motion";

type AnnouncementBarProps = {
  isMobileLayout: boolean;
  items: string[];
};

export function AnnouncementBar({ isMobileLayout, items }: AnnouncementBarProps) {
  const repeatedAnnouncement = [...items, ...items];

  return (
    <div className="overflow-hidden bg-[#E63946] py-3 text-white">
      <motion.div
        className="flex w-max items-center gap-8 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: isMobileLayout ? 22 : 24,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        {repeatedAnnouncement.map((item, index) => (
          <div key={`${item}-${index}`} className="flex items-center gap-8 px-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] sm:text-sm sm:tracking-[0.26em]">
              {item}
            </span>
            <span className="size-1.5 rounded-full bg-white/60" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
