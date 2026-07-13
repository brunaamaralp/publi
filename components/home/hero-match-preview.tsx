"use client";

import { MatchRing } from "@/components/ui/match-ring";

export function HeroMatchPreview() {
  return (
    <div className="relative flex flex-col items-center">
      <div
        className="absolute inset-0 -z-10 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--verde-neon) 15%, transparent) 0%, transparent 70%)",
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
      <p className="text-texto-secundario mt-4 max-w-[200px] text-center text-xs leading-relaxed font-normal">
        Score de match entre perfil do criador e briefing da campanha
      </p>
    </div>
  );
}
