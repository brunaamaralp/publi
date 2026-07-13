"use client";

import { MatchRing } from "@/components/ui/match-ring";

export function HeroMatchPreview() {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="absolute inset-0 -z-10 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--lilas) 25%, transparent) 0%, color-mix(in srgb, var(--verde-neon) 12%, transparent) 45%, transparent 70%)",
        }}
        aria-hidden
      />
      <MatchRing
        score={92}
        size="lg"
        darkBackdrop
        showLabel
        label="compatível"
      />
      <p className="mt-4 max-w-[200px] text-center text-xs leading-relaxed font-normal text-lilas-claro/90">
        Score de match entre perfil do criador e briefing da campanha
      </p>
    </div>
  );
}
