import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { formatDateDisplay } from '../../lib/date';

const RemitosPage = () => {
  const [remitos, setRemitos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [page, setPage] = useState(1);
  const limit = 25;

  useEffect(() => {
    const fetchRemitos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (estado) params.append('estado', estado);
        params.append('page', String(page));
        params.append('limit', String(limit));

        const { data } = await api.get(`/api/remitos?${params.toString()}`);
        setRemitos(data.data);
        setTotal(data.total);
      } catch (error) {
        toast.error('Error al cargar remitos');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchRemitos, 250);
    return () => clearTimeout(timer);
  }, [estado, page, search]);

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">Remitos</h1>
          <p className="text-sm text-gray-500">Emisión, seguimiento y PDF imprimible de remitos de venta.</p>
        </div>
        <Link to="/remitos/nuevo" className="rounded bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          + Nuevo remito
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_220px]">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Buscar por número o cliente</label>
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Estado</label>
          <select value={estado} onChange={(event) => { setEstado(event.target.value); setPage(1); }} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]">
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
        <table className="min-w-[960px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-50 text-sm text-gray-600">
              <th className="border-b p-3">Número</th>
              <th className="border-b p-3">Fecha</th>
              <th className="border-b p-3">Cliente</th>
              <th className="border-b p-3">Estado</th>
              <th className="border-b p-3">Items</th>
              <th className="border-b p-3">Egresos</th>
              <th className="border-b p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="p-4 text-center">Cargando...</td></tr>
            ) : remitos.length === 0 ? (
              <tr><td colSpan="7" className="p-4 text-center text-gray-500">No hay remitos cargados.</td></tr>
            ) : remitos.map((remito) => (
              <tr key={remito.id} className="border-b border-gray-100 text-sm last:border-b-0 hover:bg-gray-50">
                <td className="p-3 font-semibold text-[var(--color-primary)]">{remito.numero}</td>
                <td className="p-3">{formatDateDisplay(remito.fecha)}</td>
                <td className="p-3">{remito.cliente?.nombre}</td>
                <td className="p-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${remito.estado === 'Entregado' ? 'bg-green-100 text-green-700' : remito.estado === 'Cancelado' ? 'bg-gray-200 text-gray-700' : 'bg-amber-100 text-amber-700'}`}>
                    {remito.estado}
                  </span>
                </td>
                <td className="p-3">{remito.items_count}</td>
                <td className="p-3">{remito.egresos_count ?? 0}</td>
                <td className="p-3">
                  <div className="flex gap-3 text-xs font-semibold">
                    <Link to={`/remitos/${remito.id}`} className="text-[var(--color-accent)] hover:underline">Detalle</Link>
                    {remito.primary_egreso_id ? (
                      <Link to={`/egresos/${remito.primary_egreso_id}`} className="text-[var(--color-primary)] hover:underline">Ir a egreso</Link>
                    ) : remito.egresos_count > 1 ? (
                      <Link to={`/remitos/${remito.id}`} className="text-[var(--color-primary)] hover:underline">Ver egresos</Link>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>Mostrando {remitos.length} de {total} registros</div>
        <div className="flex gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="rounded border px-3 py-1 disabled:opacity-50">Anterior</button>
          <button type="button" disabled={remitos.length < limit} onClick={() => setPage((prev) => prev + 1)} className="rounded border px-3 py-1 disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default RemitosPage;
