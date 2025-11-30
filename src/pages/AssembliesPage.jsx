import React, { useState } from 'react';
import { useAssemblies } from '../contexts/AssembliesContext';
import { useInventory } from '../contexts/InventoryContext';
import { Plus, Trash2, Play, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const AssembliesPage = () => {
    const { assemblies: recipes, deleteAssembly, produceAssembly } = useAssemblies();
    const { getProduct } = useInventory();

    const handleProduce = (recipe) => {
        const quantity = prompt(`¿Cuántas unidades de "${recipe.name}" deseas producir?`, "1");
        if (quantity && !isNaN(quantity) && Number(quantity) > 0) {
            try {
                produceAssembly(recipe.id, Number(quantity));
                alert('Producción realizada con éxito.');
            } catch (error) {
                alert('Error: ' + error.message);
            }
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Eliminar esta receta?')) {
            deleteAssembly(id);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Ensambles de Productos</h1>
                    <p className="page-subtitle">Define productos compuestos y gestiona producción</p>
                </div>
                <Link to="/assemblies/new" className="btn btn-primary">
                    <Plus size={20} style={{ marginRight: '8px' }} />
                    Nueva Receta
                </Link>
            </div>

            <div className="grid-container">
                {Array.isArray(recipes) && recipes.length > 0 ? (
                    recipes.map(recipe => {
                        const product = getProduct(recipe.productId);
                        return (
                            <div key={recipe.id} className="card recipe-card">
                                <div className="recipe-header">
                                    <h3 className="recipe-title">{recipe.name}</h3>
                                    <div className="recipe-actions">
                                        <button onClick={() => handleProduce(recipe)} className="icon-btn text-success" title="Producir">
                                            <Play size={20} />
                                        </button>
                                        <button onClick={() => handleDelete(recipe.id)} className="icon-btn text-danger" title="Eliminar">
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="recipe-target">
                                    <span className="label">Producto Final:</span>
                                    <span className="value">{product ? product.name : 'Desconocido'}</span>
                                </div>

                                <div className="recipe-components">
                                    <span className="label">Componentes:</span>
                                    <ul className="component-list">
                                        {recipe.components.map((comp, idx) => {
                                            const compProduct = getProduct(comp.productId);
                                            return (
                                                <li key={idx}>
                                                    {comp.quantity} x {compProduct ? compProduct.name : '???'}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="empty-state-card">
                        <Package size={48} className="empty-icon" />
                        <h3>No hay recetas definidas</h3>
                        <p>Crea una receta para definir qué componentes forman un producto final.</p>
                    </div>
                )
                }
            </div >

            <style>{`
        .grid-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-lg);
        }

        .recipe-card {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .recipe-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid var(--color-border);
        }

        .recipe-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .recipe-actions {
          display: flex;
          gap: var(--spacing-sm);
        }

        .label {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          font-weight: 500;
          display: block;
          margin-bottom: 4px;
        }

        .value {
          font-weight: 500;
          color: var(--color-primary);
        }

        .component-list {
          list-style: none;
          margin-top: 4px;
          font-size: 0.95rem;
        }

        .component-list li {
          padding: 2px 0;
          border-bottom: 1px dashed var(--color-border);
        }
        
        .component-list li:last-child {
          border-bottom: none;
        }

        .text-success { color: var(--color-success); }
        .text-danger { color: var(--color-danger); }

        .empty-state-card {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-xl);
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          border: 1px dashed var(--color-border);
          color: var(--color-text-muted);
          text-align: center;
        }

        .empty-icon {
          margin-bottom: var(--spacing-md);
          opacity: 0.5;
        }
      `}</style>
        </div >
    );
};

export default AssembliesPage;
