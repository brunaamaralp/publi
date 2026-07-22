"use client";

import Link from "next/link";
import { motion } from "motion/react";

const TEXT_SHADOW =
  "1px 1px 0 #14201a, 2px 2px 0 #14201a, 3px 3px 0 #14201a, 4px 4px 0 #14201a, 5px 5px 0 #14201a, 6px 6px 0 #14201a, 7px 7px 0 #14201a, 8px 8px 0 #14201a, 9px 9px 0 #14201a, 10px 10px 0 #14201a, 11px 11px 0 #14201a, 12px 12px 0 #14201a";

const DISPLAY_FONT = {
  fontFamily: "var(--font-display), Impact, sans-serif",
  textShadow: TEXT_SHADOW,
} as const;

const NAV_LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#para-quem", label: "Para quem" },
  { href: "#recursos", label: "Recursos" },
] as const;

const ArrowGreenLeft = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible stroke-current text-verde-neon"
    fill="none"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
    <path d="M80,55 L95,70 L85,85" />
  </svg>
);

const ArrowGreenRight = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible stroke-current text-verde-neon"
    fill="none"
    strokeWidth="6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M90,10 C 80,60 60,80 40,60 C 20,40 40,20 60,30 C 80,40 70,70 50,80" />
    <path d="M65,75 L50,80 L55,65" />
  </svg>
);

const ArrowBlack = () => (
  <svg
    viewBox="0 0 100 100"
    className="h-full w-full overflow-visible stroke-current text-verde-carvao"
    fill="none"
    strokeWidth="5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20,80 Q 40,20 80,40" />
    <path d="M60,20 L80,40 L50,60" />
  </svg>
);

function CircularBadge() {
  return (
    <Link
      href="/cadastro"
      className="relative flex h-28 w-28 rotate-12 cursor-pointer items-center justify-center rounded-full border-[3px] border-black/5 bg-verde-neon shadow-xl transition-transform hover:scale-105 md:h-36 md:w-36"
      aria-label="Comece grátis — criar conta"
    >
      <div className="absolute inset-1 animate-[spin_10s_linear_infinite]">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <path
            id="publiCirclePath"
            d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
            fill="none"
          />
          <text
            className="text-[10px] font-black tracking-[0.16em] uppercase"
            fill="black"
          >
            <textPath href="#publiCirclePath" startOffset="0%">
              COMECE GRÁTIS • COMECE GRÁTIS •
            </textPath>
          </text>
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="h-10 w-10 overflow-visible stroke-current text-verde-carvao"
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20,80 Q 40,50 30,30 T 80,20" />
          <path d="M60,10 L80,20 L70,40" />
        </svg>
      </div>
    </Link>
  );
}

