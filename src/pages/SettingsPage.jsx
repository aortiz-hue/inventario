import React, { useState } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import { Plus, Trash2, Settings } from 'lucide-react';

const SettingsPage = () => {
    const { categories, addCategory, deleteCategory } = useInventory();
    const [newCategory, setNewCategory] = useState('');
    const [error, setError] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        if (categories.includes(newCategory.trim())) {
            setError('Esta categoría ya existe.');
            return;
        }

        addCategory(newCategory.trim());
        setNewCategory('');
        setError('');
    };

    const handleDelete = (category) => {
        if (window.confirm(`¿Estás seguro de eliminar la categoría "${category}"?`)) {
            try {
                deleteCategory(category);
                setError('');
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Configuración</h1>
                    <p className="page-subtitle">Gestiona las opciones del sistema</p>
                </div>
            </div>

            <div className="settings-grid">
                <div className="card settings-card">
                    <div className="card-header">
                        <Settings size={20} className="text-primary" />
                        <h2>Categorías de Productos</h2>
                    </div>

                    <div className="card-body">
                        <p className="text-muted mb-4">Define las categorías disponibles para clasificar tus productos.</p>

                        {/* Add Form */}
                        <form onSubmit={handleAdd} className="add-category-form">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Nueva categoría..."
                                className="form-input"
                            />
                            <button type="submit" className="btn btn-primary" disabled={!newCategory.trim()}>
                                <Plus size={18} />
                                Agregar
                            </button>
                        </form>

                        {error && <div className="alert alert-danger">{error}</div>}

                        {/* Category List */}
                        <div className="category-list">
                            {categories.map(cat => (
                                <div key={cat} className="category-item">
                                    <span>{cat}</span>
                                    <button
                                        onClick={() => handleDelete(cat)}
                                        className="icon-btn text-danger"
                                        title="Eliminar categoría"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: var(--spacing-lg);
        }

        .settings-card {
          padding: 0;
          overflow: hidden;
        }

        .card-header {
          padding: var(--spacing-lg);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          background-color: var(--color-background);
        }

        .card-header h2 {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
        }

        .card-body {
          padding: var(--spacing-lg);
          background-color: var(--color-surface);
        }

        .mb-4 { margin-bottom: var(--spacing-md); }

        .add-category-form {
          display: flex;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-lg);
        }

        .form-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.95rem;
          background-color: var(--color-surface);
          color: var(--color-text);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }

        .alert {
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--spacing-md);
          font-size: 0.9rem;
        }

        .alert-danger {
          background-color: rgba(239, 68, 68, 0.1);
          color: var(--color-danger);
          border: 1px solid var(--color-danger);
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background-color: var(--color-border);
          border-radius: var(--radius-md);
          overflow: hidden;
          border: 1px solid var(--color-border);
        }

        .category-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-sm) var(--spacing-md);
          background-color: var(--color-surface);
        }

        .category-item:hover {
          background-color: var(--color-background);
        }

        .text-primary { color: var(--color-primary); }
      `}</style>
        </div>
    );
};

export default SettingsPage;
