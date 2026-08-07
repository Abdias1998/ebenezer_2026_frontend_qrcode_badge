import { BADGE_CONTENT } from "./badgeContent";

export interface BadgeSourceData {
  firstName: string;
  lastName: string;
  photoUrl?: string;
  registrationNumber: string;
  eventName: string;
  startDate: string;
  endDate: string;
  location: string;
}

const SIZE = 1080;

function roundRectPath(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | { tl: number; tr: number; br: number; bl: number },
) {
  const radii = typeof r === "number" ? { tl: r, tr: r, br: r, bl: r } : r;
  c.beginPath();
  c.moveTo(x + radii.tl, y);
  c.lineTo(x + w - radii.tr, y);
  c.arcTo(x + w, y, x + w, y + radii.tr, radii.tr);
  c.lineTo(x + w, y + h - radii.br);
  c.arcTo(x + w, y + h, x + w - radii.br, y + h, radii.br);
  c.lineTo(x + radii.bl, y + h);
  c.arcTo(x, y + h, x, y + h - radii.bl, radii.bl);
  c.lineTo(x, y + radii.tl);
  c.arcTo(x, y, x + radii.tl, y, radii.tl);
  c.closePath();
}

function truncateLine(c: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (c.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 1 && c.measureText(`${t}…`).width > maxWidth) {
    t = t.slice(0, -1).trimEnd();
  }
  return `${t}…`;
}

function wrapLines(c: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const test = cur ? `${cur} ${w}` : w;
    if (c.measureText(test).width > maxWidth && cur) {
      lines.push(cur);
      cur = w;
    } else {
      cur = test;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Fetches an image as a blob first so the resulting <img> is same-origin and canvas-safe. */
async function loadImageSafe(url: string): Promise<HTMLImageElement | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = objectUrl;
    });
    return img;
  } catch {
    return null;
  }
}

function formatDateRange(startIso: string, endIso: string): string {
  const start = new Date(startIso);
  const end = new Date(endIso);
  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const monthYear = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" })
    .format(end)
    .toUpperCase();

  if (sameMonth) {
    return `${String(start.getDate()).padStart(2, "0")} AU ${String(end.getDate()).padStart(2, "0")} ${monthYear}`;
  }
  const startMonthYear = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" })
    .format(start)
    .toUpperCase();
  return `${String(start.getDate()).padStart(2, "0")} ${startMonthYear} - ${String(end.getDate()).padStart(2, "0")} ${monthYear}`;
}

function formatApotheoseDate(endIso: string): { weekday: string; short: string } {
  const end = new Date(endIso);
  const weekday = new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(end).toUpperCase();
  const short = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
    .format(end)
    .toUpperCase()
    .replace(/\./g, "");
  return { weekday, short };
}

/** Used when BADGE_CONTENT.apotheoseVenue isn't set: the venue card gets the first
 *  comma-separated segment of the event location instead of the full address. */
function splitLocationFallback(location: string): { name: string; city: string } {
  const [name, ...rest] = location.split(",").map((s) => s.trim());
  return { name: name || location, city: rest.join(", ") };
}

function drawBackground(ctx: CanvasRenderingContext2D, flyerImg: HTMLImageElement | null) {
  const g = ctx.createRadialGradient(SIZE * 0.62, SIZE * 0.42, 80, SIZE * 0.5, SIZE * 0.5, 900);
  g.addColorStop(0, "#f16a44");
  g.addColorStop(0.45, "#7a1c14");
  g.addColorStop(1, "#1c0503");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SIZE, SIZE);

  if (flyerImg) {
    ctx.save();
    ctx.globalAlpha = BADGE_CONTENT.backgroundImageOpacity;
    const scale = Math.max(SIZE / flyerImg.width, SIZE / flyerImg.height);
    const dw = flyerImg.width * scale;
    const dh = flyerImg.height * scale;
    ctx.drawImage(flyerImg, (SIZE - dw) / 2, (SIZE - dh) / 2, dw, dh);
    ctx.restore();
  }

  const cg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  cg.addColorStop(0, "rgba(0,0,0,0.35)");
  cg.addColorStop(0.3, "rgba(0,0,0,0)");
  cg.addColorStop(0.7, "rgba(0,0,0,0)");
  cg.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = cg;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.save();
  ctx.translate(SIZE * 0.62, SIZE * 0.46);
  ctx.globalAlpha = 0.06;
  const rays = 28;
  for (let i = 0; i < rays; i++) {
    ctx.rotate((Math.PI * 2) / rays);
    ctx.fillStyle = i % 2 === 0 ? "#ffffff" : "transparent";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 640, 0, (Math.PI * 2) / rays / 2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawLogoCircle(ctx: CanvasRenderingContext2D, logoImg: HTMLImageElement | null) {
  const cx = 148;
  const cy = 118;
  const r = 68;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = "#f7f4ea";
  ctx.fill();

  if (logoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 10, 0, Math.PI * 2);
    ctx.clip();
    const scale = Math.max((2 * (r - 10)) / logoImg.width, (2 * (r - 10)) / logoImg.height);
    const dw = logoImg.width * scale;
    const dh = logoImg.height * scale;
    ctx.drawImage(logoImg, cx - dw / 2, cy - dh / 2, dw, dh);
    ctx.restore();
  }

  ctx.lineWidth = 5;
  ctx.strokeStyle = "#d9a83c";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 12, 0, Math.PI * 2);
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#c99a3a";
  ctx.stroke();
  ctx.restore();
}

