import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, History, Layers, QrCode, Menu, X, FileText, Settings } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Package, label: 'Inventario', path: '/inventory' },
    { icon: History, label: 'Movimientos', path: '/movements' },
    { icon: Layers, label: 'Ensambles', path: '/assemblies' },
    { icon: QrCode, label: 'Etiquetas QR', path: '/qr-generator' },
    { icon: FileText, label: 'Reportes', path: '/reports' },
    { icon: Settings, label: 'Configuración', path: '/settings' },
  ];

  return (
    <div className="layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <button className="menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <span className="logo">Sistema de Inventarios</span>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="logo">Sistema de Inventarios</span>
          <button className="close-btn" onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--color-background);
        }

        .mobile-header {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 60px;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-border);
          align-items: center;
          padding: 0 var(--spacing-md);
          z-index: 40;
        }

        .sidebar {
          width: 260px;
          background: var(--color-surface);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          z-index: 50;
          transition: transform 0.3s ease;
        }

        .sidebar-header {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--spacing-lg);
          border-bottom: 1px solid var(--color-border);
        }

        .logo {
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--color-primary);
        }

        .sidebar-nav {
          padding: var(--spacing-md);
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          font-weight: 500;
          transition: all 0.2s;
        }

        .nav-item:hover {
          background-color: var(--color-background);
          color: var(--color-text);
        }

        .nav-item.active {
          background-color: var(--color-primary);
          color: white;
        }

        .main-content {
          flex: 1;
          margin-left: 260px;
          padding: var(--spacing-xl);
          width: 100%;
        }

        .menu-btn, .close-btn {
          background: none;
          border: none;
          color: var(--color-text);
          cursor: pointer;
        }

        .close-btn {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-header {
            display: flex;
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .close-btn {
            display: block;
          }

          .main-content {
            margin-left: 0;
            padding-top: 80px; /* Header + spacing */
            padding-left: var(--spacing-md);
            padding-right: var(--spacing-md);
          }

          .sidebar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 45;
          }
        }
      `}</style>
    </div>
  );
};

export default MainLayout;
