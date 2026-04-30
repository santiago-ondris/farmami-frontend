import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { handleFormInvalid } from '../../lib/validation';
import { formatDateInputValue } from '../../lib/date';

const EMPTY_FORM = {
  establecimiento: '',
  nombre: '',
  direccion: '',
  localidad: '',
  direccion_tecnica: '',
  vigencia_habilitacion: '',
  gln: '',
  contacto: '',
  cuit: ''
};

const ClienteFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!isEditing) return;

    const fetchCliente = async () => {
      try {
        const { data } = await api.get(`/api/clientes/${id}`);
        setFormData({
          establecimiento: data.establecimiento || '',
          nombre: data.nombre || '',
          direccion: data.direccion || '',
          localidad: data.localidad || '',
          direccion_tecnica: data.direccion_tecnica || '',
          vigencia_habilitacion: formatDateInputValue(data.vigencia_habilitacion),
          gln: data.gln || '',
          contacto: data.contacto || '',
          cuit: data.cuit || ''
        });
      } catch (error) {
        toast.error('No se pudo cargar el cliente');
        navigate('/clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id, isEditing, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        vigencia_habilitacion: formData.vigencia_habilitacion || null
      };

      if (isEditing) {
        await api.patch(`/api/clientes/${id}`, payload);
        toast.success('Cliente actualizado');
        navigate(`/clientes/${id}`);
      } else {
        const { data } = await api.post('/api/clientes', payload);
        toast.success('Cliente creado');
        navigate(`/clientes/${data.id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar cliente');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="font-['var(--font-body)']">Cargando...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 font-['var(--font-body)']">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">
            {isEditing ? 'Editar cliente' : 'Nuevo cliente'}
          </h1>
          <p className="text-sm text-gray-500">Datos administrativos, de habilitación y contacto.</p>
        </div>
        <Link to={isEditing ? `/clientes/${id}` : '/clientes'} className="text-sm text-gray-500 hover:underline">
          Volver
        </Link>
      </div>

      <form onSubmit={handleSubmit} onInvalid={handleFormInvalid} className="space-y-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Establecimiento *</label>
            <input required name="establecimiento" value={formData.establecimiento} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Nombre *</label>
            <input required name="nombre" value={formData.nombre} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Dirección</label>
            <input name="direccion" value={formData.direccion} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Localidad</label>
            <input name="localidad" value={formData.localidad} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Dirección técnica</label>
            <input name="direccion_tecnica" value={formData.direccion_tecnica} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Vigencia de habilitación</label>
            <input type="date" name="vigencia_habilitacion" value={formData.vigencia_habilitacion} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">GLN</label>
            <input name="gln" value={formData.gln} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Contacto</label>
            <input name="contacto" value={formData.contacto} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">CUIT</label>
            <input name="cuit" value={formData.cuit} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <Link to={isEditing ? `/clientes/${id}` : '/clientes'} className="rounded border border-gray-300 px-6 py-2 font-semibold hover:bg-gray-50">
            Cancelar
          </Link>
          <button type="submit" disabled={saving} className="rounded bg-[var(--color-primary)] px-6 py-2 font-semibold text-white disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteFormPage;
