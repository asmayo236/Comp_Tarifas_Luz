import { calcularTarifa } from '../services/simulator.js';
import { fmtEur, TARIFA_COLORS } from '../services/format.js';

export default function ResultsSummary({ tarifaPrincipal, tarifas, periodo }) {
  const totalPrincipal = calcularTarifa(tarifaPrincipal, periodo).total;
  const colorPrincipal = TARIFA_COLORS[0]; // blue

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">
        Comparativa de costes
      </h2>
      <div className="space-y-4">
        {tarifas.map((tarifa, idx) => {
          const totalAlt = calcularTarifa(tarifa, periodo).total;
          const ahorro = totalPrincipal - totalAlt;
          const porcentaje = totalPrincipal > 0 ? (ahorro / totalPrincipal) * 100 : 0;
          const maxTotal = Math.max(totalPrincipal, totalAlt);
          const altGana = ahorro > 0;
          const colorAlt = TARIFA_COLORS[(idx + 1) % TARIFA_COLORS.length];

          return (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: colorPrincipal }} />
                  Tu tarifa
                </span>
                <span className="font-bold">{fmtEur(totalPrincipal)} €</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 mb-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${maxTotal > 0 ? (totalPrincipal / maxTotal) * 100 : 0}%`,
                    backgroundColor: colorPrincipal,
                  }}
                />
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium flex items-center gap-1.5">
                  <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: colorAlt }} />
                  {tarifa.nombre}
                </span>
                <span className="font-bold">{fmtEur(totalAlt)} €</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 mb-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${maxTotal > 0 ? (totalAlt / maxTotal) * 100 : 0}%`,
                    backgroundColor: colorAlt,
                  }}
                />
              </div>
              <div className={`text-center p-3 rounded-xl ${altGana ? 'bg-primary-lighter' : 'bg-red-50'}`}>
                {altGana ? (
                  <span className="text-primary font-bold">
                    Con {tarifa.nombre} ahorras {fmtEur(ahorro)} €{periodo.tipo === 'anual' ? '/año' : ''} ({fmtEur(porcentaje, 1)}%)
                  </span>
                ) : (
                  <span className="text-danger font-bold">
                    Tu tarifa es más económica por {fmtEur(Math.abs(ahorro))} €{periodo.tipo === 'anual' ? '/año' : ''} ({fmtEur(Math.abs(porcentaje), 1)}%)
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
