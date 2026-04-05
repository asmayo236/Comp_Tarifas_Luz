import TarifaColumn from './TarifaColumn.jsx';
import { calcularTarifa } from '../services/simulator.js';

export default function ComparisonPanel({ tarifaPrincipal, tarifas, periodo, onChangePrincipal, onChangeTarifa, onRemoveTarifa, onAddTarifa }) {
  const totalPrincipal = calcularTarifa(tarifaPrincipal, periodo).total;
  const totales = tarifas.map(t => calcularTarifa(t, periodo).total);
  const allTotales = [totalPrincipal, ...totales];
  const minTotal = Math.min(...allTotales);

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TarifaColumn
          tarifa={tarifaPrincipal}
          onChange={onChangePrincipal}
          periodo={periodo}
          isPrincipal
          isWinner={totalPrincipal === minTotal}
        />
        {tarifas.map((tarifa, idx) => (
          <TarifaColumn
            key={idx}
            tarifa={tarifa}
            onChange={(updated) => onChangeTarifa(idx, updated)}
            periodo={periodo}
            isWinner={totales[idx] === minTotal}
            onRemove={tarifas.length > 1 ? () => onRemoveTarifa(idx) : undefined}
          />
        ))}
        {tarifas.length < 3 && (
          <button
            onClick={onAddTarifa}
            className="bg-white rounded-2xl shadow-sm p-5 border-2 border-dashed border-gray-200 hover:border-primary flex flex-col items-center justify-center gap-2 text-text-secondary hover:text-primary transition-colors cursor-pointer min-h-[200px]"
          >
            <span className="text-3xl">+</span>
            <span className="text-sm font-semibold">Añadir tarifa</span>
          </button>
        )}
      </div>
    </div>
  );
}
