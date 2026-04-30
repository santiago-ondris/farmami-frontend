import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { formatDateDisplay } from '../../lib/date';
import { confirmToast } from '../../lib/confirmToast';

const formatMoney = (value) => Number(value || 0).toFixed(2);

const OrdenesCompraPage = () => {
  const [ordenesCompra, setOrdenesCompra] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 25;

  useEffect(() => {
    const fetchOrdenesCompra = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', String(page));
        params.append('limit', String(limit));

        const { data } = await api.get(`/api/ordenes-compra?${params.toString()}`);
        setOrdenesCompra(data.data);
        setTotal(data.total);
      } catch (error) {
        toast.error('Error al cargar ordenes de compra');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchOrdenesCompra, 250);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleDelete = async (id) => {
    const confirmed = await confirmToast({
      title: 'Eliminar orden de compra',
      description: 'El registro quedara desactivado logicamente.',
      confirmLabel: 'Eliminar'
    });

    if (!confirmed) return;

    try {
      await api.delete(`/api/ordenes-compra/${id}`);
      setOrdenesCompra((prev) => prev.filter((item) => item.id !== id));
      setTotal((prev) => prev - 1);
      toast.success('Orden de compra eliminada');
    } catch (error) {
      toast.error('Error al eliminar orden de compra');
    }
  };

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">Ordenes de compra</h1>
          <p className="text-sm text-gray-500">Alta, consulta y seguimiento interno de compras a proveedores.</p>
        </div>
        <Link to="/ordenes-compra/nuevo" className="rounded bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          + Nueva orden
        </Link>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
        <label className="mb-1 block text-xs font-medium text-gray-500">Buscar por numero, proveedor o condicion de pago</label>
        <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
        <table className="min-w-[1120px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-50 text-sm text-gray-600">
              <th className="border-b p-3">Numero</th>
              <th className="border-b p-3">Fecha</th>
              <th className="border-b p-3">Proveedor</th>
              <th className="border-b p-3">Condicion de pago</th>
              <th className="border-b p-3">Fecha de entrega</th>
              <th className="border-b p-3">Items</th>
              <th className="border-b p-3">Importe total</th>
              <th className="border-b p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="p-4 text-center">Cargando...</td></tr>
            ) : ordenesCompra.length === 0 ? (
              <tr><td colSpan="8" className="p-4 text-center text-gray-500">No hay ordenes de compra cargadas.</td></tr>
            ) : ordenesCompra.map((ordenCompra) => (
              <tr key={ordenCompra.id} className="border-b border-gray-100 text-sm last:border-b-0 hover:bg-gray-50">
                <td className="p-3 font-semibold text-[var(--color-primary)]">{ordenCompra.numero}</td>
                <td className="p-3">{formatDateDisplay(ordenCompra.fecha)}</td>
                <td className="p-3">{ordenCompra.proveedor?.nombre}</td>
                <td className="p-3">{ordenCompra.condicion_pago}</td>
                <td className="p-3">{ordenCompra.fecha_entrega ? formatDateDisplay(ordenCompra.fecha_entrega) : '-'}</td>
                <td className="p-3">{ordenCompra.items_count}</td>
                <td className="p-3">{formatMoney(ordenCompra.importe_total)}</td>
                <td className="p-3">
                  <div className="flex gap-3 text-xs font-semibold">
                    <Link to={`/ordenes-compra/${ordenCompra.id}`} className="text-[var(--color-accent)] hover:underline">Detalle</Link>
                    <button type="button" onClick={() => handleDelete(ordenCompra.id)} className="text-[var(--color-action)] hover:underline">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>Mostrando {ordenesCompra.length} de {total} registros</div>
        <div className="flex gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="rounded border px-3 py-1 disabled:opacity-50">Anterior</button>
          <button type="button" disabled={ordenesCompra.length < limit} onClick={() => setPage((prev) => prev + 1)} className="rounded border px-3 py-1 disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default OrdenesCompraPage;
