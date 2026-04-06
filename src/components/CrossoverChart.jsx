import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend, ReferenceDot
} from 'recharts';
import { generarDatosGrafica, calcularPuntoCruce } from '../services/simulator.js';
import { fmtEur, fmtNum, TARIFA_COLORS } from '../services/format.js';

const NAMES_DEFAULT = ['Tu tarifa', 'Alternativa', '3ª tarifa', '4ª tarifa'];

export default function CrossoverChart({ tarifaPrincipal, tarifas, periodo }) {
  const [conImpuestos, setConImpuestos] = useState(true);

  const allTarifas = [tarifaPrincipal, ...tarifas];
  const consumoPeriodo = tarifaPrincipal.consumo_kwh.total;
  const dias = periodo.dias || 365;

  // Always show annual consumption on the chart
  const consumoAnual = periodo.tipo === 'anual'
    ? consumoPeriodo
    : Math.round(consumoPeriodo * (365 / dias));

  // Use annual period for chart calculations
  const periodoAnual = useMemo(() => ({ tipo: 'anual', dias: 365 }), []);

  const data = useMemo(
    () => generarDatosGrafica(allTarifas, periodoAnual, conImpuestos, consumoAnual),
    [allTarifas, conImpuestos, consumoAnual]
  );

  const puntosCruce = useMemo(() => {
    const puntos = [];
    for (let i = 1; i < allTarifas.length; i++) {
      const pc = calcularPuntoCruce(allTarifas[0], allTarifas[i], periodoAnual, conImpuestos);
      if (pc) puntos.push({ ...pc, idx: i });
    }
    return puntos;
  }, [allTarifas, conImpuestos]);

  const nombres = [
    'Tu tarifa',
    ...tarifas.map((t, i) => t.nombre || NAMES_DEFAULT[i + 1])
  ];

  const consumoLabel = `Tu consumo: ${fmtNum(consumoAnual)} kWh/año${periodo.tipo !== 'anual' ? ' (est.)' : ''}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
      <div className="flex items-center justify-end mb-4">
        <div className="flex items-center gap-2 text-xs">
          <span className={!conImpuestos ? 'font-bold text-primary' : 'text-text-secondary'}>Sin impuestos</span>
          <button
            onClick={() => setConImpuestos(!conImpuestos)}
            className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${conImpuestos ? 'bg-primary' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow ${conImpuestos ? 'left-5.5' : 'left-0.5'}`} />
          </button>
          <span className={conImpuestos ? 'font-bold text-primary' : 'text-text-secondary'}>Con impuestos</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 25, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="consumo"
            type="number"
            domain={[0, 'dataMax']}
            label={{ value: 'Consumo anual (kWh/año)', position: 'insideBottom', offset: -5, style: { fontSize: 12 } }}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => fmtNum(v)}
          />
          <YAxis
            label={{ value: 'Coste anual (€)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 12 } }}
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => fmtNum(v)}
          />
          <Tooltip
            formatter={(value, name) => [`${fmtEur(value)} €`, name]}
            labelFormatter={(v) => `${fmtNum(v)} kWh/año`}
          />
          <Legend />

          {allTarifas.map((_, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={`tarifa${idx}`}
              name={nombres[idx]}
              stroke={TARIFA_COLORS[idx % TARIFA_COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}

          {consumoAnual > 0 && (
            <ReferenceLine
              x={consumoAnual}
              stroke="#6b7280"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              label={{
                value: consumoLabel,
                position: 'insideTopRight',
                style: { fontSize: 10, fill: '#6b7280' },
                offset: 10,
              }}
            />
          )}

          {puntosCruce.map((pc, i) => (
            <ReferenceDot
              key={i}
              x={Math.round(pc.consumo)}
              y={Math.round(pc.coste * 100) / 100}
              r={6}
              fill="#ef4444"
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {puntosCruce.length > 0 && (
        <div className="mt-3 space-y-2">
          {puntosCruce.map((pc, i) => (
            <div key={i} className="bg-primary-lighter rounded-xl p-3 text-sm">
              <p className="font-bold text-primary">
                Punto de cruce vs {nombres[pc.idx]}: {fmtNum(Math.round(pc.consumo))} kWh/año
              </p>
              <p className="text-text-secondary text-xs mt-1">
                Con tu consumo de {fmtNum(consumoAnual)} kWh/año,{' '}
                {consumoAnual > pc.consumo
                  ? `${nombres[pc.idx]} es más económica`
                  : 'tu tarifa actual es más económica'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
