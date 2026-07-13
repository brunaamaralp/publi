import { EMPRESAS_PLATAFORMA_MOCK } from "@/lib/mock-data/empresas";

const MARCAS_EXIBIDAS = EMPRESAS_PLATAFORMA_MOCK.slice(0, 8);

export function HomeLogos() {
  return (
    <section
      className="border-b border-cinza-200 bg-white py-10"
      aria-label="Marcas na plataforma"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="eyebrow-secao text-center">
          Marcas que já publicam campanhas
        </p>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {MARCAS_EXIBIDAS.map((empresa) => (
            <li key={empresa.id}>
              <span className="font-display text-texto-secundario text-sm font-semibold tracking-tight sm:text-base">
                {empresa.nomeFantasia ?? empresa.razaoSocial}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
