import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import DateField from '../../components/DateField';
import ClienteAutocomplete from '../../components/ClienteAutocomplete';
import PresupuestoItemsEditor from '../../components/presupuestos/PresupuestoItemsEditor';
import PresupuestoTipoModal from '../../components/presupuestos/PresupuestoTipoModal';
import { handleFormInvalid } from '../../lib/validation';
import { formatDateInputValue, getTodayDateInputValue } from '../../lib/date';

const createEmptyItem = () => ({
  descripcion: '',
  cantidad: '',
  precio_unitario: ''
});

const EMPTY_FORM = {
  numero: '',
  fecha: '',
  cliente_tipo: '',
  cliente_id: '',
  cliente_nombre: '',
  cliente_direccion: '',
  cliente_contacto: '',
  cliente_localidad: '',
  cliente_gln: '',
  forma_entrega: '',
  condicion_pago: '',
  mantenimiento_oferta: '',
  observaciones: '',
  items: [createEmptyItem()]
};

const CLIENTE_TYPE_LABELS = {
  NUEVO: 'Cliente nuevo',
  EXISTENTE: 'Cliente existente'
};

const PresupuestoFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [showTipoModal, setShowTipoModal] = useState(!isEditing);
  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
    fecha: getTodayDateInputValue()
  });

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    const fetchPresupuesto = async () => {
      try {
        const { data } = await api.get(`/api/presupuestos/${id}`);
        setFormData({
          numero: data.numero,
          fecha: formatDateInputValue(data.fecha),
          cliente_tipo: data.cliente_tipo,
          cliente_id: data.cliente_id || '',
          cliente_nombre: data.cliente_nombre || '',
          cliente_direccion: data.cliente_direccion || '',
          cliente_contacto: data.cliente_contacto || '',
          cliente_localidad: data.cliente_localidad || '',
          cliente_gln: data.cliente_gln || '',
          forma_entrega: data.forma_entrega || '',
          condicion_pago: data.condicion_pago || '',
          mantenimiento_oferta: data.mantenimiento_oferta || '',
          observaciones: data.observaciones || '',
          items: data.items.map((item) => ({
            descripcion: item.descripcion,
            cantidad: String(item.cantidad),
            precio_unitario: String(item.precio_unitario)
          }))
        });
      } catch (error) {
        toast.error('No se pudo cargar el presupuesto');
        navigate('/presupuestos');
      } finally {
        setLoading(false);
      }
    };

    fetchPresupuesto();
  }, [id, isEditing, navigate]);

  const importeTotal = useMemo(() => (
    formData.items.reduce((total, item) => total + (Number(item.cantidad || 0) * Number(item.precio_unitario || 0)), 0)
  ), [formData.items]);

  const applyClienteTipo = (tipo) => {
    setFormData((prev) => ({
      ...prev,
      cliente_tipo: tipo,
      cliente_id: tipo === 'EXISTENTE' ? prev.cliente_id : '',
      cliente_nombre: tipo === 'NUEVO' ? prev.cliente_nombre : '',
      cliente_direccion: tipo === 'NUEVO' ? prev.cliente_direccion : '',
      cliente_contacto: tipo === 'NUEVO' ? prev.cliente_contacto : '',
      cliente_localidad: tipo === 'NUEVO' ? prev.cliente_localidad : '',
      cliente_gln: tipo === 'NUEVO' ? prev.cliente_gln : ''
    }));
    setShowTipoModal(false);
  };

  const handleExistingClientChange = async (clienteId) => {
    setFormData((prev) => ({
      ...prev,
      cliente_id: clienteId
    }));

    if (!clienteId) {
      setFormData((prev) => ({
        ...prev,
        cliente_id: '',
        cliente_nombre: '',
        cliente_direccion: '',
        cliente_contacto: '',
        cliente_localidad: '',
        cliente_gln: ''
      }));
      return;
    }

    try {
      const { data } = await api.get(`/api/clientes/${clienteId}`);
      setFormData((prev) => ({
        ...prev,
        cliente_id: clienteId,
        cliente_nombre: data.nombre || '',
        cliente_direccion: data.direccion || '',
        cliente_contacto: data.contacto || '',
        cliente_localidad: data.localidad || '',
        cliente_gln: data.gln || ''
      }));
    } catch (error) {
      toast.error('No se pudo cargar el cliente seleccionado');
    }
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

    if (!formData.fecha) {
      toast.error('Selecciona una fecha');
      return;
    }

    if (!formData.cliente_tipo) {
      toast.error('Selecciona el tipo de cliente');
      setShowTipoModal(true);
      return;
    }

    if (formData.cliente_tipo === 'EXISTENTE' && !formData.cliente_id) {
      toast.error('Selecciona un cliente existente');
      return;
    }

    if (formData.cliente_tipo === 'NUEVO' && !formData.cliente_nombre.trim()) {
      toast.error('Ingresa el nombre o entidad');
      return;
    }

    if (formData.items.length === 0 || formData.items.some((item) => !item.descripcion || !item.cantidad || !item.precio_unitario)) {
      toast.error('Completa todos los campos de los items');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fecha: formData.fecha,
        cliente_tipo: formData.cliente_tipo,
        cliente_id: formData.cliente_tipo === 'EXISTENTE' ? formData.cliente_id : null,
        cliente_nombre: formData.cliente_nombre,
        cliente_direccion: formData.cliente_direccion || null,
        cliente_contacto: formData.cliente_contacto || null,
        cliente_localidad: formData.cliente_localidad || null,
        cliente_gln: formData.cliente_gln || null,
        forma_entrega: formData.forma_entrega || null,
        condicion_pago: formData.condicion_pago || null,
        mantenimiento_oferta: formData.mantenimiento_oferta || null,
        observaciones: formData.observaciones || null,
        items: formData.items.map((item) => ({
          descripcion: item.descripcion,
          cantidad: parseInt(item.cantidad, 10),
          precio_unitario: parseFloat(item.precio_unitario)
        }))
      };

      if (isEditing) {
        await api.patch(`/api/presupuestos/${id}`, payload);
        toast.success('Presupuesto actualizado');
        navigate(`/presupuestos/${id}`);
      } else {
        const { data } = await api.post('/api/presupuestos', payload);
        toast.success('Presupuesto creado');
        navigate(`/presupuestos/${data.id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error al guardar presupuesto');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="font-['var(--font-body)']">Cargando...</div>;

  return (
    <>
      <PresupuestoTipoModal
        open={showTipoModal}
        onSelect={applyClienteTipo}
        onCancel={() => navigate('/presupuestos')}
      />

      <div className="mx-auto max-w-6xl space-y-6 font-['var(--font-body)']">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">
              {isEditing ? 'Editar presupuesto' : 'Nuevo presupuesto'}
            </h1>
            <p className="text-sm text-gray-500">Carga un presupuesto para un cliente nuevo o para un cliente ya registrado.</p>
          </div>
          <Link to={isEditing ? `/presupuestos/${id}` : '/presupuestos'} className="text-sm text-gray-500 hover:underline">Volver</Link>
        </div>

        <form onSubmit={handleSubmit} onInvalid={handleFormInvalid} className="space-y-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Cabecera</p>
                <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Datos del presupuesto</h2>
              </div>
              <div className="flex rounded-2xl border border-gray-200 bg-gray-50 p-1">
                {Object.entries(CLIENTE_TYPE_LABELS).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => applyClienteTipo(value)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      formData.cliente_tipo === value
                        ? 'bg-white text-[var(--color-primary)] shadow-sm'
                        : 'text-gray-500 hover:text-[var(--color-primary)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Numero</label>
                <input value={formData.numero || 'Se generara al guardar'} readOnly className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Fecha *</label>
                <DateField value={formData.fecha} onChange={(value) => setFormData((prev) => ({ ...prev, fecha: value }))} required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tipo</label>
                <input value={CLIENTE_TYPE_LABELS[formData.cliente_tipo] || '-'} readOnly className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 outline-none" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Importe total</label>
                <input
                  value={new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(importeTotal)}
                  readOnly
                  className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 outline-none"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 border-t border-gray-100 pt-6">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Destinatario</p>
              <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">
                {formData.cliente_tipo === 'EXISTENTE' ? 'Cliente seleccionado' : 'Datos del cliente'}
              </h2>
            </div>

            {formData.cliente_tipo === 'EXISTENTE' ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium">Cliente *</label>
                  <ClienteAutocomplete value={formData.cliente_id} onChange={handleExistingClientChange} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Nombre</label>
                  <input value={formData.cliente_nombre} readOnly className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Contacto</label>
                  <input value={formData.cliente_contacto} readOnly className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Localidad</label>
                  <input value={formData.cliente_localidad} readOnly className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">GLN</label>
                  <input value={formData.cliente_gln} readOnly className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 outline-none" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Direccion</label>
                  <input value={formData.cliente_direccion} readOnly className="w-full rounded border border-gray-200 bg-gray-50 px-3 py-2 outline-none" />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium">Nombre o entidad *</label>
                  <input
                    required={formData.cliente_tipo === 'NUEVO'}
                    value={formData.cliente_nombre}
                    onChange={(event) => setFormData((prev) => ({ ...prev, cliente_nombre: event.target.value }))}
                    className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Contacto</label>
                  <input
                    value={formData.cliente_contacto}
                    onChange={(event) => setFormData((prev) => ({ ...prev, cliente_contacto: event.target.value }))}
                    className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Localidad</label>
                  <input
                    value={formData.cliente_localidad}
                    onChange={(event) => setFormData((prev) => ({ ...prev, cliente_localidad: event.target.value }))}
                    className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">GLN</label>
                  <input
                    value={formData.cliente_gln}
                    onChange={(event) => setFormData((prev) => ({ ...prev, cliente_gln: event.target.value }))}
                    className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium">Direccion</label>
                  <input
                    value={formData.cliente_direccion}
                    onChange={(event) => setFormData((prev) => ({ ...prev, cliente_direccion: event.target.value }))}
                    className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>
            )}
          </section>

          <PresupuestoItemsEditor
            items={formData.items}
            onAddItem={handleAddItem}
            onChangeItem={handleItemChange}
            onRemoveItem={handleRemoveItem}
            importeTotal={importeTotal}
          />

          <section className="space-y-4 border-t border-gray-100 pt-6">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Condiciones</p>
              <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Datos de entrega y pago</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Forma de entrega</label>
                <input
                  value={formData.forma_entrega}
                  onChange={(event) => setFormData((prev) => ({ ...prev, forma_entrega: event.target.value }))}
                  className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Condicion de pago</label>
                <input
                  value={formData.condicion_pago}
                  onChange={(event) => setFormData((prev) => ({ ...prev, condicion_pago: event.target.value }))}
                  className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Mantenimiento de oferta</label>
                <input
                  value={formData.mantenimiento_oferta}
                  onChange={(event) => setFormData((prev) => ({ ...prev, mantenimiento_oferta: event.target.value }))}
                  className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>
          </section>

          <section className="space-y-3 border-t border-gray-100 pt-6">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Cierre</p>
              <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Observaciones</h2>
            </div>
            <textarea
              rows="4"
              value={formData.observaciones}
              onChange={(event) => setFormData((prev) => ({ ...prev, observaciones: event.target.value }))}
              className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]"
              placeholder="Condiciones, notas comerciales o aclaraciones del presupuesto..."
            />
          </section>

          <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
            <Link to={isEditing ? `/presupuestos/${id}` : '/presupuestos'} className="rounded border border-gray-300 px-6 py-2 font-semibold hover:bg-gray-50">Cancelar</Link>
            <button type="submit" disabled={saving} className="rounded bg-[var(--color-primary)] px-6 py-2 font-semibold text-white disabled:opacity-50">
              {saving ? 'Guardando...' : 'Guardar presupuesto'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default PresupuestoFormPage;
