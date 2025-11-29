import React from 'react';
import { useInventory } from '../contexts/InventoryContext';
import { FileSpreadsheet, Printer, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReportsPage = () => {
    const { products } = useInventory();

    const downloadCSV = () => {
        // Define headers
        const headers = ['ID', 'Nombre', 'SKU', 'Categoría', 'Stock', 'Costo', 'Precio', 'Valor Total'];

        // Map data
        const rows = products.map(p => [
            p.id,
            `"${p.name.replace(/"/g, '""')}"`, // Escape quotes
            p.sku,
            p.category,
            p.stock,
            p.cost,
            p.price,
            (p.stock * p.cost).toFixed(2)
        ]);

        // Combine
        const csvContent = [
            headers.join(','),
            ...rows.map(r => r.join(','))
        ].join('\n');

        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `inventario_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reportes</h1>
                    <p className="page-subtitle">Genera y exporta información de tu inventario</p>
                </div>
            </div>

            <div className="reports-grid">
                {/* CSV Export Card */}
                <div className="card report-card">
                    <div className="icon-wrapper bg-success-light">
                        <FileSpreadsheet size={32} className="text-success" />
                    </div>
                    <div className="report-info">
                        <h3>Exportar Inventario (CSV)</h3>
                        <p>Descarga todo tu inventario en formato compatible con Excel.</p>
                        <button onClick={downloadCSV} className="btn btn-outline">
                            Descargar CSV
                        </button>
                    </div>
                </div>

                {/* Value Report Card */}
                <div className="card report-card">
                    <div className="icon-wrapper bg-primary-light">
                        <TrendingUp size={32} className="text-primary" />
                    </div>
                    <div className="report-info">
                        <h3>Valorización de Inventario</h3>
                        <p>Reporte imprimible del valor total de tu stock por categoría.</p>
                        <Link to="/reports/value" className="btn btn-outline">
                            Ver Reporte
                        </Link>
                    </div>
                </div>

                {/* Low Stock Report Card */}
                <div className="card report-card">
                    <div className="icon-wrapper bg-warning-light">
                        <AlertTriangle size={32} className="text-warning" />
                    </div>
                    <div className="report-info">
                        <h3>Productos con Bajo Stock</h3>
                        <p>Lista de productos que están por debajo del mínimo requerido.</p>
                        <Link to="/reports/low-stock" className="btn btn-outline">
                            Ver Reporte
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .report-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: var(--spacing-xl);
          gap: var(--spacing-lg);
          transition: transform 0.2s;
        }

        .report-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .icon-wrapper {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .report-info h3 {
          margin-bottom: var(--spacing-sm);
          font-size: 1.25rem;
        }

        .report-info p {
          color: var(--color-text-muted);
          margin-bottom: var(--spacing-lg);
          min-height: 48px;
        }

        .btn-outline {
          background: transparent;
          border: 1px solid var(--color-border);
          color: var(--color-text);
          width: 100%;
        }

        .btn-outline:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background-color: var(--color-background);
        }

        .bg-success-light { background-color: #d1fae5; }
        .text-success { color: var(--color-success); }
        
        .bg-primary-light { background-color: #e0e7ff; }
        .text-primary { color: var(--color-primary); }

        .bg-warning-light { background-color: #fef3c7; }
        .text-warning { color: var(--color-warning); }
      `}</style>
        </div>
    );
};

export default ReportsPage;
