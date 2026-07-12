"use client";

import { BadgeTipoUsuario } from "@/components/admin/moderacao/badge-tipo-usuario";
import { Button } from "@/components/ui/button";
import type { UsuarioPendenteModeracao } from "@/lib/mock-data/moderacao";
import {
  formatarDataCadastro,
  getNomeExibicao,
} from "@/lib/moderacao/moderacao-utils";

type TabelaPendentesProps = {
  itens: UsuarioPendenteModeracao[];
  onRevisar: (item: UsuarioPendenteModeracao) => void;
};

export function TabelaPendentes({ itens, onRevisar }: TabelaPendentesProps) {
  if (itens.length === 0) {
    return (
      <div className="text-muted-foreground flex min-h-[200px] items-center justify-center border-t px-4 text-sm">
        Nenhum perfil pendente com os filtros atuais.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-left text-xs">
        <thead>
          <tr className="border-b bg-muted/50 text-[10px] uppercase tracking-wide text-muted-foreground">
            <th className="px-4 py-2 font-medium">Nome / Razão social</th>
            <th className="px-3 py-2 font-medium">Tipo</th>
            <th className="px-3 py-2 font-medium">E-mail</th>
            <th className="px-3 py-2 font-medium">Cadastro</th>
            <th className="px-4 py-2 text-right font-medium">Ação</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => (
            <tr
              key={item.cadastro.usuario.id}
              className="border-b hover:bg-muted/20"
            >
              <td className="max-w-[220px] truncate px-4 py-2 font-medium">
                {getNomeExibicao(item)}
              </td>
              <td className="px-3 py-2">
                <BadgeTipoUsuario tipo={item.tipo} />
              </td>
              <td className="text-muted-foreground max-w-[180px] truncate px-3 py-2">
                {item.cadastro.usuario.email}
              </td>
              <td className="font-data text-muted-foreground px-3 py-2 whitespace-nowrap">
                {formatarDataCadastro(item.cadastro.usuario.criadoEm)}
              </td>
              <td className="px-4 py-2 text-right">
                <Button size="xs" onClick={() => onRevisar(item)}>
                  Revisar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
