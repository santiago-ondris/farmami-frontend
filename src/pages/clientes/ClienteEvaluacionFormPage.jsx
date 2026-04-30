import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import AptitudToggleGroup from '../../components/AptitudToggleGroup';
import { CAMPOS_EVALUACION_CLIENTE } from '../../lib/fase2';
import { formatDateInputValue, getTodayDateInputValue } from '../../lib/date';

const buildInitialState = () => CAMPOS_EVALUACION_CLIENTE.reduce((acc, [key]) => {
  acc[key] = 'APTO';
  return acc;
}, {
  fecha: getTodayDateInputValue()
});

const ClienteEvaluacionFormPage = () => {
  const { id, evaluacionId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(evaluacionId);
  const [formData, setFormData] = useState(buildInitialState());
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    const fetchEvaluacion = async () => {
      try {
        const { data } = await api.get(`/api/evaluaciones-clientes/${evaluacionId}`);
        setFormData({
          ...buildInitialState(),
          ...data,
          fecha: formatDateInputValue(data.fecha)
        });
      } catch (error) {
        toast.error('No se pudo cargar la evaluacion');
        navigate(`/clientes/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvaluacion();
  }, [evaluacionId, id, isEditing, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        fecha: formData.fecha
      };

      if (isEditing) {
        await api.patch(`/api/evaluaciones-clientes/${evaluacionId}`, payload);
        toast.success('Evaluacion actualizada');
      } else {
        await api.post(`/api/clientes/${id}/evaluaciones`, payload);
        toast.success('Evaluacion guardada');
      }

      navigate(`/clientes/${id}`);
    } catch (error) {
      toast.error(isEditing ? 'Error al actualizar evaluacion' : 'Error al guardar evaluacion');
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
            {isEditing ? 'Editar evaluacion de cliente' : 'Nueva evaluacion de cliente'}
          </h1>
          <p className="text-sm text-gray-500">Estado apto/no apto por criterio de habilitacion y gestion.</p>
        </div>
        <Link to={`/clientes/${id}`} className="text-sm text-gray-500 hover:underline">Volver</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Fecha *</label>
            <input required type="date" value={formData.fecha} onChange={(event) => setFormData((prev) => ({ ...prev, fecha: event.target.value }))} className="w-full rounded border border-gray-300 px-3 py-2 outline-none focus:border-[var(--color-primary)]" />
          </div>
          {!isEditing && (
            <p className="text-sm text-gray-500">El numero de evaluacion se generara automaticamente al guardar.</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {CAMPOS_EVALUACION_CLIENTE.map(([key, label]) => (
            <div key={key} className="grid gap-2 rounded border border-gray-100 p-4 md:grid-cols-[1fr_280px] md:items-center">
              <div className="text-sm font-medium text-gray-700">{label}</div>
              <AptitudToggleGroup value={formData[key]} onChange={(value) => setFormData((prev) => ({ ...prev, [key]: value }))} name={key} />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <Link to={`/clientes/${id}`} className="rounded border border-gray-300 px-6 py-2 font-semibold hover:bg-gray-50">Cancelar</Link>
          <button type="submit" disabled={saving} className="rounded bg-[var(--color-primary)] px-6 py-2 font-semibold text-white disabled:opacity-50">
            {saving ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Guardar evaluacion'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClienteEvaluacionFormPage;
