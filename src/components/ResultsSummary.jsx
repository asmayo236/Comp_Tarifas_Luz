import { calcularTarifa } from '../services/simulator.js';
import { fmtEur, TARIFA_COLORS } from '../services/format.js';

export default function ResultsSummary({ tarifaPrincipal, tarifas, periodo }) {
  const totalPrincipal = calcularTarifa(tarifaPrincipal, periodo).total;
  const colorPrincipal = TARIFA_COLORS[0];

  const allNames = ['Tu tarifa', ...tarifas.map(t => t.nombre)];
  const allTotals = [totalPrincipal, ...tarifas.map(t => calcularTarifa(t, periodo).total)];
  const allColors = allNames.map((_, i) => TARIFA_COLORS[i % TARIFA_COLORS.length]);
  const maxTotal = Math.max(...allTotals);
  const minTotal = Math.min(...allTotals);
  const minIdx = allTotals.indexOf(minTotal);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">
        Comparativa de costes
      </h2>

      {/* All tariff bars in a single block */}
      <div className="space-y-3">
        {allNames.map((name, idx) => (
          <div key={idx}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: allColors[idx] }} />
                {name}
              </span>
              <span className="font-bold">{fmtEur(allTotals[idx])} €</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${maxTotal > 0 ? (allTotals[idx] / maxTotal) * 100 : 0}%`,
                  backgroundColor: allColors[idx],
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary message */}
      <div className="text-center p-3 rounded-xl bg-success-light mt-4">
        {minIdx === 0 ? (
          <span className="text-success font-bold">
            Tu tarifa es la más económica
            {tarifas.length === 1
              ? ` por ${fmtEur(allTotals[1] - minTotal)} €${periodo.tipo === 'anual' ? '/año' : ''}`
              : ''}
          </span>
        ) : (
          <div>
            <span className="text-success font-bold block">
              Con {allNames[minIdx]} ahorras {fmtEur(totalPrincipal - minTotal)} €{periodo.tipo === 'anual' ? '/año' : ''} ({fmtEur((totalPrincipal - minTotal) / totalPrincipal * 100, 1)}%)
            </span>
            <span className="text-success text-sm mt-1 block">
              👉 Valora cambiar a {allNames[minIdx]}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
