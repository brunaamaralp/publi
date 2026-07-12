"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { FormularioCadastroEmpresa } from "@/components/empresa/formulario-cadastro";
import { Button } from "@/components/ui/button";
import {
  Card,
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
import {
  useAgencia,
  type EmpresaClienteVinculada,
} from "@/lib/contexts/agencia-context";
import { criarEmpresaCadastroInicial } from "@/lib/empresa/cadastro-types";
import { EMPRESAS_PLATAFORMA_MOCK } from "@/lib/mock-data/empresas";
import { empresaCadastroFormSchema } from "@/lib/schemas/empresa-cadastro";

type AdicionarEmpresaClienteProps = {
  className?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "xs";
};

export function AdicionarEmpresaCliente({
  className,
  variant = "outline",
  size = "sm",
}: AdicionarEmpresaClienteProps) {
  const { empresasClientes, adicionarEmpresaCliente } = useAgencia();
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [novaEmpresaDraft, setNovaEmpresaDraft] = useState(
    criarEmpresaCadastroInicial,
  );
  const [errosNovaEmpresa, setErrosNovaEmpresa] = useState<
    Record<string, string>
  >({});
  const [aba, setAba] = useState<"vincular" | "criar">("vincular");

  const empresasFiltradas = EMPRESAS_PLATAFORMA_MOCK.filter((emp) => {
    const jaVinculada = empresasClientes.some((e) => e.id === emp.id);
    if (jaVinculada) return false;
    const termo = busca.toLowerCase();
    if (!termo) return true;
    return (
      emp.razaoSocial.toLowerCase().includes(termo) ||
      emp.nomeFantasia?.toLowerCase().includes(termo) ||
      emp.segmento.toLowerCase().includes(termo)
    );
  });

  function vincularEmpresa(empresa: (typeof EMPRESAS_PLATAFORMA_MOCK)[number]) {
    const vinculada: EmpresaClienteVinculada = {
      ...empresa,
      criadaPelaAgencia: false,
    };
    adicionarEmpresaCliente(vinculada);
    toast.success(`${empresa.nomeFantasia ?? empresa.razaoSocial} vinculada.`);
    setAberto(false);
    setBusca("");
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

    adicionarEmpresaCliente(nova);
    setNovaEmpresaDraft(criarEmpresaCadastroInicial());
    setErrosNovaEmpresa({});
    setAberto(false);
    toast.success("Empresa-cliente criada e vinculada.");
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant={variant}
            size={size}
            className={className}
          />
        }
      >
        <Plus data-icon="inline-start" />
        Adicionar nova empresa-cliente
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Adicionar empresa-cliente</DialogTitle>
          <DialogDescription>
            Vincule uma empresa já cadastrada na plataforma ou crie uma nova.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 border-b pb-3">
          <Button
            type="button"
            size="xs"
            variant={aba === "vincular" ? "default" : "ghost"}
            onClick={() => setAba("vincular")}
          >
            Vincular existente
          </Button>
          <Button
            type="button"
            size="xs"
            variant={aba === "criar" ? "default" : "ghost"}
            onClick={() => setAba("criar")}
          >
            Criar nova
          </Button>
        </div>

        {aba === "vincular" ? (
          <div className="space-y-3">
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome ou segmento..."
                className="pl-9"
                aria-label="Buscar empresas na plataforma"
              />
            </div>
            {empresasFiltradas.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Nenhuma empresa disponível para vincular.
              </p>
            ) : (
              <ul className="max-h-56 space-y-2 overflow-y-auto">
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
                          size="xs"
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
        ) : (
          <FormularioCadastroEmpresa
            draft={novaEmpresaDraft}
            onChange={(p) =>
              setNovaEmpresaDraft((prev) => ({ ...prev, ...p }))
            }
            errors={errosNovaEmpresa}
            idPrefix="dash-nova-empresa"
          />
        )}

        <DialogFooter>
          {aba === "criar" ? (
            <Button type="button" onClick={criarEmpresaCliente}>
              Criar e vincular
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setAberto(false)}
            >
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
