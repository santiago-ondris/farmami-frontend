import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import ProductLotesModal from '../../components/ProductLotesModal';

const STOCK_EXPORT_FILTERS = {
  withStock: {
    title: 'Exportar solo productos con stock',
    description: 'Incluye exclusivamente productos con stock mayor a cero.'
  },
  withoutStock: {
    title: 'Exportar solo productos sin stock',
    description: 'Incluye productos sin unidades disponibles o con stock en cero.'
  },
  all: {
    title: 'Exportar todos los productos',
    description: 'No aplica filtros de stock al Excel.'
  }
};

const ProductosPage = () => {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productLotes, setProductLotes] = useState([]);
  const [loadingLotes, setLoadingLotes] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportScope, setExportScope] = useState('current');
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

  const handleExport = async (scope = 'current', stockStatus = 'all') => {
    try {
      setExporting(true);
      const params = new URLSearchParams();
      if (scope === 'current') {
        params.append('filter', 'current');
        if (search) params.append('search', search);
      }
      params.append('stock_status', stockStatus);

      const response = await api.get(`/api/export/stock?${params.toString()}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `stock_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      toast.error('Error al exportar stock');
    } finally {
      setExporting(false);
      setShowExportModal(false);
    }
  };

  const openExportModal = (scope) => {
    setExportScope(scope);
    setShowExportModal(true);
  };

  const handleOpenLotes = async (producto) => {
    setSelectedProduct(producto);
    setProductLotes([]);
    setLoadingLotes(true);

    try {
      const { data } = await api.get(`/api/products/${producto.id}/lotes`);
      setSelectedProduct(data.product);
      setProductLotes(data.lotes);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al cargar lotes');
    } finally {
      setLoadingLotes(false);
    }
  };

  const handleCloseLotes = () => {
    setSelectedProduct(null);
    setProductLotes([]);
    setLoadingLotes(false);
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
          <button onClick={() => openExportModal('current')} className="toolbar-button cursor-pointer">
            Exportar vista
          </button>
          <button onClick={() => openExportModal('all')} className="toolbar-button cursor-pointer">
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
        <table className="data-table min-w-[820px]">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Laboratorio</th>
              <th>Lotes</th>
              <th className="text-right">Stock actual</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-4 text-center">Cargando...</td></tr>
            ) : productos.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">No hay productos registrados</td></tr>
            ) : (
              productos.map((producto) => (
                <tr key={producto.id}>
                  <td className="font-semibold text-[var(--color-primary)]">{producto.nombre}</td>
                  <td>{producto.laboratorio}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleOpenLotes(producto)}
                      className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
                    >
                      Ver lotes
                    </button>
                  </td>
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

      <ProductLotesModal
        open={!!selectedProduct}
        product={selectedProduct}
        lotes={productLotes}
        loading={loadingLotes}
        onClose={handleCloseLotes}
      />

      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4" onClick={() => !exporting && setShowExportModal(false)}>
          <div
            className="w-full max-w-xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-100 bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-6 py-5 sm:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Exportacion de stock</p>
              <h3 className="mt-2 font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Elegir contenido para el Excel</h3>
              <p className="mt-2 text-sm text-slate-500">
                {exportScope === 'current'
                  ? 'El archivo respetara la busqueda actual y luego aplicara el filtro de stock que selecciones.'
                  : 'El archivo incluira todo el catalogo y luego aplicara el filtro de stock que selecciones.'}
              </p>
            </div>

            <div className="space-y-3 px-6 py-5 sm:px-8">
              {Object.entries(STOCK_EXPORT_FILTERS).map(([key, option]) => (
                <button
                  key={key}
                  type="button"
                  disabled={exporting}
                  onClick={() => handleExport(exportScope, key)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-left transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="font-semibold text-slate-900">{option.title}</div>
                  <div className="mt-1 text-sm text-slate-500">{option.description}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-end border-t border-slate-100 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                disabled={exporting}
                className="secondary-button !px-4 !py-2 !text-xs disabled:cursor-not-allowed disabled:opacity-60"
              >
                {exporting ? 'Preparando...' : 'Cancelar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductosPage;
