"use client";

import { useState } from "react";

import {
  CadastroAgencia,
  PainelAgenciaConcluido,
} from "@/components/agencia/cadastro-agencia";
import { AgenciaProvider } from "@/lib/contexts/agencia-context";

export default function CadastroAgenciaPage() {
  const [concluido, setConcluido] = useState(false);

  return (
    <AgenciaProvider>
      {concluido ? (
        <PainelAgenciaConcluido />
      ) : (
        <CadastroAgencia onConcluido={() => setConcluido(true)} />
      )}
    </AgenciaProvider>
  );
}