function drawWordmark(ctx: CanvasRenderingContext2D, eventName: string) {
  const cx = 540;
  const y = 118;
  const tokens = eventName.trim().split(/\s+/);
  const lastIsNumber = /^\d+$/.test(tokens[tokens.length - 1] ?? "");
  const edition = lastIsNumber ? tokens[tokens.length - 1] : "";
  const title = lastIsNumber ? tokens.slice(0, -1).join(" ") : eventName;

  ctx.save();
  ctx.textBaseline = "alphabetic";

  const titleFont = "italic 800 52px Georgia, serif";
  const editionFont = "900 84px Georgia, serif";
  const gap = 16;

  if (edition) {
    ctx.font = titleFont;
    const titleWidth = ctx.measureText(title).width;
    ctx.font = editionFont;
    const editionWidth = ctx.measureText(edition).width;
    const startX = cx - (titleWidth + gap + editionWidth) / 2;

    ctx.textAlign = "left";
    ctx.font = titleFont;
    ctx.fillStyle = "#f2f4fb";
    ctx.fillText(title, startX, y);

    const editionX = startX + titleWidth + gap;
    ctx.font = editionFont;
    const g = ctx.createLinearGradient(editionX, y - 70, editionX + editionWidth, y + 10);
    g.addColorStop(0, "#f5d27f");
    g.addColorStop(1, "#c8931f");
    ctx.fillStyle = g;
    ctx.fillText(edition, editionX, y + 14);
  } else {
    ctx.textAlign = "center";
    ctx.font = titleFont;
    ctx.fillStyle = "#f2f4fb";
    ctx.fillText(title, cx, y);
  }

  roundRectPath(ctx, cx - 150, y + 26, 300, 34, 17);
  ctx.fillStyle = "rgba(217,168,60,0.9)";
  ctx.fill();
  ctx.font = "700 15px Georgia, serif";
  ctx.fillStyle = "#1a1200";
  ctx.fillText(BADGE_CONTENT.bibleVerse, cx, y + 49);
  ctx.restore();
}

function drawThemeBadge(ctx: CanvasRenderingContext2D) {
  const x = 782;
  const y = 66;
  const w = 236;
  const h = 84;
  ctx.save();
  roundRectPath(ctx, x, y, w, h, 14);
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, "#f0c766");
  g.addColorStop(1, "#c8931f");
  ctx.fillStyle = g;
  ctx.fill();

  ctx.textAlign = "center";
  ctx.fillStyle = "#1a1200";
  ctx.font = "700 15px Georgia, serif";
  ctx.fillText("THÈME", x + w / 2, y + 30);
  ctx.font = "900 30px Georgia, serif";
  ctx.fillText(BADGE_CONTENT.theme, x + w / 2, y + 63);
  ctx.restore();
}

