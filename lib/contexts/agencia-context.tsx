"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { Agencia, AgenciaCliente, Empresa } from "@/lib/types";

export type EmpresaClienteVinculada = Empresa & {
  nomeFantasia?: string;
  /** Empresas criadas pela agência no fluxo de cadastro podem ser editadas depois. */
  criadaPelaAgencia: boolean;
};

type AgenciaContextValue = {
  agencia: Agencia | null;
  empresasClientes: EmpresaClienteVinculada[];
  vinculos: AgenciaCliente[];
  empresaAtivaId: string | null;
  empresaAtiva: EmpresaClienteVinculada | null;
  setEmpresaAtivaId: (empresaId: string) => void;
  inicializarAgencia: (
    agencia: Agencia,
    clientes: EmpresaClienteVinculada[],
  ) => void;
  adicionarEmpresaCliente: (empresa: EmpresaClienteVinculada) => void;
};

const STORAGE_KEY = "agencia-empresa-ativa";
const SESSION_STORAGE_KEY = "agencia-sessao";

type AgenciaSessaoSalva = {
  agencia: Agencia;
  empresasClientes: EmpresaClienteVinculada[];
};

const AgenciaContext = createContext<AgenciaContextValue | null>(null);

export function AgenciaProvider({ children }: { children: ReactNode }) {
  const [agencia, setAgencia] = useState<Agencia | null>(null);
  const [empresasClientes, setEmpresasClientes] = useState<
    EmpresaClienteVinculada[]
  >([]);
  const [empresaAtivaId, setEmpresaAtivaIdState] = useState<string | null>(
    null,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) setEmpresaAtivaIdState(salvo);

    const sessao = localStorage.getItem(SESSION_STORAGE_KEY);
    if (sessao) {
      try {
        const parsed = JSON.parse(sessao) as AgenciaSessaoSalva;
        if (parsed.agencia && parsed.empresasClientes?.length) {
          setAgencia(parsed.agencia);
          setEmpresasClientes(parsed.empresasClientes);
        }
      } catch {
        /* ignora sessão inválida */
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !agencia) return;
    localStorage.setItem(
      SESSION_STORAGE_KEY,
      JSON.stringify({ agencia, empresasClientes }),
    );
  }, [hydrated, agencia, empresasClientes]);

  const setEmpresaAtivaId = useCallback((empresaId: string) => {
    setEmpresaAtivaIdState(empresaId);
    localStorage.setItem(STORAGE_KEY, empresaId);
  }, []);

  const inicializarAgencia = useCallback(
    (novaAgencia: Agencia, clientes: EmpresaClienteVinculada[]) => {
      setAgencia(novaAgencia);
      setEmpresasClientes(clientes);
      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({ agencia: novaAgencia, empresasClientes: clientes }),
      );
      if (clientes[0]) {
        setEmpresaAtivaId(clientes[0].id);
      }
    },
    [setEmpresaAtivaId],
  );

  const adicionarEmpresaCliente = useCallback(
    (empresa: EmpresaClienteVinculada) => {
      setEmpresasClientes((prev) => {
        if (prev.some((e) => e.id === empresa.id)) return prev;
        return [...prev, empresa];
      });
    },
    [],
  );

  const empresaAtiva = useMemo(
    () => empresasClientes.find((e) => e.id === empresaAtivaId) ?? null,
    [empresasClientes, empresaAtivaId],
  );

  const vinculos = useMemo(
    () =>
      agencia
        ? empresasClientes.map((e) => ({
            agenciaId: agencia.id,
            empresaId: e.id,
          }))
        : [],
    [agencia, empresasClientes],
  );

  const value = useMemo(
    () => ({
      agencia,
      empresasClientes,
      vinculos,
      empresaAtivaId,
      empresaAtiva,
      setEmpresaAtivaId,
      inicializarAgencia,
      adicionarEmpresaCliente,
    }),
    [
      agencia,
      empresasClientes,
      vinculos,
      empresaAtivaId,
      empresaAtiva,
      setEmpresaAtivaId,
      inicializarAgencia,
      adicionarEmpresaCliente,
    ],
  );

  return (
    <AgenciaContext.Provider value={value}>{children}</AgenciaContext.Provider>
  );
}

export function useAgencia() {
  const ctx = useContext(AgenciaContext);
  if (!ctx) {
    throw new Error("useAgencia deve ser usado dentro de AgenciaProvider");
  }
  return ctx;
}

export function useAgenciaOpcional() {
  return useContext(AgenciaContext);
}
