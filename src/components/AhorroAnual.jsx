import { calcularTarifa } from '../services/simulator.js';
import { fmtNum } from '../services/format.js';

export default function AhorroAnual({ tarifaPrincipal, tarifas, periodo }) {
  if (periodo.tipo === 'anual') return null;

  const totalPrincipal = calcularTarifa(tarifaPrincipal, periodo).total;

  // Find the cheapest alternative
  let bestName = null;
  let bestAhorro = 0;
  tarifas.forEach((tarifa) => {
    const totalAlt = calcularTarifa(tarifa, periodo).total;
    const ahorro = totalPrincipal - totalAlt;
    if (ahorro > bestAhorro || bestName === null) {
      bestAhorro = ahorro;
      bestName = tarifa.nombre;
    }
  });

  const ahorroAnual = bestAhorro * (365 / periodo.dias);

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
            Basado en extrapolar el periodo de {periodo.dias} días
          </p>
        </div>
      </div>
    </div>
  );
}
