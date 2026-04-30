import React, { useState, useEffect } from 'react';
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
      } catch (e) { }
      setLoading(false);
    };
    fetchProduct();
  }, [id, page, order]);

  if (loading) return <div>Cargando...</div>;
  if (!producto) return <div className="text-red-500">Producto no encontrado</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-['var(--font-body)']">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-['var(--font-heading)'] text-[var(--color-primary)]">Historial de Producto</h1>
        <Link to="/productos" className="text-gray-500 hover:underline">Volver al catálogo</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 sm:col-span-2 relative overflow-hidden">
          {producto.deleted_at && (
            <div className="absolute top-0 right-0 bg-red-100 text-red-700 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-bl-lg">
              Producto Archivado / Eliminado
            </div>
          )}
          <h2 className="text-2xl font-bold text-gray-800">{producto.nombre}</h2>
          <p className="text-gray-500 mt-1">Laboratorio: {producto.laboratorio}</p>
        </div>
        <div className="bg-[var(--color-primary)] text-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
          <p className="text-sm opacity-90 font-medium">Stock Total Calculado</p>
          <span className="text-5xl font-bold mt-2 font-['var(--font-heading)']">{producto.stock}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-700 flex justify-between items-center">
          <span>Línea de Tiempo Operativa</span>
          <select
            className="text-sm border rounded p-1 font-normal outline-none focus:border-[var(--color-primary)] cursor-pointer"
            value={order}
            onChange={e => { setOrder(e.target.value); setPage(1); }}
          >
            <option value="desc">Más nuevos primero</option>
            <option value="asc">Más antiguos primero</option>
          </select>
        </div>
        <div className="p-0">
          {producto.history && producto.history.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No hay movimientos registrados para este producto.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {producto.history.map((mov, idx) => (
                <div key={idx} className="p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${mov.tipo === 'INGRESO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-[var(--color-action)]'}`}>
                      {mov.tipo === 'INGRESO' ? '📥' : '📤'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{mov.tipo === 'INGRESO' ? 'Ingreso de mercadería' : 'Egreso de mercadería'}</div>
                      <div className="text-sm text-gray-500">{formatDateDisplay(mov.fecha)}</div>
                      {mov.tipo === 'EGRESO' && mov.estado_remito && (
                        <div className="text-xs mt-1 text-gray-400">Estado: {mov.estado_remito}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 justify-between w-full sm:w-auto mt-4 sm:mt-0">
                    <div className={`font-bold text-2xl ${mov.tipo === 'INGRESO' ? 'text-green-600' : 'text-[var(--color-action)]'}`}>
                      {mov.tipo === 'INGRESO' ? '+' : '-'}{mov.cantidad}
                    </div>
                    <Link to={`/${mov.tipo.toLowerCase()}s/${mov.id}`} className="px-4 py-2 border rounded text-xs font-semibold hover:bg-white bg-gray-50 transition-colors">
                      Ver Remito
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {producto.historyTotal > 0 && (
        <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
          <div>Mostrando {producto.history.length} de {producto.historyTotal} movimientos</div>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer bg-white">Anterior</button>
            <button disabled={producto.history.length < limit} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer bg-white">Siguiente</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DetalleProductoPage;
