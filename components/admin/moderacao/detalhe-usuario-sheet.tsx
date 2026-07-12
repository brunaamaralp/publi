"use client";

import type { ReactNode } from "react";
import { ImageIcon } from "lucide-react";

import { BadgeTipoUsuario } from "@/components/admin/moderacao/badge-tipo-usuario";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { UsuarioPendenteModeracao } from "@/lib/mock-data/moderacao";
import { formatarDataCadastro } from "@/lib/moderacao/moderacao-utils";

type SecaoProps = {
  titulo: string;
  children: ReactNode;
};

function Secao({ titulo, children }: SecaoProps) {
  return (
    <section className="border-b px-4 py-3 last:border-b-0">
      <h3 className="text-muted-foreground mb-2 text-[10px] font-semibold uppercase tracking-wide">
        {titulo}
      </h3>
      {children}
    </section>
  );
}

function ListaChaveValor({
  itens,
}: {
  itens: { chave: string; valor: ReactNode }[];
}) {
  return (
    <dl className="grid gap-1.5">
      {itens.map((item) => (
        <div key={item.chave} className="grid grid-cols-[120px_1fr] gap-2 text-xs">
          <dt className="text-muted-foreground">{item.chave}</dt>
          <dd className="font-medium">{item.valor}</dd>
        </div>
      ))}
    </dl>
  );
}

type DetalheUsuarioSheetProps = {
  item: UsuarioPendenteModeracao | null;
  aberto: boolean;
  onAbertoChange: (aberto: boolean) => void;
  onAprovar: () => void;
  onRejeitar: () => void;
};

