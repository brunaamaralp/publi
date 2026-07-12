"use client";

import { useState } from "react";

import {
  CadastroAgencia,
  PainelAgenciaConcluido,
} from "@/components/agencia/cadastro-agencia";

export default function CadastroAgenciaPage() {
  const [concluido, setConcluido] = useState(false);

  return concluido ? (
    <PainelAgenciaConcluido />
  ) : (
    <CadastroAgencia onConcluido={() => setConcluido(true)} />
  );
}
