/**
 * Dias úteis (seg–sex), sem feriados — suficiente para o mock de liberação automática.
 */

export const DIAS_UTEIS_LIBERACAO_AUTOMATICA = 5;

export function adicionarDiasUteis(
  aPartirDe: Date | string,
  quantidade: number,
): Date {
  const data = new Date(aPartirDe);
  if (Number.isNaN(data.getTime())) {
    throw new Error("Data inválida para cálculo de dias úteis");
  }
  let restantes = quantidade;
  while (restantes > 0) {
    data.setDate(data.getDate() + 1);
    const dia = data.getDay();
    if (dia !== 0 && dia !== 6) {
      restantes -= 1;
    }
  }
  return data;
}

/** ISO UTC a partir de `adicionarDiasUteis`. */
export function prazoLiberacaoAutomaticaIso(
  dataEntrega: Date | string,
  dias = DIAS_UTEIS_LIBERACAO_AUTOMATICA,
): string {
  return adicionarDiasUteis(dataEntrega, dias).toISOString();
}

/**
 * Quantos dias úteis faltam até o prazo (0 se já passou ou é o mesmo dia útil).
 * Conta apenas dias úteis futuros até a data do prazo.
 */
export function diasUteisRestantesAte(
  prazoIso: string,
  agora: Date = new Date(),
): number {
  const prazo = new Date(prazoIso);
  if (Number.isNaN(prazo.getTime())) return 0;
  if (agora >= prazo) return 0;

  let contagem = 0;
  const cursor = new Date(agora);
  cursor.setHours(0, 0, 0, 0);
  const fim = new Date(prazo);
  fim.setHours(0, 0, 0, 0);

  while (cursor < fim) {
    cursor.setDate(cursor.getDate() + 1);
    const dia = cursor.getDay();
    if (dia !== 0 && dia !== 6) contagem += 1;
  }
  return contagem;
}

export function prazoLiberacaoVencido(
  prazoIso: string | undefined,
  agora: Date = new Date(),
): boolean {
  if (!prazoIso) return false;
  const prazo = new Date(prazoIso);
  if (Number.isNaN(prazo.getTime())) return false;
  return agora >= prazo;
}
