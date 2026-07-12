"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Eye, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { FormularioCadastroEmpresa } from "@/components/empresa/formulario-cadastro";
import { SeletorEmpresaCliente } from "@/components/agencia/seletor-empresa-cliente";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress, ProgressLabel } from "@/components/ui/progress";
import { Stepper } from "@/components/ui/stepper";
import {
  useAgencia,
  type EmpresaClienteVinculada,
} from "@/lib/contexts/agencia-context";
import {
  criarEmpresaCadastroInicial,
} from "@/lib/empresa/cadastro-types";
import { EMPRESAS_PLATAFORMA_MOCK } from "@/lib/mock-data/empresas";
import {
  agenciaCadastroFormSchema,
  empresaCadastroFormSchema,
} from "@/lib/schemas/empresa-cadastro";
import type { Agencia } from "@/lib/types";

const PASSOS = [
  { id: "dados", label: "Dados", description: "Agência" },
  { id: "clientes", label: "Clientes", description: "Empresas" },
] as const;

type CadastroAgenciaProps = {
  onConcluido?: () => void;
};

export function CadastroAgencia({ onConcluido }: CadastroAgenciaProps) {
  const { inicializarAgencia } = useAgencia();
  const [passo, setPasso] = useState(0);
  const [razaoSocial, setRazaoSocial] = useState("");
  const [erroRazao, setErroRazao] = useState<string | null>(null);
  const [busca, setBusca] = useState("");
  const [selecionadas, setSelecionadas] = useState<EmpresaClienteVinculada[]>(
    [],
  );
  const [dialogAberto, setDialogAberto] = useState(false);
  const [novaEmpresaDraft, setNovaEmpresaDraft] = useState(
    criarEmpresaCadastroInicial,
  );
  const [errosNovaEmpresa, setErrosNovaEmpresa] = useState<
    Record<string, string>
  >({});

  const empresasFiltradas = EMPRESAS_PLATAFORMA_MOCK.filter((emp) => {
    const termo = busca.toLowerCase();
    const jaSelecionada = selecionadas.some((s) => s.id === emp.id);
    if (jaSelecionada) return false;
    if (!termo) return true;
    return (
      emp.razaoSocial.toLowerCase().includes(termo) ||
      emp.nomeFantasia?.toLowerCase().includes(termo) ||
      emp.segmento.toLowerCase().includes(termo)
    );
  });

  function avancarPasso1() {
    const result = agenciaCadastroFormSchema.safeParse({ razaoSocial });
    if (!result.success) {
      setErroRazao(result.error.issues[0]?.message ?? "Dados inválidos");
      return;
    }
    setErroRazao(null);
    setPasso(1);
  }

  function vincularEmpresa(empresa: (typeof EMPRESAS_PLATAFORMA_MOCK)[number]) {
    const vinculada: EmpresaClienteVinculada = {
      ...empresa,
      criadaPelaAgencia: false,
    };
    setSelecionadas((prev) =>
      prev.some((e) => e.id === empresa.id) ? prev : [...prev, vinculada],
    );
  }

  function removerEmpresa(id: string) {
    setSelecionadas((prev) => prev.filter((e) => e.id !== id));
  }

  function criarEmpresaCliente() {
    const dados = {
      razaoSocial: novaEmpresaDraft.razaoSocial,
      segmento: novaEmpresaDraft.segmento,
      orcamentoMedioCampanha:
        novaEmpresaDraft.orcamentoMedioCampanha === ""
          ? undefined
          : novaEmpresaDraft.orcamentoMedioCampanha,
    };

    const result = empresaCadastroFormSchema.safeParse(dados);
    if (!result.success) {
      const novosErros: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const path = issue.path[0]?.toString() ?? "root";
        novosErros[path] = issue.message;
      }
      setErrosNovaEmpresa(novosErros);
      return;
    }

    const nova: EmpresaClienteVinculada = {
      id: crypto.randomUUID(),
      usuarioId: "usr-empresa-nova",
      razaoSocial: result.data.razaoSocial,
      segmento: result.data.segmento,
      nomeFantasia: result.data.razaoSocial,
      criadaPelaAgencia: true,
    };

    setSelecionadas((prev) => [...prev, nova]);
    setNovaEmpresaDraft(criarEmpresaCadastroInicial());
    setErrosNovaEmpresa({});
    setDialogAberto(false);
    toast.success("Empresa-cliente criada e vinculada.");
  }

  function concluir() {
    if (selecionadas.length === 0) {
      toast.error("Vincule pelo menos uma empresa-cliente.");
      return;
    }

    const agencia: Agencia = {
      id: crypto.randomUUID(),
      usuarioId: "usr-agencia-mock",
      razaoSocial,
    };

    inicializarAgencia(agencia, selecionadas);

    console.log("Cadastro agência concluído:", {
      agencia,
      vinculos: selecionadas.map((e) => ({
        agenciaId: agencia.id,
        empresaId: e.id,
        criadaPelaAgencia: e.criadaPelaAgencia,
      })),
    });

    toast.success("Cadastro da agência concluído!");
    onConcluido?.();
  }

  const progresso = ((passo + 1) / PASSOS.length) * 100;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <header className="mb-8 space-y-4">
        <div>
          <p className="text-primary text-sm font-medium">Cadastro de agência</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">
            Gerencie empresas-clientes na plataforma
          </h1>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm">
            A agência não substitui a empresa como contraparte contratual — quem
            assina contratos é sempre a empresa-cliente.
          </p>
        </div>

        <Progress value={progresso} aria-label="Progresso do cadastro">
          <ProgressLabel>
            Passo {passo + 1} de {PASSOS.length}
          </ProgressLabel>
        </Progress>
        <Stepper steps={[...PASSOS]} currentStep={passo} />
      </header>

      {passo === 0 ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="agencia-razao">
              Razão social <span className="text-destructive">*</span>
            </Label>
            <Input
              id="agencia-razao"
              value={razaoSocial}
              onChange={(e) => setRazaoSocial(e.target.value)}
              aria-invalid={!!erroRazao}
              placeholder="Nome legal da agência"
            />
            {erroRazao ? (
              <p role="alert" className="text-destructive text-sm">
                {erroRazao}
              </p>
            ) : null}
          </div>

          <footer className="flex justify-end">
            <Button type="button" onClick={avancarPasso1}>
              Continuar
            </Button>
          </footer>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">Adicionar empresas-clientes</h2>
            <p className="text-muted-foreground text-sm">
              Vincule empresas já cadastradas ou crie uma nova. Empresas de
              terceiros ficam em modo somente visualização.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou segmento..."
                className="pl-9"
                aria-label="Buscar empresas na plataforma"
              />
            </div>
            <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
              <DialogTrigger
                render={<Button type="button" variant="outline" />}
              >
                <Plus className="size-4" aria-hidden />
                Criar empresa-cliente
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Nova empresa-cliente</DialogTitle>
                  <DialogDescription>
                    Empresas criadas por você poderão ser editadas depois.
                    Demais empresas ficam em modo visualização.
                  </DialogDescription>
                </DialogHeader>
                <FormularioCadastroEmpresa
                  draft={novaEmpresaDraft}
                  onChange={(p) =>
                    setNovaEmpresaDraft((prev) => ({ ...prev, ...p }))
                  }
                  errors={errosNovaEmpresa}
                  idPrefix="nova-empresa"
                />
                <DialogFooter>
                  <Button type="button" onClick={criarEmpresaCliente}>
                    Criar e vincular
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium">Empresas na plataforma</h3>
            {empresasFiltradas.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nenhuma empresa encontrada para vincular.
              </p>
            ) : (
              <ul className="space-y-2">
                {empresasFiltradas.map((emp) => (
                  <li key={emp.id}>
                    <Card size="sm">
                      <CardHeader className="flex-row items-center justify-between gap-2 py-3">
                        <div>
                          <CardTitle className="text-sm">
                            {emp.nomeFantasia ?? emp.razaoSocial}
                          </CardTitle>
                          <CardDescription>{emp.segmento}</CardDescription>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => vincularEmpresa(emp)}
                        >
                          Vincular
                        </Button>
                      </CardHeader>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {selecionadas.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">
                Empresas vinculadas ({selecionadas.length})
              </h3>
              <ul className="space-y-2">
                {selecionadas.map((emp) => (
                  <li
                    key={emp.id}
                    className="border-border flex items-center justify-between gap-3 rounded-card border p-3"
                  >
                    <div className="flex items-start gap-3">
                      <Building2
                        className="text-muted-foreground mt-0.5 size-4 shrink-0"
                        aria-hidden
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {emp.nomeFantasia ?? emp.razaoSocial}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          <Badge variant="secondary">{emp.segmento}</Badge>
                          {emp.criadaPelaAgencia ? (
                            <Badge variant="default">Criada por você</Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1">
                              <Eye className="size-3" aria-hidden />
                              Somente visualização
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removerEmpresa(emp.id)}
                    >
                      Remover
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <footer className="border-border flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPasso(0)}
            >
              Voltar
            </Button>
            <Button type="button" onClick={concluir}>
              Concluir cadastro
            </Button>
          </footer>
        </div>
      )}
    </div>
  );
}

export function PainelAgenciaConcluido() {
  const { agencia, empresaAtiva } = useAgencia();

  return (
    <div className="min-h-screen">
      <header className="border-border bg-background/95 sticky top-0 z-10 border-b px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium">{agencia?.razaoSocial}</p>
          <SeletorEmpresaCliente />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-12 text-center sm:px-6">
        <h1 className="text-2xl font-semibold">Conta configurada</h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Use o seletor acima para alternar entre as empresas-clientes que você
          gerencia. O contexto ativo será reutilizado em demandas e resultados de
          campanha.
        </p>
        {empresaAtiva ? (
          <Card className="mt-8 text-left">
            <CardHeader>
              <CardTitle className="text-base">
                Contexto ativo: {empresaAtiva.nomeFantasia ?? empresaAtiva.razaoSocial}
              </CardTitle>
              <CardDescription>
                {empresaAtiva.criadaPelaAgencia
                  ? "Você criou esta empresa — edição disponível em telas futuras."
                  : "Empresa de terceiros — modo somente visualização."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                Segmento: {empresaAtiva.segmento}
              </p>
              <Link
                href="/agencia/dashboard"
                className={buttonVariants()}
              >
                Ir para o dashboard
              </Link>
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
