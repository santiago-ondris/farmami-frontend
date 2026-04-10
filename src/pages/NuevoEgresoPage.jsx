import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../lib/axios';
import { handleFormInvalid } from '../lib/validation';
import ProductAutocomplete from '../components/ProductAutocomplete';

const NuevoEgresoPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    fecha_entrega: new Date().toISOString().split('T')[0],
    cantidad: '',
    empresa_solicitante: '',
    lote: '',
    vencimiento: '',
    serial: '',
    orden_compra: '',
    estado_remito: 'Pendiente'
  });

  const [loteWarning, setLoteWarning] = useState(false);
  const [stockInfo, setStockInfo] = useState(null);

  const [showStockModal, setShowStockModal] = useState(false);
  const [stockResultante, setStockResultante] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const checkLote = async () => {
      if (formData.product_id && formData.lote) {
        try {
          const { data } = await api.get(`/api/ingresos?search=${formData.lote}`);
          const exists = data.data.some(i => i.product_id === formData.product_id && i.lote === formData.lote);
          setLoteWarning(!exists);
        } catch (e) { }
      } else {
        setLoteWarning(false);
      }
    };
    const tid = setTimeout(checkLote, 500);
    return () => clearTimeout(tid);
  }, [formData.product_id, formData.lote]);

  useEffect(() => {
    const fetchStock = async () => {
      if (formData.product_id) {
        try {
          const { data } = await api.get(`/api/stock/${formData.product_id}`);
          setStockInfo(data);
        } catch (e) { }
      } else {
        setStockInfo(null);
      }
    };
    fetchStock();
  }, [formData.product_id]);

  const handleSubmit = async (e, confirmNegative = false) => {
    e?.preventDefault();
    if (!formData.product_id) {
      alert("Seleccione un producto.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        fecha_entrega: new Date(formData.fecha_entrega).toISOString(),
        vencimiento: new Date(formData.vencimiento).toISOString(),
        cantidad: parseInt(formData.cantidad, 10),
        confirm_negative: confirmNegative
      };
      await api.post('/api/egresos', payload);
      navigate('/egresos');
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.warning === 'stock_negativo') {
        setStockResultante(err.response.data.stock_resultante);
        setShowStockModal(true);
      } else {
        alert(err.response?.data?.error || "Error al crear egreso");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-['var(--font-body)']">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-['var(--font-heading)'] text-[var(--color-primary)]">Nuevo Egreso</h1>
        <Link to="/egresos" className="text-gray-500 hover:underline">Volver a lista</Link>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} onInvalid={handleFormInvalid} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">

        {loteWarning && (
          <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded text-sm mb-4 font-medium">
            ⚠️ Este lote no está registrado en ningún ingreso previo de este producto. Podría ser un error de tipeo.
          </div>
        )}

        {stockInfo && formData.cantidad && (stockInfo.stock - parseInt(formData.cantidad) < 0) && (
          <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded text-sm mb-4 font-bold">
            🛑 Atención: Este egreso dejará el stock en negativo ({stockInfo.stock - parseInt(formData.cantidad)}).
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Producto *</label>
            <ProductAutocomplete
              value={formData.product_id}
              onChange={(id) => setFormData({ ...formData, product_id: id })}
            />
            {stockInfo && <div className="text-xs mt-1 font-semibold text-gray-500">Stock actual: {stockInfo.stock}</div>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Entrega *</label>
            <input required type="date" name="fecha_entrega" value={formData.fecha_entrega} onChange={handleChange} className="w-full p-2 border rounded outline-none focus:border-[var(--color-primary)]" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Empresa Solicitante *</label>
            <input required type="text" name="empresa_solicitante" value={formData.empresa_solicitante} onChange={handleChange} className="w-full p-2 border rounded outline-none focus:border-[var(--color-primary)]" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Lote *</label>
            <input required type="text" name="lote" value={formData.lote} onChange={handleChange} className={`w-full p-2 border rounded outline-none focus:border-[var(--color-primary)] ${loteWarning ? 'border-amber-400 bg-amber-50' : 'border-gray-300'}`} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vencimiento *</label>
            <input required type="date" name="vencimiento" value={formData.vencimiento} onChange={handleChange} className="w-full p-2 border rounded outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cantidad *</label>
            <input required type="number" min="1" name="cantidad" value={formData.cantidad} onChange={handleChange} className="w-full p-2 border rounded outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Estado Remito *</label>
            <select name="estado_remito" value={formData.estado_remito} onChange={handleChange} className="w-full p-2 border rounded outline-none">
              <option value="Pendiente">Pendiente</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Serial</label>
            <input type="text" name="serial" value={formData.serial} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Orden de Compra</label>
            <input type="text" name="orden_compra" value={formData.orden_compra} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
          <Link to="/egresos" className="px-6 py-2 border rounded font-semibold hover:bg-gray-50">Cancelar</Link>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[var(--color-action)] text-white rounded font-semibold disabled:opacity-50">
            {loading ? 'Guardando...' : 'Guardar Egreso'}
          </button>
        </div>
      </form>

      {showStockModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 text-center transform transition-all">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🛑</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 font-['var(--font-heading)']">Stock en Negativo</h3>
            <p className="text-gray-600 mb-6">
              Este egreso dejará el stock en negativo <strong className="text-red-600 font-bold ml-1">({stockResultante})</strong>. <br />¿Deseas continuar de todos modos?
            </p>
            <div className="space-y-3">
              <button
                onClick={() => { setShowStockModal(false); handleSubmit(null, true); }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded font-bold transition-colors cursor-pointer"
              >
                Continuar de todos modos
              </button>
              <Link
                to={`/productos/${formData.product_id}`}
                className="block w-full py-3 border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Ver historial de este artículo
              </Link>
              <button
                onClick={() => setShowStockModal(false)}
                className="w-full py-2 text-gray-500 font-semibold hover:underline cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NuevoEgresoPage;
