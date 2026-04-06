import { calcularTarifa } from '../services/simulator.js';
import { fmtNum } from '../services/format.js';

export default function AhorroAnual({ tarifaPrincipal, tarifas, periodo }) {
  if (periodo.tipo === 'anual') return null;

  const totalPrincipal = calcularTarifa(tarifaPrincipal, periodo).total;

  return (
    <div className="bg-success-light rounded-2xl p-5 mb-6">
      {tarifas.map((tarifa, idx) => {
        const totalAlt = calcularTarifa(tarifa, periodo).total;
        const diferenciaAnual = (totalPrincipal - totalAlt) * (365 / periodo.dias);

        return (
          <div key={idx} className="flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-bold text-success">
                Ahorro anual estimado vs {tarifa.nombre}: ~{fmtNum(Math.abs(diferenciaAnual))} €/año
              </p>
              <p className="text-xs text-text-secondary">
                Basado en extrapolar el periodo de {periodo.dias} días
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
