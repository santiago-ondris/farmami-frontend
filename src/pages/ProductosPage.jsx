import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../lib/axios';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      try {
        const url = search ? `/api/products?search=${encodeURIComponent(search)}` : '/api/products';
        const { data } = await api.get(url);
        setProductos(data);
      } catch (err) { }
      setLoading(false);
    };

    const tid = setTimeout(fetchProductos, 300);
    return () => clearTimeout(tid);
  }, [search]);

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold font-['var(--font-heading)'] text-[var(--color-primary)]">Catálogo de Productos</h1>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center">
        <div className="flex-1 max-w-md">
          <label className="block text-xs font-medium text-gray-500 mb-1">Buscar Producto o Laboratorio</label>
          <input type="text" className="w-full p-2 border rounded outline-none focus:border-[var(--color-primary)]" value={search} onChange={e => setSearch(e.target.value)} />
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
                    <Link to={`/productos/${p.id}`} className="text-[var(--color-accent)] font-semibold hover:underline">Ver Historial</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductosPage;
