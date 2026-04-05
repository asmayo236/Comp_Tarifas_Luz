import NumInput from './NumInput.jsx';

export default function ConsumoInputs({ tarifa, onChange, disabled = false, periodoTipo }) {
  const update = (path, value) => {
    const keys = path.split('.');
    const updated = { ...tarifa };
    let obj = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      obj[keys[i]] = { ...obj[keys[i]] };
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;

    // Auto-calculate total if 3 periodos
    if (tarifa.modo_energia === '3periodos' && path !== 'consumo_kwh.total') {
      updated.consumo_kwh = { ...updated.consumo_kwh };
      updated.consumo_kwh.total =
        (updated.consumo_kwh.punta || 0) +
        (updated.consumo_kwh.llano || 0) +
        (updated.consumo_kwh.valle || 0);
    }

    onChange(updated);
  };

  const suffix = periodoTipo === 'anual' ? 'kWh/año' : 'kWh';

  if (disabled) {
    return (
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3 border-b border-gray-100 pb-1">
          Consumo
        </h3>
        <div className="bg-primary-lighter rounded-lg p-3 text-sm text-text-secondary">
          Heredado: <span className="font-semibold text-primary">{tarifa.consumo_kwh.total}</span> {suffix}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3 border-b border-gray-100 pb-1">
        Consumo
      </h3>
      {tarifa.modo_energia === 'fijo24h' ? (
        <NumInput label="Consumo total" value={tarifa.consumo_kwh.total} onChange={(v) => update('consumo_kwh.total', v)} suffix={suffix} step={10} />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            <NumInput label="Punta" value={tarifa.consumo_kwh.punta || 0} onChange={(v) => update('consumo_kwh.punta', v)} suffix="kWh" step={10} />
            <NumInput label="Llano" value={tarifa.consumo_kwh.llano || 0} onChange={(v) => update('consumo_kwh.llano', v)} suffix="kWh" step={10} />
            <NumInput label="Valle" value={tarifa.consumo_kwh.valle || 0} onChange={(v) => update('consumo_kwh.valle', v)} suffix="kWh" step={10} />
          </div>
          <div className="mt-2 text-xs text-text-secondary">
            Total: <span className="font-semibold text-primary">{tarifa.consumo_kwh.total}</span> {suffix}
          </div>
        </>
      )}
    </div>
  );
}
