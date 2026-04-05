export default function PeriodSelector({ periodo, onChange }) {
  const handleTipoChange = (tipo) => {
    if (tipo === 'anual') {
      onChange({ tipo: 'anual', dias: 365, inicio: '', fin: '' });
    } else {
      onChange({ ...periodo, tipo: 'personalizado' });
    }
  };

  const handleFechaChange = (field, value) => {
    const updated = { ...periodo, [field]: value };
    if (updated.inicio && updated.fin) {
      const diff = (new Date(updated.fin) - new Date(updated.inicio)) / (1000 * 60 * 60 * 24);
      updated.dias = Math.max(1, Math.round(diff));
    }
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <span className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Periodo:</span>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="periodo"
              checked={periodo.tipo === 'anual'}
              onChange={() => handleTipoChange('anual')}
              className="accent-primary"
            />
            <span className="text-sm font-medium">Anual</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="radio"
              name="periodo"
              checked={periodo.tipo === 'personalizado'}
              onChange={() => handleTipoChange('personalizado')}
              className="accent-primary"
            />
            <span className="text-sm font-medium">Personalizado</span>
          </label>
        </div>
        {periodo.tipo === 'personalizado' && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-1.5 text-sm">
              Desde:
              <input
                type="date"
                value={periodo.inicio}
                onChange={(e) => handleFechaChange('inicio', e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
            </label>
            <label className="flex items-center gap-1.5 text-sm">
              Hasta:
              <input
                type="date"
                value={periodo.fin}
                onChange={(e) => handleFechaChange('fin', e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
              />
            </label>
            <span className="text-sm text-text-secondary">
              {periodo.dias} días
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
