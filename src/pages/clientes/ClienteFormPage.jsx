import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import DateField from '../../components/DateField';
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
    <div className="mx-auto max-w-5xl space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Comercial</p>
          <h1 className="section-title">{isEditing ? 'Editar cliente' : 'Nuevo cliente'}</h1>
          <p className="section-subtitle mt-2">Datos administrativos, de habilitacion y contacto.</p>
        </div>
        <Link to={isEditing ? `/clientes/${id}` : '/clientes'} className="ghost-link">
          Volver
        </Link>
      </div>

      <form onSubmit={handleSubmit} onInvalid={handleFormInvalid} className="form-shell space-y-5 p-6 sm:p-7">
        <section className="form-section space-y-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Identificacion</p>
            <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Datos principales</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="field-label">Establecimiento *</label>
              <input required name="establecimiento" value={formData.establecimiento} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="field-label">Nombre *</label>
              <input required name="nombre" value={formData.nombre} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="field-label">Direccion</label>
              <input name="direccion" value={formData.direccion} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="field-label">Localidad</label>
              <input name="localidad" value={formData.localidad} onChange={handleChange} className="field-input" />
            </div>
          </div>
        </section>

        <section className="form-section space-y-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Habilitacion</p>
            <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Datos regulatorios</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="field-label">Direccion tecnica</label>
              <input name="direccion_tecnica" value={formData.direccion_tecnica} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="field-label">Vigencia de habilitacion</label>
              <DateField value={formData.vigencia_habilitacion} onChange={(value) => setFormData((prev) => ({ ...prev, vigencia_habilitacion: value }))} />
            </div>
            <div>
              <label className="field-label">GLN</label>
              <input name="gln" value={formData.gln} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="field-label">CUIT</label>
              <input name="cuit" value={formData.cuit} onChange={handleChange} className="field-input" />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Contacto</label>
              <input name="contacto" value={formData.contacto} onChange={handleChange} className="field-input" />
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
          <Link to={isEditing ? `/clientes/${id}` : '/clientes'} className="secondary-button">
            Cancelar
          </Link>
          <button type="submit" disabled={saving} className="primary-button disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteFormPage;
