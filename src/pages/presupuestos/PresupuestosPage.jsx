import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { formatDateDisplay } from '../../lib/date';
import { confirmToast } from '../../lib/confirmToast';

const formatMoney = (value) => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS'
}).format(Number(value || 0));

const formatClienteTipo = (value) => value === 'EXISTENTE' ? 'Existente' : 'Nuevo';

const PresupuestosPage = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 25;

  useEffect(() => {
    const fetchPresupuestos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', String(page));
        params.append('limit', String(limit));

        const { data } = await api.get(`/api/presupuestos?${params.toString()}`);
        setPresupuestos(data.data);
        setTotal(data.total);
      } catch (error) {
        toast.error('Error al cargar presupuestos');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchPresupuestos, 250);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleDelete = async (id) => {
    const confirmed = await confirmToast({
      title: 'Eliminar presupuesto',
      description: 'El registro quedara desactivado logicamente.',
      confirmLabel: 'Eliminar'
    });

    if (!confirmed) return;

    try {
      await api.delete(`/api/presupuestos/${id}`);
      setPresupuestos((prev) => prev.filter((item) => item.id !== id));
      setTotal((prev) => prev - 1);
      toast.success('Presupuesto eliminado');
    } catch (error) {
      toast.error('Error al eliminar presupuesto');
    }
  };

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Comercial</p>
          <h1 className="section-title">Presupuestos</h1>
          <p className="section-subtitle mt-2">Emision, seguimiento e impresion de presupuestos comerciales.</p>
        </div>
        <Link to="/presupuestos/nuevo" className="primary-button">Nuevo presupuesto</Link>
      </div>

      <div className="filter-panel p-4">
        <label className="field-label">Buscar por numero, destinatario, contacto o localidad</label>
        <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="field-input" />
      </div>

      <div className="data-table-wrap">
        <table className="data-table min-w-[1120px]">
          <thead>
            <tr>
              <th>Numero</th>
              <th>Fecha</th>
              <th>Destinatario</th>
              <th>Tipo</th>
              <th>Contacto</th>
              <th>Items</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="p-4 text-center">Cargando...</td></tr>
            ) : presupuestos.length === 0 ? (
              <tr><td colSpan="8" className="p-4 text-center text-gray-500">No hay presupuestos cargados.</td></tr>
            ) : presupuestos.map((presupuesto) => (
              <tr key={presupuesto.id}>
                <td className="font-semibold text-[var(--color-primary)]">{presupuesto.numero}</td>
                <td>{formatDateDisplay(presupuesto.fecha)}</td>
                <td>{presupuesto.cliente_nombre}</td>
                <td>{formatClienteTipo(presupuesto.cliente_tipo)}</td>
                <td>{presupuesto.cliente_contacto || '-'}</td>
                <td>{presupuesto.items_count}</td>
                <td>{formatMoney(presupuesto.importe_total)}</td>
                <td>
                  <div className="flex gap-4 text-sm">
                    <Link to={`/presupuestos/${presupuesto.id}`} className="table-link">Detalle</Link>
                    <button type="button" onClick={() => handleDelete(presupuesto.id)} className="table-danger cursor-pointer">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <div>Mostrando {presupuestos.length} de {total} registros</div>
        <div className="flex gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="toolbar-button disabled:opacity-50">Anterior</button>
          <button type="button" disabled={presupuestos.length < limit} onClick={() => setPage((prev) => prev + 1)} className="toolbar-button disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default PresupuestosPage;
