import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { formatDateDisplay } from '../../lib/date';

const EgresosPage = () => {
  const [egresos, setEgresos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [estadoRemito, setEstadoRemito] = useState('');
  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    const fetchEgresos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (estadoRemito) params.append('estado_remito', estadoRemito);
        params.append('page', page);
        params.append('limit', limit);

        const { data } = await api.get(`/api/egresos?${params.toString()}`);
        setEgresos(data.data);
        setTotal(data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceId = setTimeout(() => {
      fetchEgresos();
    }, 300);

    return () => clearTimeout(debounceId);
  }, [search, estadoRemito, page]);

  const handleExport = async (filterCurrent = false) => {
    try {
      const params = new URLSearchParams();
      if (filterCurrent) {
        params.append('filter', 'current');
        if (search) params.append('search', search);
        if (estadoRemito) params.append('estado_remito', estadoRemito);
      }

      const response = await api.get(`/api/export/egresos?${params.toString()}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `egresos_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      toast.error('Error al exportar');
    }
  };

  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'Entregado':
        return 'bg-green-100 text-green-800';
      case 'Pendiente':
        return 'bg-amber-100 text-amber-800';
      case 'Cancelado':
        return 'bg-gray-200 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Operacion</p>
          <h1 className="section-title">Egresos</h1>
          <p className="section-subtitle mt-2">Despachos emitidos con lectura clara de estado, empresa solicitante y stock comprometido.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleExport(true)} className="toolbar-button cursor-pointer">Exportar vista</button>
          <button onClick={() => handleExport(false)} className="toolbar-button cursor-pointer">Exportar todo</button>
          <Link to="/egresos/nuevo" className="primary-button">Nuevo egreso</Link>
        </div>
      </div>

      <div className="filter-panel flex flex-wrap items-end gap-4 p-4">
        <div className="min-w-[240px] flex-1">
          <label className="field-label">Buscar producto, lote o empresa</label>
          <input type="text" className="field-input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div>
          <label className="field-label">Estado de remito</label>
          <select className="field-input min-w-[180px]" value={estadoRemito} onChange={(e) => { setEstadoRemito(e.target.value); setPage(1); }}>
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="data-table-wrap">
        <table className="data-table min-w-[920px]">
          <thead>
            <tr>
              <th>F. entrega</th>
              <th>Producto / lote</th>
              <th className="text-right">Cant.</th>
              <th>Empresa</th>
              <th>Remito</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-4 text-center">Cargando...</td></tr>
            ) : egresos.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">No hay registros</td></tr>
            ) : (
              egresos.map((egreso) => (
                <tr key={egreso.id} className={egreso.estado_remito === 'Cancelado' ? 'opacity-60' : ''}>
                  <td>{formatDateDisplay(egreso.fecha_entrega)}</td>
                  <td>
                    <div className="font-semibold text-[var(--color-primary)]">{egreso.product?.nombre}</div>
                    <div className="text-xs text-gray-500">Lote: {egreso.lote}</div>
                  </td>
                  <td className="text-right font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-action)]">{egreso.cantidad}</td>
                  <td className="font-medium">{egreso.empresa_solicitante}</td>
                  <td>
                    <span className={`status-chip ${getBadgeColor(egreso.estado_remito)}`}>
                      {egreso.estado_remito}
                    </span>
                  </td>
                  <td><Link to={`/egresos/${egreso.id}`} className="table-link">Detalle</Link></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <div>Mostrando {egresos.length} de {total} registros</div>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="toolbar-button cursor-pointer disabled:opacity-50">Anterior</button>
          <button disabled={egresos.length < limit} onClick={() => setPage((prev) => prev + 1)} className="toolbar-button cursor-pointer disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default EgresosPage;
