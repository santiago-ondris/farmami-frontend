import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
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
      toast.error('Seleccioná producto y proveedor');
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
    <div className="mx-auto max-w-4xl space-y-6 font-['var(--font-body)']">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">
            {isEditing ? 'Editar rechazo' : 'Nuevo rechazo'}
          </h1>
          <p className="text-sm text-gray-500">Registro de lote rechazado y motivo documentado.</p>
        </div>
        <Link to={isEditing ? `/rechazos/${id}` : '/rechazos'} className="text-sm text-gray-500 hover:underline">Volver</Link>
      </div>

      <form onSubmit={handleSubmit} onInvalid={handleFormInvalid} className="space-y-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Fecha *</label>
            <input required type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Cantidad *</label>
            <input required min="1" type="number" name="cantidad" value={formData.cantidad} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Producto *</label>
            <ProductAutocomplete value={formData.product_id} onChange={(productId) => setFormData((prev) => ({ ...prev, product_id: productId }))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Lote *</label>
            <input required name="lote" value={formData.lote} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Remito</label>
            <input name="remito" value={formData.remito} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Proveedor *</label>
            <ProveedorAutocomplete value={formData.proveedor_id} onChange={(proveedorId) => setFormData((prev) => ({ ...prev, proveedor_id: proveedorId }))} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Motivo de rechazo *</label>
            <textarea required rows="4" name="motivo_rechazo" value={formData.motivo_rechazo} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <Link to={isEditing ? `/rechazos/${id}` : '/rechazos'} className="rounded border border-gray-300 px-6 py-2 font-semibold hover:bg-gray-50">Cancelar</Link>
          <button type="submit" disabled={saving} className="rounded bg-[var(--color-primary)] px-6 py-2 font-semibold text-white disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RechazoFormPage;
