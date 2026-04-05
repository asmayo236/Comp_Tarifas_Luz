import { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend, ReferenceDot
} from 'recharts';
import { generarDatosGrafica, calcularPuntoCruce, calcularTarifa } from '../services/simulator.js';

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#8b5cf6'];
const NAMES_DEFAULT = ['Tu tarifa', 'Alternativa', '3ª tarifa', '4ª tarifa'];

export default function CrossoverChart({ tarifaPrincipal, tarifas, periodo }) {
  const [conImpuestos, setConImpuestos] = useState(true);

  const allTarifas = [tarifaPrincipal, ...tarifas];
  const consumoActual = tarifaPrincipal.consumo_kwh.total;

  const data = useMemo(
    () => generarDatosGrafica(allTarifas, periodo, conImpuestos, consumoActual),
    [allTarifas, periodo, conImpuestos, consumoActual]
  );

  const puntosCruce = useMemo(() => {
    const puntos = [];
    for (let i = 1; i < allTarifas.length; i++) {
      const pc = calcularPuntoCruce(allTarifas[0], allTarifas[i], periodo, conImpuestos);
      if (pc) puntos.push({ ...pc, idx: i });
    }
    return puntos;
  }, [allTarifas, periodo, conImpuestos]);

  const totalPrincipal = useMemo(
    () => calcularTarifa(tarifaPrincipal, periodo).total,
    [tarifaPrincipal, periodo]
  );

  const nombres = [
    'Tu tarifa',
    ...tarifas.map((t, i) => t.nombre || NAMES_DEFAULT[i + 1])
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary flex items-center gap-2">
          📊 Punto de cruce
        </h2>
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
        <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="consumo"
            label={{ value: 'Consumo (kWh)', position: 'insideBottom', offset: -5, style: { fontSize: 12 } }}
            tick={{ fontSize: 11 }}
          />
          <YAxis
            label={{ value: 'Coste (€)', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 12 } }}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value, name) => [`${value.toFixed(2)} €`, name]}
            labelFormatter={(v) => `${v} kWh`}
          />
          <Legend />

          {allTarifas.map((_, idx) => (
            <Line
              key={idx}
              type="monotone"
              dataKey={`tarifa${idx}`}
              name={nombres[idx]}
              stroke={COLORS[idx % COLORS.length]}
              strokeWidth={2}
              dot={false}
              strokeDasharray={idx === 0 ? undefined : '6 3'}
            />
          ))}

          <ReferenceLine
            x={consumoActual}
            stroke="#6b7280"
            strokeDasharray="4 4"
            label={{ value: `Tu consumo: ${consumoActual} kWh`, position: 'top', style: { fontSize: 11, fill: '#6b7280' } }}
          />

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
                Punto de cruce vs {nombres[pc.idx]}: {Math.round(pc.consumo).toLocaleString('es-ES')} kWh{periodo.tipo === 'anual' ? '/año' : ''}
              </p>
              <p className="text-text-secondary text-xs mt-1">
                Con tu consumo de {consumoActual.toLocaleString('es-ES')} kWh,{' '}
                {consumoActual > pc.consumo
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
