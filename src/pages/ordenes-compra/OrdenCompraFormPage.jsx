import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { handleFormInvalid } from '../../lib/validation';
import OrdenCompraProveedorAutocomplete from '../../components/ordenes-compra/OrdenCompraProveedorAutocomplete';
import OrdenCompraItemsEditor from '../../components/ordenes-compra/OrdenCompraItemsEditor';
import { formatDateInputValue, getTodayDateInputValue } from '../../lib/date';

const createEmptyItem = () => ({
  producto: '',
  cantidad_pedida: '',
  precio_unitario: ''
});

const EMPTY_FORM = {
  numero: '',
  fecha: '',
  proveedor_id: '',
  condicion_pago: '',
  fecha_entrega: '',
  items: [createEmptyItem()]
};

const OrdenCompraFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!isEditing) {
      setFormData((prev) => ({
        ...prev,
        fecha: getTodayDateInputValue()
      }));
      return;
    }

    const fetchOrdenCompra = async () => {
      try {
        const { data } = await api.get(`/api/ordenes-compra/${id}`);
        setFormData({
          numero: data.numero,
          fecha: formatDateInputValue(data.fecha),
          proveedor_id: data.proveedor_id,
          condicion_pago: data.condicion_pago,
          fecha_entrega: formatDateInputValue(data.fecha_entrega),
          items: data.items.map((item) => ({
            producto: item.producto,
            cantidad_pedida: String(item.cantidad_pedida),
            precio_unitario: String(item.precio_unitario)
          }))
        });
      } catch (error) {
        toast.error('No se pudo cargar la orden de compra');
        navigate('/ordenes-compra');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdenCompra();
  }, [id, isEditing, navigate]);

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      ))
    }));
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, createEmptyItem()]
    }));
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const importeTotal = formData.items.reduce((total, item) => (
    total + (Number(item.cantidad_pedida || 0) * Number(item.precio_unitario || 0))
  ), 0);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.proveedor_id) {
      toast.error('Selecciona un proveedor');
      return;
    }

    if (formData.items.length === 0 || formData.items.some((item) => !item.producto || !item.cantidad_pedida || !item.precio_unitario)) {
      toast.error('Completa todos los campos de los items');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        proveedor_id: formData.proveedor_id,
        condicion_pago: formData.condicion_pago,
        fecha_entrega: formData.fecha_entrega || null,
        items: formData.items.map((item) => ({
          producto: item.producto,
          cantidad_pedida: parseInt(item.cantidad_pedida, 10),
          precio_unitario: parseFloat(item.precio_unitario)
        }))
      };

      if (isEditing) {
        await api.patch(`/api/ordenes-compra/${id}`, payload);
        toast.success('Orden de compra actualizada');
        navigate(`/ordenes-compra/${id}`);
      } else {
        const { data } = await api.post('/api/ordenes-compra', payload);
        toast.success('Orden de compra creada');
        navigate(`/ordenes-compra/${data.id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar orden de compra');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="font-['var(--font-body)']">Cargando...</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 font-['var(--font-body)']">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">
            {isEditing ? 'Editar orden de compra' : 'Nueva orden de compra'}
          </h1>
          <p className="text-sm text-gray-500">Carga manual de proveedor, condicion de pago e items.</p>
        </div>
        <Link to={isEditing ? `/ordenes-compra/${id}` : '/ordenes-compra'} className="text-sm text-gray-500 hover:underline">Volver</Link>
      </div>

      <form onSubmit={handleSubmit} onInvalid={handleFormInvalid} className="space-y-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Numero</label>
            <input value={formData.numero || 'Se generara al guardar'} readOnly className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Fecha</label>
            <input value={formData.fecha || getTodayDateInputValue()} readOnly className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 outline-none" />
          </div>
          <div className="xl:col-span-2">
            <label className="mb-1 block text-sm font-medium">Proveedor *</label>
            <OrdenCompraProveedorAutocomplete value={formData.proveedor_id} onChange={(proveedorId) => setFormData((prev) => ({ ...prev, proveedor_id: proveedorId }))} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Condicion de pago *</label>
            <input required name="condicion_pago" value={formData.condicion_pago} onChange={(event) => setFormData((prev) => ({ ...prev, condicion_pago: event.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Fecha de entrega</label>
            <input type="date" name="fecha_entrega" value={formData.fecha_entrega} onChange={(event) => setFormData((prev) => ({ ...prev, fecha_entrega: event.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
        </div>

        <OrdenCompraItemsEditor
          items={formData.items}
          onAddItem={handleAddItem}
          onChangeItem={handleItemChange}
          onRemoveItem={handleRemoveItem}
          importeTotal={importeTotal}
        />

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <Link to={isEditing ? `/ordenes-compra/${id}` : '/ordenes-compra'} className="rounded border border-gray-300 px-6 py-2 font-semibold hover:bg-gray-50">Cancelar</Link>
          <button type="submit" disabled={saving} className="rounded bg-[var(--color-primary)] px-6 py-2 font-semibold text-white disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar orden'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrdenCompraFormPage;
