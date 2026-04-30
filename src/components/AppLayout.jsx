import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-[var(--color-primary)] text-white flex flex-col">
        <div className="p-6 border-b border-white/20">
          <h2 className="text-xl font-bold font-['var(--font-heading)']">Inventario Farmacéutico</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 font-['var(--font-body)']">
          <Link to="/dashboard" className="block py-2 px-4 rounded hover:bg-white/10">Inicio</Link>
          <Link to="/ingresos" className="block py-2 px-4 rounded hover:bg-white/10">Ingresos</Link>
          <Link to="/egresos" className="block py-2 px-4 rounded hover:bg-white/10">Egresos</Link>
          <Link to="/productos" className="block py-2 px-4 rounded hover:bg-white/10">Stock</Link>
          <Link to="/clientes" className="block py-2 px-4 rounded hover:bg-white/10">Clientes</Link>
          <Link to="/proveedores" className="block py-2 px-4 rounded hover:bg-white/10">Proveedores</Link>
          <Link to="/rechazos" className="block py-2 px-4 rounded hover:bg-white/10">Rechazos</Link>
          <Link to="/remitos" className="block py-2 px-4 rounded hover:bg-white/10">Remitos</Link>
          <Link to="/ordenes-compra" className="block py-2 px-4 rounded hover:bg-white/10">Ordenes de compra</Link>
          {user?.role === 'admin' && (
            <Link to="/admin/usuarios" className="block py-2 px-4 rounded hover:bg-white/10 text-[var(--color-accent)] font-semibold">Usuarios</Link>
          )}
        </nav>
        <div className="p-4 border-t border-white/20">
          <p className="text-sm opacity-80 truncate mb-4">{user?.email}</p>
          <button onClick={logout} className="w-full bg-[var(--color-action)] text-white py-2 rounded font-semibold hover:opacity-90 cursor-pointer">
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
