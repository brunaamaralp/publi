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
