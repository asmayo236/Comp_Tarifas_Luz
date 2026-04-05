export default function UploadOverlay({ message }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-sm">
        <div className="text-4xl mb-4 animate-pulse">📄</div>
        <p className="font-bold text-lg mb-2">Procesando factura</p>
        <p className="text-sm text-text-secondary">{message}</p>
      </div>
    </div>
  );
}
