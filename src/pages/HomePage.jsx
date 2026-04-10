import { useEffect, useState } from 'react';
import { useStock } from '../hooks/useStock';
import api from '../lib/axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { stockData, loading, error } = useStock();
  const [pendingTotal, setPendingTotal] = useState(0);
  const [pageVencimiento, setPageVencimiento] = useState(1);
  const limitVencimiento = 15;

  useEffect(() => {
    const fetchPendingEgresos = async () => {
      try {
        const { data } = await api.get('/api/egresos?estado_remito=Pendiente&limit=1');
        setPendingTotal(data.total || 0);
      } catch (e) { }
    };
    fetchPendingEgresos();
  }, []);

  if (loading) return <div className="p-4 font-['var(--font-body)']">Cargando dashboard...</div>;
  if (error) return <div className="p-4 text-red-500 font-['var(--font-body)']">{error}</div>;

  const totalProductos = stockData.length;
  const totalUnidades = stockData.reduce((acc, item) => acc + item.stock, 0);
  const stockNegativos = stockData.filter(i => i.stock_negativo);

  const productosPorVencer = stockData.filter(i => i.vence_pronto);
  const paginatedVencimiento = productosPorVencer.slice((pageVencimiento - 1) * limitVencimiento, pageVencimiento * limitVencimiento);

  return (
    <div className="space-y-8 font-['var(--font-body)']">
      <h1 className="text-3xl font-bold font-['var(--font-heading)'] text-[var(--color-primary)]">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Cards */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-gray-500 mb-1">Stock Activo</p>
          <span className="text-4xl font-bold text-[var(--color-primary)] font-['var(--font-heading)']">{totalProductos}</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-gray-500 mb-1">Inventario Total</p>
          <span className="text-4xl font-bold text-[var(--color-primary)] font-['var(--font-heading)']">{totalUnidades}</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-gray-500 mb-1">Egresos Pendientes</p>
          <span className="text-4xl font-bold text-[var(--color-accent)] font-['var(--font-heading)']">{pendingTotal}</span>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-gray-500 mb-1">Stock Crítico</p>
          <span className="text-4xl font-bold text-[var(--color-action)] font-['var(--font-heading)']">{stockNegativos.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Alertas Vencimiento */}
        <div className="bg-white border text-amber-900 border-amber-200 rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold font-['var(--font-heading)'] mb-4 text-amber-700 flex items-center gap-2">
            ⚠️ Alertas de Vencimiento (60 días)
          </h2>
          {productosPorVencer.length === 0 ? (
            <p className="text-sm opacity-80">El inventario está sano. Ningún lote próximo a vencer.</p>
          ) : (
            <div className="space-y-4">
              <ul className="space-y-3">
                {paginatedVencimiento.map(p => (
                  <li key={p.id} className="flex justify-between items-center pb-2 border-b border-amber-100 last:border-0 last:pb-0">
                    <div className="font-medium text-sm">
                      {p.nombre} <span className="opacity-70 font-normal">({p.laboratorio})</span>
                    </div>
                    <Link to={`/productos/${p.id}`} className="text-xs font-semibold bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded transition-colors text-amber-800">
                      Ver Lotes
                    </Link>
                  </li>
                ))}
              </ul>

              {productosPorVencer.length > limitVencimiento && (
                <div className="flex justify-between items-center text-sm text-amber-800 mt-4 border-t border-amber-200 pt-3">
                  <div className="font-medium">Mostrando {paginatedVencimiento.length} de {productosPorVencer.length}</div>
                  <div className="flex gap-2">
                    <button disabled={pageVencimiento === 1} onClick={() => setPageVencimiento(p => p - 1)} className="px-3 py-1 border border-amber-300 rounded font-semibold disabled:opacity-50 bg-white hover:bg-amber-50 cursor-pointer">Anterior</button>
                    <button disabled={pageVencimiento * limitVencimiento >= productosPorVencer.length} onClick={() => setPageVencimiento(p => p + 1)} className="px-3 py-1 border border-amber-300 rounded font-semibold disabled:opacity-50 bg-white hover:bg-amber-50 cursor-pointer">Siguiente</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default HomePage;
