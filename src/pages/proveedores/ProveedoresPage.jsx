import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { TIPOS_PROVEEDOR } from '../../lib/fase2';
import { confirmToast } from '../../lib/confirmToast';

const ProveedoresPage = () => {
  const [proveedores, setProveedores] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tipo, setTipo] = useState('');
  const [page, setPage] = useState(1);
  const limit = 25;

  useEffect(() => {
    const fetchProveedores = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (tipo) params.append('tipo', tipo);
        params.append('page', String(page));
        params.append('limit', String(limit));

        const { data } = await api.get(`/api/proveedores?${params.toString()}`);
        setProveedores(data.data);
        setTotal(data.total);
      } catch (error) {
        toast.error('Error al cargar proveedores');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchProveedores, 250);
    return () => clearTimeout(timer);
  }, [page, search, tipo]);

  const handleDelete = async (id) => {
    const confirmed = await confirmToast({
      title: 'Eliminar proveedor',
      description: 'El registro quedara desactivado logicamente.',
      confirmLabel: 'Eliminar'
    });

    if (!confirmed) return;

    try {
      await api.delete(`/api/proveedores/${id}`);
      setProveedores((prev) => prev.filter((item) => item.id !== id));
      setTotal((prev) => prev - 1);
      toast.success('Proveedor eliminado');
    } catch (error) {
      toast.error('Error al eliminar proveedor');
    }
  };

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Comercial</p>
          <h1 className="section-title">Proveedores</h1>
          <p className="section-subtitle mt-2">Alta, clasificacion documental e historial de evaluaciones.</p>
        </div>
        <Link to="/proveedores/nuevo" className="primary-button">
          Nuevo proveedor
        </Link>
      </div>

      <div className="filter-panel grid grid-cols-1 gap-4 p-4 md:grid-cols-[1fr_260px]">
        <div>
          <label className="field-label">Buscar por nombre, numero, CUIT o GLN</label>
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="field-input" />
        </div>
        <div>
          <label className="field-label">Tipo</label>
          <select value={tipo} onChange={(event) => { setTipo(event.target.value); setPage(1); }} className="field-input">
            <option value="">Todos</option>
            {TIPOS_PROVEEDOR.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="data-table-wrap">
        <table className="data-table min-w-[1220px]">
          <thead>
            <tr>
              <th>Numero</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>CUIT</th>
              <th>GLN</th>
              <th>Producto o servicio</th>
              <th>Documentacion</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="p-4 text-center">Cargando...</td></tr>
            ) : proveedores.length === 0 ? (
              <tr><td colSpan="8" className="p-4 text-center text-gray-500">No hay proveedores cargados.</td></tr>
            ) : proveedores.map((proveedor) => (
              <tr key={proveedor.id}>
                <td className="font-medium text-[var(--color-primary)]">{proveedor.numero}</td>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.tipo}</td>
                <td>{proveedor.cuit || '-'}</td>
                <td>{proveedor.gln || '-'}</td>
                <td>{proveedor.producto_o_servicio || '-'}</td>
                <td>
                  <span className={`status-chip ${proveedor.documentacion_completa ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {proveedor.documentacion_completa ? 'Completa' : 'Incompleta'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-4 text-sm">
                    <Link to={`/proveedores/${proveedor.id}`} className="table-link">Ver ficha</Link>
                    <button type="button" onClick={() => handleDelete(proveedor.id)} className="table-danger cursor-pointer">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <div>Mostrando {proveedores.length} de {total} registros</div>
        <div className="flex gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="toolbar-button disabled:opacity-50">Anterior</button>
          <button type="button" disabled={proveedores.length < limit} onClick={() => setPage((prev) => prev + 1)} className="toolbar-button disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default ProveedoresPage;
