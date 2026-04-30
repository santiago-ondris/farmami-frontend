import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { confirmToast } from '../../lib/confirmToast';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 25;

  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', String(page));
        params.append('limit', String(limit));

        const { data } = await api.get(`/api/clientes?${params.toString()}`);
        setClientes(data.data);
        setTotal(data.total);
      } catch (error) {
        toast.error('Error al cargar clientes');
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchClientes, 250);
    return () => clearTimeout(timer);
  }, [page, search]);

  const handleDelete = async (id) => {
    const confirmed = await confirmToast({
      title: 'Eliminar cliente',
      description: 'El registro quedara desactivado logicamente.',
      confirmLabel: 'Eliminar'
    });

    if (!confirmed) return;

    try {
      await api.delete(`/api/clientes/${id}`);
      setClientes((prev) => prev.filter((item) => item.id !== id));
      setTotal((prev) => prev - 1);
      toast.success('Cliente eliminado');
    } catch (error) {
      toast.error('Error al eliminar cliente');
    }
  };

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">Clientes</h1>
          <p className="text-sm text-gray-500">Establecimientos habilitados, datos de contacto e historial de evaluaciones.</p>
        </div>
        <Link to="/clientes/nuevo" className="rounded bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
          + Nuevo cliente
        </Link>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <label className="mb-1 block text-xs font-medium text-gray-500">Buscar por nombre o establecimiento</label>
        <input
          type="text"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
        <table className="min-w-[900px] w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-50 text-sm text-gray-600">
              <th className="border-b p-3">Establecimiento</th>
              <th className="border-b p-3">Nombre</th>
              <th className="border-b p-3">Localidad</th>
              <th className="border-b p-3">GLN</th>
              <th className="border-b p-3">Contacto</th>
              <th className="border-b p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-4 text-center">Cargando...</td></tr>
            ) : clientes.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">No hay clientes cargados.</td></tr>
            ) : clientes.map((cliente) => (
              <tr key={cliente.id} className="border-b border-gray-100 text-sm last:border-b-0 hover:bg-gray-50">
                <td className="p-3 font-medium text-[var(--color-primary)]">{cliente.establecimiento}</td>
                <td className="p-3">{cliente.nombre}</td>
                <td className="p-3">{cliente.localidad || '-'}</td>
                <td className="p-3">{cliente.gln || '-'}</td>
                <td className="p-3">{cliente.contacto || '-'}</td>
                <td className="p-3">
                  <div className="flex gap-3 text-xs font-semibold">
                    <Link to={`/clientes/${cliente.id}`} className="text-[var(--color-accent)] hover:underline">Ver ficha</Link>
                    <button type="button" onClick={() => handleDelete(cliente.id)} className="text-[var(--color-action)] hover:underline">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>Mostrando {clientes.length} de {total} registros</div>
        <div className="flex gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="rounded border px-3 py-1 disabled:opacity-50">
            Anterior
          </button>
          <button type="button" disabled={clientes.length < limit} onClick={() => setPage((prev) => prev + 1)} className="rounded border px-3 py-1 disabled:opacity-50">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientesPage;
