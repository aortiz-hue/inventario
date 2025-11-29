import React, { useEffect } from 'react';
import { useInventory } from '../../contexts/InventoryContext';
import { ArrowLeft, Printer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const InventoryValueReport = () => {
    const { products, categories } = useInventory();
    const navigate = useNavigate();

    const currentDate = new Date().toLocaleDateString();

    // Calculate totals by category
    const categoryStats = categories.map(cat => {
        const catProducts = products.filter(p => p.category === cat);
        const count = catProducts.reduce((acc, p) => acc + Number(p.stock), 0);
        const value = catProducts.reduce((acc, p) => acc + (Number(p.stock) * Number(p.cost)), 0);
        return { name: cat, count, value };
    });

    const totalValue = categoryStats.reduce((acc, c) => acc + c.value, 0);
    const totalItems = categoryStats.reduce((acc, c) => acc + c.count, 0);

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
                    <h1>Reporte de Valorización de Inventario</h1>
                    <p>Fecha de emisión: {currentDate}</p>
                </div>

                <div className="summary-section">
                    <div className="summary-box">
                        <span className="label">Valor Total (Costo)</span>
                        <span className="value">${totalValue.toFixed(2)}</span>
                    </div>
                    <div className="summary-box">
                        <span className="label">Total Unidades</span>
                        <span className="value">{totalItems}</span>
                    </div>
                </div>

                <table className="report-table">
                    <thead>
                        <tr>
                            <th>Categoría</th>
                            <th className="text-right">Unidades</th>
                            <th className="text-right">Valor Total ($)</th>
                            <th className="text-right">% del Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoryStats.map(cat => (
                            <tr key={cat.name}>
                                <td>{cat.name}</td>
                                <td className="text-right">{cat.count}</td>
                                <td className="text-right">${cat.value.toFixed(2)}</td>
                                <td className="text-right">
                                    {totalValue > 0 ? ((cat.value / totalValue) * 100).toFixed(1) : 0}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>TOTAL</th>
                            <th className="text-right">{totalItems}</th>
                            <th className="text-right">${totalValue.toFixed(2)}</th>
                            <th className="text-right">100%</th>
                        </tr>
                    </tfoot>
                </table>

                <div className="report-footer">
                    <p>Fin del reporte</p>
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
        }

        .summary-section {
          display: flex;
          justify-content: space-around;
          margin-bottom: 3rem;
          background-color: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
        }

        .summary-box {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .summary-box .label {
          font-size: 0.9rem;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .summary-box .value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
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

        .report-table tfoot th {
          border-top: 2px solid #374151;
          font-size: 1rem;
        }

        .text-right { text-align: right !important; }

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

export default InventoryValueReport;
