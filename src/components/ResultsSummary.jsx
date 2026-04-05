import { calcularTarifa } from '../services/simulator.js';
import { fmtEur } from '../services/format.js';

export default function ResultsSummary({ tarifaPrincipal, tarifas, periodo }) {
  const totalPrincipal = calcularTarifa(tarifaPrincipal, periodo).total;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
      <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4">
        Comparativa de costes
      </h2>
      <div className="space-y-4">
        {tarifas.map((tarifa, idx) => {
          const totalAlt = calcularTarifa(tarifa, periodo).total;
          const diferencia = totalPrincipal - totalAlt;
          const porcentaje = totalPrincipal > 0 ? (diferencia / totalPrincipal) * 100 : 0;
          const maxTotal = Math.max(totalPrincipal, totalAlt);

          return (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Tu tarifa</span>
                <span className="font-bold">{fmtEur(totalPrincipal)} €</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 mb-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${diferencia >= 0 ? 'bg-danger' : 'bg-primary'}`}
                  style={{ width: `${maxTotal > 0 ? (totalPrincipal / maxTotal) * 100 : 0}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{tarifa.nombre}</span>
                <span className="font-bold">{fmtEur(totalAlt)} €</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-4 mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${diferencia >= 0 ? 'bg-primary' : 'bg-danger'}`}
                  style={{ width: `${maxTotal > 0 ? (totalAlt / maxTotal) * 100 : 0}%` }}
                />
              </div>
              <div className={`text-center p-3 rounded-xl ${diferencia >= 0 ? 'bg-primary-lighter' : 'bg-red-50'}`}>
                {diferencia >= 0 ? (
                  <span className="text-primary font-bold">
                    Ahorras {fmtEur(diferencia)} €{periodo.tipo === 'anual' ? '/año' : ''} ({fmtEur(porcentaje, 1)}%)
                  </span>
                ) : (
                  <span className="text-danger font-bold">
                    Pagas {fmtEur(Math.abs(diferencia))} € más ({fmtEur(Math.abs(porcentaje), 1)}%)
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
