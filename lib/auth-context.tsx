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
import { flushSync } from "react-dom";

import type { Usuario } from "@/lib/types/usuario";

const STORAGE_KEY = "auth-usuario";

type AuthContextValue = {
  usuario: Usuario | null;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    tipo?: Usuario["tipo"],
  ) => Usuario;
  registrarTipo: (tipo: Usuario["tipo"], email?: string) => Usuario;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const CONTAS_DEMO: Record<
  string,
  Pick<Usuario, "tipo" | "status"> & { id?: string }
> = {
  "influenciador@publi.app": {
    tipo: "influenciador",
    status: "ativo",
    id: "usr-influ-neg-001",
  },
  "empresa@publi.app": { tipo: "empresa", status: "ativo" },
  "agencia@publi.app": { tipo: "agencia", status: "ativo" },
  "admin@publi.app": { tipo: "admin", status: "ativo" },
};

function persistir(usuario: Usuario | null) {
  if (typeof window === "undefined") return;
  if (usuario) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function novoId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `usr-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function carregar(): Usuario | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Usuario;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUsuario(carregar());
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (email: string, _password: string, tipo?: Usuario["tipo"]) => {
      void _password;
      const normalizado = email.trim().toLowerCase();
      const demo = CONTAS_DEMO[normalizado];
      const next: Usuario = {
        id: demo?.id ?? novoId(),
        email: normalizado,
        tipo: tipo ?? demo?.tipo ?? "influenciador",
        status: demo?.status ?? "ativo",
        criadoEm: new Date().toISOString(),
      };
      flushSync(() => setUsuario(next));
      persistir(next);
      return next;
    },
    [],
  );

  const registrarTipo = useCallback(
    (tipo: Usuario["tipo"], email = "novo@publi.app") => {
      const next: Usuario = {
        id: novoId(),
        email: email.trim().toLowerCase(),
        tipo,
        status: "pendente_verificacao",
        criadoEm: new Date().toISOString(),
      };
      flushSync(() => setUsuario(next));
      persistir(next);
      return next;
    },
    [],
  );

  const logout = useCallback(() => {
    setUsuario(null);
    persistir(null);
  }, []);

  const value = useMemo(
    () => ({ usuario, isLoading, login, registrarTipo, logout }),
    [usuario, isLoading, login, registrarTipo, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return ctx;
}

export function useAuthOpcional() {
  return useContext(AuthContext);
}
