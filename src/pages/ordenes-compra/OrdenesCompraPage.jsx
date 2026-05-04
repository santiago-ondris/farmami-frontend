import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { formatDateDisplay } from '../../lib/date';
import { confirmToast } from '../../lib/confirmToast';

const formatMoney = (value) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(Number(value || 0));
};

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Comercial</p>
          <h1 className="section-title">Ordenes de compra</h1>
          <p className="section-subtitle mt-2">Alta, consulta y seguimiento interno de compras a proveedores.</p>
        </div>
        <Link to="/ordenes-compra/nuevo" className="primary-button">Nueva orden</Link>
      </div>

      <div className="filter-panel p-4">
        <label className="field-label">Buscar por numero, proveedor o condicion de pago</label>
        <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="field-input" />
      </div>

      <div className="data-table-wrap">
        <table className="data-table min-w-[1140px]">
          <thead>
            <tr>
              <th>Numero</th>
              <th>Fecha</th>
              <th>Proveedor</th>
              <th>Condicion de pago</th>
              <th>Fecha de entrega</th>
              <th>Items</th>
              <th>Importe total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="p-4 text-center">Cargando...</td></tr>
            ) : ordenesCompra.length === 0 ? (
              <tr><td colSpan="8" className="p-4 text-center text-gray-500">No hay ordenes de compra cargadas.</td></tr>
            ) : ordenesCompra.map((ordenCompra) => (
              <tr key={ordenCompra.id}>
                <td className="font-semibold text-[var(--color-primary)]">{ordenCompra.numero}</td>
                <td>{formatDateDisplay(ordenCompra.fecha)}</td>
                <td>{ordenCompra.proveedor?.nombre}</td>
                <td>{ordenCompra.condicion_pago}</td>
                <td>{ordenCompra.fecha_entrega ? formatDateDisplay(ordenCompra.fecha_entrega) : '-'}</td>
                <td>{ordenCompra.items_count}</td>
                <td>{formatMoney(ordenCompra.importe_total)}</td>
                <td>
                  <div className="flex gap-4 text-sm">
                    <Link to={`/ordenes-compra/${ordenCompra.id}`} className="table-link">Detalle</Link>
                    <button type="button" onClick={() => handleDelete(ordenCompra.id)} className="table-danger cursor-pointer">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <div>Mostrando {ordenesCompra.length} de {total} registros</div>
        <div className="flex gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="toolbar-button disabled:opacity-50">Anterior</button>
          <button type="button" disabled={ordenesCompra.length < limit} onClick={() => setPage((prev) => prev + 1)} className="toolbar-button disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default OrdenesCompraPage;
