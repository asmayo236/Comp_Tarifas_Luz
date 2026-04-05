import PotenciaInputs from './PotenciaInputs.jsx';
import EnergiaInputs from './EnergiaInputs.jsx';
import ConsumoInputs from './ConsumoInputs.jsx';
import NumInput from './NumInput.jsx';
import { calcularTarifa } from '../services/simulator.js';

export default function TarifaColumn({ tarifa, onChange, periodo, isPrincipal = false, isWinner = false, onRemove }) {
  const resultado = calcularTarifa(tarifa, periodo);

  return (
    <div className={`bg-white rounded-2xl shadow-sm p-5 flex flex-col ${isWinner ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-text-secondary">
            {isPrincipal ? 'Tu tarifa' : tarifa.nombre}
          </h2>
          {isWinner && (
            <span className="inline-block mt-1 bg-primary text-white text-xs font-semibold px-3 py-0.5 rounded-full">
              Más económica
            </span>
          )}
        </div>
        {!isPrincipal && onRemove && (
          <button
            onClick={onRemove}
            className="text-text-secondary hover:text-danger text-lg cursor-pointer"
            title="Eliminar tarifa"
          >
            ✕
          </button>
        )}
      </div>

      <PotenciaInputs tarifa={tarifa} onChange={onChange} />
      <EnergiaInputs tarifa={tarifa} onChange={onChange} />
      <ConsumoInputs
        tarifa={tarifa}
        onChange={onChange}
        disabled={!isPrincipal}
        periodoTipo={periodo.tipo}
      />

      <div className="mb-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3 border-b border-gray-100 pb-1">
          Otros
        </h3>
        <NumInput
          label="Alquiler contador"
          value={tarifa.alquiler_contador_eur_mes}
          onChange={(v) => onChange({ ...tarifa, alquiler_contador_eur_mes: v })}
          suffix="€/mes"
          step={0.01}
        />
      </div>

      {/* Results breakdown */}
      <div className="mt-auto pt-4 border-t-2 border-gray-100">
        <div className="space-y-1.5 text-sm">
          <ResultRow label="Energía" value={resultado.costeEnergia} />
          <ResultRow label="Potencia" value={resultado.costePotencia} />
          <ResultRow label="Imp. eléctrico" value={resultado.impuestoElectrico} />
          <ResultRow label="Contador" value={resultado.alquilerContador} />
          <ResultRow label="IVA (21%)" value={resultado.iva} />
          <div className="flex justify-between pt-2 border-t border-gray-200 text-base font-extrabold">
            <span>TOTAL</span>
            <span className="text-primary">{resultado.total.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultRow({ label, value }) {
  return (
    <div className="flex justify-between text-text-secondary">
      <span>{label}</span>
      <span className="font-semibold text-text-main">{value.toFixed(2)} €</span>
    </div>
  );
}
