/**
 * Converte File de imagem em data URL JPEG comprimido para persistir no
 * localStorage (rascunho de cadastro), sem estourar a quota.
 */
export async function comprimirImagemParaDataUrl(
  file: File,
  opcoes?: { maxLado?: number; qualidade?: number; maxBytes?: number },
): Promise<string> {
  const maxLado = opcoes?.maxLado ?? 512;
  const qualidadeInicial = opcoes?.qualidade ?? 0.82;
  const maxBytes = opcoes?.maxBytes ?? 350_000;

  const bitmap = await createImageBitmap(file);
  const escala = Math.min(1, maxLado / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * escala));
  const h = Math.max(1, Math.round(bitmap.height * escala));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("Não foi possível processar a imagem.");
  }
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  let qualidade = qualidadeInicial;
  let dataUrl = canvas.toDataURL("image/jpeg", qualidade);
  while (dataUrl.length > maxBytes && qualidade > 0.45) {
    qualidade -= 0.1;
    dataUrl = canvas.toDataURL("image/jpeg", qualidade);
  }
  return dataUrl;
}

export function ehDataUrl(url: string | null | undefined): boolean {
  return Boolean(url?.startsWith("data:"));
}

export function ehBlobUrl(url: string | null | undefined): boolean {
  return Boolean(url?.startsWith("blob:"));
}
