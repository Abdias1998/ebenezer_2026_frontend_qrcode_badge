import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale = "fr-FR"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const sameMonth =
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear();

  if (sameMonth) {
    return `${startDate.getDate()} - ${endDate.getDate()} ${new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(endDate)}`;
  }

  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function scrollToFirstError(errors: Record<string, any>) {
  const firstErrorKey = Object.keys(errors)[0];
  if (!firstErrorKey) return;

  const element = document.querySelector(`[name="${firstErrorKey}"]`) ||
    document.querySelector(`#${firstErrorKey}`);

  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
    (element as HTMLElement).focus?.();
  }
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

export function downloadFile(url: string, filename: string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function resolveAssetUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4001/api/v1";
  const origin = apiUrl.replace(/\/api\/v1\/?$/, "");
  return `${origin}${path}`;
}

export function downloadImage(url: string, filename = "qrcode.png") {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const objectUrl = URL.createObjectURL(blob);
      downloadFile(objectUrl, filename);
      URL.revokeObjectURL(objectUrl);
    })
    .catch(() => {
      window.open(url, "_blank");
    });
}

export const COUNTRIES = [
  "Bénin", "Burkina Faso", "Cameroun", "Cap-Vert", "Centrafrique",
  "Comores", "Congo", "Côte d'Ivoire", "Djibouti", "Érythrée",
  "Éthiopie", "Gabon", "Gambie", "Ghana", "Guinée", "Guinée-Bissau",
  "Guinée équatoriale", "Kenya", "Lesotho", "Liberia", "Madagascar",
  "Malawi", "Mali", "Maroc", "Maurice", "Mauritanie", "Mozambique",
  "Namibie", "Niger", "Nigeria", "Ouganda", "RDC", "Rwanda",
  "São Tomé-et-Príncipe", "Sénégal", "Sierra Leone", "Somalie",
  "Soudan", "Soudan du Sud", "Swaziland", "Tanzanie", "Tchad",
  "Togo", "Tunisie", "Zambie", "Zimbabwe",
  "Algérie", "Angola", "Botswana", "Burundi", "Égypte",
  "France", "Belgique", "Suisse", "Canada", "États-Unis",
  "Autre",
];
