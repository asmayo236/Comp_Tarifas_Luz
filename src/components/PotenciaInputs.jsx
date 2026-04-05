import NumInput from './NumInput.jsx';
import { fmtNum } from '../services/format.js';

const UNIDAD_LABELS = { anio: '€/kW·año', mes: '€/kW·mes', dia: '€/kW·día' };
const CONVERSIONES = { anio: 1, mes: 12, dia: 365 };

export default function PotenciaInputs({ tarifa, onChange, editable = true }) {
  const handleUnidadChange = (nuevaUnidad) => {
    const factorViejo = CONVERSIONES[tarifa.unidad_potencia];
    const factorNuevo = CONVERSIONES[nuevaUnidad];
    const p1Anual = tarifa.precios_potencia.p1 * factorViejo;
    const p2Anual = tarifa.precios_potencia.p2 * factorViejo;
    onChange({
      ...tarifa,
      unidad_potencia: nuevaUnidad,
      precios_potencia: {
        p1: Math.round((p1Anual / factorNuevo) * 10000) / 10000,
        p2: Math.round((p2Anual / factorNuevo) * 10000) / 10000,
      },
    });
  };

  const update = (path, value) => {
    const keys = path.split('.');
    const updated = { ...tarifa };
    let obj = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      obj[keys[i]] = { ...obj[keys[i]] };
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    onChange(updated);
  };

  // Non-editable: show values as read-only
  if (!editable) {
    return (
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3 border-b border-gray-100 pb-1">
          Potencia
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <NumInput label="P1 (Punta)" value={tarifa.potencia_kw.p1} onChange={() => {}} suffix="kW" disabled />
          <NumInput label="P2 (Valle)" value={tarifa.potencia_kw.p2} onChange={() => {}} suffix="kW" disabled />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <NumInput label="Precio P1" value={tarifa.precios_potencia.p1} onChange={(v) => update('precios_potencia.p1', v)} suffix={UNIDAD_LABELS[tarifa.unidad_potencia]} />
          <NumInput label="Precio P2" value={tarifa.precios_potencia.p2} onChange={(v) => update('precios_potencia.p2', v)} suffix={UNIDAD_LABELS[tarifa.unidad_potencia]} />
        </div>
        <div className="mb-3 mt-2">
          <label className="text-xs text-text-secondary">Precios en:</label>
          <div className="flex gap-2 mt-1">
            {Object.entries(UNIDAD_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleUnidadChange(key)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                  tarifa.unidad_potencia === key
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-text-secondary border-gray-200 hover:border-primary-light'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3 border-b border-gray-100 pb-1">
        Potencia
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <NumInput label="P1 (Punta)" value={tarifa.potencia_kw.p1} onChange={(v) => update('potencia_kw.p1', v)} suffix="kW" />
        <NumInput label="P2 (Valle)" value={tarifa.potencia_kw.p2} onChange={(v) => update('potencia_kw.p2', v)} suffix="kW" />
      </div>
      <div className="grid grid-cols-2 gap-3 mt-2">
        <NumInput label="Precio P1" value={tarifa.precios_potencia.p1} onChange={(v) => update('precios_potencia.p1', v)} suffix={UNIDAD_LABELS[tarifa.unidad_potencia]} />
        <NumInput label="Precio P2" value={tarifa.precios_potencia.p2} onChange={(v) => update('precios_potencia.p2', v)} suffix={UNIDAD_LABELS[tarifa.unidad_potencia]} />
      </div>
      <div className="mb-3 mt-2">
        <label className="text-xs text-text-secondary">Precios en:</label>
        <div className="flex gap-2 mt-1">
          {Object.entries(UNIDAD_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleUnidadChange(key)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                tarifa.unidad_potencia === key
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-text-secondary border-gray-200 hover:border-primary-light'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
