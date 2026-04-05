import { useRef } from 'react';

export default function Header({ onFileSelected, isProcessing }) {
  const fileInputRef = useRef(null);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-main flex items-center gap-2">
            <span className="text-primary">⚡</span> Comparador de Factura Eléctrica
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Compara tu tarifa actual con otras opciones. Modifica los datos o sube tu factura.
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) onFileSelected(e.target.files[0]);
            }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="bg-primary hover:bg-primary-light text-white font-semibold px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin">⏳</span> Procesando...
              </>
            ) : (
              <>📄 Subir mi factura</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
