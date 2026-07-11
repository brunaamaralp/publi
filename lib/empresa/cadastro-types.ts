import type { AudienciaLinha } from "@/lib/influenciador/cadastro-types";

export type EmpresaCadastroDraft = {
  razaoSocial: string;
  segmento: string;
  orcamentoMedioCampanha: number | "";
  publicoGenero: AudienciaLinha[];
  publicoFaixaEtaria: AudienciaLinha[];
  publicoLocalidade: AudienciaLinha[];
};

export function criarEmpresaCadastroInicial(): EmpresaCadastroDraft {
  return {
    razaoSocial: "",
    segmento: "",
    orcamentoMedioCampanha: "",
    publicoGenero: [],
    publicoFaixaEtaria: [],
    publicoLocalidade: [],
  };
}
