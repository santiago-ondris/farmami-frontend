import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import DateField from '../../components/DateField';
import { formatDateDisplay } from '../../lib/date';

const RechazosPage = () => {
  const [rechazos, setRechazos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [page, setPage] = useState(1);
  const limit = 25;

  useEffect(() => {
    const fetchRechazos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (fechaDesde) params.append('fecha_desde', fechaDesde);
        if (fechaHasta) params.append('fecha_hasta', fechaHasta);
        params.append('page', String(page));
        params.append('limit', String(limit));

        const { data } = await api.get(`/api/rechazos?${params.toString()}`);
        setRechazos(data.data);
        setTotal(data.total);
      } catch (error) {
        toast.error('Error al cargar rechazos');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchRechazos, 250);
    return () => clearTimeout(timer);
  }, [fechaDesde, fechaHasta, page, search]);

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">Rechazos</h1>
          <p className="text-sm text-gray-500">Trazabilidad de rechazos por producto, lote y proveedor.</p>
        </div>
        <Link to="/rechazos/nuevo" className="rounded bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          + Nuevo rechazo
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px]">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Buscar por producto, lote o proveedor</label>
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Desde</label>
          <DateField value={fechaDesde} onChange={(value) => { setFechaDesde(value); setPage(1); }} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Hasta</label>
          <DateField value={fechaHasta} onChange={(value) => { setFechaHasta(value); setPage(1); }} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
        <table className="min-w-[1080px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-50 text-sm text-gray-600">
              <th className="border-b p-3">Fecha</th>
              <th className="border-b p-3">Producto</th>
              <th className="border-b p-3">Lote</th>
              <th className="border-b p-3">Motivo</th>
              <th className="border-b p-3">Cantidad</th>
              <th className="border-b p-3">Remito</th>
              <th className="border-b p-3">Proveedor</th>
              <th className="border-b p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="p-4 text-center">Cargando...</td></tr>
            ) : rechazos.length === 0 ? (
              <tr><td colSpan="8" className="p-4 text-center text-gray-500">No hay rechazos cargados.</td></tr>
            ) : rechazos.map((rechazo) => (
              <tr key={rechazo.id} className="border-b border-gray-100 text-sm last:border-b-0 hover:bg-gray-50">
                <td className="p-3">{formatDateDisplay(rechazo.fecha)}</td>
                <td className="p-3 font-medium text-[var(--color-primary)]">{rechazo.product?.nombre}</td>
                <td className="p-3">{rechazo.lote}</td>
                <td className="p-3">{rechazo.motivo_rechazo}</td>
                <td className="p-3 font-semibold">{rechazo.cantidad}</td>
                <td className="p-3">{rechazo.remito || '-'}</td>
                <td className="p-3">{rechazo.proveedor?.nombre || '-'}</td>
                <td className="p-3">
                  <Link to={`/rechazos/${rechazo.id}`} className="text-xs font-semibold text-[var(--color-accent)] hover:underline">
                    Detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>Mostrando {rechazos.length} de {total} registros</div>
        <div className="flex gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="rounded border px-3 py-1 disabled:opacity-50">Anterior</button>
          <button type="button" disabled={rechazos.length < limit} onClick={() => setPage((prev) => prev + 1)} className="rounded border px-3 py-1 disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default RechazosPage;
