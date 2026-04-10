import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AppLayout from './components/AppLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/HomePage.jsx';
import IngresosPage from './pages/IngresosPage.jsx';
import NuevoIngresoPage from './pages/NuevoIngresoPage.jsx';
import DetalleIngresoPage from './pages/DetalleIngresoPage.jsx';
import EgresosPage from './pages/EgresosPage.jsx';
import NuevoEgresoPage from './pages/NuevoEgresoPage.jsx';
import DetalleEgresoPage from './pages/DetalleEgresoPage.jsx';
import ProductosPage from './pages/ProductosPage.jsx';
import DetalleProductoPage from './pages/DetalleProductoPage.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import UsuariosPage from './pages/UsuariosPage.jsx';

function App() {
  return (
    <AuthProvider>
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
