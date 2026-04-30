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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Comercial</p>
          <h1 className="section-title">Remitos</h1>
          <p className="section-subtitle mt-2">Emision, seguimiento y PDF imprimible de remitos de venta.</p>
        </div>
        <Link to="/remitos/nuevo" className="primary-button">Nuevo remito</Link>
      </div>

      <div className="filter-panel grid grid-cols-1 gap-4 p-4 md:grid-cols-[1fr_220px]">
        <div>
          <label className="field-label">Buscar por numero o cliente</label>
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="field-input" />
        </div>
        <div>
          <label className="field-label">Estado</label>
          <select value={estado} onChange={(event) => { setEstado(event.target.value); setPage(1); }} className="field-input">
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="data-table-wrap">
        <table className="data-table min-w-[980px]">
          <thead>
            <tr>
              <th>Numero</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Estado</th>
              <th>Items</th>
              <th>Egresos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="p-4 text-center">Cargando...</td></tr>
            ) : remitos.length === 0 ? (
              <tr><td colSpan="7" className="p-4 text-center text-gray-500">No hay remitos cargados.</td></tr>
            ) : remitos.map((remito) => (
              <tr key={remito.id}>
                <td className="font-semibold text-[var(--color-primary)]">{remito.numero}</td>
                <td>{formatDateDisplay(remito.fecha)}</td>
                <td>{remito.cliente?.nombre}</td>
                <td>
                  <span className={`status-chip ${remito.estado === 'Entregado' ? 'bg-green-100 text-green-700' : remito.estado === 'Cancelado' ? 'bg-gray-200 text-gray-700' : 'bg-amber-100 text-amber-700'}`}>
                    {remito.estado}
                  </span>
                </td>
                <td>{remito.items_count}</td>
                <td>{remito.egresos_count ?? 0}</td>
                <td>
                  <div className="flex gap-4 text-sm">
                    <Link to={`/remitos/${remito.id}`} className="table-link">Detalle</Link>
                    {remito.primary_egreso_id ? (
                      <Link to={`/egresos/${remito.primary_egreso_id}`} className="table-link-secondary">Ir a egreso</Link>
                    ) : remito.egresos_count > 1 ? (
                      <Link to={`/remitos/${remito.id}`} className="table-link-secondary">Ver egresos</Link>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <div>Mostrando {remitos.length} de {total} registros</div>
        <div className="flex gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="toolbar-button disabled:opacity-50">Anterior</button>
          <button type="button" disabled={remitos.length < limit} onClick={() => setPage((prev) => prev + 1)} className="toolbar-button disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default RemitosPage;
