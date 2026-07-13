/** Nome amigável a partir do e-mail (sem expor o endereço inteiro no título). */
export function formatarNomeExibicao(email?: string | null): string {
  if (!email) return "usuário";

  const local = email.split("@")[0]?.trim() ?? "";
  if (!local) return "usuário";

  const comEspacos = local
    .replace(/[._-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();

  const palavras = comEspacos.split(/\s+/).filter(Boolean);

  if (palavras.length > 1) {
    return palavras
      .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(" ");
  }

  // Uma palavra longa (ex: oestudionarrativa) — usa só a parte antes de números
  const curta = local.replace(/\d+/g, "").slice(0, 16);
  return curta.charAt(0).toUpperCase() + curta.slice(1).toLowerCase();
}