export function Hero() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-verde-carvao selection:bg-verde-neon selection:text-verde-carvao">
      {/* Background Grid */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:4rem_4rem]"
        aria-hidden
      />

      {/* Navbar */}
      <nav className="relative z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-6 py-6 md:px-10 md:py-8">
        <Link href="/" className="flex items-center gap-1" aria-label="Publi">
          <div className="relative rounded-2xl rounded-bl-sm bg-white px-3 py-1.5 text-xs font-black tracking-tight text-verde-carvao shadow-sm md:text-sm">
            PUB
            <div
              className="absolute -bottom-1.5 left-0 h-3 w-3 bg-white"
              style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
            />
          </div>
          <div className="rounded-full border-[1.5px] border-white bg-verde-neon px-3 py-1.5 text-xs font-black text-verde-carvao shadow-sm md:text-sm">
            LI
          </div>
        </Link>

        <div className="hidden items-center space-x-2 md:flex">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-xs font-semibold text-white/80 transition-colors hover:text-white sm:inline-flex md:text-sm"
          >
            Entrar
          </Link>
          <Link
            href="/cadastro"
            className="rounded-full border border-white px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-white hover:text-verde-carvao md:px-6 md:text-sm"
          >
            Criar conta
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-4 pb-40 pt-8 md:pb-52 md:pt-12">
        <div className="relative z-10 mx-auto mb-8 mt-4 flex min-h-[28rem] w-full max-w-5xl flex-col items-center justify-center text-center md:min-h-[32rem] md:mb-12">
          <div className="relative z-10 flex w-full flex-col items-center gap-4 md:gap-6">
            <div className="relative z-30 flex w-full justify-center">
              <p
                className="m-0 p-0 text-[clamp(3.5rem,10vw,120px)] font-black uppercase leading-[0.85] tracking-tighter text-verde-neon"
                style={DISPLAY_FONT}
              >
                #PUBLI
              </p>
            </div>

            <h1 className="relative z-20 m-0 max-w-3xl px-4 p-0 text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold leading-tight tracking-tight text-balance text-white md:leading-snug">
              A plataforma que junta marcas e criadores
            </h1>
          </div>

          {/* Absolute Overlays */}
          <div className="pointer-events-none absolute inset-0 h-full w-full">
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="pointer-events-auto absolute bottom-[8%] left-[2%] z-30 md:bottom-[12%] md:left-[8%]"
            >
              <div className="flex aspect-[3/3.5] w-36 rotate-[-12deg] flex-col items-center justify-center rounded-[2rem] border border-white/40 bg-white/20 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:rotate-0 md:w-48">
                <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-[3px] border-white/50 bg-[#D2B48C] shadow-inner md:h-20 md:w-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces"
                    alt="Marina Costa"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-bold text-white md:text-lg">
                    marina.criadora
                  </p>
                  <p className="mt-1 text-[10px] text-white/80 md:text-xs">
                    92% compatível
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="pointer-events-auto absolute right-[2%] top-[6%] z-30 md:right-[10%] md:top-[10%]"
            >
              <div className="flex aspect-[3/3.5] w-36 rotate-[12deg] flex-col items-center justify-center rounded-[2rem] border border-white/40 bg-white/20 p-5 shadow-2xl backdrop-blur-md transition-transform duration-500 hover:rotate-0 md:w-48">
                <div className="mb-4 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-[3px] border-white/50 bg-[#2C3E50] shadow-inner md:h-20 md:w-20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces"
                    alt="Lucas Pereira"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-bold text-white md:text-lg">
                    lucas.lifestyle
                  </p>
                  <p className="mt-1 text-[10px] text-white/80 md:text-xs">
                    R$ 8.500 · Reels
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="absolute bottom-[2%] left-[0%] z-20 h-20 w-20 md:left-[4%] md:h-28 md:w-28">
              <ArrowGreenLeft />
            </div>

            <div className="absolute right-[0%] top-[2%] z-20 h-20 w-20 md:right-[4%] md:h-28 md:w-28">
              <ArrowGreenRight />
            </div>

            <div className="pointer-events-auto absolute bottom-[-6%] right-[0%] z-40 md:bottom-[-4%] md:right-[8%]">
              <CircularBadge />
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Features */}
      <section
        id="como-funciona"
        className="relative z-20 mt-auto w-full rounded-t-[2.5rem] bg-white px-6 py-12 text-verde-carvao shadow-[0_-20px_50px_rgba(0,0,0,0.25)] md:rounded-t-[3.5rem] md:px-10 md:py-16"
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <div className="relative flex h-64 flex-col items-center rounded-[2rem] border border-gray-100 bg-[#F8F9FA] p-8 text-center">
            <h3 className="mb-2 text-xl font-black uppercase leading-tight md:text-2xl">
              Cadastre
              <br />
              seu perfil
            </h3>
            <p className="mb-auto text-[10px] font-bold text-black/60 md:text-xs">
              Influenciador, modelo, marca ou agência em minutos
            </p>

            <div className="relative mt-6 flex w-full justify-center">
              <div className="relative z-10 flex items-center rounded-2xl bg-verde-carvao p-2 pr-14 text-white shadow-lg">
                <div className="mr-3 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-white/30 bg-[#D2B48C]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces"
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold leading-none">
                    marina.criadora
                  </p>
                  <p className="mt-1 text-[8px] leading-none text-white/70">
                    Perfil verificado
                  </p>
                </div>
              </div>
              <div className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-xl bg-verde-neon px-3 py-2 text-[10px] font-black text-verde-carvao shadow-md">
                Pronto
              </div>
            </div>

            <div className="absolute -right-12 bottom-8 z-30 hidden h-16 w-16 md:block">
              <ArrowBlack />
            </div>
          </div>

          <div className="relative flex h-64 flex-col items-center rounded-[2rem] border border-gray-100 bg-[#F8F9FA] p-8 text-center">
            <h3 className="mb-2 text-xl font-black uppercase leading-tight md:text-2xl">
              Busque ou
              <br />
              seja encontrado
            </h3>
            <p className="mb-auto text-[10px] font-bold text-black/60 md:text-xs">
              Score de compatibilidade nos dois sentidos, sem esperar proposta
              chegar
            </p>

            <div className="relative mt-6 flex w-full justify-center">
              <div className="flex items-center rounded-full bg-verde-carvao p-1.5 text-white shadow-lg">
                <div className="mr-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white">
                  92%
                </div>
                <div className="px-4 text-xs font-bold">match</div>
              </div>

              <div className="absolute -bottom-6 right-1/3 z-20 rotate-12 rounded-full bg-verde-neon p-2.5 shadow-lg">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 stroke-current text-verde-carvao"
                  fill="none"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </div>

            <div className="absolute -right-12 bottom-8 z-30 hidden h-16 w-16 md:block">
              <ArrowBlack />
            </div>
          </div>

          <div className="relative flex h-64 flex-col items-center rounded-[2rem] border border-gray-100 bg-[#F8F9FA] p-8 text-center">
            <h3 className="mb-2 text-xl font-black uppercase leading-tight md:text-2xl">
              Negocie e
              <br />
              receba seguro
            </h3>
            <p className="mb-auto text-[10px] font-bold text-black/60 md:text-xs">
              Converse antes de fechar, sem custo; pagamento só libera após a
              entrega aprovada
            </p>

            <div className="relative mt-6 flex w-full max-w-[200px] flex-col items-center rounded-[2rem] bg-verde-neon px-6 py-4 text-verde-carvao shadow-lg">
              <p className="mb-1 text-[9px] font-bold uppercase tracking-wider">
                Pagamento protegido
              </p>
              <p className="text-xl font-black">R$ 8.500</p>
              <div className="absolute -bottom-2 left-8 h-5 w-5 rotate-45 bg-verde-neon" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Alias para demos / integração estilo shadcn */
export const Component = Hero;
