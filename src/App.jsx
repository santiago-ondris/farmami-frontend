import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './components/AppLayout.jsx';
import LoginPage from './pages/usuarios/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import IngresosPage from './pages/stock/IngresosPage.jsx';
import NuevoIngresoPage from './pages/stock/NuevoIngresoPage.jsx';
import DetalleIngresoPage from './pages/stock/DetalleIngresoPage.jsx';
import EgresosPage from './pages/stock/EgresosPage.jsx';
import NuevoEgresoPage from './pages/stock/NuevoEgresoPage.jsx';
import DetalleEgresoPage from './pages/stock/DetalleEgresoPage.jsx';
import ProductosPage from './pages/stock/ProductosPage.jsx';
import DetalleProductoPage from './pages/stock/DetalleProductoPage.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import UsuariosPage from './pages/usuarios/UsuariosPage.jsx';
import ClientesPage from './pages/clientes/ClientesPage.jsx';
import ClienteFormPage from './pages/clientes/ClienteFormPage.jsx';
import ClienteDetallePage from './pages/clientes/ClienteDetallePage.jsx';
import ClienteEvaluacionFormPage from './pages/clientes/ClienteEvaluacionFormPage.jsx';
import ProveedoresPage from './pages/proveedores/ProveedoresPage.jsx';
import ProveedorFormPage from './pages/proveedores/ProveedorFormPage.jsx';
import ProveedorDetallePage from './pages/proveedores/ProveedorDetallePage.jsx';
import ProveedorEvaluacionFormPage from './pages/proveedores/ProveedorEvaluacionFormPage.jsx';
import RechazosPage from './pages/rechazos/RechazosPage.jsx';
import RechazoFormPage from './pages/rechazos/RechazoFormPage.jsx';
import RechazoDetallePage from './pages/rechazos/RechazoDetallePage.jsx';
import RemitosPage from './pages/remitos/RemitosPage.jsx';
import RemitoFormPage from './pages/remitos/RemitoFormPage.jsx';
import RemitoDetallePage from './pages/remitos/RemitoDetallePage.jsx';
import OrdenesCompraPage from './pages/ordenes-compra/OrdenesCompraPage.jsx';
import OrdenCompraFormPage from './pages/ordenes-compra/OrdenCompraFormPage.jsx';
import OrdenCompraDetallePage from './pages/ordenes-compra/OrdenCompraDetallePage.jsx';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/ingresos" element={<IngresosPage />} />
            <Route path="/ingresos/nuevo" element={<NuevoIngresoPage />} />
            <Route path="/ingresos/:id" element={<DetalleIngresoPage />} />
            <Route path="/egresos" element={<EgresosPage />} />
            <Route path="/egresos/nuevo" element={<NuevoEgresoPage />} />
            <Route path="/egresos/:id" element={<DetalleEgresoPage />} />
            <Route path="/productos" element={<ProductosPage />} />
            <Route path="/productos/:id" element={<DetalleProductoPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/clientes/nuevo" element={<ClienteFormPage />} />
            <Route path="/clientes/:id" element={<ClienteDetallePage />} />
            <Route path="/clientes/:id/editar" element={<ClienteFormPage />} />
            <Route path="/clientes/:id/evaluaciones/nueva" element={<ClienteEvaluacionFormPage />} />
            <Route path="/clientes/:id/evaluaciones/:evaluacionId/editar" element={<ClienteEvaluacionFormPage />} />
            <Route path="/proveedores" element={<ProveedoresPage />} />
            <Route path="/proveedores/nuevo" element={<ProveedorFormPage />} />
            <Route path="/proveedores/:id" element={<ProveedorDetallePage />} />
            <Route path="/proveedores/:id/editar" element={<ProveedorFormPage />} />
            <Route path="/proveedores/:id/evaluaciones/nueva" element={<ProveedorEvaluacionFormPage />} />
            <Route path="/proveedores/:id/evaluaciones/:evaluacionId/editar" element={<ProveedorEvaluacionFormPage />} />
            <Route path="/rechazos" element={<RechazosPage />} />
            <Route path="/rechazos/nuevo" element={<RechazoFormPage />} />
            <Route path="/rechazos/:id" element={<RechazoDetallePage />} />
            <Route path="/rechazos/:id/editar" element={<RechazoFormPage />} />
            <Route path="/remitos" element={<RemitosPage />} />
            <Route path="/remitos/nuevo" element={<RemitoFormPage />} />
            <Route path="/remitos/:id" element={<RemitoDetallePage />} />
            <Route path="/ordenes-compra" element={<OrdenesCompraPage />} />
            <Route path="/ordenes-compra/nuevo" element={<OrdenCompraFormPage />} />
            <Route path="/ordenes-compra/:id" element={<OrdenCompraDetallePage />} />
            <Route path="/ordenes-compra/:id/editar" element={<OrdenCompraFormPage />} />
            <Route path="/admin/usuarios" element={
              <AdminRoute><UsuariosPage /></AdminRoute>
            } />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
