import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import DateField from '../../components/DateField';
import ProductAutocomplete from '../../components/ProductAutocomplete';
import ProveedorAutocomplete from '../../components/ProveedorAutocomplete';
import { handleFormInvalid } from '../../lib/validation';
import { formatDateInputValue, getTodayDateInputValue } from '../../lib/date';

const EMPTY_FORM = {
  fecha: getTodayDateInputValue(),
  product_id: '',
  lote: '',
  motivo_rechazo: '',
  cantidad: '',
  remito: '',
  proveedor_id: ''
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
          product_id: data.product_id,
          lote: data.lote,
          motivo_rechazo: data.motivo_rechazo,
          cantidad: String(data.cantidad),
          remito: data.remito || '',
          proveedor_id: data.proveedor_id
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.product_id || !formData.proveedor_id) {
      toast.error('Selecciona producto y proveedor');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        fecha: formData.fecha,
        cantidad: parseInt(formData.cantidad, 10)
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
              <label className="field-label">Cantidad *</label>
              <input required min="1" type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} className="field-input" />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Producto *</label>
              <ProductAutocomplete value={formData.product_id} onChange={(productId) => setFormData((prev) => ({ ...prev, product_id: productId }))} />
            </div>
            <div>
              <label className="field-label">Lote *</label>
              <input required name="lote" value={formData.lote} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="field-label">Remito</label>
              <input name="remito" value={formData.remito} onChange={handleChange} className="field-input" />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Proveedor *</label>
              <ProveedorAutocomplete value={formData.proveedor_id} onChange={(proveedorId) => setFormData((prev) => ({ ...prev, proveedor_id: proveedorId }))} />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Motivo de rechazo *</label>
              <textarea required rows="4" name="motivo_rechazo" value={formData.motivo_rechazo} onChange={handleChange} className="field-input" />
            </div>
          </div>
        </section>

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
