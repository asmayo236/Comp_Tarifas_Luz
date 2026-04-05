import { GEMINI_PROMPT } from '../data/prompt.js';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function analyzeInvoiceWithGemini(text, apiKey) {
  const prompt = GEMINI_PROMPT.replace('{texto_factura}', text);

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 2048 },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Error de Gemini API: ${response.status} - ${err}`);
  }

  const data = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  // Extract JSON from response (may be wrapped in markdown code block)
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No se pudo extraer JSON de la respuesta de Gemini');
  }

  return JSON.parse(jsonMatch[0]);
}

export function mapGeminiToTarifa(geminiData) {
  const consumo = geminiData.consumo_kwh || {};
  const precios = geminiData.precios_energia_eur_kwh || {};
  const tienePeriodos = precios.punta != null && precios.llano != null && precios.valle != null;

  return {
    nombre: 'Mi factura',
    comercializadora: geminiData.comercializadora || 'Desconocida',
    potencia_kw: {
      p1: geminiData.potencia_contratada_kw?.p1 || 4.6,
      p2: geminiData.potencia_contratada_kw?.p2 || 4.6,
    },
    precios_potencia: {
      p1: geminiData.precios_potencia_eur_kw_anio?.p1 || 31.40,
      p2: geminiData.precios_potencia_eur_kw_anio?.p2 || 1.50,
    },
    unidad_potencia: 'anio',
    modo_energia: tienePeriodos ? '3periodos' : 'fijo24h',
    precio_energia_fijo: precios.precio_medio || 0.15,
    precios_energia: tienePeriodos
      ? { punta: precios.punta, llano: precios.llano, valle: precios.valle }
      : { punta: 0.185, llano: 0.150, valle: 0.105 },
    consumo_kwh: {
      total: consumo.total || 300,
      punta: consumo.punta || 0,
      llano: consumo.llano || 0,
      valle: consumo.valle || 0,
    },
    alquiler_contador_eur_mes: geminiData.alquiler_contador_eur_mes || 0.81,
  };
}

export function mapGeminiToPeriodo(geminiData) {
  const p = geminiData.periodo;
  if (p && p.inicio && p.fin) {
    return {
      tipo: 'personalizado',
      dias: p.dias || Math.round((new Date(p.fin) - new Date(p.inicio)) / (1000 * 60 * 60 * 24)),
      inicio: p.inicio,
      fin: p.fin,
    };
  }
  return { tipo: 'anual', dias: 365, inicio: '', fin: '' };
}