function drawPhotoFrame(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, initials: string) {
  const f = { x: 330, y: 236, w: 656, h: 520, r: { tl: 230, tr: 230, br: 34, bl: 34 } };
  ctx.save();
  roundRectPath(ctx, f.x - 12, f.y - 12, f.w + 24, f.h + 24, {
    tl: f.r.tl + 12,
    tr: f.r.tr + 12,
    br: f.r.br + 12,
    bl: f.r.bl + 12,
  });
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  ctx.fill();
  ctx.shadowColor = "transparent";

  roundRectPath(ctx, f.x, f.y, f.w, f.h, f.r);
  ctx.clip();

  if (img) {
    const scale = Math.max(f.w / img.width, f.h / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, f.x + (f.w - dw) / 2, f.y + (f.h - dh) / 2, dw, dh);
  } else {
    ctx.fillStyle = "#4a0e0e";
    ctx.fillRect(f.x, f.y, f.w, f.h);
    ctx.fillStyle = "rgba(240,199,102,0.9)";
    ctx.font = "900 180px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText(initials, f.x + f.w / 2, f.y + f.h / 2 + 60);
  }
  ctx.restore();
}

function drawCta(ctx: CanvasRenderingContext2D) {
  // Kept narrow (max ~280px) so it never runs under the photo frame, which starts at x=330.
  ctx.save();
  ctx.textAlign = "left";
  ctx.fillStyle = "#f7f4ea";
  ctx.font = "italic 900 64px Georgia, serif";
  ctx.fillText(BADGE_CONTENT.ctaLine1, 44, 460);
  ctx.fillText(BADGE_CONTENT.ctaLine2, 44, 528);

  ctx.strokeStyle = "#d9a83c";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(46, 552);
  ctx.quadraticCurveTo(120, 566, 195, 546);
  ctx.stroke();
  ctx.restore();
}

function drawDateBlock(ctx: CanvasRenderingContext2D, dateRange: string, location: string) {
  const x = 60;
  const y = 758;
  const w = 78;
  const h = 96;
  ctx.save();
  roundRectPath(ctx, x, y, w, h, 14);
  ctx.fillStyle = "#9e2117";
  ctx.fill();
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillStyle = "#f7f4ea";
  ctx.font = "800 17px Georgia, serif";
  ctx.fillText("DATE", 0, 6);
  ctx.restore();

  const x2 = x + w + 10;
  const w2 = 320;
  roundRectPath(ctx, x2, y, w2, h, 14);
  ctx.fillStyle = "rgba(247,244,234,0.96)";
  ctx.fill();

  const parts = dateRange.split(" ");
  const firstLine = parts.slice(0, 3).join(" ");
  const secondLine = parts.slice(3).join(" ");
  ctx.textAlign = "left";
  ctx.fillStyle = "#6e1712";
  ctx.font = "900 30px Georgia, serif";
  ctx.fillText(firstLine, x2 + 18, y + 44);
  ctx.font = "700 18px Georgia, serif";
  ctx.fillStyle = "#8a6a1f";
  ctx.fillText(secondLine, x2 + 18, y + 74);

  ctx.font = "600 17px Georgia, serif";
  ctx.fillStyle = "#f0c766";
  const lines = wrapLines(ctx, `📍 ${location}`, 420);
  lines.slice(0, 3).forEach((line, i) => {
    ctx.fillText(line, x, y + h + 32 + i * 24);
  });
  ctx.restore();
}

function drawApotheose(ctx: CanvasRenderingContext2D, weekday: string, dateShort: string) {
  const x = 460;
  const y = 758;
  const w = 232;
  const h = 176;
  ctx.save();
  roundRectPath(ctx, x, y, w, h, 16);
  ctx.fillStyle = "rgba(247,244,234,0.97)";
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 18;
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.textAlign = "center";
  ctx.fillStyle = "#8a6a1f";
  ctx.font = "800 14px Georgia, serif";
  ctx.fillText("APOTHÉOSE", x + w / 2, y + 24);

  ctx.fillStyle = "#6e1712";
  ctx.font = "700 16px Georgia, serif";
  ctx.fillText(weekday, x + w / 2, y + 48);

  const dayNum = dateShort.match(/\d+/)?.[0] ?? "";
  const rest = dateShort.replace(dayNum, "").trim();
  ctx.font = "900 56px Georgia, serif";
  const g = ctx.createLinearGradient(x, y + 50, x, y + 110);
  g.addColorStop(0, "#f0c766");
  g.addColorStop(1, "#c8931f");
  ctx.fillStyle = g;
  ctx.fillText(dayNum, x + w / 2, y + 100);

  ctx.font = "700 15px Georgia, serif";
  ctx.fillStyle = "#6e1712";
  ctx.fillText(rest, x + w / 2, y + 118);

  roundRectPath(ctx, x + w / 2 - 46, y + h - 40, 92, 30, 15);
  ctx.fillStyle = "#6e1712";
  ctx.fill();
  ctx.fillStyle = "#f0c766";
  ctx.font = "800 16px Georgia, serif";
  ctx.fillText("15H", x + w / 2, y + h - 19);
  ctx.restore();
}

