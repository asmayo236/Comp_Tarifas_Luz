export const GEMINI_PROMPT = `Eres un experto en facturas eléctricas españolas. Analiza el siguiente texto
extraído de una factura de electricidad y devuelve ÚNICAMENTE un JSON válido.
Sin explicaciones, sin markdown, sin texto adicional.

{
  "comercializadora": "nombre",
  "periodo": {
    "inicio": "YYYY-MM-DD",
    "fin": "YYYY-MM-DD",
    "dias": número
  },
  "tarifa_acceso": "2.0TD",
  "potencia_contratada_kw": { "p1": número, "p2": número },
  "consumo_kwh": {
    "punta": número o null,
    "llano": número o null,
    "valle": número o null,
    "total": número
  },
  "precios_potencia_eur_kw_anio": { "p1": número, "p2": número },
  "precios_energia_eur_kwh": {
    "punta": número o null,
    "llano": número o null,
    "valle": número o null,
    "precio_medio": número o null
  },
  "alquiler_contador_eur_mes": número,
  "total_factura": número
}

Reglas:
- Si un dato no aparece, usa null.
- Si el consumo no se desglosa, pon solo "total" y deja los periodos en null.
- Si hay un precio único de energía, ponlo en "precio_medio" y deja periodos en null.
- Si los precios de potencia aparecen como €/kW·día, multiplica × 365.
- Si aparecen como €/kW·mes, multiplica × 12.

TEXTO DE LA FACTURA:
---
{texto_factura}
---`;