export function DetalheUsuarioSheet({
  item,
  aberto,
  onAbertoChange,
  onAprovar,
  onRejeitar,
}: DetalheUsuarioSheetProps) {
  if (!item) return null;

  const { usuario } = item.cadastro;

  return (
    <Sheet open={aberto} onOpenChange={onAbertoChange}>
      <SheetContent className="max-w-xl overflow-y-auto p-0 sm:max-w-xl">
        <SheetHeader className="bg-muted/30">
          <div className="flex items-start gap-2 pr-8">
            <SheetTitle className="text-base">
              {item.tipo === "influenciador"
                ? item.cadastro.influenciador.nome
                : item.tipo === "empresa"
                  ? item.cadastro.empresa.razaoSocial
                  : item.cadastro.agencia.razaoSocial}
            </SheetTitle>
            <BadgeTipoUsuario tipo={item.tipo} />
          </div>
          <SheetDescription>
            {usuario.email} · cadastro em{" "}
            {formatarDataCadastro(usuario.criadoEm)}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <Secao titulo="Conta">
            <ListaChaveValor
              itens={[
                { chave: "ID", valor: <span className="font-data">{usuario.id}</span> },
                { chave: "Status", valor: "pendente_verificacao" },
                { chave: "Tipo", valor: usuario.tipo },
              ]}
            />
          </Secao>

          {item.tipo === "influenciador" && (
            <>
              <Secao titulo="Perfil">
                <ListaChaveValor
                  itens={[
                    { chave: "Plano", valor: item.cadastro.influenciador.plano },
                    {
                      chave: "Bio",
                      valor: (
                        <p className="text-muted-foreground font-normal leading-relaxed">
                          {item.cadastro.influenciador.bio}
                        </p>
                      ),
                    },
                  ]}
                />
              </Secao>

              <Secao titulo="Categorias">
                <div className="flex flex-wrap gap-1">
                  {item.cadastro.categorias.map((cat) => (
                    <Badge key={cat.id} variant="secondary" className="text-[10px]">
                      {cat.nome}
                      <span className="text-muted-foreground ml-1">
                        ({cat.tipo})
                      </span>
                    </Badge>
                  ))}
                </div>
              </Secao>

              <Secao titulo="Métricas enviadas">
                <ListaChaveValor
                  itens={[
                    {
                      chave: "Seguidores",
                      valor: (
                        <span className="font-data">
                          {item.cadastro.metricaPerfil.seguidores.toLocaleString(
                            "pt-BR",
                          )}
                        </span>
                      ),
                    },
                    {
                      chave: "Engajamento",
                      valor: (
                        <span className="font-data">
                          {item.cadastro.metricaPerfil.engajamentoMedio}%
                        </span>
                      ),
                    },
                    {
                      chave: "Alcance médio",
                      valor: item.cadastro.metricaPerfil.alcanceMedio
                        ? `${item.cadastro.metricaPerfil.alcanceMedio.toLocaleString("pt-BR")}`
                        : "—",
                    },
                    {
                      chave: "Referência",
                      valor: item.cadastro.metricaPerfil.dataReferencia,
                    },
                    {
                      chave: "Validação",
                      valor: item.cadastro.metricaPerfil.statusValidacao,
                    },
                  ]}
                />
              </Secao>

              <Secao titulo="Print de audiência">
                <div className="border-border bg-muted/40 flex h-36 items-center justify-center rounded border border-dashed">
                  <div className="text-muted-foreground flex flex-col items-center gap-1 text-xs">
                    <ImageIcon className="size-5 opacity-50" />
                    <span>Print enviado pelo influenciador</span>
                    <span className="font-data text-[10px] opacity-70">
                      {item.cadastro.metricaPerfil.printUrl}
                    </span>
                  </div>
                </div>
              </Secao>

              <Secao titulo="Audiência">
                <div className="space-y-1">
                  {item.cadastro.audiencia.map((linha, i) => (
                    <div
                      key={`${linha.dimensao}-${linha.valor}-${i}`}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-muted-foreground capitalize">
                        {linha.dimensao.replace("_", " ")} · {linha.valor}
                      </span>
                      <span className="font-data font-medium">
                        {linha.percentual}%
                      </span>
                    </div>
                  ))}
                </div>
              </Secao>

              {item.cadastro.equipamentos.length > 0 && (
                <Secao titulo="Equipamentos">
                  <ul className="space-y-1 text-xs">
                    {item.cadastro.equipamentos.map((eq) => (
                      <li key={eq.id}>
                        <span className="font-medium">{eq.tipo}</span>
                        {eq.descricao ? (
                          <span className="text-muted-foreground">
                            {" "}
                            — {eq.descricao}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </Secao>
              )}
            </>
          )}

          {item.tipo === "empresa" && (
            <>
              <Secao titulo="Empresa">
                <ListaChaveValor
                  itens={[
                    {
                      chave: "Razão social",
                      valor: item.cadastro.empresa.razaoSocial,
                    },
                    {
                      chave: "Segmento",
                      valor: item.cadastro.empresa.segmento,
                    },
                    {
                      chave: "Orçamento médio",
                      valor: item.cadastro.orcamentoMedioCampanha
                        ? `R$ ${item.cadastro.orcamentoMedioCampanha.toLocaleString("pt-BR")}`
                        : "Não informado",
                    },
                  ]}
                />
              </Secao>

              <Secao titulo="Público-alvo">
                <div className="space-y-1">
                  {item.cadastro.publicoAlvo.map((linha, i) => (
                    <div key={`${linha.dimensao}-${i}`} className="text-xs">
                      <span className="text-muted-foreground capitalize">
                        {linha.dimensao.replace("_", " ")}:
                      </span>{" "}
                      <span className="font-medium">{linha.valor}</span>
                    </div>
                  ))}
                </div>
              </Secao>
            </>
          )}

          {item.tipo === "agencia" && (
            <>
              <Secao titulo="Agência">
                <ListaChaveValor
                  itens={[
                    {
                      chave: "Razão social",
                      valor: item.cadastro.agencia.razaoSocial,
                    },
                  ]}
                />
              </Secao>

              <Secao titulo="Clientes vinculados">
                <ul className="space-y-2">
                  {item.cadastro.clientesVinculados.map((cliente) => (
                    <li
                      key={cliente.id}
                      className="border-border rounded border px-2 py-1.5 text-xs"
                    >
                      <p className="font-medium">{cliente.razaoSocial}</p>
                      <p className="text-muted-foreground">{cliente.segmento}</p>
                    </li>
                  ))}
                </ul>
              </Secao>
            </>
          )}
        </div>

        <SheetFooter className="sticky bottom-0 bg-background">
          <Button variant="destructive" size="sm" onClick={onRejeitar}>
            Rejeitar
          </Button>
          <Button size="sm" onClick={onAprovar}>
            Aprovar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
