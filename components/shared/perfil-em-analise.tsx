"use client";

import { Clock, Search } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const MENSAGENS: Record<
  "influenciador" | "empresa" | "agencia",
  { descricao: string; visibilidade: React.ReactNode }
> = {
  influenciador: {
    descricao:
      "Seu cadastro foi enviado com sucesso. Nossa equipe está revisando suas informações e métricas antes de liberar seu perfil para empresas.",
    visibilidade: (
      <>
        Seu perfil ainda <strong>não aparece</strong> nas buscas nem no
        algoritmo de match até a aprovação.
      </>
    ),
  },
  empresa: {
    descricao:
      "Seu cadastro foi enviado com sucesso. Nossa equipe está revisando os dados da empresa antes de liberar o acesso à busca de influenciadores.",
    visibilidade: (
      <>
        Sua empresa ainda <strong>não aparece</strong> nas buscas nem pode
        publicar demandas até a aprovação.
      </>
    ),
  },
  agencia: {
    descricao:
      "Seu cadastro foi enviado com sucesso. Nossa equipe está revisando os dados da agência antes de liberar o gerenciamento de empresas-clientes.",
    visibilidade: (
      <>
        Sua agência ainda <strong>não pode operar</strong> em nome das
        empresas-clientes na plataforma até a aprovação.
      </>
    ),
  },
};

type PerfilEmAnaliseProps = {
  tipoConta?: "influenciador" | "empresa" | "agencia";
  className?: string;
};

export function PerfilEmAnalise({
  tipoConta = "influenciador",
  className,
}: PerfilEmAnaliseProps) {
  const mensagens = MENSAGENS[tipoConta];

  return (
    <div
      className={cn(
        "mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-12 text-center",
        className,
      )}
    >
      <div className="bg-primary/10 mb-6 flex size-16 items-center justify-center rounded-full">
        <Clock className="text-primary size-8" aria-hidden />
      </div>

      <h1 className="text-2xl font-semibold tracking-tight">
        Perfil em análise
      </h1>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        {mensagens.descricao}
      </p>

      <Card className="mt-8 w-full text-left">
        <CardHeader>
          <CardTitle className="text-base">O que acontece agora?</CardTitle>
          <CardDescription>
            Status da conta:{" "}
            <span className="text-foreground font-medium">
              pendente_verificacao
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <Search className="text-muted-foreground mt-0.5 size-4 shrink-0" />
            <p>{mensagens.visibilidade}</p>
          </div>
          <p className="text-muted-foreground">
            Você pode continuar navegando pela plataforma. Avisaremos quando o
            perfil for aprovado.
          </p>
        </CardContent>
      </Card>

      <a
        href="/"
        className="border-border bg-background hover:bg-muted mt-8 inline-flex h-9 items-center justify-center rounded-button border px-4 text-sm font-medium"
      >
        Voltar ao início
      </a>
    </div>
  );
}
