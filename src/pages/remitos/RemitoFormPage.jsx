import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import ClienteAutocomplete from '../../components/ClienteAutocomplete';
import DateField from '../../components/DateField';
import ProductAutocomplete from '../../components/ProductAutocomplete';
import StockWarningModal from '../../components/StockWarningModal';
import { getTodayDateInputValue } from '../../lib/date';

const createEmptyItem = () => ({
  product_id: '',
  descripcion: '',
  cantidad: '',
  lote: '',
  vencimiento: ''
});

const RemitoFormPage = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [showWarnings, setShowWarnings] = useState(false);
  const [warningItems, setWarningItems] = useState([]);
  const [formData, setFormData] = useState({
    fecha: getTodayDateInputValue(),
    hora: '12:00',
    cliente_id: '',
    estado: 'Pendiente',
    items: [createEmptyItem()]
  });

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      ))
    }));
  };

  const handleProductSelect = (index, product) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) => (
        itemIndex === index
          ? {
              ...item,
              product_id: product.id,
              descripcion: product.nombre
            }
          : item
      ))
    }));
  };

  const submit = async (force = false) => {
    if (!formData.cliente_id) {
      toast.error('Selecciona un cliente');
      return;
    }

    if (formData.items.some((item) => !item.product_id || !item.descripcion || !item.cantidad || !item.lote || !item.vencimiento)) {
      toast.error('Completa todos los campos de los items');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        fecha: formData.fecha,
        force,
        items: formData.items.map((item) => ({
          ...item,
          cantidad: parseInt(item.cantidad, 10),
          vencimiento: item.vencimiento
        }))
      };

      const { data } = await api.post('/api/remitos', payload);
      toast.success('Remito creado');
      navigate(`/remitos/${data.id}`);
    } catch (error) {
      if (error.response?.data?.warning === 'stock_negativo') {
        setWarningItems(error.response.data.stock_warnings || []);
        setShowWarnings(true);
      } else {
        toast.error(error.response?.data?.error || 'Error al crear remito');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 font-['var(--font-body)']">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">Nuevo remito</h1>
          <p className="text-sm text-gray-500">Cliente, fecha y carga dinamica de items con validacion de stock.</p>
        </div>
        <Link to="/remitos" className="text-sm text-gray-500 hover:underline">Volver</Link>
      </div>

      <div className="space-y-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Fecha *</label>
            <DateField value={formData.fecha} onChange={(value) => setFormData((prev) => ({ ...prev, fecha: value }))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Hora *</label>
            <input type="time" value={formData.hora} onChange={(event) => setFormData((prev) => ({ ...prev, hora: event.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Estado *</label>
            <select value={formData.estado} onChange={(event) => setFormData((prev) => ({ ...prev, estado: event.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]">
              <option value="Pendiente">Pendiente</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="mb-1 block text-sm font-medium">Cliente *</label>
            <ClienteAutocomplete value={formData.cliente_id} onChange={(clienteId) => setFormData((prev) => ({ ...prev, cliente_id: clienteId }))} />
          </div>
        </div>

        <section className="space-y-4 border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Items</h2>
              <p className="text-sm text-gray-500">Cada fila genera un egreso asociado al remito.</p>
            </div>
            <button type="button" onClick={() => setFormData((prev) => ({ ...prev, items: [...prev.items, createEmptyItem()] }))} className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50">
              Agregar item
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={`item-${index}`} className="grid gap-4 rounded border border-gray-100 p-4 lg:grid-cols-[1.8fr_110px_160px_160px_56px]">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Producto</label>
                  <ProductAutocomplete
                    value={item.product_id}
                    onChange={(productId) => handleItemChange(index, 'product_id', productId)}
                    onSelectProduct={(product) => handleProductSelect(index, product)}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Cantidad</label>
                  <input type="number" min="1" value={item.cantidad} onChange={(event) => handleItemChange(index, 'cantidad', event.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Lote</label>
                  <input value={item.lote} onChange={(event) => handleItemChange(index, 'lote', event.target.value)} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-500">Vencimiento</label>
                  <DateField value={item.vencimiento} onChange={(value) => handleItemChange(index, 'vencimiento', value)} />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.items.length === 1) return;
                      setFormData((prev) => ({ ...prev, items: prev.items.filter((_, itemIndex) => itemIndex !== index) }));
                    }}
                    className="w-full rounded border border-red-200 px-3 py-2 text-sm font-semibold text-[var(--color-action)] hover:bg-red-50"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <Link to="/remitos" className="rounded border border-gray-300 px-6 py-2 font-semibold hover:bg-gray-50">Cancelar</Link>
          <button type="button" onClick={() => submit(false)} disabled={saving} className="rounded bg-[var(--color-primary)] px-6 py-2 font-semibold text-white disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar remito'}
          </button>
        </div>
      </div>

      <StockWarningModal
        open={showWarnings}
        description="Uno o mas productos quedarian con stock en negativo si emitis este remito."
        warnings={warningItems}
        onClose={() => setShowWarnings(false)}
        onConfirm={() => {
          setShowWarnings(false);
          submit(true);
        }}
      />
    </div>
  );
};

export default RemitoFormPage;
