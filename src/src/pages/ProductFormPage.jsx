import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInventory } from '../contexts/InventoryContext';
import { Save, ArrowLeft, Scan, X } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const ProductFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addProduct, getProduct, updateProduct, categories } = useInventory();

    const isEditMode = !!id;
    const [showScanner, setShowScanner] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        category: '',
        description: '',
        price: '',
        cost: '',
        stock: '',
        minStock: ''
    });

    useEffect(() => {
        if (isEditMode) {
            const product = getProduct(id);
            if (product) {
                setFormData(product);
            } else {
                navigate('/inventory');
            }
        }
    }, [id, getProduct, navigate, isEditMode]);

    // Scanner Effect
    useEffect(() => {
        let scanner = null;

        if (showScanner) {
            scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
            );

            scanner.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scanner) {
                scanner.clear().catch(error => {
                    console.error("Failed to clear html5-qrcode scanner. ", error);
                });
            }
        };
    }, [showScanner]);

    const onScanSuccess = (decodedText, decodedResult) => {
        setFormData(prev => ({ ...prev, sku: decodedText }));
        setShowScanner(false);
    };

    const onScanFailure = (error) => {
        // handle scan failure, usually better to ignore and keep scanning.
        // console.warn(`Code scan error = ${error}`);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            price: Number(formData.price),
            cost: Number(formData.cost),
            stock: Number(formData.stock),
            minStock: Number(formData.minStock)
        };

        if (isEditMode) {
            updateProduct(id, dataToSave);
        } else {
            addProduct(dataToSave);
        }
        navigate('/inventory');
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <button onClick={() => navigate('/inventory')} className="back-btn">
                    <ArrowLeft size={20} />
                    <span>Volver</span>
                </button>
                <h1 className="page-title">{isEditMode ? 'Editar Producto' : 'Nuevo Producto'}</h1>
            </div>

            <div className="card form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nombre del Producto</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="Ej. Tornillo de 2 pulgadas"
                            />
                        </div>

                        <div className="form-group">
                            <label>SKU / Código</label>
                            <div className="input-with-action">
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ej. TOR-001"
                                />
                                <button
                                    type="button"
                                    className="btn btn-outline icon-only"
                                    onClick={() => setShowScanner(true)}
                                    title="Escanear Código"
                                >
                                    <Scan size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Categoría</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar...</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label>Descripción</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                            />
                        </div>

                        <div className="form-group">
                            <label>Costo ($)</label>
                            <input
                                type="number"
                                name="cost"
                                value={formData.cost}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Precio de Venta ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Inicial</label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Stock Mínimo (Alerta)</label>
                            <input
                                type="number"
                                name="minStock"
                                value={formData.minStock}
                                onChange={handleChange}
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={() => navigate('/inventory')} className="btn">
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} style={{ marginRight: '8px' }} />
                            Guardar Producto
                        </button>
                    </div>
                </form>
            </div>

            {/* Scanner Modal */}
            {showScanner && (
                <div className="modal-overlay">
                    <div className="modal-content scanner-modal">
                        <div className="modal-header">
                            <h3>Escanear Código</h3>
                            <button onClick={() => setShowScanner(false)} className="close-btn">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div id="reader" width="100%"></div>
                            <p className="text-center text-muted mt-2">
                                Apunta la cámara al código de barras o QR
                            </p>
                        </div>
                    </div>
                </div>
            )}

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
          max-width: 800px;
          margin: 0 auto;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
        }

        .full-width {
          grid-column: span 2;
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

        .input-with-action {
            display: flex;
            gap: 8px;
        }
        
        .input-with-action input {
            flex: 1;
        }

        .icon-only {
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .form-actions {
          margin-top: var(--spacing-xl);
          display: flex;
          justify-content: flex-end;
          gap: var(--spacing-md);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--color-border);
        }

        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }

        .modal-content {
            background-color: var(--color-surface);
            border-radius: var(--radius-lg);
            width: 90%;
            max-width: 500px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .modal-header {
            padding: var(--spacing-lg);
            border-bottom: 1px solid var(--color-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-header h3 {
            margin: 0;
            font-size: 1.25rem;
            color: var(--color-text);
        }

        .modal-body {
            padding: var(--spacing-lg);
        }
        
        .close-btn {
            background: none;
            border: none;
            color: var(--color-text-muted);
            cursor: pointer;
        }

        .mt-2 { margin-top: 0.5rem; }
        .text-center { text-align: center; }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .full-width {
            grid-column: span 1;
          }
        }
      `}</style>
        </div>
    );
};

export default ProductFormPage;
