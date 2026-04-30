import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { handleFormInvalid } from '../../lib/validation';
import ProductAutocomplete from '../../components/ProductAutocomplete';
import ProveedorAutocomplete from '../../components/ProveedorAutocomplete';
import { getTodayDateInputValue } from '../../lib/date';

const NuevoIngresoPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_id: '',
    fecha_ingreso: getTodayDateInputValue(),
    nro_remito: '',
    lote: '',
    vencimiento: '',
    proveedor_id: '',
    cadena_frio: false,
    cantidad: '',
    observaciones: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.product_id) {
      toast.error("Por favor, seleccione un producto.");
      return;
    }
    if (!formData.proveedor_id) {
      toast.error("Por favor, seleccione un proveedor.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        fecha_ingreso: formData.fecha_ingreso,
        vencimiento: formData.vencimiento,
        cantidad: parseInt(formData.cantidad, 10)
      };
      await api.post('/api/ingresos', payload);
      navigate('/ingresos');
    } catch (err) {
      toast.error(err.response?.data?.error || "Error al crear ingreso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-['var(--font-body)']">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-['var(--font-heading)'] text-[var(--color-primary)]">Nuevo Ingreso</h1>
        <Link to="/ingresos" className="text-gray-500 hover:underline">Volver a lista</Link>
      </div>

      <form onSubmit={handleSubmit} onInvalid={handleFormInvalid} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Producto *</label>
            <ProductAutocomplete
              value={formData.product_id}
              onChange={(id) => setFormData({ ...formData, product_id: id })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fecha de Ingreso *</label>
            <input required type="date" name="fecha_ingreso" value={formData.fecha_ingreso} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">NRO de Remito</label>
            <input type="text" name="nro_remito" value={formData.nro_remito} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Lote *</label>
            <input required type="text" name="lote" value={formData.lote} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Vencimiento *</label>
            <input required type="date" name="vencimiento" value={formData.vencimiento} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Proveedor *</label>
            <ProveedorAutocomplete
              value={formData.proveedor_id}
              onChange={(proveedorId) => setFormData((prev) => ({ ...prev, proveedor_id: proveedorId }))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cantidad *</label>
            <input required type="number" min="1" name="cantidad" value={formData.cantidad} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[var(--color-primary)] outline-none" />
          </div>

          <div className="flex items-center pt-6">
            <input type="checkbox" id="cadena" name="cadena_frio" checked={formData.cadena_frio} onChange={handleChange} className="w-4 h-4 text-[var(--color-primary)] cursor-pointer" />
            <label htmlFor="cadena" className="ml-2 text-sm font-medium text-gray-700 cursor-pointer">Requiere Cadena de Frío</label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows="3" className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-[var(--color-primary)] outline-none"></textarea>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-2">
          <Link to="/ingresos" className="px-6 py-2 border border-gray-300 rounded font-semibold hover:bg-gray-50 cursor-pointer">Cancelar</Link>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-[var(--color-primary)] text-white rounded font-semibold disabled:opacity-50 cursor-pointer">
            {loading ? 'Guardando...' : 'Guardar Ingreso'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NuevoIngresoPage;
