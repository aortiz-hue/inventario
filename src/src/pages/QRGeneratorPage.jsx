import React, { useState, useRef } from 'react';
import { useInventory } from '../contexts/InventoryContext';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, Download, Search, QrCode } from 'lucide-react';
import html2canvas from 'html2canvas';

const QRGeneratorPage = () => {
  const { products } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const labelRef = useRef(null);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (labelRef.current) {
      try {
        const canvas = await html2canvas(labelRef.current, {
          backgroundColor: '#ffffff', // Force white background
          scale: 3 // Higher scale for better quality
        });

        const link = document.createElement('a');
        link.download = `QR_${selectedProduct.sku}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
        alert('Hubo un error al generar la imagen.');
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header no-print">
        <div>
          <h1 className="page-title">Generador de Etiquetas QR</h1>
          <p className="page-subtitle">Selecciona un producto para generar su etiqueta</p>
        </div>
      </div>

      <div className="qr-layout">
        {/* Product Selection Panel */}
        <div className="card selection-panel no-print">
          <div className="search-box">
            <Search size={20} className="text-muted" />
            <input
              type="text"
              placeholder="Buscar por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="product-list-compact">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className={`product-item-compact ${selectedProduct?.id === product.id ? 'active' : ''}`}
                onClick={() => setSelectedProduct(product)}
              >
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-sku">SKU: {product.sku}</span>
                </div>
                {selectedProduct?.id === product.id && <QrCode size={18} className="text-primary" />}
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="empty-state">No se encontraron productos</div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="preview-panel">
          {selectedProduct ? (
            <div className="preview-content">
              <div className="label-container" ref={labelRef}>
                <div className="qr-code-wrapper">
                  <QRCodeSVG
                    value={JSON.stringify({ id: selectedProduct.id, sku: selectedProduct.sku })}
                    size={100}
                    level="H"
                  />
                </div>
                <div className="label-details">
                  <h2 className="label-product-name">{selectedProduct.name}</h2>
                  <div className="label-meta">
                    <span className="label-sku">SKU: {selectedProduct.sku}</span>
                    <span className="label-category">{selectedProduct.category}</span>
                  </div>
                  <div className="label-price">${Number(selectedProduct.price).toFixed(2)}</div>
                </div>
              </div>

              <div className="action-buttons no-print">
                <button onClick={handlePrint} className="btn btn-outline">
                  <Printer size={20} />
                  Imprimir
                </button>
                <button onClick={handleDownload} className="btn btn-primary">
                  <Download size={20} />
                  Descargar PNG
                </button>
              </div>

              <p className="help-text no-print">
                * La etiqueta se ha optimizado para ser legible en cualquier fondo.
              </p>
            </div>
          ) : (
            <div className="empty-preview">
              <QrCode size={48} className="text-muted" />
              <p>Selecciona un producto para ver su etiqueta</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .qr-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: var(--spacing-lg);
          align-items: start;
        }

        .selection-panel {
          height: calc(100vh - 200px);
          display: flex;
          flex-direction: column;
          padding: 0;
          overflow: hidden;
        }

        .search-box {
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--color-border);
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .search-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 0.95rem;
          background: transparent;
          color: var(--color-text);
        }

        .product-list-compact {
          flex: 1;
          overflow-y: auto;
        }

        .product-item-compact {
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--color-border);
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background-color 0.2s;
        }

        .product-item-compact:hover {
          background-color: var(--color-background);
        }

        .product-item-compact.active {
          background-color: #e0e7ff; /* Light indigo */
          border-left: 4px solid var(--color-primary);
        }

        /* Dark mode adjustment for active item */
        @media (prefers-color-scheme: dark) {
          .product-item-compact.active {
            background-color: rgba(99, 102, 241, 0.2);
          }
        }

        .product-info {
          display: flex;
          flex-direction: column;
        }

        .product-name {
          font-weight: 500;
          color: var(--color-text);
        }

        .product-sku {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .preview-panel {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          background-color: var(--color-background); /* Use theme background for preview area */
          border-radius: var(--radius-lg);
          border: 2px dashed var(--color-border);
        }

        .preview-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-xl);
        }

        /* LABEL STYLES - FORCED HIGH CONTRAST */
        .label-container {
          display: flex;
          flex-direction: row; /* Horizontal Layout */
          align-items: center;
          background-color: white !important; /* Force white background */
          color: black !important; /* Force black text */
          padding: 1.5rem;
          border: 2px solid black;
          border-radius: 8px;
          gap: 1.5rem;
          width: 400px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .qr-code-wrapper {
          flex-shrink: 0;
        }

        .label-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          overflow: hidden;
        }

        .label-product-name {
          font-size: 1.25rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0;
          color: black !important;
        }

        .label-meta {
          display: flex;
          flex-direction: column;
          font-size: 0.85rem;
          color: #374151 !important; /* Dark gray for meta */
        }

        .label-sku {
          font-family: monospace;
          font-weight: 600;
        }

        .label-price {
          font-size: 1.5rem;
          font-weight: 800;
          color: black !important;
          margin-top: 0.25rem;
        }

        .action-buttons {
          display: flex;
          gap: var(--spacing-md);
        }

        .empty-preview {
          text-align: center;
          color: var(--color-text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-md);
        }

        .help-text {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        @media (max-width: 768px) {
          .qr-layout {
            grid-template-columns: 1fr;
          }
          
          .selection-panel {
            height: 300px;
          }
        }

        @media print {
          .no-print { display: none !important; }
          .page-container { padding: 0; }
          .qr-layout { display: block; }
          .preview-panel { border: none; background: white; }
          
          .label-container {
            border: 1px solid black;
            box-shadow: none;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
};

export default QRGeneratorPage;
