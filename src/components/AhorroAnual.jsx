import { calcularTarifa } from '../services/simulator.js';
import { fmtNum } from '../services/format.js';

export default function AhorroAnual({ tarifaPrincipal, tarifas, periodo }) {
  if (periodo.tipo === 'anual') return null;

  const totalPrincipal = calcularTarifa(tarifaPrincipal, periodo).total;

  // Find the cheapest alternative
  let bestName = null;
  let bestAhorro = 0;
  let bestTotalAlt = 0;
  tarifas.forEach((tarifa) => {
    const totalAlt = calcularTarifa(tarifa, periodo).total;
    const ahorro = totalPrincipal - totalAlt;
    if (ahorro > bestAhorro || bestName === null) {
      bestAhorro = ahorro;
      bestName = tarifa.nombre;
      bestTotalAlt = totalAlt;
    }
  });

  const factor = 365 / periodo.dias;
  const ahorroAnual = bestAhorro * factor;
  const totalAnualPrincipal = totalPrincipal * factor;
  const totalAnualAlt = bestTotalAlt * factor;

  return (
    <div className="bg-success-light rounded-2xl p-5 mb-6">
      <div className="flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <div>
          <p className="font-bold text-success">
            {bestAhorro > 0
              ? `Ahorro anual estimado con ${bestName}: ~${fmtNum(Math.abs(ahorroAnual))} €/año`
              : `Tu tarifa es la más económica (~${fmtNum(Math.abs(ahorroAnual))} €/año menos)`
            }
          </p>
          <p className="text-xs text-text-secondary">
            {bestAhorro > 0
              ? `Pasarías de ~${fmtNum(Math.round(totalAnualPrincipal))} €/año a ~${fmtNum(Math.round(totalAnualAlt))} €/año`
              : `Pasarías de ~${fmtNum(Math.round(totalAnualPrincipal))} €/año a ~${fmtNum(Math.round(totalAnualAlt))} €/año`
            }
            {' · '}Basado en extrapolar el periodo de {periodo.dias} días
          </p>
        </div>
      </div>
    </div>
  );
}
