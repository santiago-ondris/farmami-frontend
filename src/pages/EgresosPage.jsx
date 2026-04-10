import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

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
      alert("Error al exportar");
    }
  };

  const getBadgeColor = (estado) => {
    switch(estado) {
      case 'Entregado': return 'bg-green-100 text-green-800';
      case 'Pendiente': return 'bg-amber-100 text-amber-800';
      case 'Cancelado': return 'bg-gray-200 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-['var(--font-heading)'] text-[var(--color-primary)]">Egresos</h1>
        <div className="flex gap-2">
          <button onClick={() => handleExport(true)} className="px-4 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50 text-sm cursor-pointer">
            Exportar Vista
          </button>
          <button onClick={() => handleExport(false)} className="px-4 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50 text-sm cursor-pointer">
            Exportar Todo
          </button>
          <Link to="/egresos/nuevo" className="px-4 py-2 bg-[var(--color-action)] text-white rounded font-semibold text-sm hover:opacity-90">
            + Nuevo Egreso
          </Link>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Buscar (Producto, Lote, Empresa)</label>
          <input type="text" className="w-full p-2 border rounded outline-none focus:border-[var(--color-primary)]" value={search} onChange={e => {setSearch(e.target.value); setPage(1)}} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Estado Remito</label>
          <select className="w-full p-2 border rounded" value={estadoRemito} onChange={e => {setEstadoRemito(e.target.value); setPage(1)}}>
            <option value="">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Entregado">Entregado</option>
            <option value="Cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-3 border-b">F. Entrega</th>
              <th className="p-3 border-b">Producto / Lote</th>
              <th className="p-3 border-b text-right">Cant</th>
              <th className="p-3 border-b">Empresa</th>
              <th className="p-3 border-b">Remito</th>
              <th className="p-3 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-4 text-center">Cargando...</td></tr>
            ) : egresos.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">No hay registros</td></tr>
            ) : (
              egresos.map(e => (
                <tr key={e.id} className={`hover:bg-gray-50 text-sm border-b last:border-0 border-gray-100 ${e.estado_remito === 'Cancelado' ? 'opacity-60' : ''}`}>
                  <td className="p-3">{new Date(e.fecha_entrega).toLocaleDateString('es-AR')}</td>
                  <td className="p-3">
                    <div className="font-semibold text-[var(--color-primary)]">{e.product?.nombre}</div>
                    <div className="text-xs">Lote: {e.lote}</div>
                  </td>
                  <td className="p-3 text-right font-bold text-lg">{e.cantidad}</td>
                  <td className="p-3 font-medium">{e.empresa_solicitante}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getBadgeColor(e.estado_remito)}`}>
                      {e.estado_remito}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link to={`/egresos/${e.id}`} className="text-[var(--color-accent)] hover:underline font-semibold text-xs">Detalle</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>Mostrando {egresos.length} de {total} registros</div>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer">Anterior</button>
          <button disabled={egresos.length < limit} onClick={()=>setPage(p=>p+1)} className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default EgresosPage;
