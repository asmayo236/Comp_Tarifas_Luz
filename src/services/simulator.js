/**
 * Motor de simulación para comparar tarifas eléctricas.
 */

const IMPUESTO_ELECTRICO = 0.05113;
const IVA = 0.21;

function normalizarPrecioPotencia(precio, unidad) {
  switch (unidad) {
    case 'mes': return precio * 12;
    case 'dia': return precio * 365;
    default: return precio; // 'anio'
  }
}

export function calcularTarifa(tarifa, periodo) {
  const dias = periodo.dias;

  const precioP1Anual = normalizarPrecioPotencia(tarifa.precios_potencia.p1, tarifa.unidad_potencia);
  const precioP2Anual = normalizarPrecioPotencia(tarifa.precios_potencia.p2, tarifa.unidad_potencia);

  const costePotencia =
    (tarifa.potencia_kw.p1 * precioP1Anual / 365 * dias) +
    (tarifa.potencia_kw.p2 * precioP2Anual / 365 * dias);

  let costeEnergia;
  if (tarifa.modo_energia === 'fijo24h') {
    costeEnergia = tarifa.consumo_kwh.total * (tarifa.precio_energia_fijo || 0);
  } else {
    costeEnergia =
      (tarifa.consumo_kwh.punta || 0) * (tarifa.precios_energia?.punta || 0) +
      (tarifa.consumo_kwh.llano || 0) * (tarifa.precios_energia?.llano || 0) +
      (tarifa.consumo_kwh.valle || 0) * (tarifa.precios_energia?.valle || 0);
  }

  const impuestoElectrico = (costeEnergia + costePotencia) * IMPUESTO_ELECTRICO;
  const alquilerContador = tarifa.alquiler_contador_eur_mes * (dias / 30);
  const subtotal = costeEnergia + costePotencia + impuestoElectrico + alquilerContador;
  const iva = subtotal * IVA;
  const total = subtotal + iva;

  return {
    costeEnergia,
    costePotencia,
    impuestoElectrico,
    alquilerContador,
    subtotal,
    iva,
    total,
  };
}

export function calcularPrecioMedio(tarifa) {
  if (tarifa.modo_energia === 'fijo24h') {
    return tarifa.precio_energia_fijo || 0;
  }
  const total = tarifa.consumo_kwh.total || 1;
  const punta = tarifa.consumo_kwh.punta || 0;
  const llano = tarifa.consumo_kwh.llano || 0;
  const valle = tarifa.consumo_kwh.valle || 0;
  return (
    (punta * (tarifa.precios_energia?.punta || 0) +
     llano * (tarifa.precios_energia?.llano || 0) +
     valle * (tarifa.precios_energia?.valle || 0)) / total
  );
}

export function calcularCosteFijo(tarifa, periodo, conImpuestos = true) {
  const dias = periodo.dias;
  const precioP1Anual = normalizarPrecioPotencia(tarifa.precios_potencia.p1, tarifa.unidad_potencia);
  const precioP2Anual = normalizarPrecioPotencia(tarifa.precios_potencia.p2, tarifa.unidad_potencia);

  const costePotencia =
    (tarifa.potencia_kw.p1 * precioP1Anual / 365 * dias) +
    (tarifa.potencia_kw.p2 * precioP2Anual / 365 * dias);

  const alquilerContador = tarifa.alquiler_contador_eur_mes * (dias / 30);

  let costeFijo = costePotencia + alquilerContador;

  if (conImpuestos) {
    const impElec = costePotencia * IMPUESTO_ELECTRICO;
    costeFijo = (costePotencia + impElec + alquilerContador) * (1 + IVA);
  }

  return costeFijo;
}

export function calcularPrecioMedioConImpuestos(tarifa, conImpuestos = true) {
  let precioMedio = calcularPrecioMedio(tarifa);
  if (conImpuestos) {
    precioMedio = precioMedio * (1 + IMPUESTO_ELECTRICO) * (1 + IVA);
  }
  return precioMedio;
}

export function calcularPuntoCruce(tarifaA, tarifaB, periodo, conImpuestos = true) {
  const fijoA = calcularCosteFijo(tarifaA, periodo, conImpuestos);
  const fijoB = calcularCosteFijo(tarifaB, periodo, conImpuestos);
  const precioA = calcularPrecioMedioConImpuestos(tarifaA, conImpuestos);
  const precioB = calcularPrecioMedioConImpuestos(tarifaB, conImpuestos);

  const denominador = precioA - precioB;
  if (Math.abs(denominador) < 1e-10) return null;

  const consumoCruce = (fijoB - fijoA) / denominador;
  if (consumoCruce <= 0) return null;

  const costeCruce = fijoA + precioA * consumoCruce;
  return { consumo: consumoCruce, coste: costeCruce };
}

export function generarDatosGrafica(tarifas, periodo, conImpuestos, consumoActual) {
  const maxConsumo = Math.max(consumoActual * 2, 6000);
  const pasos = 100;
  const data = [];

  for (let i = 0; i <= pasos; i++) {
    const consumo = (maxConsumo / pasos) * i;
    const punto = { consumo: Math.round(consumo) };

    tarifas.forEach((tarifa, idx) => {
      const costeFijo = calcularCosteFijo(tarifa, periodo, conImpuestos);
      const precioMedio = calcularPrecioMedioConImpuestos(tarifa, conImpuestos);
      punto[`tarifa${idx}`] = Math.round((costeFijo + precioMedio * consumo) * 100) / 100;
    });

    data.push(punto);
  }

  return data;
}
