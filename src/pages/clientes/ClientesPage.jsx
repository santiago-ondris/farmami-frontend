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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Comercial</p>
          <h1 className="section-title">Clientes</h1>
          <p className="section-subtitle mt-2">Establecimientos habilitados, datos de contacto e historial de evaluaciones.</p>
        </div>
        <Link to="/clientes/nuevo" className="primary-button">
          Nuevo cliente
        </Link>
      </div>

      <div className="filter-panel p-4">
        <label className="field-label">Buscar por nombre o establecimiento</label>
        <input
          type="text"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="field-input"
        />
      </div>

      <div className="data-table-wrap">
        <table className="data-table min-w-[980px]">
          <thead>
            <tr>
              <th>Establecimiento</th>
              <th>Nombre</th>
              <th>Localidad</th>
              <th>GLN</th>
              <th>Contacto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="p-4 text-center">Cargando...</td></tr>
            ) : clientes.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">No hay clientes cargados.</td></tr>
            ) : clientes.map((cliente) => (
              <tr key={cliente.id}>
                <td className="font-medium text-[var(--color-primary)]">{cliente.establecimiento}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.localidad || '-'}</td>
                <td>{cliente.gln || '-'}</td>
                <td>{cliente.contacto || '-'}</td>
                <td>
                  <div className="flex gap-4 text-sm">
                    <Link to={`/clientes/${cliente.id}`} className="table-link">Ver ficha</Link>
                    <button type="button" onClick={() => handleDelete(cliente.id)} className="table-danger cursor-pointer">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <div>Mostrando {clientes.length} de {total} registros</div>
        <div className="flex gap-2">
          <button type="button" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="toolbar-button disabled:opacity-50">
            Anterior
          </button>
          <button type="button" disabled={clientes.length < limit} onClick={() => setPage((prev) => prev + 1)} className="toolbar-button disabled:opacity-50">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientesPage;
