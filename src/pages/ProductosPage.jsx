import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductosPage = () => {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        params.append('page', page);
        params.append('limit', limit);

        const { data } = await api.get(`/api/products?${params.toString()}`);
        setProductos(data.data);
        setTotal(data.total);
      } catch (err) { }
      setLoading(false);
    };

    const tid = setTimeout(fetchProductos, 300);
    return () => clearTimeout(tid);
  }, [search, page]);

  const handleDelete = (id, nombre) => {
    toast((t) => (
      <div className="flex flex-col gap-2 p-1">
        <p className="text-sm font-semibold text-gray-800">¿Estás seguro?</p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 font-medium cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const tid = toast.loading('Eliminando...');
              try {
                await api.delete(`/api/products/${id}`);
                setProductos(prev => prev.filter(p => p.id !== id));
                setTotal(prev => prev - 1);
                toast.success('Producto eliminado', { id: tid });
              } catch (err) {
                toast.error(err.response?.data?.error || 'Error al eliminar', { id: tid });
              }
            }}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 font-bold cursor-pointer"
          >
            Eliminar
          </button>
        </div>
      </div>
    ), { duration: 6000, position: 'top-center' });
  };

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-['var(--font-heading)'] text-[var(--color-primary)]">Stock de Productos</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
        <div className="flex-1 max-w-md">
          <label className="block text-xs font-medium text-gray-500 mb-1">Buscar Producto o Laboratorio</label>
          <input type="text" className="w-full p-2 border rounded outline-none focus:border-[var(--color-primary)]" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm">
              <th className="p-3 border-b">Producto</th>
              <th className="p-3 border-b">Laboratorio</th>
              <th className="p-3 border-b text-right">Stock Actual</th>
              <th className="p-3 border-b text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-4 text-center">Cargando...</td></tr>
            ) : productos.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">No hay productos registrados</td></tr>
            ) : (
              productos.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 border-b border-gray-100 text-sm last:border-0">
                  <td className="p-3 font-semibold text-[var(--color-primary)]">{p.nombre}</td>
                  <td className="p-3">{p.laboratorio}</td>
                  <td className="p-3 text-right">
                    <span className={`font-bold text-lg ${p.stock < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link to={`/productos/${p.id}`} className="text-[var(--color-accent)] font-semibold hover:underline">Ver Historial</Link>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(p.id, p.nombre)}
                          className="text-red-500 hover:text-red-700 font-semibold text-xs cursor-pointer"
                          title="Eliminar producto"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
        <div>Mostrando {productos.length} de {total} registros</div>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer">Anterior</button>
          <button disabled={productos.length < limit} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer">Siguiente</button>
        </div>
      </div>

    </div>
  );
};

export default ProductosPage;
