import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInventory } from '../contexts/InventoryContext';
import { useMovements } from '../contexts/MovementsContext';
import { Save, ArrowLeft } from 'lucide-react';

const MovementFormPage = () => {
    const { type } = useParams(); // 'IN' or 'OUT'
    const navigate = useNavigate();
    const { products } = useInventory();
    const { addMovement } = useMovements();

    const isEntry = type === 'IN';

    const [formData, setFormData] = useState({
        productId: '',
        quantity: '',
        reason: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        const product = products.find(p => p.id === formData.productId);
        if (!product) return;

        if (!isEntry && Number(formData.quantity) > product.stock) {
            alert(`Error: No hay suficiente stock. Stock actual: ${product.stock}`);
            return;
        }

        try {
            addMovement({
                productId: formData.productId,
                type: type,
                quantity: Number(formData.quantity),
                reason: formData.reason
            });
            navigate('/movements');
        } catch (error) {
            alert('Error al registrar movimiento: ' + error.message);
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <button onClick={() => navigate('/movements')} className="back-btn">
                    <ArrowLeft size={20} />
                    <span>Volver</span>
                </button>
                <h1 className="page-title">
                    {isEntry ? 'Registrar Entrada de Stock' : 'Registrar Salida de Stock'}
                </h1>
            </div>

            <div className="card form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Producto</label>
                            <select
                                name="productId"
                                value={formData.productId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar producto...</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.name} (SKU: {p.sku}) - Stock: {p.stock}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Cantidad a {isEntry ? 'Ingresar' : 'Retirar'}</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                min="1"
                                required
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Motivo / Nota (Opcional)</label>
                            <textarea
                                name="reason"
                                value={formData.reason}
                                onChange={handleChange}
                                rows="3"
                                placeholder={isEntry ? "Ej. Compra de proveedor, Devolución..." : "Ej. Venta, Merma, Uso interno..."}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/movements')} className="btn">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={`btn ${isEntry ? 'btn-success' : 'btn-danger'}`}
                        >
                            <Save size={18} style={{ marginRight: '8px' }} />
                            {isEntry ? 'Registrar Entrada' : 'Registrar Salida'}
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

        .back-btn:hover {
          color: var(--color-primary);
        }

        .form-card {
          max-width: 600px;
          margin: 0 auto;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-lg);
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .form-group label {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--color-text);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 10px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 1rem;
          background-color: var(--color-background);
          color: var(--color-text);
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
        }

        .form-actions {
          margin-top: var(--spacing-xl);
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-md);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--color-border);
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
      `}</style>
        </div>
    );
};

export default MovementFormPage;
