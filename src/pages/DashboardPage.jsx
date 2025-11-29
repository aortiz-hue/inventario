import React from 'react';
import { useInventory } from '../contexts/InventoryContext';
import { useMovements } from '../contexts/MovementsContext';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { AlertTriangle, DollarSign, Package, TrendingUp } from 'lucide-react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const DashboardPage = () => {
    const { products, categories } = useInventory();
    const { movements } = useMovements();

    // Metrics
    const totalProducts = products.length;
    const totalStock = products.reduce((acc, p) => acc + Number(p.stock), 0);
    const totalValue = products.reduce((acc, p) => acc + (Number(p.stock) * Number(p.price)), 0);
    const lowStockProducts = products.filter(p => p.minStock && p.stock <= p.minStock);

    // Chart Data: Stock by Category
    const stockByCategory = categories.map(cat => {
        const catProducts = products.filter(p => p.category === cat);
        return catProducts.reduce((acc, p) => acc + Number(p.stock), 0);
    });

    const barData = {
        labels: categories,
        datasets: [
            {
                label: 'Stock por Categoría',
                data: stockByCategory,
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 1,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Distribución de Inventario' },
        },
    };

    // Recent Movements
    const recentMovements = movements.slice(0, 5);

    return (
        <div className="page-container">
            <h1 className="page-title">Dashboard</h1>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="card stat-card">
                    <div className="stat-icon bg-primary-light">
                        <Package className="text-primary" size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Productos</span>
                        <span className="stat-value">{totalProducts}</span>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon bg-success-light">
                        <DollarSign className="text-success" size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Valor Inventario</span>
                        <span className="stat-value">${totalValue.toFixed(2)}</span>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon bg-warning-light">
                        <TrendingUp className="text-warning" size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Total Unidades</span>
                        <span className="stat-value">{totalStock}</span>
                    </div>
                </div>

                <div className="card stat-card">
                    <div className="stat-icon bg-danger-light">
                        <AlertTriangle className="text-danger" size={24} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-label">Stock Bajo</span>
                        <span className="stat-value">{lowStockProducts.length}</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                {/* Chart Section */}
                <div className="card chart-section">
                    <Bar options={barOptions} data={barData} />
                </div>

                {/* Alerts & Recent Activity */}
                <div className="side-section">
                    {/* Low Stock Alerts */}
                    {lowStockProducts.length > 0 && (
                        <div className="card alerts-card">
                            <h3>Alertas de Stock</h3>
                            <div className="alerts-list">
                                {lowStockProducts.map(p => (
                                    <div key={p.id} className="alert-item">
                                        <AlertTriangle size={16} className="text-danger" />
                                        <div className="alert-details">
                                            <span className="alert-name">{p.name}</span>
                                            <span className="alert-stock">Stock: {p.stock} (Min: {p.minStock})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Movements */}
                    <div className="card recent-card">
                        <h3>Movimientos Recientes</h3>
                        <div className="recent-list">
                            {recentMovements.length > 0 ? (
                                recentMovements.map(m => (
                                    <div key={m.id} className="recent-item">
                                        <span className={`indicator ${m.type === 'IN' ? 'bg-success' : 'bg-danger'}`}></span>
                                        <div className="recent-details">
                                            <span className="recent-type">{m.type === 'IN' ? 'Entrada' : 'Salida'}</span>
                                            <span className="recent-date">{new Date(m.date).toLocaleDateString()}</span>
                                        </div>
                                        <span className="recent-qty">{m.quantity} u.</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-muted">No hay movimientos recientes.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-xl);
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          padding: var(--spacing-lg);
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          color: var(--color-text-muted);
          font-size: 0.9rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text);
        }

        .bg-primary-light { background-color: #e0e7ff; }
        .text-primary { color: var(--color-primary); }
        
        .bg-success-light { background-color: #d1fae5; }
        .text-success { color: var(--color-success); }

        .bg-warning-light { background-color: #fef3c7; }
        .text-warning { color: var(--color-warning); }

        .bg-danger-light { background-color: #fee2e2; }
        .text-danger { color: var(--color-danger); }

        .dashboard-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-lg);
        }

        .side-section {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .alerts-list, .recent-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-md);
        }

        .alert-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-sm);
          background-color: #fef2f2;
          border-radius: var(--radius-md);
          border: 1px solid #fee2e2;
        }

        .alert-details {
          display: flex;
          flex-direction: column;
        }

        .alert-name { font-weight: 500; font-size: 0.9rem; }
        .alert-stock { font-size: 0.8rem; color: var(--color-danger); }

        .recent-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-sm) 0;
          border-bottom: 1px solid var(--color-border);
        }

        .indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .bg-success { background-color: var(--color-success); }
        .bg-danger { background-color: var(--color-danger); }

        .recent-details {
          flex: 1;
          margin-left: var(--spacing-md);
          display: flex;
          flex-direction: column;
        }

        .recent-type { font-weight: 500; font-size: 0.9rem; }
        .recent-date { font-size: 0.8rem; color: var(--color-text-muted); }
        .recent-qty { font-weight: 600; }

        @media (max-width: 1024px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default DashboardPage;
