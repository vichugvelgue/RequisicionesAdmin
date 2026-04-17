/**
 * Formato estándar de fecha en la app: DD-MMM-YYYY (ej. 10-OCT-1997).
 * Mes en 3 letras mayúsculas en español.
 */

export const MONTHS_MMM = [
  'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN',
  'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC',
];

const MONTH_MMM_TO_NUM = Object.fromEntries(
  MONTHS_MMM.map((m, i) => [m, i])
);

const ISO_YMD = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Convierte Date o string (yyyy-mm-dd o DD-MMM-YYYY) a DD-MMM-YYYY.
 * @param {Date|string} dateOrString - Date, "yyyy-mm-dd" o "10-OCT-1997" (también acepta "/" legado)
 * @returns {string} "10-OCT-1997"
 */
export function formatDateToDDMMMYYYY(dateOrString) {
  if (!dateOrString) return '';
  let d;
  if (typeof dateOrString === 'string') {
    const trimmed = dateOrString.trim();
    if (ISO_YMD.test(trimmed)) {
      d = new Date(`${trimmed}T12:00:00`);
    } else {
      d = parseDDMMMYYYY(trimmed);
      if (!d) d = new Date(trimmed);
    }
  } else {
    d = new Date(dateOrString);
  }
  if (Number.isNaN(d.getTime())) return '';
  const day = String(d.getDate()).padStart(2, '0');
  const month = MONTHS_MMM[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Título de mes para calendarios (react-day-picker): MMM YYYY, ej. MAR 2025.
 * Usa las mismas abreviaturas que {@link formatDateToDDMMMYYYY}.
 * @param {Date|number|string} date - Fecha que cae en el mes a mostrar
 * @returns {string} ej. "ENE 2026"
 */
export function formatMonthYearCaption(date) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${MONTHS_MMM[d.getMonth()]} ${d.getFullYear()}`;
}

/**
 * Parsea string DD-MMM-YYYY (o DD/MMM/YYYY legado) a Date (para ordenar/filtrar).
 * @param {string} str - "10-OCT-1997" o "10/OCT/1997"
 * @returns {Date|null}
 */
export function parseDDMMMYYYY(str) {
  if (!str || typeof str !== 'string') return null;
  const parts = str.trim().split(/[-/]/);
  if (parts.length !== 3) return null;
  const [day, monthStr, year] = parts;
  const monthNum = MONTH_MMM_TO_NUM[monthStr?.toUpperCase()];
  if (monthNum === undefined) return null;
  const y = Number(year);
  const d = Number(day);
  if (!y || !d) return null;
  const date = new Date(y, monthNum, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Convierte Date a valor para <input type="date"> (yyyy-mm-dd).
 * @param {Date} date
 * @returns {string} "1997-10-10"
 */
export function dateToInputValue(date) {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Convierte DD-MMM-YYYY a valor para <input type="date"> (yyyy-mm-dd).
 * @param {string} str - "10-OCT-1997"
 * @returns {string} "1997-10-10"
 */
export function parseDDMMMYYYYToInputValue(str) {
  const d = parseDDMMMYYYY(str);
  return d ? dateToInputValue(d) : '';
}

/**
 * Comprueba si una fecha (Date local) cae dentro de un rango acotado por strings yyyy-mm-dd.
 * @param {Date} reqDate
 * @param {string} [startIso]
 * @param {string} [endIso]
 * @returns {boolean}
 */
export function isDateWithinIsoRange(reqDate, startIso, endIso) {
  if (!reqDate || Number.isNaN(reqDate.getTime())) return false;
  if (startIso) {
    const [sy, sm, sd] = String(startIso).split('-');
    const start = new Date(Number(sy), Number(sm) - 1, Number(sd));
    if (reqDate < start) return false;
  }
  if (endIso) {
    const [ey, em, ed] = String(endIso).split('-');
    const end = new Date(Number(ey), Number(em) - 1, Number(ed));
    if (reqDate > end) return false;
  }
  return true;
}
