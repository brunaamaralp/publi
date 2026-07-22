"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ReceitaMensal } from "@/lib/financeiro/types";
import { formatarMoeda } from "@/lib/influenciador/cadastro-utils";

type GraficoReceitaMensalProps = {
  dados: ReceitaMensal[];
  titulo?: string;
  descricao?: string;
};

export function GraficoReceitaMensal({
  dados,
  titulo = "Receita mensal",
  descricao = "Últimos 6 meses na plataforma",
}: GraficoReceitaMensalProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{titulo}</CardTitle>
        <CardDescription>{descricao}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dados}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--cinza-200)"
              />
              <XAxis
                dataKey="mesLabel"
                tick={{ fontSize: 12, fill: "var(--cinza-500)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--cinza-500)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) =>
                  v >= 1000 ? `R$ ${(v / 1000).toFixed(0)}k` : `R$ ${v}`
                }
                width={48}
              />
              <Tooltip
                cursor={{ fill: "color-mix(in srgb, var(--verde-acao) 8%, transparent)" }}
                content={({ active, payload }) => {
                  if (!active || !payload?.[0]) return null;
                  const item = payload[0].payload as ReceitaMensal;
                  return (
                    <div className="border-border bg-popover rounded-card border px-3 py-2 text-sm shadow-md">
                      <p className="text-muted-foreground text-xs">{item.mesAno}</p>
                      <p className="font-data font-semibold">
                        {formatarMoeda(item.receita)}
                      </p>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="receita"
                fill="var(--verde-acao)"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
