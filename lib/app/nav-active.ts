/** Verifica se um item do menu deve aparecer ativo para o pathname atual. */
export function isNavItemActive(
  pathname: string,
  href: string,
  siblingHrefs: string[] = [],
  rotasRelacionadas: string[] = [],
): boolean {
  if (href === "/inicio") {
    return pathname === "/inicio";
  }

  /** Painel do influenciador: só a rota exata (não /influenciador/[id] nem subpáginas). */
  if (href === "/influenciador") {
    if (pathname === "/influenciador" || pathname === "/inicio") return true;
    return false;
  }

  /** Painel da empresa: só a rota exata (não /empresa/demandas etc.). */
  if (href === "/empresa") {
    if (pathname === "/empresa" || pathname === "/inicio") return true;
    return false;
  }

  /** Painel da agência: só dashboard (não subpáginas). */
  if (href === "/agencia/dashboard") {
    if (
      pathname === "/agencia/dashboard" ||
      pathname === "/inicio" ||
      pathname === "/agencia"
    ) {
      return true;
    }
    return false;
  }

  const correspondeHref =
    pathname === href || pathname.startsWith(`${href}/`);

  const correspondeRelacionada = rotasRelacionadas.some(
    (rota) => pathname === rota || pathname.startsWith(`${rota}/`),
  );

  if (!correspondeHref && !correspondeRelacionada) {
    return false;
  }

  if (!correspondeHref) {
    return correspondeRelacionada;
  }

  const irmaoMaisEspecifico = siblingHrefs.find(
    (outro) =>
      outro !== href &&
      outro.length > href.length &&
      outro.startsWith(`${href}/`) &&
      (pathname === outro || pathname.startsWith(`${outro}/`)),
  );

  return !irmaoMaisEspecifico;
}

export function coletarHrefsGrupo(
  itens: { href: string; filhos?: { href: string }[] }[],
): string[] {
  return itens.flatMap((item) => [
    item.href,
    ...(item.filhos?.map((f) => f.href) ?? []),
  ]);
}
