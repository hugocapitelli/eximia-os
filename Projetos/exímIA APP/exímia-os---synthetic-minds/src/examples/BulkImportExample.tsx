// Bulk Import Panel Usage Example
// Story 7.7.0 - Bulk Book Import

import { useState } from 'react';
import toast from 'react-hot-toast';
import { BulkImportPanel } from '../components/organisms/BulkImportPanel';
import type { ImportReport } from '../services/biblioteca/importService';

export function BulkImportExample() {
  const [lastReport, setLastReport] = useState<ImportReport | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleImportComplete = (report: ImportReport) => {
    setLastReport(report);
    console.log('Import completed:', report);
    toast.success(
      `Importação concluída! ${report.importedCount} livros importados.`
    );
  };

  return (
    <div className="bulk-import-example">
      <h1>Exemplo de Importação em Lote</h1>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="toggle-button"
        style={{
          padding: '0.75rem 1.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '2rem',
        }}
      >
        {isOpen ? 'Fechar' : 'Abrir'} Painel de Importação
      </button>

      {isOpen && (
        <div className="import-panel-container" style={{ marginBottom: '2rem' }}>
          <BulkImportPanel
            onImportComplete={handleImportComplete}
            className="panel"
          />
        </div>
      )}

      {lastReport && (
        <div className="last-report" style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1.5rem',
          marginTop: '2rem',
        }}>
          <h2>Último Relatório</h2>
          <div className="report-content" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            margin: '1rem 0',
          }}>
            <p><strong>Total:</strong> {lastReport.totalFiles}</p>
            <p><strong>Importados:</strong> {lastReport.importedCount}</p>
            <p><strong>Duplicatas:</strong> {lastReport.duplicateCount}</p>
            <p><strong>Falhados:</strong> {lastReport.failedCount}</p>
            <p><strong>Inválidos:</strong> {lastReport.invalidBooks.length}</p>
          </div>
          {lastReport.errors.length > 0 && (
            <div style={{
              background: '#fee2e2',
              border: '1px solid #fca5a5',
              borderRadius: '6px',
              padding: '1rem',
              marginTop: '1rem',
            }}>
              <h3 style={{ color: '#dc2626', margin: '0 0 0.5rem 0' }}>Erros:</h3>
              <ul style={{ list: 'none', padding: 0, margin: 0 }}>
                {lastReport.errors.map((error, i) => (
                  <li key={i} style={{ color: '#991b1b', margin: '0.5rem 0' }}>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
