/**
 * Utility functions for date manipulation, calendar period formatting,
 * elapsed duration calculation, and parsing freeform Indonesian/English duration strings.
 */

export const MONTH_NAMES_ID = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export const MONTH_SHORT_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

export const MONTH_SHORT_EN = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const MONTH_MAP: Record<string, number> = {
  // Indonesian
  jan: 1, januari: 1,
  feb: 2, februari: 2,
  mar: 3, maret: 3,
  apr: 4, april: 4,
  mei: 5,
  jun: 6, juni: 6,
  jul: 7, juli: 7,
  agu: 8, agt: 8, agustus: 8,
  sep: 9, september: 9,
  okt: 10, oktober: 10,
  nov: 11, nopember: 11, november: 11,
  des: 12, desember: 12,

  // English
  january: 1,
  february: 2,
  march: 3,
  may: 5,
  june: 6,
  july: 7,
  aug: 8, august: 8,
  sept: 9,
  oct: 10, october: 10,
  dec: 12, december: 12,
};

/**
 * Format "YYYY-MM" into readable "Jan 2025" or "Januari 2025"
 */
export function formatMonthYear(ym: string, full = false): string {
  if (!ym) return "";
  const parts = ym.split("-");
  if (parts.length < 2) return ym;

  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  if (monthIdx < 0 || monthIdx > 11) return ym;

  const monthName = full ? MONTH_NAMES_ID[monthIdx] : MONTH_SHORT_ID[monthIdx];
  return `${monthName} ${year}`;
}

/**
 * Format "YYYY-MM-DD" into readable Indonesian date "15 Jun 2026"
 */
export function formatFullDate(dateStr: string, full = false): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length === 2) return formatMonthYear(dateStr, full);
  if (parts.length < 3) return dateStr;

  const year = parts[0];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (monthIdx < 0 || monthIdx > 11) return dateStr;

  const monthName = full ? MONTH_NAMES_ID[monthIdx] : MONTH_SHORT_ID[monthIdx];
  return `${day} ${monthName} ${year}`;
}

/**
 * Calculates duration in months and years between start and end month.
 * e.g. 2025-01 to 2025-03 = 3 months
 */
export function calculateDuration(
  startYM: string,
  endYM?: string | null,
  isCurrent = false
): { totalMonths: number; years: number; months: number; text: string } {
  if (!startYM) {
    return { totalMonths: 0, years: 0, months: 0, text: "" };
  }

  const [startYear, startMonth] = startYM.split("-").map((n) => parseInt(n, 10));
  if (!startYear || !startMonth) {
    return { totalMonths: 0, years: 0, months: 0, text: "" };
  }

  let endYear: number;
  let endMonth: number;

  if (isCurrent || !endYM) {
    const now = new Date();
    endYear = now.getFullYear();
    endMonth = now.getMonth() + 1;
  } else {
    const [ey, em] = endYM.split("-").map((n) => parseInt(n, 10));
    endYear = ey || startYear;
    endMonth = em || startMonth;
  }

  let totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  if (totalMonths < 1) totalMonths = 1;

  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} thn`);
  if (remainingMonths > 0 || years === 0) parts.push(`${remainingMonths} bln`);

  const durationStr = parts.join(" ");
  const text = isCurrent ? `${durationStr} • Berjalan` : durationStr;

  return {
    totalMonths,
    years,
    months: remainingMonths,
    text,
  };
}

/**
 * Build clean standard duration period string
 * e.g. "Jan 2025 – Mar 2025" or "Jan 2026 – Sekarang"
 */
export function buildDurationPeriod(
  startYM: string,
  endYM?: string | null,
  isCurrent = false
): string {
  if (!startYM) return "";
  const startStr = formatMonthYear(startYM);

  if (isCurrent) {
    return `${startStr} – Sekarang`;
  }

  if (!endYM) {
    return startStr;
  }

  const endStr = formatMonthYear(endYM);
  return `${startStr} – ${endStr}`;
}

/**
 * Parses freeform duration strings into structured calendar components:
 * Examples handled:
 * - "jan 2025– maret 2025" -> start: "2025-01", end: "2025-03", isCurrent: false
 * - "Jan – Mar 2025" -> start: "2025-01", end: "2025-03", isCurrent: false
 * - "2026 – Sekarang" -> start: "2026-01", end: "", isCurrent: true
 * - "2026 – Present" -> start: "2026-01", end: "", isCurrent: true
 * - "Jun 2026" -> start: "2026-06", end: "", isCurrent: false
 */
export function parseDurationString(raw: string): {
  startMonth: string;
  endMonth: string;
  isCurrent: boolean;
} {
  const result = {
    startMonth: "",
    endMonth: "",
    isCurrent: false,
  };

  if (!raw || typeof raw !== "string") return result;

  const clean = raw.trim().toLowerCase();

  // Check if current
  if (
    clean.includes("sekarang") ||
    clean.includes("present") ||
    clean.includes("saat ini") ||
    clean.includes("current") ||
    clean.includes("active")
  ) {
    result.isCurrent = true;
  }

  // Split by range separators: "–", "—", "-", "sd", "s/d", "sampai", "to"
  const rangeParts = clean.split(/\s*(?:–|—|-|\bsd\b|\bs\/d\b|\bsampai\b|\bto\b)\s*/);

  const parsePart = (part: string): { month: number | null; year: number | null } => {
    if (!part) return { month: null, year: null };

    // Find 4-digit year
    const yearMatch = part.match(/\b(19\d\d|20\d\d)\b/);
    const year = yearMatch ? parseInt(yearMatch[1], 10) : null;

    // Find month word or numeric month
    let month: number | null = null;
    const words = part.split(/[^a-z0-9]+/);
    for (const w of words) {
      if (MONTH_MAP[w]) {
        month = MONTH_MAP[w];
        break;
      }
    }

    return { month, year };
  };

  if (rangeParts.length >= 2) {
    const p1 = parsePart(rangeParts[0]);
    const p2 = parsePart(rangeParts[1]);

    // If p1 has no year but p2 does, inherit year (e.g. "Jan – Mar 2025")
    const p1Year = p1.year || p2.year;
    const p2Year = p2.year || p1.year;

    if (p1Year) {
      const m1 = p1.month ? String(p1.month).padStart(2, "0") : "01";
      result.startMonth = `${p1Year}-${m1}`;
    }

    if (result.isCurrent) {
      result.endMonth = "";
    } else if (p2Year) {
      const m2 = p2.month ? String(p2.month).padStart(2, "0") : "12";
      result.endMonth = `${p2Year}-${m2}`;
    }
  } else if (rangeParts.length === 1) {
    const p = parsePart(rangeParts[0]);
    if (p.year) {
      const m = p.month ? String(p.month).padStart(2, "0") : "01";
      result.startMonth = `${p.year}-${m}`;
    }
  }

  return result;
}

/**
 * Format single certificate date into standard string e.g. "Jun 2026"
 */
export function formatCertificateDate(ym: string): string {
  if (!ym) return "";
  return formatMonthYear(ym);
}
