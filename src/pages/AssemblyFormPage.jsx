import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../contexts/InventoryContext';
import { useAssemblies } from '../contexts/AssembliesContext';
import { Save, ArrowLeft, Plus, Trash2 } from 'lucide-react';

const AssemblyFormPage = () => {
    const navigate = useNavigate();
    const { products } = useInventory();
    const { addRecipe } = useAssemblies();

    const [name, setName] = useState('');
    const [targetProductId, setTargetProductId] = useState('');
    const [components, setComponents] = useState([{ productId: '', quantity: 1 }]);

    const handleAddComponent = () => {
        setComponents([...components, { productId: '', quantity: 1 }]);
    };

    const handleRemoveComponent = (index) => {
        const newComponents = [...components];
        newComponents.splice(index, 1);
        setComponents(newComponents);
    };

    const handleComponentChange = (index, field, value) => {
        const newComponents = [...components];
        newComponents[index][field] = value;
        setComponents(newComponents);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!targetProductId) {
            alert('Debes seleccionar un producto final.');
            return;
        }
        if (components.some(c => !c.productId || c.quantity <= 0)) {
            alert('Todos los componentes deben tener un producto y cantidad válida.');
            return;
        }

        try {
            addRecipe({
                name,
                productId: targetProductId,
                components: components.map(c => ({
                    productId: c.productId,
                    quantity: Number(c.quantity)
                }))
            });
            navigate('/assemblies');
        } catch (error) {
            alert('Error al guardar receta: ' + error.message);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <button onClick={() => navigate('/assemblies')} className="back-btn">
                    <ArrowLeft size={20} />
                    <span>Volver</span>
                </button>
                <h1 className="page-title">Nueva Receta de Ensamble</h1>
            </div>

            <div className="card form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nombre de la Receta</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Ej. Ensamble de Mesa Básica"
                        />
                    </div>

                    <div className="form-group">
                        <label>Producto Final (Resultado)</label>
                        <select
                            value={targetProductId}
                            onChange={(e) => setTargetProductId(e.target.value)}
                            required
                        >
                            <option value="">Seleccionar producto a producir...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
                            ))}
                        </select>
                    </div>

                    <div className="components-section">
                        <div className="section-header">
                            <h3>Componentes Requeridos</h3>
                            <button type="button" onClick={handleAddComponent} className="btn btn-sm">
                                <Plus size={16} /> Agregar Componente
                            </button>
                        </div>

                        {components.map((comp, index) => (
                            <div key={index} className="component-row">
                                <div className="form-group flex-grow">
                                    <select
                                        value={comp.productId}
                                        onChange={(e) => handleComponentChange(index, 'productId', e.target.value)}
                                        required
                                    >
                                        <option value="">Seleccionar componente...</option>
                                        {products.filter(p => p.id !== targetProductId).map(p => (
                                            <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group w-24">
                                    <input
                                        type="number"
                                        value={comp.quantity}
                                        onChange={(e) => handleComponentChange(index, 'quantity', e.target.value)}
                                        min="0.01"
                                        step="0.01"
                                        required
                                        placeholder="Cant."
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveComponent(index)}
                                    className="icon-btn text-danger"
                                    disabled={components.length === 1}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/assemblies')} className="btn">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} style={{ marginRight: '8px' }} />
                            Guardar Receta
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--color-text-muted);
          margin-bottom: var(--spacing-sm);
          padding: 0;
        }

        .form-card {
          max-width: 700px;
          margin: 0 auto;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-md);
        }

        .form-group label {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--color-text);
        }

        .form-group input,
        .form-group select {
          padding: 10px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 1rem;
          background-color: var(--color-background);
          color: var(--color-text);
        }

        .components-section {
          margin-top: var(--spacing-lg);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--color-border);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-md);
        }

        .section-header h3 {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .component-row {
          display: flex;
          gap: var(--spacing-sm);
          align-items: flex-start;
          margin-bottom: var(--spacing-sm);
        }

        .flex-grow {
          flex: 1;
        }

        .w-24 {
          width: 100px;
        }

        .btn-sm {
          padding: 4px 12px;
          font-size: 0.85rem;
          background-color: var(--color-background);
          border: 1px solid var(--color-border);
        }

        .form-actions {
          margin-top: var(--spacing-xl);
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-md);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--color-border);
        }
      `}</style>
        </div>
    );
};

export default AssemblyFormPage;
