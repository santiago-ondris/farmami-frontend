import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { handleFormInvalid } from '../lib/validation';
import { TIPOS_PROVEEDOR } from '../lib/fase2';

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
    <div className="mx-auto max-w-5xl space-y-6 font-['var(--font-body)']">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">
            {isEditing ? 'Editar proveedor' : 'Nuevo proveedor'}
          </h1>
          <p className="text-sm text-gray-500">Datos generales, clasificacion y documentacion.</p>
        </div>
        <Link to={isEditing ? `/proveedores/${id}` : '/proveedores'} className="text-sm text-gray-500 hover:underline">Volver</Link>
      </div>

      <form onSubmit={handleSubmit} onInvalid={handleFormInvalid} className="space-y-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <section className="space-y-4">
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Datos generales</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Numero *</label>
              <input required name="numero" value={formData.numero} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Nombre *</label>
              <input required name="nombre" value={formData.nombre} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Tipo *</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]">
                {TIPOS_PROVEEDOR.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Producto o servicio</label>
              <input name="producto_o_servicio" value={formData.producto_o_servicio} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Direccion</label>
              <input name="direccion" value={formData.direccion} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">CUIT</label>
              <input name="cuit" value={formData.cuit} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">GLN</label>
              <input name="gln" value={formData.gln} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Nombre de contacto</label>
              <input name="nombre_contacto" value={formData.nombre_contacto} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Telefono de contacto</label>
              <input name="telefono_contacto" value={formData.telefono_contacto} onChange={handleChange} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium">Observaciones</label>
              <textarea name="observaciones" value={formData.observaciones} onChange={handleChange} rows="3" className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
            </div>
          </div>
        </section>

        <section className="space-y-4 border-t border-gray-100 pt-6">
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Documentacion</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {BOOLEAN_FIELDS.map(([key, label]) => (
              <label key={key} className="flex items-center gap-3 rounded border border-gray-100 px-4 py-3 text-sm">
                <input type="checkbox" name={key} checked={formData[key]} onChange={handleChange} className="h-4 w-4" />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <Link to={isEditing ? `/proveedores/${id}` : '/proveedores'} className="rounded border border-gray-300 px-6 py-2 font-semibold hover:bg-gray-50">Cancelar</Link>
          <button type="submit" disabled={saving} className="rounded bg-[var(--color-primary)] px-6 py-2 font-semibold text-white disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProveedorFormPage;
