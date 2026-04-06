import { useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import PeriodSelector from './components/PeriodSelector.jsx';
import ComparisonPanel from './components/ComparisonPanel.jsx';
import ResultsSummary from './components/ResultsSummary.jsx';
import CrossoverChart from './components/CrossoverChart.jsx';
import AhorroAnual from './components/AhorroAnual.jsx';
import ApiKeyModal from './components/ApiKeyModal.jsx';
import UploadOverlay from './components/UploadOverlay.jsx';
import { defaultTarifaPrincipal, defaultTarifaAlternativa, defaultPeriodo } from './data/defaults.js';

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default function App() {
  const [periodo, setPeriodo] = useState(deepClone(defaultPeriodo));
  const [tarifaPrincipal, setTarifaPrincipal] = useState(deepClone(defaultTarifaPrincipal));
  const [tarifas, setTarifas] = useState([deepClone(defaultTarifaAlternativa)]);

  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMsg, setProcessingMsg] = useState('');
  const [error, setError] = useState(null);

  // Sync consumo and potencia from principal to alternativas
  const syncFromPrincipal = useCallback((principal, alts) => {
    return alts.map(t => ({
      ...t,
      consumo_kwh: { ...principal.consumo_kwh },
      potencia_kw: { ...principal.potencia_kw },
    }));
  }, []);

  const handleChangePrincipal = useCallback((updated) => {
    setTarifaPrincipal(updated);
    setTarifas(prev => syncFromPrincipal(updated, prev));
  }, [syncFromPrincipal]);

  const handleChangeTarifa = useCallback((idx, updated) => {
    setTarifas(prev => {
      const next = [...prev];
      next[idx] = updated;
      return next;
    });
  }, []);

  const handleRemoveTarifa = useCallback((idx) => {
    setTarifas(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const handleAddTarifa = useCallback(() => {
    const nueva = deepClone(defaultTarifaAlternativa);
    nueva.nombre = `Tarifa ${tarifas.length + 2}`;
    nueva.consumo_kwh = { ...tarifaPrincipal.consumo_kwh };
    nueva.potencia_kw = { ...tarifaPrincipal.potencia_kw };
    setTarifas(prev => [...prev, nueva]);
  }, [tarifas.length, tarifaPrincipal.consumo_kwh, tarifaPrincipal.potencia_kw]);

  const handleFileSelected = useCallback((file) => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      processInvoice(file, savedKey);
    } else {
      setPendingFile(file);
      setShowApiKeyModal(true);
    }
  }, []);

  const handleApiKeySubmit = useCallback((key) => {
    localStorage.setItem('gemini_api_key', key);
    setShowApiKeyModal(false);
    if (pendingFile) {
      processInvoice(pendingFile, key);
      setPendingFile(null);
    }
  }, [pendingFile]);

  const processInvoice = async (file, apiKey) => {
    setIsProcessing(true);
    setError(null);

    try {
      setProcessingMsg('Extrayendo texto del PDF...');
      const { extractTextFromPDF } = await import('./services/pdfExtractor.js');
      const text = await extractTextFromPDF(file);

      setProcessingMsg('Analizando con Gemini...');
      const { analyzeInvoiceWithGemini, mapGeminiToTarifa, mapGeminiToPeriodo } = await import('./services/geminiService.js');
      const geminiData = await analyzeInvoiceWithGemini(text, apiKey);

      const nuevaTarifa = mapGeminiToTarifa(geminiData);
      const nuevoPeriodo = mapGeminiToPeriodo(geminiData);

      setTarifaPrincipal(nuevaTarifa);
      setPeriodo(nuevoPeriodo);
      setTarifas(prev => syncFromPrincipal(nuevaTarifa, prev));
    } catch (err) {
      console.error('Error processing invoice:', err);
      setError(err.message);
      // If auth error, clear stored key
      if (err.message.includes('401') || err.message.includes('403')) {
        localStorage.removeItem('gemini_api_key');
      }
    } finally {
      setIsProcessing(false);
      setProcessingMsg('');
    }
  };

  return (
    <div className="min-h-screen bg-bg-page">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Header onFileSelected={handleFileSelected} isProcessing={isProcessing} />
        <PeriodSelector periodo={periodo} onChange={setPeriodo} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 text-sm text-danger">
            <strong>Error:</strong> {error}
            <button onClick={() => setError(null)} className="ml-2 underline cursor-pointer">Cerrar</button>
          </div>
        )}

        <ComparisonPanel
          tarifaPrincipal={tarifaPrincipal}
          tarifas={tarifas}
          periodo={periodo}
          onChangePrincipal={handleChangePrincipal}
          onChangeTarifa={handleChangeTarifa}
          onRemoveTarifa={handleRemoveTarifa}
          onAddTarifa={handleAddTarifa}
        />

        <ResultsSummary
          tarifaPrincipal={tarifaPrincipal}
          tarifas={tarifas}
          periodo={periodo}
        />

        <AhorroAnual
          tarifaPrincipal={tarifaPrincipal}
          tarifas={tarifas}
          periodo={periodo}
        />

        <CrossoverChart
          tarifaPrincipal={tarifaPrincipal}
          tarifas={tarifas}
          periodo={periodo}
        />

        <div className="text-center text-xs text-text-secondary py-4">
          Privacidad: tu factura se procesa en tu navegador. Los datos se envían a Google Gemini solo para extracción.
        </div>
      </div>

      {showApiKeyModal && (
        <ApiKeyModal
          onSubmit={handleApiKeySubmit}
          onClose={() => { setShowApiKeyModal(false); setPendingFile(null); }}
        />
      )}

      {isProcessing && <UploadOverlay message={processingMsg} />}
    </div>
  );
}
