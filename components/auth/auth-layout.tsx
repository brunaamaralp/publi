import Link from "next/link";

type AuthLayoutProps = {
  children: React.ReactNode;
  titulo: string;
  subtitulo?: string;
};

export function AuthLayout({ children, titulo, subtitulo }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-verde-carvao p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute top-1/4 left-1/2 size-64 -translate-x-1/2 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--verde-neon) 45%, transparent) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <Link href="/" className="relative font-display text-2xl font-semibold">
          Publi
        </Link>
        <div className="relative space-y-4">
          <p className="text-verde-neon text-xs font-semibold uppercase tracking-widest">
            Marketplace de influência
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-balance">
            {titulo}
          </h1>
          {subtitulo ? (
            <p className="max-w-md text-sm leading-relaxed text-zinc-400">
              {subtitulo}
            </p>
          ) : null}
        </div>
        <p className="relative text-xs text-zinc-500">
          Autenticação simulada — sem backend nesta fase.
        </p>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b px-4 py-4 lg:hidden">
          <Link href="/" className="font-display text-lg font-semibold">
            Publi
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
