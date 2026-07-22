"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Eye, Pencil, Search } from "lucide-react";
import { toast } from "sonner";

import { AdicionarEmpresaCliente } from "@/components/agencia/adicionar-empresa-cliente";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAgencia,
  type EmpresaClienteVinculada,
} from "@/lib/contexts/agencia-context";
import { resolverModoAcesso } from "@/lib/agencia/modo-acesso";
import { cn } from "@/lib/utils";

export function GestaoClientesAgenciaFlow() {
  const {
    agencia,
    empresasClientes,
    empresaAtivaId,
    setEmpresaAtivaId,
    atualizarEmpresaCliente,
  } = useAgencia();
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<EmpresaClienteVinculada | null>(null);
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [segmento, setSegmento] = useState("");

  const filtrados = empresasClientes.filter((e) => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return true;
    return (
      e.razaoSocial.toLowerCase().includes(termo) ||
      (e.nomeFantasia?.toLowerCase().includes(termo) ?? false) ||
      e.segmento.toLowerCase().includes(termo)
    );
  });

  function abrirEdicao(empresa: EmpresaClienteVinculada) {
    if (!empresa.criadaPelaAgencia) {
      toast.error("Clientes vinculados só podem ser visualizados.");
      return;
    }
    setEditando(empresa);
    setNomeFantasia(empresa.nomeFantasia ?? "");
    setRazaoSocial(empresa.razaoSocial);
    setSegmento(empresa.segmento);
  }

  function salvarEdicao() {
    if (!editando) return;
    if (!razaoSocial.trim()) {
      toast.error("Informe a razão social.");
      return;
    }
    if (!segmento.trim()) {
      toast.error("Informe o segmento.");
      return;
    }
    atualizarEmpresaCliente(editando.id, {
      razaoSocial: razaoSocial.trim(),
      nomeFantasia: nomeFantasia.trim() || undefined,
      segmento: segmento.trim(),
    });
    toast.success("Cliente atualizado.");
    setEditando(null);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <p className="text-primary text-sm font-medium">Agência</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            Empresas-clientes
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm">
            {agencia?.razaoSocial
              ? `Portfólio de ${agencia.razaoSocial}. `
              : null}
            Clientes criados pela agência permitem edição; vínculos de terceiros
            são somente leitura.
          </p>
        </div>
        <AdicionarEmpresaCliente className="shrink-0" />
      </header>

      <div className="relative max-w-md">
        <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
        <Input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar cliente…"
          className="pl-9"
          aria-label="Buscar empresas-clientes"
        />
      </div>

      {filtrados.length === 0 ? (
        <div className="text-muted-foreground rounded-card border border-dashed px-6 py-14 text-center text-sm">
          Nenhum cliente encontrado. Adicione o primeiro para começar.
        </div>
      ) : (
        <ul className="space-y-3">
          {filtrados.map((empresa) => {
            const modo = resolverModoAcesso(empresa);
            const ativa = empresa.id === empresaAtivaId;
            const nome = empresa.nomeFantasia ?? empresa.razaoSocial;

            return (
              <li key={empresa.id}>
                <div
                  className={cn(
                    "flex flex-col gap-4 rounded-card border bg-card p-4 sm:flex-row sm:items-center sm:justify-between",
                    ativa && "border-primary ring-1 ring-primary/20",
                  )}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <Building2
                      className="text-muted-foreground mt-0.5 size-4 shrink-0"
                      aria-hidden
                    />
                    <div className="min-w-0 space-y-1">
                      <p className="truncate font-medium">{nome}</p>
                      <p className="text-muted-foreground text-xs">
                        {empresa.segmento}
                        {empresa.nomeFantasia ? (
                          <> · {empresa.razaoSocial}</>
                        ) : null}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {ativa ? (
                          <Badge variant="default">Ativo</Badge>
                        ) : null}
                        <Badge variant="secondary">
                          {modo === "edicao" ? "Edição" : "Somente leitura"}
                        </Badge>
                        {empresa.criadaPelaAgencia ? (
                          <Badge variant="outline">Criado pela agência</Badge>
                        ) : (
                          <Badge variant="outline">Vinculado</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    {!ativa ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setEmpresaAtivaId(empresa.id)}
                      >
                        Definir ativo
                      </Button>
                    ) : null}
                    {empresa.criadaPelaAgencia ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => abrirEdicao(empresa)}
                      >
                        <Pencil className="size-3.5" aria-hidden />
                        Editar
                      </Button>
                    ) : (
                      <span className="text-muted-foreground inline-flex items-center gap-1 text-xs">
                        <Eye className="size-3.5" aria-hidden />
                        Leitura
                      </span>
                    )}
                    <Link
                      href={`/agencia/clientes/${empresa.id}`}
                      className={cn(
                        buttonVariants({ size: "sm" }),
                        "border-transparent bg-verde-carvao-escuro text-verde-neon hover:bg-verde-carvao",
                      )}
                      onClick={() => setEmpresaAtivaId(empresa.id)}
                    >
                      Abrir workspace
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog
        open={editando !== null}
        onOpenChange={(open) => !open && setEditando(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
            <DialogDescription>
              Atualize os dados do cliente criado pela agência.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-razao">Razão social</Label>
              <Input
                id="edit-razao"
                value={razaoSocial}
                onChange={(e) => setRazaoSocial(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fantasia">Nome fantasia</Label>
              <Input
                id="edit-fantasia"
                value={nomeFantasia}
                onChange={(e) => setNomeFantasia(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-segmento">Segmento</Label>
              <Input
                id="edit-segmento"
                value={segmento}
                onChange={(e) => setSegmento(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditando(null)}
            >
              Cancelar
            </Button>
            <Button type="button" onClick={salvarEdicao}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
