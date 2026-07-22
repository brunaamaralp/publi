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

import {
  comModoAcesso,
  resolverModoAcesso,
  type ModoAcessoCliente,
} from "@/lib/agencia/modo-acesso";
import type { Agencia, AgenciaCliente, Empresa } from "@/lib/types";

export type EmpresaClienteVinculada = Empresa & {
  nomeFantasia?: string;
  /** Empresas criadas pela agência no fluxo de cadastro podem ser editadas depois. */
  criadaPelaAgencia: boolean;
  /** Preferência explícita; se omitida, deriva de `criadaPelaAgencia`. */
  modoAcesso: ModoAcessoCliente;
};

type AgenciaContextValue = {
  agencia: Agencia | null;
  empresasClientes: EmpresaClienteVinculada[];
  vinculos: AgenciaCliente[];
  empresaAtivaId: string | null;
  empresaAtiva: EmpresaClienteVinculada | null;
  modoAcessoClienteAtivo: ModoAcessoCliente | null;
  podeEditarClienteAtivo: boolean;
  setEmpresaAtivaId: (empresaId: string) => void;
  inicializarAgencia: (
    agencia: Agencia,
    clientes: EmpresaClienteVinculada[],
  ) => void;
  adicionarEmpresaCliente: (empresa: EmpresaClienteVinculada) => void;
  atualizarEmpresaCliente: (
    empresaId: string,
    patch: Partial<
      Pick<
        EmpresaClienteVinculada,
        "razaoSocial" | "nomeFantasia" | "segmento" | "modoAcesso"
      >
    >,
  ) => void;
};

const STORAGE_KEY = "agencia-empresa-ativa";
const SESSION_STORAGE_KEY = "agencia-sessao";

type AgenciaSessaoSalva = {
  agencia: Agencia;
  empresasClientes: EmpresaClienteVinculada[];
};

const AgenciaContext = createContext<AgenciaContextValue | null>(null);

function normalizarClientes(
  clientes: Array<
    Omit<EmpresaClienteVinculada, "modoAcesso"> & {
      modoAcesso?: ModoAcessoCliente;
    }
  >,
): EmpresaClienteVinculada[] {
  return clientes.map(comModoAcesso);
}

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
          setEmpresasClientes(normalizarClientes(parsed.empresasClientes));
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
    (
      novaAgencia: Agencia,
      clientes: Array<
        Omit<EmpresaClienteVinculada, "modoAcesso"> & {
          modoAcesso?: ModoAcessoCliente;
        }
      >,
    ) => {
      const normalizados = normalizarClientes(clientes);
      setAgencia(novaAgencia);
      setEmpresasClientes(normalizados);
      localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          agencia: novaAgencia,
          empresasClientes: normalizados,
        }),
      );
      if (normalizados[0]) {
        setEmpresaAtivaId(normalizados[0].id);
      }
    },
    [setEmpresaAtivaId],
  );

  const adicionarEmpresaCliente = useCallback(
    (
      empresa: Omit<EmpresaClienteVinculada, "modoAcesso"> & {
        modoAcesso?: ModoAcessoCliente;
      },
    ) => {
      const normalizada = comModoAcesso(empresa);
      setEmpresasClientes((prev) => {
        if (prev.some((e) => e.id === normalizada.id)) return prev;
        return [...prev, normalizada];
      });
    },
    [],
  );

  const atualizarEmpresaCliente = useCallback(
    (
      empresaId: string,
      patch: Partial<
        Pick<
          EmpresaClienteVinculada,
          "razaoSocial" | "nomeFantasia" | "segmento" | "modoAcesso"
        >
      >,
    ) => {
      setEmpresasClientes((prev) =>
        prev.map((e) => {
          if (e.id !== empresaId) return e;
          return comModoAcesso({ ...e, ...patch });
        }),
      );
    },
    [],
  );

  const empresaAtiva = useMemo(
    () => empresasClientes.find((e) => e.id === empresaAtivaId) ?? null,
    [empresasClientes, empresaAtivaId],
  );

  const modoAcessoClienteAtivo = useMemo(
    () => (empresaAtiva ? resolverModoAcesso(empresaAtiva) : null),
    [empresaAtiva],
  );

  const podeEditarClienteAtivo = modoAcessoClienteAtivo === "edicao";

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
      modoAcessoClienteAtivo,
      podeEditarClienteAtivo,
      setEmpresaAtivaId,
      inicializarAgencia,
      adicionarEmpresaCliente,
      atualizarEmpresaCliente,
    }),
    [
      agencia,
      empresasClientes,
      vinculos,
      empresaAtivaId,
      empresaAtiva,
      modoAcessoClienteAtivo,
      podeEditarClienteAtivo,
      setEmpresaAtivaId,
      inicializarAgencia,
      adicionarEmpresaCliente,
      atualizarEmpresaCliente,
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
