import React from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { ArrowLeft, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LowStockReport = () => {
    const { products } = useInventory();
    const navigate = useNavigate();

    const currentDate = new Date().toLocaleDateString();

    // Filter low stock products
    const lowStockProducts = products.filter(p => p.minStock && p.stock <= p.minStock);

    return (
        <div className="report-container">
            <div className="no-print report-controls">
                <button onClick={() => navigate('/reports')} className="btn">
                    <ArrowLeft size={20} /> Volver
                </button>
                <button onClick={() => window.print()} className="btn btn-primary">
                    <Printer size={20} style={{ marginRight: '8px' }} /> Imprimir
                </button>
            </div>

            <div className="paper">
                <div className="report-header">
                    <h1>Reporte de Stock Bajo</h1>
                    <p>Fecha de emisión: {currentDate}</p>
                    <p className="subtitle">Productos que requieren reabastecimiento inmediato</p>
                </div>

                {lowStockProducts.length > 0 ? (
                    <table className="report-table">
                        <thead>
                            <tr>
                                <th>SKU</th>
                                <th>Producto</th>
                                <th>Proveedor/Categoría</th>
                                <th className="text-right">Stock Actual</th>
                                <th className="text-right">Mínimo</th>
                                <th className="text-right">Déficit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lowStockProducts.map(p => (
                                <tr key={p.id}>
                                    <td className="font-mono">{p.sku}</td>
                                    <td>{p.name}</td>
                                    <td>{p.category}</td>
                                    <td className="text-right text-danger font-bold">{p.stock}</td>
                                    <td className="text-right">{p.minStock}</td>
                                    <td className="text-right">{(p.minStock - p.stock)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-report">
                        <p>¡Excelente! No hay productos con stock bajo en este momento.</p>
                    </div>
                )}

                <div className="report-footer">
                    <p>Fin del reporte - Total items: {lowStockProducts.length}</p>
                </div>
            </div>

            <style>{`
        .report-container {
          padding: 2rem;
          background-color: #f3f4f6;
          min-height: 100vh;
        }

        .report-controls {
          display: flex;
          justify-content: space-between;
          margin-bottom: 2rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .paper {
          background: white;
          max-width: 800px;
          margin: 0 auto;
          padding: 4rem;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }

        .report-header {
          text-align: center;
          margin-bottom: 3rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 2rem;
        }

        .report-header h1 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          color: #b91c1c; /* Red for urgency */
        }

        .subtitle {
          color: #6b7280;
        }

        .report-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2rem;
        }

        .report-table th, .report-table td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
        }

        .report-table th {
          background-color: #f9fafb;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
        }

        .text-right { text-align: right !important; }
        .text-danger { color: #dc2626; }
        .font-bold { font-weight: 700; }
        .font-mono { font-family: monospace; }

        .empty-report {
          text-align: center;
          padding: 3rem;
          background-color: #f0fdf4;
          border-radius: 0.5rem;
          color: #166534;
        }

        .report-footer {
          text-align: center;
          color: #9ca3af;
          font-size: 0.8rem;
          margin-top: 4rem;
        }

        @media print {
          .no-print { display: none !important; }
          .report-container { padding: 0; background: white; }
          .paper { box-shadow: none; padding: 0; max-width: 100%; }
          body { background: white; }
        }
      `}</style>
        </div>
    );
};

export default LowStockReport;
