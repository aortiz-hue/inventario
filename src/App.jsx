import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { InventoryProvider } from './contexts/InventoryContext'
import { MovementsProvider } from './contexts/MovementsContext'
import { AssembliesProvider } from './contexts/AssembliesContext'
import MainLayout from './layouts/MainLayout'
import InventoryPage from './pages/InventoryPage'
import ProductFormPage from './pages/ProductFormPage'
import MovementsPage from './pages/MovementsPage'
import MovementFormPage from './pages/MovementFormPage'
import AssembliesPage from './pages/AssembliesPage'
import AssemblyFormPage from './pages/AssemblyFormPage'
import QRGeneratorPage from './pages/QRGeneratorPage'
import DashboardPage from './pages/DashboardPage'
import ReportsPage from './pages/ReportsPage'
import InventoryValueReport from './pages/reports/InventoryValueReport'
import LowStockReport from './pages/reports/LowStockReport'
import SettingsPage from './pages/SettingsPage'

import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <InventoryProvider>
        <MovementsProvider>
          <AssembliesProvider>
            <Router>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/inventory/new" element={<ProductFormPage />} />
                  <Route path="/inventory/edit/:id" element={<ProductFormPage />} />

                  <Route path="/movements" element={<MovementsPage />} />
                  <Route path="/movements/new/:type" element={<MovementFormPage />} />

                  <Route path="/assemblies" element={<AssembliesPage />} />
                  <Route path="/assemblies/new" element={<AssemblyFormPage />} />

                  <Route path="/qr-generator" element={<QRGeneratorPage />} />

                  <Route path="/reports" element={<ReportsPage />} />
                  <Route path="/reports/value" element={<InventoryValueReport />} />
                  <Route path="/reports/low-stock" element={<LowStockReport />} />

                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </MainLayout>
            </Router>
          </AssembliesProvider>
        </MovementsProvider>
      </InventoryProvider>
    </ErrorBoundary>
  )
}

export default App
