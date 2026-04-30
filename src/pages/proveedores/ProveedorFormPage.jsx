import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { handleFormInvalid } from '../../lib/validation';
import { TIPOS_PROVEEDOR } from '../../lib/fase2';

const BOOLEAN_FIELDS = [
  ['habilitacion_jurisdiccion_provincial', 'Habilitacion jurisdiccion provincial'],
  ['ultima_resolucion_djf', 'Ultima resolucion DJF'],
  ['disposicion_habilitacion_anmat', 'Disposicion habilitacion ANMAT'],
  ['cert_buenas_practicas_transito', 'Certificado buenas practicas transito'],
  ['resolucion_cambio_direccion_tecnica', 'Resolucion cambio direccion tecnica'],
  ['registro_productos_anmat', 'Registro productos ANMAT'],
  ['habilitacion_municipal', 'Habilitacion municipal'],
  ['constancia_afip', 'Constancia AFIP'],
  ['documentacion_completa', 'Documentacion completa']
];

const EMPTY_FORM = {
  numero: '',
  nombre: '',
  direccion: '',
  cuit: '',
  gln: '',
  nombre_contacto: '',
  telefono_contacto: '',
  tipo: 'LABORATORIO',
  producto_o_servicio: '',
  observaciones: '',
  habilitacion_jurisdiccion_provincial: false,
  ultima_resolucion_djf: false,
  disposicion_habilitacion_anmat: false,
  cert_buenas_practicas_transito: false,
  resolucion_cambio_direccion_tecnica: false,
  registro_productos_anmat: false,
  habilitacion_municipal: false,
  constancia_afip: false,
  documentacion_completa: false
};

const ProveedorFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!isEditing) return;

    const fetchProveedor = async () => {
      try {
        const { data } = await api.get(`/api/proveedores/${id}`);
        setFormData({
          ...EMPTY_FORM,
          ...data
        });
      } catch (error) {
        toast.error('No se pudo cargar el proveedor');
        navigate('/proveedores');
      } finally {
        setLoading(false);
      }
    };

    fetchProveedor();
  }, [id, isEditing, navigate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      if (isEditing) {
        await api.patch(`/api/proveedores/${id}`, formData);
        toast.success('Proveedor actualizado');
        navigate(`/proveedores/${id}`);
      } else {
        const { data } = await api.post('/api/proveedores', formData);
        toast.success('Proveedor creado');
        navigate(`/proveedores/${data.id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar proveedor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="font-['var(--font-body)']">Cargando...</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Comercial</p>
          <h1 className="section-title">{isEditing ? 'Editar proveedor' : 'Nuevo proveedor'}</h1>
          <p className="section-subtitle mt-2">Datos generales, clasificacion y documentacion regulatoria.</p>
        </div>
        <Link to={isEditing ? `/proveedores/${id}` : '/proveedores'} className="ghost-link">Volver</Link>
      </div>

      <form onSubmit={handleSubmit} onInvalid={handleFormInvalid} className="form-shell space-y-5 p-6 sm:p-7">
        <section className="form-section space-y-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Identificacion</p>
            <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Datos generales</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="field-label">Numero *</label>
              <input required name="numero" value={formData.numero} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="field-label">Nombre *</label>
              <input required name="nombre" value={formData.nombre} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="field-label">Tipo *</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} className="field-input">
                {TIPOS_PROVEEDOR.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Producto o servicio</label>
              <input name="producto_o_servicio" value={formData.producto_o_servicio} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="field-label">Direccion</label>
              <input name="direccion" value={formData.direccion} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="field-label">CUIT</label>
              <input name="cuit" value={formData.cuit} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="field-label">GLN</label>
              <input name="gln" value={formData.gln} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="field-label">Nombre de contacto</label>
              <input name="nombre_contacto" value={formData.nombre_contacto} onChange={handleChange} className="field-input" />
            </div>
            <div>
              <label className="field-label">Telefono de contacto</label>
              <input name="telefono_contacto" value={formData.telefono_contacto} onChange={handleChange} className="field-input" />
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Observaciones</label>
              <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows="4" className="field-input" />
            </div>
          </div>
        </section>

        <section className="form-section space-y-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Control documental</p>
            <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Checklist regulatorio</h2>
            <p className="text-sm text-gray-500">Marque la documentacion disponible para la ficha del proveedor.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {BOOLEAN_FIELDS.map(([key, label]) => (
              <label key={key} className="checkbox-card flex items-center gap-3 text-sm">
                <input type="checkbox" name={key} checked={formData[key]} onChange={handleChange} className="h-4 w-4" />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:justify-end">
          <Link to={isEditing ? `/proveedores/${id}` : '/proveedores'} className="secondary-button">Cancelar</Link>
          <button type="submit" disabled={saving} className="primary-button disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProveedorFormPage;
