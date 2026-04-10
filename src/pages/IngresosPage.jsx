import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

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
      alert("Error al exportar");
    }
  };

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-['var(--font-heading)'] text-[var(--color-primary)]">Ingresos</h1>
        <div className="flex gap-2">
          <button onClick={() => handleExport(true)} className="px-4 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50 text-sm cursor-pointer">
            Exportar Vista
          </button>
          <button onClick={() => handleExport(false)} className="px-4 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50 text-sm cursor-pointer">
            Exportar Todo
          </button>
          <Link to="/ingresos/nuevo" className="px-4 py-2 bg-[var(--color-primary)] text-white rounded font-semibold text-sm hover:opacity-90">
            + Nuevo Ingreso
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Buscar (Producto, Lote, Proveedor)</label>
          <input type="text" className="w-full p-2 border rounded outline-none focus:border-[var(--color-primary)]" value={search} onChange={e => {setSearch(e.target.value); setPage(1)}} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Cadena Frío</label>
          <select className="w-full p-2 border rounded" value={cadenaFrio} onChange={e => {setCadenaFrio(e.target.value); setPage(1)}}>
            <option value="">Todos</option>
            <option value="true">Sí</option>
            <option value="false">No</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
          <input type="date" className="w-full p-2 border rounded outline-none" value={fechaDesde} onChange={e => {setFechaDesde(e.target.value); setPage(1)}} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
          <input type="date" className="w-full p-2 border rounded outline-none" value={fechaHasta} onChange={e => {setFechaHasta(e.target.value); setPage(1)}} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-3 border-b">Fecha</th>
              <th className="p-3 border-b">Producto</th>
              <th className="p-3 border-b">Prov/Lab</th>
              <th className="p-3 border-b">Lote</th>
              <th className="p-3 border-b">Vto</th>
              <th className="p-3 border-b text-center">Frio</th>
              <th className="p-3 border-b text-right">Cant</th>
              <th className="p-3 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="p-4 text-center">Cargando...</td></tr>
            ) : ingresos.length === 0 ? (
              <tr><td colSpan="8" className="p-4 text-center text-gray-500">No hay registros</td></tr>
            ) : (
              ingresos.map(i => (
                <tr key={i.id} className="hover:bg-gray-50 text-sm border-b last:border-0 border-gray-100">
                  <td className="p-3">{new Date(i.fecha_ingreso).toLocaleDateString('es-AR')}</td>
                  <td className="p-3 font-semibold text-[var(--color-primary)]">{i.product?.nombre}</td>
                  <td className="p-3">
                    <div className="text-xs font-medium">{i.proveedor}</div>
                    <div className="text-[10px] text-gray-500">{i.product?.laboratorio}</div>
                  </td>
                  <td className="p-3">{i.lote}</td>
                  <td className="p-3">{new Date(i.vencimiento).toLocaleDateString('es-AR')}</td>
                  <td className="p-3 text-center">{i.cadena_frio ? '❄️' : '-'}</td>
                  <td className="p-3 text-right font-bold">{i.cantidad}</td>
                  <td className="p-3">
                    <Link to={`/ingresos/${i.id}`} className="text-[var(--color-accent)] hover:underline font-semibold text-xs">Detalle</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>Mostrando {ingresos.length} de {total} registros</div>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer">Anterior</button>
          <button disabled={ingresos.length < limit} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default IngresosPage;
