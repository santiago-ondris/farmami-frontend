import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import DateField from '../../components/DateField';
import RechazoItemsEditor from '../../components/rechazos/RechazoItemsEditor';
import ProveedorAutocomplete from '../../components/ProveedorAutocomplete';
import { handleFormInvalid } from '../../lib/validation';
import { formatDateInputValue, getTodayDateInputValue } from '../../lib/date';

const createEmptyItem = () => ({
  product_id: '',
  lote: '',
  cantidad: '',
  motivo_rechazo: ''
});

const EMPTY_FORM = {
  fecha: getTodayDateInputValue(),
  remito: '',
  proveedor_id: '',
  items: [createEmptyItem()]
};

const RechazoFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!isEditing) return;

    const fetchRechazo = async () => {
      try {
        const { data } = await api.get(`/api/rechazos/${id}`);
        setFormData({
          fecha: formatDateInputValue(data.fecha),
          remito: data.remito || '',
          proveedor_id: data.proveedor_id,
          items: data.items.map((item) => ({
            product_id: item.product_id,
            lote: item.lote,
            cantidad: String(item.cantidad),
            motivo_rechazo: item.motivo_rechazo
          }))
        });
      } catch (error) {
        toast.error('No se pudo cargar el rechazo');
        navigate('/rechazos');
      } finally {
        setLoading(false);
      }
    };

    fetchRechazo();
  }, [id, isEditing, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.proveedor_id) {
      toast.error('Selecciona el proveedor');
      return;
    }

    if (formData.items.length === 0 || formData.items.some(item => !item.product_id || !item.lote || !item.cantidad || !item.motivo_rechazo)) {
      toast.error('Completa todos los campos de los productos rechazados');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fecha: formData.fecha,
        remito: formData.remito || null,
        proveedor_id: formData.proveedor_id,
        items: formData.items.map((item) => ({
          product_id: item.product_id,
          lote: item.lote,
          motivo_rechazo: item.motivo_rechazo,
          cantidad: parseInt(item.cantidad, 10)
        }))
      };

      if (isEditing) {
        await api.patch(`/api/rechazos/${id}`, payload);
        toast.success('Rechazo actualizado');
        navigate(`/rechazos/${id}`);
      } else {
        const { data } = await api.post('/api/rechazos', payload);
        toast.success('Rechazo creado');
        navigate(`/rechazos/${data.id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar rechazo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="font-['var(--font-body)']">Cargando...</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Control de calidad</p>
          <h1 className="section-title">{isEditing ? 'Editar rechazo' : 'Nuevo rechazo'}</h1>
          <p className="section-subtitle mt-2">Registro de lote rechazado y motivo documentado.</p>
        </div>
        <Link to={isEditing ? `/rechazos/${id}` : '/rechazos'} className="ghost-link">Volver</Link>
      </div>

      <form onSubmit={handleSubmit} onInvalid={handleFormInvalid} className="form-shell space-y-5 p-6 sm:p-7">
        <section className="form-section space-y-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Registro base</p>
            <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Datos del rechazo</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="field-label">Fecha *</label>
              <DateField value={formData.fecha} onChange={(value) => setFormData((prev) => ({ ...prev, fecha: value }))} />
            </div>
            <div>
              <label className="field-label">Proveedor *</label>
              <ProveedorAutocomplete value={formData.proveedor_id} onChange={(proveedorId) => setFormData((prev) => ({ ...prev, proveedor_id: proveedorId }))} />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Remito</label>
              <input name="remito" value={formData.remito} onChange={handleChange} className="field-input" />
            </div>
          </div>
        </section>

        <RechazoItemsEditor
          items={formData.items}
          onAddItem={handleAddItem}
          onChangeItem={handleItemChange}
          onRemoveItem={handleRemoveItem}
        />

        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
          <Link to={isEditing ? `/rechazos/${id}` : '/rechazos'} className="secondary-button">Cancelar</Link>
          <button type="submit" disabled={saving} className="primary-button disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RechazoFormPage;
