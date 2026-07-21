"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckSquare, Hourglass, Square } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  checklistPerfilIncompleto,
  perfilAguardandoAnalise,
  perfilTemPendencias,
  type ItemChecklistPerfil,
} from "@/lib/influenciador/perfil-storage";
import { cn } from "@/lib/utils";

export function BannerCompletarPerfil() {
  const { usuario } = useAuth();
  const [itens, setItens] = useState<ItemChecklistPerfil[]>([]);
  const [aguardandoAnalise, setAguardandoAnalise] = useState(false);
  const [temPendencias, setTemPendencias] = useState(false);

  useEffect(() => {
    if (!usuario || usuario.tipo !== "influenciador") {
      setItens([]);
      setTemPendencias(false);
      setAguardandoAnalise(false);
      return;
    }
    setItens(checklistPerfilIncompleto(usuario.id));
    setTemPendencias(perfilTemPendencias(usuario.id));
    setAguardandoAnalise(perfilAguardandoAnalise(usuario.id));
  }, [usuario]);

  if (!usuario || usuario.tipo !== "influenciador") return null;
  if (!temPendencias && !aguardandoAnalise) return null;

  return (
    <aside
      className="banner-informativo space-y-4 rounded-card p-4"
      aria-labelledby="banner-completar-perfil"
    >
      {aguardandoAnalise ? (
        <div className="flex gap-3">
          <Hourglass
            className="text-verde-neon mt-0.5 size-4 shrink-0"
            aria-hidden
          />
          <div className="space-y-1">
            <p
              id="banner-completar-perfil"
              className="font-display text-sm font-bold"
            >
              Perfil em análise
            </p>
            <p className="text-texto-secundario text-sm font-normal leading-relaxed">
              Recebemos o print das suas métricas. A moderação vai revisar seu
              perfil — enquanto isso, você já pode usar o app normalmente.
            </p>
          </div>
        </div>
      ) : (
        <div>
          <p
            id="banner-completar-perfil"
            className="font-display text-sm font-bold"
          >
            Complete seu perfil
          </p>
          <p className="text-texto-secundario mt-1 text-sm font-normal leading-relaxed">
            Você já pode navegar pelo app. Para aparecer em buscas e liberar a
            análise do perfil, complete os itens abaixo.
          </p>
        </div>
      )}

      {temPendencias ? (
        <ul className="space-y-3" aria-label="Itens pendentes do perfil">
          {itens.map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex gap-2">
                {item.completo ? (
                  <CheckSquare
                    className="text-verde-neon mt-0.5 size-4 shrink-0"
                    aria-hidden
                  />
                ) : (
                  <Square
                    className="text-texto-secundario mt-0.5 size-4 shrink-0"
                    aria-hidden
                  />
                )}
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      item.completo && "text-texto-secundario line-through",
                    )}
                  >
                    {item.label}
                  </p>
                  {item.descricao && !item.completo ? (
                    <p className="text-texto-secundario mt-0.5 text-xs font-normal leading-relaxed">
                      {item.descricao}
                    </p>
                  ) : null}
                </div>
              </div>
              {!item.completo ? (
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "shrink-0 self-start",
                  )}
                >
                  Completar agora
                </Link>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
