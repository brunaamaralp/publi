"use client";

import { useState } from "react";
import { toast } from "sonner";

import { FormularioCadastroEmpresa } from "@/components/empresa/formulario-cadastro";
import { PerfilEmAnalise } from "@/components/shared/perfil-em-analise";
import { Button } from "@/components/ui/button";
import {
  criarEmpresaCadastroInicial,
  type EmpresaCadastroDraft,
} from "@/lib/empresa/cadastro-types";
import { empresaCadastroFormSchema } from "@/lib/schemas/empresa-cadastro";
import type { Empresa } from "@/lib/types";
import type { AudienciaLinha } from "@/lib/influenciador/cadastro-types";
import type { PublicoAlvoDemanda } from "@/lib/types/demanda";
import type { Usuario } from "@/lib/types/usuario";

function mapPublico(
  linhas: AudienciaLinha[],
  dimensao: PublicoAlvoDemanda["dimensao"],
): PublicoAlvoDemanda[] {
  return linhas
    .filter((l) => l.valor.trim())
    .map((l) => ({ dimensao, valor: l.valor }));
}

function montarPublicoAlvo(draft: EmpresaCadastroDraft): PublicoAlvoDemanda[] {
  return [
    ...mapPublico(draft.publicoGenero, "genero"),
    ...mapPublico(draft.publicoFaixaEtaria, "faixa_etaria"),
    ...mapPublico(draft.publicoLocalidade, "localidade"),
  ];
}

export function CadastroEmpresa() {
  const [draft, setDraft] = useState<EmpresaCadastroDraft>(
    criarEmpresaCadastroInicial,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [concluido, setConcluido] = useState(false);

  function updateDraft(partial: Partial<EmpresaCadastroDraft>) {
    setDraft((prev) => ({ ...prev, ...partial }));
  }

  function handleSubmit() {
    const dados = {
      razaoSocial: draft.razaoSocial,
      segmento: draft.segmento,
      orcamentoMedioCampanha:
        draft.orcamentoMedioCampanha === ""
          ? undefined
          : draft.orcamentoMedioCampanha,
    };

    const result = empresaCadastroFormSchema.safeParse(dados);
    if (!result.success) {
      const novosErros: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0]?.toString() ?? "root";
        novosErros[path] = issue.message;
      }
      setErrors(novosErros);
      toast.error("Revise os campos obrigatórios.");
      return;
    }

    const payload = {
      usuario: {
        id: crypto.randomUUID(),
        email: "empresa@exemplo.com",
        tipo: "empresa" as const,
        status: "pendente_verificacao" as const,
        criadoEm: new Date().toISOString(),
      } satisfies Usuario,
      empresa: {
        id: crypto.randomUUID(),
        usuarioId: "usr-empresa-mock",
        razaoSocial: result.data.razaoSocial,
        segmento: result.data.segmento,
      } satisfies Empresa,
      orcamentoMedioCampanha: result.data.orcamentoMedioCampanha,
      publicoAlvo: montarPublicoAlvo(draft),
    };

    console.log("Cadastro empresa concluído:", payload);
    toast.success("Cadastro enviado com sucesso!");
    setConcluido(true);
  }

  if (concluido) {
    return <PerfilEmAnalise tipoConta="empresa" />;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8">
        <p className="text-primary text-sm font-medium">Cadastro de empresa</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Cadastre sua marca
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Conecte-se a influenciadores digitais para campanhas de publicidade.
          Preencha os dados abaixo para começar.
        </p>
      </header>

      <FormularioCadastroEmpresa
        draft={draft}
        onChange={updateDraft}
        errors={errors}
      />

      <footer className="border-border mt-10 border-t pt-6">
        <Button type="button" onClick={handleSubmit} className="w-full sm:w-auto">
          Concluir cadastro
        </Button>
      </footer>
    </div>
  );
}
