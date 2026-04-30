import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../lib/axios';
import { formatDateDisplay } from '../../lib/date';

const DetalleProductoPage = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('desc');
  const limit = 50;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/api/products/${id}?page=${page}&limit=${limit}&order=${order}`);
        setProducto(data);
      } catch (e) {}
      setLoading(false);
    };
    fetchProduct();
  }, [id, page, order]);

  if (loading) return <div>Cargando...</div>;
  if (!producto) return <div className="text-red-500">Producto no encontrado</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Trazabilidad de stock</p>
          <h1 className="section-title">Historial de producto</h1>
          <p className="section-subtitle mt-2">{producto.nombre} · {producto.laboratorio}</p>
        </div>
        <Link to="/productos" className="ghost-link">Volver al catalogo</Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <section className="panel relative overflow-hidden p-6 sm:col-span-2">
          {producto.deleted_at && (
            <div className="absolute right-0 top-0 rounded-bl-2xl bg-red-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
              Producto archivado
            </div>
          )}
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Ficha base</p>
          <h2 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">{producto.nombre}</h2>
          <p className="mt-2 text-sm text-gray-500">Laboratorio: {producto.laboratorio}</p>
        </section>
        <section className="panel bg-[var(--color-primary)] p-6 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70">Stock total</p>
          <div className="mt-4 font-['var(--font-heading)'] text-6xl font-bold">{producto.stock}</div>
          <p className="mt-3 text-sm text-white/80">Calculado a partir del historial consolidado.</p>
        </section>
      </div>

      <section className="panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-gray-100 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Movimiento</p>
            <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Linea de tiempo operativa</h2>
          </div>
          <select
            className="field-input max-w-[220px] cursor-pointer !py-2 text-sm"
            value={order}
            onChange={(e) => { setOrder(e.target.value); setPage(1); }}
          >
            <option value="desc">Mas nuevos primero</option>
            <option value="asc">Mas antiguos primero</option>
          </select>
        </div>
        <div>
          {producto.history && producto.history.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No hay movimientos registrados para este producto.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {producto.history.map((mov, idx) => (
                <div key={idx} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${mov.tipo === 'INGRESO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-[var(--color-action)]'}`}>
                      {mov.tipo === 'INGRESO' ? 'IN' : 'EG'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{mov.tipo === 'INGRESO' ? 'Ingreso de mercaderia' : 'Egreso de mercaderia'}</div>
                      <div className="text-sm text-gray-500">{formatDateDisplay(mov.fecha)}</div>
                      {mov.tipo === 'EGRESO' && mov.estado_remito && (
                        <div className="mt-1 text-xs text-gray-400">Estado: {mov.estado_remito}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between gap-6 sm:w-auto">
                    <div className={`font-['var(--font-heading)'] text-3xl font-bold ${mov.tipo === 'INGRESO' ? 'text-green-600' : 'text-[var(--color-action)]'}`}>
                      {mov.tipo === 'INGRESO' ? '+' : '-'}{mov.cantidad}
                    </div>
                    <Link to={`/${mov.tipo.toLowerCase()}s/${mov.id}`} className="secondary-button !px-4 !py-2 !text-xs">
                      Ver remito
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {producto.historyTotal > 0 && (
        <div className="flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <div>Mostrando {producto.history.length} de {producto.historyTotal} movimientos</div>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="toolbar-button disabled:opacity-50">Anterior</button>
            <button disabled={producto.history.length < limit} onClick={() => setPage((prev) => prev + 1)} className="toolbar-button disabled:opacity-50">Siguiente</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalleProductoPage;
