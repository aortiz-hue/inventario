import React, { useState } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const InventoryPage = () => {
    const { products, deleteProduct } = useInventory();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    });

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            deleteProduct(id);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Inventario</h1>
                    <p className="page-subtitle">Gestiona tus productos y existencias</p>
                </div>
                <Link to="/inventory/new" className="btn btn-primary">
                    <Plus size={20} style={{ marginRight: '8px' }} />
                    Nuevo Producto
                </Link>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-wrapper">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o SKU..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Add Category Filter Select here later */}
            </div>

            {/* Table */}
            <div className="card table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>SKU</th>
                            <th>Categoría</th>
                            <th>Stock</th>
                            <th>Precio</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr key={product.id}>
                                    <td>
                                        <div className="product-name">{product.name}</div>
                                        {product.minStock && product.stock <= product.minStock && (
                                            <span className="badge badge-warning">Stock Bajo</span>
                                        )}
                                    </td>
                                    <td>{product.sku}</td>
                                    <td><span className="badge">{product.category}</span></td>
                                    <td className={product.stock <= 0 ? 'text-danger' : ''}>
                                        {product.stock}
                                    </td>
                                    <td>${Number(product.price).toFixed(2)}</td>
                                    <td>
                                        <div className="actions-cell">
                                            <Link to={`/inventory/edit/${product.id}`} className="icon-btn">
                                                <Edit size={18} />
                                            </Link>
                                            <button onClick={() => handleDelete(product.id)} className="icon-btn text-danger">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="empty-state">
                                    No se encontraron productos. ¡Agrega uno nuevo!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
        }

        .page-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: var(--color-text);
        }

        .page-subtitle {
          color: var(--color-text-muted);
        }

        .filters-bar {
          margin-bottom: var(--spacing-lg);
          display: flex;
          gap: var(--spacing-md);
        }

        .search-wrapper {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }

        .search-input {
          width: 100%;
          padding: 10px 10px 10px 40px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .search-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }

        .table-container {
          padding: 0;
          overflow-x: auto;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .data-table th {
          padding: var(--spacing-md);
          background-color: var(--color-background);
          font-weight: 600;
          color: var(--color-text-muted);
          border-bottom: 1px solid var(--color-border);
        }

        .data-table td {
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text);
        }

        .product-name {
          font-weight: 500;
        }

        .badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: var(--radius-full);
          background-color: var(--color-background);
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid var(--color-border);
        }

        .badge-warning {
          background-color: #fffbeb;
          color: #b45309;
          border-color: #fcd34d;
          margin-left: 8px;
        }

        .text-danger {
          color: var(--color-danger);
        }

        .actions-cell {
          display: flex;
          gap: var(--spacing-sm);
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-muted);
          padding: 4px;
          border-radius: var(--radius-sm);
          transition: background-color 0.2s;
        }

        .icon-btn:hover {
          background-color: var(--color-background);
          color: var(--color-text);
        }

        .icon-btn.text-danger:hover {
          background-color: #fef2f2;
          color: var(--color-danger);
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-xl);
          color: var(--color-text-muted);
        }
      `}</style>
        </div>
    );
};

export default InventoryPage;
