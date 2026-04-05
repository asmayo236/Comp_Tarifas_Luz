export const defaultTarifaPrincipal = {
  nombre: 'Mi tarifa actual',
  comercializadora: 'Comercializadora ejemplo',
  potencia_kw: { p1: 4.6, p2: 4.6 },
  precios_potencia: { p1: 31.40, p2: 1.50 },
  unidad_potencia: 'anio',
  modo_energia: 'fijo24h',
  precio_energia_fijo: 0.155,
  precios_energia: { punta: 0.185, llano: 0.150, valle: 0.105 },
  consumo_kwh: { total: 3600, punta: 900, llano: 1440, valle: 1260 },
  alquiler_contador_eur_mes: 0.81,
};

export const defaultTarifaAlternativa = {
  nombre: 'Tarifa alternativa',
  comercializadora: 'Otra comercializadora',
  potencia_kw: { p1: 4.6, p2: 4.6 },
  precios_potencia: { p1: 30.67, p2: 1.42 },
  unidad_potencia: 'anio',
  modo_energia: 'fijo24h',
  precio_energia_fijo: 0.130,
  precios_energia: { punta: 0.170, llano: 0.135, valle: 0.095 },
  consumo_kwh: { total: 3600, punta: 900, llano: 1440, valle: 1260 },
  alquiler_contador_eur_mes: 0.81,
};

export const defaultPeriodo = {
  tipo: 'anual',
  dias: 365,
  inicio: '',
  fin: '',
};
