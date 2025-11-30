import React, { useState } from 'react';
import { useMovements } from '../contexts/MovementsContext';
import { useInventory } from '../contexts/InventoryContext';
import { ArrowUpRight, ArrowDownLeft, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const MovementsPage = () => {
    const { movements } = useMovements();
    const { products } = useInventory();
    const [filterType, setFilterType] = useState('ALL'); // ALL, IN, OUT

    const getProductName = (id) => {
        const product = products.find(p => p.id === id);
        return product ? product.name : 'Producto Eliminado';
    };

    const filteredMovements = movements.filter(m => {
        if (filterType === 'ALL') return true;
        return m.type === filterType;
    });

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Movimientos de Inventario</h1>
                    <p className="page-subtitle">Historial de entradas y salidas</p>
                </div>
                <div className="header-actions">
                    <Link to="/movements/new/IN" className="btn btn-success">
                        <ArrowDownLeft size={20} style={{ marginRight: '8px' }} />
                        Registrar Entrada
                    </Link>
                    <Link to="/movements/new/OUT" className="btn btn-danger">
                        <ArrowUpRight size={20} style={{ marginRight: '8px' }} />
                        Registrar Salida
                    </Link>
                </div>
            </div>

            <div className="filters-bar">
                <button
                    className={`filter-btn ${filterType === 'ALL' ? 'active' : ''}`}
                    onClick={() => setFilterType('ALL')}
                >
                    Todos
                </button>
                <button
                    className={`filter-btn ${filterType === 'IN' ? 'active' : ''}`}
                    onClick={() => setFilterType('IN')}
                >
                    Entradas
                </button>
                <button
                    className={`filter-btn ${filterType === 'OUT' ? 'active' : ''}`}
                    onClick={() => setFilterType('OUT')}
                >
                    Salidas
                </button>
            </div>

            <div className="card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Tipo</th>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Motivo/Nota</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMovements.length > 0 ? (
                            filteredMovements.map((movement) => (
                                <tr key={movement.id}>
                                    <td>{new Date(movement.date).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${movement.type === 'IN' ? 'badge-success' : 'badge-danger'}`}>
                                            {movement.type === 'IN' ? 'Entrada' : 'Salida'}
                                        </span>
                                    </td>
                                    <td className="product-name">{getProductName(movement.productId)}</td>
                                    <td className="font-mono">{movement.quantity}</td>
                                    <td className="text-muted">{movement.reason || '-'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="empty-state">
                                    No hay movimientos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
        .header-actions {
          display: flex;
          gap: var(--spacing-md);
        }

        .btn-success {
          background-color: var(--color-success);
          color: white;
        }
        .btn-success:hover {
          background-color: #059669;
        }

        .btn-danger {
          background-color: var(--color-danger);
          color: white;
        }
        .btn-danger:hover {
          background-color: #dc2626;
        }

        .filters-bar {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
        }

        .filter-btn {
          padding: 6px 16px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          color: var(--color-text-muted);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .filter-btn.active {
          background-color: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }

        .badge-success {
          background-color: #d1fae5;
          color: #065f46;
          border-color: #34d399;
        }

        .badge-danger {
          background-color: #fee2e2;
          color: #991b1b;
          border-color: #f87171;
        }

        .font-mono {
          font-family: monospace;
          font-size: 1rem;
        }

        .text-muted {
          color: var(--color-text-muted);
        }
        
        @media (max-width: 640px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-md);
          }
          
          .header-actions {
            width: 100%;
          }
          
          .header-actions .btn {
            flex: 1;
          }
        }
      `}</style>
        </div>
    );
};

export default MovementsPage;
