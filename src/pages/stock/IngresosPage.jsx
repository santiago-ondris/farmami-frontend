import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import DateField from '../../components/DateField';
import { formatDateDisplay } from '../../lib/date';

const IngresosPage = () => {
  const [ingresos, setIngresos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [cadenaFrio, setCadenaFrio] = useState('');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    const fetchIngresos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (cadenaFrio) params.append('cadena_frio', cadenaFrio);
        if (fechaDesde) params.append('fecha_desde', fechaDesde);
        if (fechaHasta) params.append('fecha_hasta', fechaHasta);
        params.append('page', page);
        params.append('limit', limit);

        const { data } = await api.get(`/api/ingresos?${params.toString()}`);
        setIngresos(data.data);
        setTotal(data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const debounceId = setTimeout(() => {
      fetchIngresos();
    }, 300);

    return () => clearTimeout(debounceId);
  }, [search, cadenaFrio, fechaDesde, fechaHasta, page]);

  const handleExport = async (filterCurrent = false) => {
    try {
      const params = new URLSearchParams();
      if (filterCurrent) {
        params.append('filter', 'current');
        if (search) params.append('search', search);
        if (cadenaFrio) params.append('cadena_frio', cadenaFrio);
        if (fechaDesde) params.append('fecha_desde', fechaDesde);
        if (fechaHasta) params.append('fecha_hasta', fechaHasta);
      }

      const response = await api.get(`/api/export/ingresos?${params.toString()}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ingresos_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      toast.error('Error al exportar');
    }
  };

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Operacion</p>
          <h1 className="section-title">Ingresos</h1>
          <p className="section-subtitle mt-2">Registro de mercaderia recibida con filtros por fecha, proveedor y cadena de frio.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleExport(true)} className="toolbar-button cursor-pointer">Exportar vista</button>
          <button onClick={() => handleExport(false)} className="toolbar-button cursor-pointer">Exportar todo</button>
          <Link to="/ingresos/nuevo" className="primary-button">Nuevo ingreso</Link>
        </div>
      </div>

      <div className="filter-panel flex flex-wrap items-end gap-4 p-4">
        <div className="min-w-[240px] flex-1">
          <label className="field-label">Buscar producto, lote, remito o proveedor</label>
          <input type="text" className="field-input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <div>
          <label className="field-label">Cadena de frio</label>
          <select className="field-input min-w-[160px]" value={cadenaFrio} onChange={(e) => { setCadenaFrio(e.target.value); setPage(1); }}>
            <option value="">Todos</option>
            <option value="true">Si</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label className="field-label">Desde</label>
          <DateField value={fechaDesde} onChange={(value) => { setFechaDesde(value); setPage(1); }} />
        </div>
        <div>
          <label className="field-label">Hasta</label>
          <DateField value={fechaHasta} onChange={(value) => { setFechaHasta(value); setPage(1); }} />
        </div>
      </div>

      <div className="data-table-wrap">
        <table className="data-table min-w-[920px]">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Nro remito</th>
              <th>Producto</th>
              <th>Prov/Lab</th>
              <th>Lote</th>
              <th>Vto</th>
              <th className="text-center">Frio</th>
              <th className="text-right">Cant.</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="9" className="p-4 text-center">Cargando...</td></tr>
            ) : ingresos.length === 0 ? (
              <tr><td colSpan="9" className="p-4 text-center text-gray-500">No hay registros</td></tr>
            ) : (
              ingresos.map((ingreso) => (
                <tr key={ingreso.id}>
                  <td>{formatDateDisplay(ingreso.fecha_ingreso)}</td>
                  <td>{ingreso.nro_remito || '-'}</td>
                  <td className="font-semibold text-[var(--color-primary)]">{ingreso.product?.nombre}</td>
                  <td>
                    <div className="text-sm font-medium">{ingreso.proveedor_rel?.nombre || ingreso.proveedor}</div>
                    <div className="text-xs text-gray-500">{ingreso.product?.laboratorio}</div>
                  </td>
                  <td>{ingreso.lote}</td>
                  <td>{formatDateDisplay(ingreso.vencimiento)}</td>
                  <td className="text-center">{ingreso.cadena_frio ? 'Si' : '-'}</td>
                  <td className="text-right font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">{ingreso.cantidad}</td>
                  <td><Link to={`/ingresos/${ingreso.id}`} className="table-link">Detalle</Link></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <div>Mostrando {ingresos.length} de {total} registros</div>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="toolbar-button cursor-pointer disabled:opacity-50">Anterior</button>
          <button disabled={ingresos.length < limit} onClick={() => setPage((prev) => prev + 1)} className="toolbar-button cursor-pointer disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default IngresosPage;
