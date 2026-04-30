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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">Proveedores</h1>
          <p className="text-sm text-gray-500">Alta, clasificacion documental e historial de evaluaciones.</p>
        </div>
        <Link to="/proveedores/nuevo" className="rounded bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          + Nuevo proveedor
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_260px]">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Buscar por nombre, numero, CUIT o GLN</label>
          <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-500">Tipo</label>
          <select value={tipo} onChange={(event) => { setTipo(event.target.value); setPage(1); }} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]">
            <option value="">Todos</option>
            {TIPOS_PROVEEDOR.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
        <table className="min-w-[1180px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-50 text-sm text-gray-600">
              <th className="border-b p-3">Numero</th>
              <th className="border-b p-3">Nombre</th>
              <th className="border-b p-3">Tipo</th>
              <th className="border-b p-3">CUIT</th>
              <th className="border-b p-3">GLN</th>
              <th className="border-b p-3">Producto/Servicio</th>
              <th className="border-b p-3">Documentacion</th>
              <th className="border-b p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="p-4 text-center">Cargando...</td></tr>
            ) : proveedores.length === 0 ? (
              <tr><td colSpan="8" className="p-4 text-center text-gray-500">No hay proveedores cargados.</td></tr>
            ) : proveedores.map((proveedor) => (
              <tr key={proveedor.id} className="border-b border-gray-100 text-sm last:border-b-0 hover:bg-gray-50">
                <td className="p-3 font-medium text-[var(--color-primary)]">{proveedor.numero}</td>
                <td className="p-3">{proveedor.nombre}</td>
                <td className="p-3">{proveedor.tipo}</td>
                <td className="p-3">{proveedor.cuit || '-'}</td>
                <td className="p-3">{proveedor.gln || '-'}</td>
                <td className="p-3">{proveedor.producto_o_servicio || '-'}</td>
                <td className="p-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${proveedor.documentacion_completa ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {proveedor.documentacion_completa ? 'Completa' : 'Incompleta'}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex gap-3 text-xs font-semibold">
                    <Link to={`/proveedores/${proveedor.id}`} className="text-[var(--color-accent)] hover:underline">Ver ficha</Link>
                    <button type="button" onClick={() => handleDelete(proveedor.id)} className="text-[var(--color-action)] hover:underline">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>Mostrando {proveedores.length} de {total} registros</div>
        <div className="flex gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="rounded border px-3 py-1 disabled:opacity-50">Anterior</button>
          <button type="button" disabled={proveedores.length < limit} onClick={() => setPage((prev) => prev + 1)} className="rounded border px-3 py-1 disabled:opacity-50">Siguiente</button>
        </div>
      </div>
    </div>
  );
};

export default ProveedoresPage;
