import { StatusDelivery } from "../constants/enums.constants";
import type { City, Report } from "../interfaces";

export type DeliveryPerformance = {
  count: number;
  total: number;
};

export type DeliveryPerformancePeriods = {
  today: DeliveryPerformance;
  week: DeliveryPerformance;
};

type DateRange = {
  start: Date;
  end: Date;
};

type YmdDateRange = {
  start: string;
  end: string;
};

export function formatDateToYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayYmdRange(referenceDate = new Date()): YmdDateRange {
  const today = formatDateToYmd(referenceDate);

  return {
    start: today,
    end: today,
  };
}

export function getRappidexWeekYmdRange(
  referenceDate = new Date(),
): YmdDateRange {
  const date = new Date(referenceDate);
  const weekStartDay = 2; // terça-feira
  const currentDay = date.getDay();
  const diffToTuesday = (currentDay - weekStartDay + 7) % 7;

  const start = new Date(date);
  start.setDate(date.getDate() - diffToTuesday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    start: formatDateToYmd(start),
    end: formatDateToYmd(end),
  };
}

export function getLastClosedRappidexWeekYmdRange(
  referenceDate = new Date(),
): YmdDateRange {
  const currentWeekRange = getRappidexWeekRange(referenceDate);
  const start = new Date(currentWeekRange.start);
  start.setDate(start.getDate() - 7);

  const end = new Date(currentWeekRange.start);
  end.setDate(end.getDate() - 1);

  return {
    start: formatDateToYmd(start),
    end: formatDateToYmd(end),
  };
}

export function isClosedWeekSettlementWaitingRepasseDay(
  referenceDate = new Date(),
): boolean {
  const currentDay = referenceDate.getDay();

  // A semana fecha na segunda. De terça até sexta o valor fica aguardando repasse.
  return currentDay >= 2 && currentDay <= 5;
}

export function getClosedWeekSettlementMessage(referenceDate = new Date()) {
  return referenceDate.getDay() === 5
    ? "Repasse previsto para hoje"
    : "Aguarde o repasse na sexta-feira";
}

export function getClosedWeekSettlementDisplayMessage(
  hasPendingValue: boolean,
  referenceDate = new Date(),
) {
  if (!hasPendingValue) {
    return "Nenhum valor a receber da semana anterior";
  }

  return getClosedWeekSettlementMessage(referenceDate);
}

export function createLocalDate(dateString: string, endOfDay = false): Date {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(
    year,
    month - 1,
    day,
    endOfDay ? 23 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 59 : 0,
    endOfDay ? 999 : 0,
  );
}

export function getTodayRange(referenceDate = new Date()): DateRange {
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(referenceDate);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export function getRappidexWeekRange(baseDate = new Date()): DateRange {
  const date = new Date(baseDate);
  const weekStartDay = 2; // terça-feira
  const currentDay = date.getDay();
  const diffToTuesday = (currentDay - weekStartDay + 7) % 7;

  const start = new Date(date);
  start.setDate(date.getDate() - diffToTuesday);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);

  return { start, end };
}

export const getTuesdayWeekRange = getRappidexWeekRange;

function isWithinRange(date: Date, range: DateRange) {
  const timestamp = date.getTime();
  return timestamp >= range.start.getTime() && timestamp <= range.end.getTime();
}

export function parseDeliveryValue(value?: string | number | null): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  const normalizedValue = String(value ?? "")
    .trim()
    .replace(/R\$/gi, "")
    .replace(/\s/g, "");

  if (!normalizedValue) return 0;

  const decimalValue = normalizedValue.includes(",")
    ? normalizedValue.replace(/\./g, "").replace(",", ".")
    : normalizedValue;
  const parsedValue = Number(decimalValue);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function getFinishedDate(report: Report): Date | null {
  const finishedDateValue =
    report.finishedAt ||
    report.completedAt ||
    report.finalizedAt ||
    report.updatedAt;

  if (!finishedDateValue) return null;
  const finishedDate = new Date(finishedDateValue);

  return Number.isNaN(finishedDate.getTime()) ? null : finishedDate;
}

function getCityDeliveryValue(
  report: Report,
  deliveryValueByCityId: Map<string, number>,
) {
  const cityId = String(
    report.establishmentCityId ||
      report.cityId ||
      report.establishment?.cityId ||
      "",
  ).trim();
  if (!cityId) return 0;

  return deliveryValueByCityId.get(cityId) ?? 0;
}

export function getMotoboyDeliveryValue(report: Report, cities: City[]) {
  const deliveryValueByCityId = new Map<string, number>();

  cities.forEach((city) => {
    const cityId = String(city.id ?? "").trim();

    if (cityId) {
      deliveryValueByCityId.set(cityId, parseDeliveryValue(city.deliveryValue));
    }
  });

  return getCityDeliveryValue(report, deliveryValueByCityId);
}

export function calculateReportsMotoboyTotal(
  reports: Report[],
  cities: City[],
) {
  return reports.reduce((total, report) => {
    return total + getMotoboyDeliveryValue(report, cities);
  }, 0);
}

export function formatMotoboyDeliveryGain(value: number) {
  return `+R$ ${value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function calculateDeliveryPerformance(
  reports: Report[],
  motoboyId: string,
  cities: City[],
  referenceDate = new Date(),
): DeliveryPerformancePeriods {
  const todayRange = getTodayRange(referenceDate);
  const weekRange = getRappidexWeekRange(referenceDate);
  const deliveryValueByCityId = new Map<string, number>();
  const performance: DeliveryPerformancePeriods = {
    today: { count: 0, total: 0 },
    week: { count: 0, total: 0 },
  };

  cities.forEach((city) => {
    const cityId = String(city.id ?? "").trim();
    const deliveryValue = parseDeliveryValue(city.deliveryValue);

    if (cityId) {
      deliveryValueByCityId.set(cityId, deliveryValue);
    }
  });

  reports.forEach((report) => {
    const normalizedStatus = String(report.status).toUpperCase();
    const isFinished =
      normalizedStatus === StatusDelivery.FINISHED ||
      normalizedStatus === "COMPLETED";
    const assignedMotoboyId =
      report.motoboyId || report.motoboy?.id || report.motoboy?._id;

    if (!isFinished || String(assignedMotoboyId) !== String(motoboyId)) {
      return;
    }

    const finishedAt = getFinishedDate(report);
    if (!finishedAt) return;

    const deliveryValue = getCityDeliveryValue(report, deliveryValueByCityId);

    if (isWithinRange(finishedAt, weekRange)) {
      performance.week.count += 1;
      performance.week.total += deliveryValue;
    }

    if (isWithinRange(finishedAt, todayRange)) {
      performance.today.count += 1;
      performance.today.total += deliveryValue;
    }
  });

  return performance;
}
