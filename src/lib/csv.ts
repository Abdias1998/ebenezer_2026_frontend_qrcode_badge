/**
 * Génère un fichier CSV lisible directement par Excel (séparateur « ; »,
 * encodage UTF-8 avec BOM pour les accents) et le télécharge.
 */
export function downloadCsv(
  fileName: string,
  headers: string[],
  rows: (string | number | undefined | null)[][],
): void {
  const escape = (value: string | number | undefined | null) => {
    const text = value == null ? "" : String(value);
    return /[";\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const content = [headers, ...rows]
    .map((row) => row.map(escape).join(";"))
    .join("\r\n");
  const blob = new Blob(["﻿" + content], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
