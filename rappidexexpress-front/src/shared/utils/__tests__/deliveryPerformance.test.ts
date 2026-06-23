import assert from "node:assert/strict";
import test from "node:test";

import { StatusDelivery } from "../../constants/enums.constants";
import type { City, Report } from "../../interfaces";
import {
  calculateDeliveryPerformance,
  calculateReportsMotoboyTotal,
  createLocalDate,
  formatDateToYmd,
  formatMotoboyDeliveryGain,
  getMotoboyDeliveryValue,
  getRappidexWeekRange,
  getRappidexWeekYmdRange,
  getTodayYmdRange,
} from "../deliveryPerformance";

const city: City = { id: "city-1", name: "Cidade", deliveryValue: "R$ 8,50" };

function report(overrides: Partial<Report>): Report {
  return {
    clientName: "Cliente",
    clientPhone: "",
    createdAt: "2026-06-02T10:00:00",
    createdBy: "",
    establishmentId: "",
    establishmentImage: "",
    establishmentName: "",
    establishmentPhone: "",
    establishmentLocation: "",
    establishmentPix: "",
    establishmentCityId: "city-1",
    id: "delivery-1",
    isActive: true,
    motoboyId: "motoboy-1",
    motoboyName: "Motoboy",
    motoboyPhone: "",
    payment: "",
    status: StatusDelivery.FINISHED,
    value: "999,00",
    observation: "",
    soda: "",
    onCoursedAt: "",
    collectedAt: "",
    ...overrides,
  };
}

test("cria filtros YYYY-MM-DD locais sem depender de toISOString", () => {
  assert.equal(formatDateToYmd(new Date(2026, 5, 2, 23, 30)), "2026-06-02");
  assert.deepEqual(getTodayYmdRange(new Date(2026, 5, 2, 23, 30)), {
    start: "2026-06-02",
    end: "2026-06-02",
  });
});

test("cria filtros YYYY-MM-DD da semana Rappidex de terça a segunda", () => {
  assert.deepEqual(getRappidexWeekYmdRange(new Date(2026, 5, 8, 12)), {
    start: "2026-06-02",
    end: "2026-06-08",
  });
  assert.deepEqual(getRappidexWeekYmdRange(new Date(2026, 5, 9, 12)), {
    start: "2026-06-09",
    end: "2026-06-15",
  });
});

test("cria limites locais inclusivos para o filtro manual", () => {
  assert.deepEqual(
    createLocalDate("2026-06-02"),
    new Date(2026, 5, 2, 0, 0, 0, 0),
  );
  assert.deepEqual(
    createLocalDate("2026-06-02", true),
    new Date(2026, 5, 2, 23, 59, 59, 999),
  );
});

test("sábado usa a semana inclusiva de terça a segunda", () => {
  const { start, end } = getRappidexWeekRange(new Date(2026, 5, 6, 12));

  assert.deepEqual(start, new Date(2026, 5, 2, 0, 0, 0, 0));
  assert.deepEqual(end, new Date(2026, 5, 8, 23, 59, 59, 999));
});

test("segunda-feira pertence à semana iniciada na terça anterior", () => {
  const { start, end } = getRappidexWeekRange(new Date(2026, 5, 8, 12));

  assert.deepEqual(start, new Date(2026, 5, 2, 0, 0, 0, 0));
  assert.deepEqual(end, new Date(2026, 5, 8, 23, 59, 59, 999));
});

test("terça-feira inicia uma nova semana", () => {
  const { start, end } = getRappidexWeekRange(new Date(2026, 5, 9, 12));

  assert.deepEqual(start, new Date(2026, 5, 9, 0, 0, 0, 0));
  assert.deepEqual(end, new Date(2026, 5, 15, 23, 59, 59, 999));
});

test("conta somente entregas finalizadas do motoboy e usa o valor da cidade", () => {
  const reports = [
    report({ id: "start", finishedAt: "2026-06-02T00:00:00" }),
    report({ id: "end", finishedAt: "2026-06-08T23:59:59.999" }),
    report({ id: "previous-week", finishedAt: "2026-06-01T23:59:59.999" }),
    report({ id: "next-week", finishedAt: "2026-06-09T00:00:00" }),
    report({
      id: "canceled",
      status: StatusDelivery.CANCELED,
      finishedAt: "2026-06-04T12:00:00",
    }),
    report({
      id: "in-route",
      status: StatusDelivery.ONCOURSE,
      finishedAt: "2026-06-04T12:00:00",
    }),
    report({
      id: "other-motoboy",
      motoboyId: "motoboy-2",
      finishedAt: "2026-06-04T12:00:00",
    }),
    report({
      id: "nested-motoboy",
      motoboyId: "",
      motoboy: { id: "motoboy-1" },
      finishedAt: "2026-06-03T12:00:00",
    }),
    report({ id: "no-finished-date", createdAt: "2026-06-03T12:00:00" }),
  ];

  const performance = calculateDeliveryPerformance(
    reports,
    "motoboy-1",
    [city],
    new Date(2026, 5, 8, 12),
  );

  assert.deepEqual(performance.week, { count: 3, total: 25.5 });
});

test("prioriza finishedAt e usa datas alternativas somente quando necessário", () => {
  const reports = [
    report({
      id: "finished-at-wins",
      finishedAt: "2026-06-01T12:00:00",
      updatedAt: "2026-06-04T12:00:00",
    }),
    report({
      id: "legacy-completed-at",
      completedAt: "2026-06-04T12:00:00",
      updatedAt: "2026-06-01T12:00:00",
    }),
  ];

  const performance = calculateDeliveryPerformance(
    reports,
    "motoboy-1",
    [city],
    new Date(2026, 5, 8, 12),
  );

  assert.deepEqual(performance.week, { count: 1, total: 8.5 });
});

test("usa o valor pago ao entregador da cidade para o aviso de finalização", () => {
  const finishedDelivery = report({ value: "150,00" });

  assert.equal(getMotoboyDeliveryValue(finishedDelivery, [city]), 8.5);
  assert.equal(formatMotoboyDeliveryGain(8.5), "+R$ 8,50");
});

test("usa zero no aviso quando a cidade não tem valor configurado", () => {
  const cityWithoutValue: City = { id: "city-1", name: "Cidade" };

  assert.equal(getMotoboyDeliveryValue(report({}), [cityWithoutValue]), 0);
  assert.equal(formatMotoboyDeliveryGain(0), "+R$ 0,00");
});

test("soma o valor do motoboy pela cidade sem afetar a quantidade", () => {
  const reports = [
    report({ id: "one" }),
    report({ id: "two" }),
    report({ id: "without-city-value", establishmentCityId: "city-2" }),
  ];

  assert.equal(calculateReportsMotoboyTotal(reports, [city]), 17);
});
