"use client";

import { InicioAdmin } from "@/components/app/inicio-admin";
import { InicioAgencia } from "@/components/app/inicio-agencia";
import { InicioEmpresa } from "@/components/app/inicio-empresa";
import {
  InicioInfluenciador,
  useNomeExibicaoUsuario,
} from "@/components/app/inicio-influenciador";
import { useAuth } from "@/lib/auth-context";

export function InicioDashboard() {
  const { usuario } = useAuth();
  const nomeExibicao = useNomeExibicaoUsuario();

  if (!usuario) return null;

  switch (usuario.tipo) {
    case "empresa":
      return <InicioEmpresa nomeExibicao={nomeExibicao} />;
    case "agencia":
      return <InicioAgencia />;
    case "admin":
      return <InicioAdmin nomeExibicao={nomeExibicao} />;
    case "influenciador":
    default:
      return <InicioInfluenciador nomeExibicao={nomeExibicao} />;
  }
}
