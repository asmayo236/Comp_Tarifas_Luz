import NumInput from './NumInput.jsx';

export default function EnergiaInputs({ tarifa, onChange }) {
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

  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3 border-b border-gray-100 pb-1">
        Energía
      </h3>
      <div className="flex gap-3 mb-3">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            checked={tarifa.modo_energia === 'fijo24h'}
            onChange={() => onChange({ ...tarifa, modo_energia: 'fijo24h' })}
            className="accent-primary"
          />
          <span className="text-xs font-medium">Precio fijo 24h</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="radio"
            checked={tarifa.modo_energia === '3periodos'}
            onChange={() => onChange({ ...tarifa, modo_energia: '3periodos' })}
            className="accent-primary"
          />
          <span className="text-xs font-medium">3 periodos</span>
        </label>
      </div>
      {tarifa.modo_energia === 'fijo24h' ? (
        <NumInput
          label="Precio energía"
          value={tarifa.precio_energia_fijo}
          onChange={(v) => update('precio_energia_fijo', v)}
          suffix="€/kWh"
          step={0.001}
        />
      ) : (
        <div className="grid grid-cols-3 gap-2">
          <NumInput label="Punta" value={tarifa.precios_energia?.punta || 0} onChange={(v) => update('precios_energia.punta', v)} suffix="€/kWh" step={0.001} />
          <NumInput label="Llano" value={tarifa.precios_energia?.llano || 0} onChange={(v) => update('precios_energia.llano', v)} suffix="€/kWh" step={0.001} />
          <NumInput label="Valle" value={tarifa.precios_energia?.valle || 0} onChange={(v) => update('precios_energia.valle', v)} suffix="€/kWh" step={0.001} />
        </div>
      )}
    </div>
  );
}
