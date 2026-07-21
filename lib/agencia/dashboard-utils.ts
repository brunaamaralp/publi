import type { EmpresaClienteVinculada } from "@/lib/contexts/agencia-context";
import type { MinhaDemandaItem } from "@/lib/empresa/demandas-types";
import { listarDemandasEmpresa } from "@/lib/empresa/demandas-utils";
import {
  CONTRATOS_AGENCIA_MOCK,
  DEMANDAS_AGENCIA_CLIENTES_MOCK,
  type ContratoAgenciaResumo,
} from "@/lib/mock-data/agencia-dashboard";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";

const STATUS_DEMANDA_ATIVA = new Set([
  "aberta",
  "em_negociacao",
  "em_andamento",
]);
const STATUS_CONTRATO_ANDAMENTO = new Set(["assinado", "em_execucao"]);

export type ResumoEmpresaCliente = {
  empresaId: string;
  demandasAtivas: number;
  contratosAndamento: number;
  ultimoContrato: ContratoAgenciaResumo | null;
  investidoMes: number;
};

export type ResumoConsolidadoAgencia = {
  totalDemandasAtivas: number;
  totalContratosAndamento: number;
  totalInvestidoMes: number;
  totalEmpresasClientes: number;
};

function isMesAtual(iso: string, referencia = new Date()): boolean {
  const data = new Date(iso);
  return (
    data.getFullYear() === referencia.getFullYear() &&
    data.getMonth() === referencia.getMonth()
  );
}

function contratosEmpresa(empresaId: string): ContratoAgenciaResumo[] {
  return CONTRATOS_AGENCIA_MOCK.filter((c) => c.empresaId === empresaId);
}

function ultimoContrato(empresaId: string): ContratoAgenciaResumo | null {
  const contratos = contratosEmpresa(empresaId);
  if (contratos.length === 0) return null;
  return [...contratos].sort(
    (a, b) =>
      new Date(b.dataAssinatura).getTime() -
      new Date(a.dataAssinatura).getTime(),
  )[0]!;
}

function investidoMesEmpresa(empresaId: string): number {
  return contratosEmpresa(empresaId)
    .filter(
      (c) =>
        STATUS_CONTRATO_ANDAMENTO.has(c.status) &&
        isMesAtual(c.dataAssinatura),
    )
    .reduce((acc, c) => acc + c.valor, 0);
}

function demandasAtivasEmpresa(empresaId: string): number {
  return listarDemandasEmpresa(empresaId).filter((item) =>
    STATUS_DEMANDA_ATIVA.has(item.demanda.status),
  ).length;
}

export function obterResumoEmpresaCliente(
  empresaId: string,
): ResumoEmpresaCliente {
  const contratos = contratosEmpresa(empresaId);
  return {
    empresaId,
    demandasAtivas: demandasAtivasEmpresa(empresaId),
    contratosAndamento: contratos.filter((c) =>
      STATUS_CONTRATO_ANDAMENTO.has(c.status),
    ).length,
    ultimoContrato: ultimoContrato(empresaId),
    investidoMes: investidoMesEmpresa(empresaId),
  };
}

export function obterResumoConsolidado(
  empresas: EmpresaClienteVinculada[],
): ResumoConsolidadoAgencia {
  const empresaIds = empresas.map((e) => e.id);

  const resumos = empresaIds.map(obterResumoEmpresaCliente);

  const contratosAndamento = CONTRATOS_AGENCIA_MOCK.filter(
    (c) =>
      empresaIds.includes(c.empresaId) &&
      STATUS_CONTRATO_ANDAMENTO.has(c.status),
  );

  return {
    totalDemandasAtivas: resumos.reduce((acc, r) => acc + r.demandasAtivas, 0),
    totalContratosAndamento: contratosAndamento.length,
    totalInvestidoMes: resumos.reduce((acc, r) => acc + r.investidoMes, 0),
    totalEmpresasClientes: empresas.length,
  };
}

export function formatarUltimoContrato(
  contrato: ContratoAgenciaResumo | null,
): string {
  if (!contrato) return "Nenhum contrato";
  return `${contrato.campanhaTitulo} · ${formatarMoeda(contrato.valor)}`;
}

export function labelStatusContrato(
  status: ContratoAgenciaResumo["status"],
): string {
  const labels: Record<ContratoAgenciaResumo["status"], string> = {
    rascunho: "Rascunho",
    assinado: "Assinado",
    em_execucao: "Em execução",
    cumprido: "Cumprido",
    cancelado: "Cancelado",
    em_disputa: "Em disputa",
  };
  return labels[status];
}

export function mesclarDemandasAgenciaClientes(
  existentes: MinhaDemandaItem[],
): MinhaDemandaItem[] {
  const idsExistentes = new Set(existentes.map((i) => i.demanda.id));
  const novas = DEMANDAS_AGENCIA_CLIENTES_MOCK.filter(
    (item) => !idsExistentes.has(item.demanda.id),
  );
  if (novas.length === 0) return existentes;
  return [...novas, ...existentes];
}
