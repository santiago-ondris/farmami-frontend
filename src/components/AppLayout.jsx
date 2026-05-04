import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TermopharmaLogo from './TermopharmaLogo';

const NAV_SECTIONS = [
  {
    title: 'Operacion',
    items: [
      { to: '/dashboard', label: 'Inicio' },
      { to: '/productos', label: 'Stock' },
      { to: '/ingresos', label: 'Ingresos' },
      { to: '/egresos', label: 'Egresos' }
    ]
  },
  {
    title: 'Comercial',
    items: [
      { to: '/clientes', label: 'Clientes' },
      { to: '/proveedores', label: 'Proveedores' },
      { to: '/remitos', label: 'Remitos' },
      { to: '/ordenes-compra', label: 'Ordenes de compra' }
    ]
  },
  {
    title: 'Calidad',
    items: [
      { to: '/rechazos', label: 'Rechazos' }
    ]
  }
];

const AppLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] md:grid md:grid-cols-[280px_1fr] md:h-screen md:overflow-hidden">
      <aside className="flex w-full flex-col border-r border-white/10 bg-[var(--color-primary)] text-white shadow-xl md:h-screen md:overflow-y-auto scrollbar-hide">
        <div className="border-b border-white/15 px-6 py-6">
          <div className="mb-5 max-w-[170px]">
            <TermopharmaLogo className="w-full" compact />
          </div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-white/60">Panel interno</p>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold">Inventario Farmaceutico</h2>
          <p className="mt-2 text-sm text-white/80">
            Stock, trazabilidad y circuito documental en una sola vista.
          </p>
        </div>

        <nav className="flex-1 space-y-6 px-4 py-5 font-['var(--font-body)']">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-white text-[var(--color-primary)] shadow-lg'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          {user?.role === 'admin' && (
            <div>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/50">
                Administracion
              </p>
              <NavLink
                to="/admin/usuarios"
                className={({ isActive }) => `block rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-white text-[var(--color-primary)] shadow-lg'
                    : 'text-[var(--color-accent)] hover:bg-white/10'
                }`}
              >
                Usuarios
              </NavLink>
            </div>
          )}
        </nav>

        <div className="border-t border-white/15 px-4 py-4">
          <div className="mb-4 rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/50">Sesion activa</p>
            <p className="mt-1 truncate text-sm text-white/80">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full rounded-xl bg-[var(--color-action)] py-2.5 font-semibold text-white hover:opacity-90 cursor-pointer"
          >
            Cerrar sesion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 md:h-screen md:overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
