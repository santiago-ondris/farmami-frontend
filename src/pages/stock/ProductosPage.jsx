import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';

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
      } catch (err) {}
      setLoading(false);
    };

    const tid = setTimeout(fetchProductos, 300);
    return () => clearTimeout(tid);
  }, [search, page]);

  const handleDelete = (id) => {
    toast(
      (toastInstance) => (
        <div className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-5 shadow-2xl">
          <p className="text-sm font-semibold text-gray-900">Eliminar producto</p>
          <p className="mt-1 text-sm text-gray-500">El producto se dara de baja y dejara de estar disponible en el listado.</p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => toast.dismiss(toastInstance.id)}
              className="secondary-button !px-4 !py-2 !text-xs"
            >
              Cancelar
            </button>
            <button
              onClick={async () => {
                toast.dismiss(toastInstance.id);
                const loadingToastId = toast.loading('Eliminando...');
                try {
                  await api.delete(`/api/products/${id}`);
                  setProductos((prev) => prev.filter((producto) => producto.id !== id));
                  setTotal((prev) => prev - 1);
                  toast.success('Producto eliminado', { id: loadingToastId });
                } catch (err) {
                  toast.error(err.response?.data?.error || 'Error al eliminar', { id: loadingToastId });
                }
              }}
              className="danger-button !px-4 !py-2 !text-xs"
            >
              Eliminar
            </button>
          </div>
        </div>
      ),
      { duration: 6000, position: 'top-center' }
    );
  };

  const handleExport = async (filterCurrent = false) => {
    try {
      const params = new URLSearchParams();
      if (filterCurrent) {
        params.append('filter', 'current');
        if (search) params.append('search', search);
      }

      const response = await api.get(`/api/export/stock?${params.toString()}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `stock_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      toast.error('Error al exportar stock');
    }
  };

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Inventario</p>
          <h1 className="section-title">Stock de productos</h1>
          <p className="section-subtitle mt-2">Catalogo operativo con stock consolidado y acceso al historial de movimientos.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => handleExport(true)} className="toolbar-button cursor-pointer">
            Exportar vista
          </button>
          <button onClick={() => handleExport(false)} className="toolbar-button cursor-pointer">
            Exportar todo
          </button>
        </div>
      </div>

      <div className="filter-panel p-4">
        <div className="max-w-md">
          <label className="field-label">Buscar producto o laboratorio</label>
          <input
            type="text"
            className="field-input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <div className="data-table-wrap">
        <table className="data-table min-w-[700px]">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Laboratorio</th>
              <th className="text-right">Stock actual</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-4 text-center">Cargando...</td></tr>
            ) : productos.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">No hay productos registrados</td></tr>
            ) : (
              productos.map((producto) => (
                <tr key={producto.id}>
                  <td className="font-semibold text-[var(--color-primary)]">{producto.nombre}</td>
                  <td>{producto.laboratorio}</td>
                  <td className="text-right">
                    <span className={`font-['var(--font-heading)'] text-2xl font-bold ${producto.stock < 0 ? 'text-red-600' : 'text-gray-800'}`}>
                      {producto.stock}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center justify-center gap-4 text-sm">
                      <Link to={`/productos/${producto.id}`} className="table-link">Ver historial</Link>
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(producto.id)}
                          className="table-danger cursor-pointer"
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

      <div className="flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
        <div>Mostrando {productos.length} de {total} registros</div>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="toolbar-button cursor-pointer disabled:opacity-50">
            Anterior
          </button>
          <button disabled={productos.length < limit} onClick={() => setPage((prev) => prev + 1)} className="toolbar-button cursor-pointer disabled:opacity-50">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductosPage;