function drawVenue(ctx: CanvasRenderingContext2D, venueName: string, city: string) {
  const x = 710;
  const y = 758;
  const w = 210;
  const h = 96;
  ctx.save();
  roundRectPath(ctx, x, y, w, h, 14);
  ctx.fillStyle = "rgba(74,14,14,0.72)";
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(217,168,60,0.6)";
  ctx.stroke();

  ctx.fillStyle = "#f0c766";
  const bx = x + 26;
  const by = y + 20;
  const bw = 30;
  const bh = 40;
  ctx.fillRect(bx, by, bw, bh);
  ctx.fillStyle = "rgba(74,14,14,0.72)";
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 2; col++) {
      ctx.fillRect(bx + 5 + col * 14, by + 6 + row * 11, 7, 7);
    }
  }
  ctx.fillStyle = "#f0c766";
  ctx.beginPath();
  ctx.moveTo(bx - 4, by);
  ctx.lineTo(bx + bw / 2, by - 14);
  ctx.lineTo(bx + bw + 4, by);
  ctx.closePath();
  ctx.fill();

  ctx.textAlign = "left";
  ctx.font = "800 16px Georgia, serif";
  ctx.fillStyle = "#f7f4ea";
  const rawLines = wrapLines(ctx, venueName, 120);
  const nameLines = rawLines.slice(0, 2);
  if (rawLines.length > 2 && nameLines[1]) nameLines[1] = `${nameLines[1].trimEnd()}…`;
  ctx.fillText(nameLines[0] ?? venueName, x + 70, y + 36);
  if (nameLines[1]) ctx.fillText(nameLines[1], x + 70, y + 54);

  if (city) {
    ctx.font = "600 14px Georgia, serif";
    ctx.fillStyle = "#e7c9ad";
    const cityLine = truncateLine(ctx, `(${city})`, w - 82);
    ctx.fillText(cityLine, x + 70, y + (nameLines[1] ? 74 : 58));
  }
  ctx.restore();
}

function drawEntree(ctx: CanvasRenderingContext2D) {
  const cx = 985;
  const cy = 812;
  const r = 78;
  ctx.save();
  const g = ctx.createRadialGradient(cx - 20, cy - 20, 5, cx, cy, r);
  g.addColorStop(0, "#ff5b4d");
  g.addColorStop(1, "#c22318");
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.shadowColor = "rgba(0,0,0,0.4)";
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.shadowColor = "transparent";

  ctx.beginPath();
  ctx.arc(cx, cy, r - 8, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.stroke();

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  const words = BADGE_CONTENT.entryNote.split(" ");
  ctx.font = "900 15px Georgia, serif";
  ctx.fillText(words[0] ?? "", cx, cy - 18);
  ctx.font = "700 13px Georgia, serif";
  ctx.fillText(words.slice(1, 3).join(" "), cx, cy + 2);
  ctx.fillText(words.slice(3).join(" "), cx, cy + 20);
  ctx.restore();
}

export async function generateBadgeBlob(data: BadgeSourceData): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context unavailable");

  const [img, flyerImg, logoImg] = await Promise.all([
    data.photoUrl ? loadImageSafe(data.photoUrl) : Promise.resolve(null),
    loadImageSafe(BADGE_CONTENT.backgroundImagePath),
    loadImageSafe(BADGE_CONTENT.logoPath),
  ]);
  const initials = `${data.firstName[0] ?? ""}${data.lastName[0] ?? ""}`.toUpperCase();
  const dateRange = formatDateRange(data.startDate, data.endDate);
  const { weekday, short } = formatApotheoseDate(data.endDate);
  const venue = BADGE_CONTENT.apotheoseVenue ?? splitLocationFallback(data.location);

  drawBackground(ctx, flyerImg);
  drawLogoCircle(ctx, logoImg);
  drawWordmark(ctx, data.eventName);
  drawThemeBadge(ctx);
  drawPhotoFrame(ctx, img, initials);
  drawCta(ctx);
  drawDateBlock(ctx, dateRange, data.location);
  drawApotheose(ctx, weekday, short);
  drawVenue(ctx, venue.name, venue.city);
  drawEntree(ctx);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Badge image generation failed"));
    }, "image/png");
  });
}

export function downloadBadgeBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
