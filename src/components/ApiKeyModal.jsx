import { useState } from 'react';

export default function ApiKeyModal({ onSubmit, onClose }) {
  const [key, setKey] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
        <h2 className="text-lg font-bold mb-2">🔑 API Key de Gemini</h2>
        <p className="text-sm text-text-secondary mb-4">
          Para procesar tu factura PDF, necesitamos una API key de Google Gemini (gratuita).
          Puedes obtenerla en{' '}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            aistudio.google.com/apikey
          </a>
        </p>
        <input
          type="password"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="AIza..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-primary"
        />
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-main cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={() => key.trim() && onSubmit(key.trim())}
            disabled={!key.trim()}
            className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-light disabled:opacity-50 cursor-pointer"
          >
            Guardar y procesar
          </button>
        </div>
        <p className="text-xs text-text-secondary mt-3">
          Tu key se guarda solo en tu navegador (localStorage).
        </p>
      </div>
    </div>
  );
}
