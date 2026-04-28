import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import { CAMPOS_EVALUACION_CLIENTE, getEvaluacionResult } from '../lib/fase2';

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">{cliente.nombre}</h1>
          <p className="text-sm text-gray-500">{cliente.establecimiento}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/clientes" className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50">
            Volver
          </Link>
          <Link to={`/clientes/${id}/editar`} className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50">
            Editar
          </Link>
          <Link to={`/clientes/${id}/evaluaciones/nueva`} className="rounded bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            Nueva evaluación
          </Link>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2 xl:grid-cols-3">
        <div><span className="block text-xs font-bold uppercase text-gray-500">Dirección</span>{cliente.direccion || '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Localidad</span>{cliente.localidad || '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Dirección técnica</span>{cliente.direccion_tecnica || '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Vigencia habilitación</span>{cliente.vigencia_habilitacion ? new Date(cliente.vigencia_habilitacion).toLocaleDateString('es-AR') : '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">GLN</span>{cliente.gln || '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Contacto</span>{cliente.contacto || '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">CUIT</span>{cliente.cuit || '-'}</div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Historial de evaluaciones</h2>
              <p className="text-sm text-gray-500">Ordenado por fecha descendente.</p>
            </div>
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
                    className={`w-full rounded border p-4 text-left ${selectedEvaluationId === evaluacion.id ? 'border-[var(--color-primary)] bg-gray-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-[var(--color-primary)]">{evaluacion.numero_evaluacion}</div>
                        <div className="text-xs text-gray-500">{new Date(evaluacion.fecha).toLocaleDateString('es-AR')}</div>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${result === 'APTO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {result}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Todavía no hay evaluaciones cargadas.</p>
          )}
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Detalle de evaluación</h2>
          {selectedEvaluation ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[var(--color-primary)]">{selectedEvaluation.numero_evaluacion}</div>
                  <div className="text-sm text-gray-500">{new Date(selectedEvaluation.fecha).toLocaleDateString('es-AR')}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${getEvaluacionResult(selectedEvaluation, CAMPOS_EVALUACION_CLIENTE) === 'APTO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {getEvaluacionResult(selectedEvaluation, CAMPOS_EVALUACION_CLIENTE)}
                  </span>
                  <Link to={`/clientes/${id}/evaluaciones/${selectedEvaluation.id}/editar`} className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold hover:bg-gray-50">
                    Editar evaluacion
                  </Link>
                </div>
              </div>
              <div className="space-y-2">
                {CAMPOS_EVALUACION_CLIENTE.map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between rounded border border-gray-100 px-3 py-2 text-sm">
                    <span>{label}</span>
                    <span className={`font-semibold ${selectedEvaluation[key] === 'APTO' ? 'text-green-700' : 'text-red-700'}`}>
                      {selectedEvaluation[key] === 'APTO' ? 'APTO' : 'NO APTO'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Seleccioná una evaluación para ver el detalle.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ClienteDetallePage;
