import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { CAMPOS_EVALUACION_CLIENTE, getEvaluacionResult } from '../../lib/fase2';
import { formatDateDisplay } from '../../lib/date';

const ClienteDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState(null);

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const { data } = await api.get(`/api/clientes/${id}`);
        setCliente(data);
        setSelectedEvaluationId(data.evaluaciones?.[0]?.id || null);
      } catch (error) {
        toast.error('No se pudo cargar el cliente');
        navigate('/clientes');
      } finally {
        setLoading(false);
      }
    };

    fetchCliente();
  }, [id, navigate]);

  if (loading) return <div className="font-['var(--font-body)']">Cargando...</div>;
  if (!cliente) return null;

  const selectedEvaluation = cliente.evaluaciones?.find((item) => item.id === selectedEvaluationId) || null;

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Ficha de cliente</p>
          <h1 className="section-title">{cliente.nombre}</h1>
          <p className="section-subtitle mt-2">{cliente.establecimiento}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/clientes" className="secondary-button">Volver</Link>
          <Link to={`/clientes/${id}/editar`} className="secondary-button">Editar</Link>
          <Link to={`/clientes/${id}/evaluaciones/nueva`} className="primary-button">Nueva evaluacion</Link>
        </div>
      </div>

      <section className="panel p-6">
        <div className="mb-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Datos generales</p>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Informacion administrativa</h2>
        </div>
        <div className="detail-grid md:grid-cols-2 xl:grid-cols-3">
          <div className="detail-item"><span className="detail-item-label">Direccion</span>{cliente.direccion || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">Localidad</span>{cliente.localidad || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">Direccion tecnica</span>{cliente.direccion_tecnica || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">Vigencia habilitacion</span>{cliente.vigencia_habilitacion ? formatDateDisplay(cliente.vigencia_habilitacion) : '-'}</div>
          <div className="detail-item"><span className="detail-item-label">GLN</span>{cliente.gln || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">Contacto</span>{cliente.contacto || '-'}</div>
          <div className="detail-item md:col-span-2 xl:col-span-1"><span className="detail-item-label">CUIT</span>{cliente.cuit || '-'}</div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-6">
          <div className="mb-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Seguimiento</p>
            <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Historial de evaluaciones</h2>
            <p className="mt-2 text-sm text-gray-500">Ordenado por fecha descendente.</p>
          </div>

          {cliente.evaluaciones?.length ? (
            <div className="space-y-3">
              {cliente.evaluaciones.map((evaluacion) => {
                const result = getEvaluacionResult(evaluacion, CAMPOS_EVALUACION_CLIENTE);
                return (
                  <button
                    key={evaluacion.id}
                    type="button"
                    onClick={() => setSelectedEvaluationId(evaluacion.id)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-colors ${
                      selectedEvaluationId === evaluacion.id ? 'border-[var(--color-primary)] bg-slate-50' : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-[var(--color-primary)]">{evaluacion.numero_evaluacion}</div>
                        <div className="text-xs text-gray-500">{formatDateDisplay(evaluacion.fecha)}</div>
                      </div>
                      <span className={`status-chip ${result === 'APTO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {result}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-sm text-gray-500">
              Todavia no hay evaluaciones cargadas.
            </div>
          )}
        </div>

        <div className="panel p-6">
          <div className="mb-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Detalle</p>
            <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Evaluacion seleccionada</h2>
          </div>
          {selectedEvaluation ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-[var(--color-primary)]">{selectedEvaluation.numero_evaluacion}</div>
                  <div className="text-sm text-gray-500">{formatDateDisplay(selectedEvaluation.fecha)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`status-chip ${getEvaluacionResult(selectedEvaluation, CAMPOS_EVALUACION_CLIENTE) === 'APTO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {getEvaluacionResult(selectedEvaluation, CAMPOS_EVALUACION_CLIENTE)}
                  </span>
                  <Link to={`/clientes/${id}/evaluaciones/${selectedEvaluation.id}/editar`} className="secondary-button !px-3 !py-2 !text-xs">
                    Editar evaluacion
                  </Link>
                </div>
              </div>
              <div className="space-y-2">
                {CAMPOS_EVALUACION_CLIENTE.map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-slate-50/70 px-4 py-3 text-sm">
                    <span>{label}</span>
                    <span className={`font-semibold ${selectedEvaluation[key] === 'APTO' ? 'text-green-700' : 'text-red-700'}`}>
                      {selectedEvaluation[key] === 'APTO' ? 'APTO' : 'NO APTO'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-sm text-gray-500">
              Selecciona una evaluacion para ver el detalle.
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ClienteDetallePage;
