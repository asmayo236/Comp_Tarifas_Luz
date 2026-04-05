import { useState, useEffect, useRef } from 'react';

export default function NumInput({ label, value, onChange, suffix = '', step = 1, disabled = false, tooltip }) {
  const [localValue, setLocalValue] = useState(String(value));
  const isFocused = useRef(false);

  // Sync from parent when not editing
  useEffect(() => {
    if (!isFocused.current) {
      setLocalValue(String(value));
    }
  }, [value]);

  const handleBlur = () => {
    isFocused.current = false;
    const parsed = parseFloat(localValue.replace(',', '.'));
    if (!isNaN(parsed)) {
      onChange(parsed);
      setLocalValue(String(parsed));
    } else {
      setLocalValue(String(value));
    }
  };

  return (
    <div>
      <label className="text-xs text-text-secondary flex items-center gap-1">
        {label}
        {tooltip && (
          <span className="cursor-help text-primary-light" title={tooltip}>ℹ️</span>
        )}
      </label>
      <div className="flex items-center gap-1.5 mt-0.5">
        <input
          type="text"
          inputMode="decimal"
          value={localValue}
          onFocus={() => { isFocused.current = true; }}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
          disabled={disabled}
          className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 disabled:bg-gray-50 disabled:text-text-secondary"
        />
        {suffix && <span className="text-xs text-text-secondary whitespace-nowrap">{suffix}</span>}
      </div>
    </div>
  );
}
