import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { CAMPOS_EVALUACION_PROVEEDOR, getEvaluacionResult } from '../../lib/fase2';
import { formatDateDisplay } from '../../lib/date';

const ProveedorDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proveedor, setProveedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvaluationId, setSelectedEvaluationId] = useState(null);

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const { data } = await api.get(`/api/proveedores/${id}`);
        setProveedor(data);
        setSelectedEvaluationId(data.evaluaciones?.[0]?.id || null);
      } catch (error) {
        toast.error('No se pudo cargar el proveedor');
        navigate('/proveedores');
      } finally {
        setLoading(false);
      }
    };

    fetchProveedor();
  }, [id, navigate]);

  if (loading) return <div className="font-['var(--font-body)']">Cargando...</div>;
  if (!proveedor) return null;

  const selectedEvaluation = proveedor.evaluaciones?.find((item) => item.id === selectedEvaluationId) || null;

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['var(--font-heading)'] text-3xl font-bold text-[var(--color-primary)]">{proveedor.nombre}</h1>
          <p className="text-sm text-gray-500">{proveedor.numero} TIPO {proveedor.tipo}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/proveedores" className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50">Volver</Link>
          <Link to={`/proveedores/${id}/editar`} className="rounded border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50">Editar</Link>
          <Link to={`/proveedores/${id}/evaluaciones/nueva`} className="rounded bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">Nueva evaluacion</Link>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-2 xl:grid-cols-3">
        <div><span className="block text-xs font-bold uppercase text-gray-500">Direccion</span>{proveedor.direccion || '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">CUIT</span>{proveedor.cuit || '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">GLN</span>{proveedor.gln || '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Contacto</span>{proveedor.nombre_contacto || '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Telefono</span>{proveedor.telefono_contacto || '-'}</div>
        <div><span className="block text-xs font-bold uppercase text-gray-500">Producto / servicio</span>{proveedor.producto_o_servicio || '-'}</div>
        <div className="xl:col-span-2"><span className="block text-xs font-bold uppercase text-gray-500">Observaciones</span>{proveedor.observaciones || '-'}</div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Estado documental</h2>
          <div className="grid grid-cols-1 gap-2">
            {CAMPOS_EVALUACION_PROVEEDOR.map(([key, label]) => (
              <div key={key} className="flex items-center justify-between rounded border border-gray-100 px-3 py-2 text-sm">
                <span>{label}</span>
                <span className={`font-semibold ${proveedor[key] ? 'text-green-700' : 'text-red-700'}`}>
                  {proveedor[key] ? 'Si' : 'No'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Historial de evaluaciones</h2>
          {proveedor.evaluaciones?.length ? (
            <div className="space-y-3">
              {proveedor.evaluaciones.map((evaluacion) => (
                <button
                  key={evaluacion.id}
                  type="button"
                  onClick={() => setSelectedEvaluationId(evaluacion.id)}
                  className={`w-full rounded border p-4 text-left ${selectedEvaluationId === evaluacion.id ? 'border-[var(--color-primary)] bg-gray-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-semibold text-[var(--color-primary)]">{evaluacion.numero_evaluacion}</div>
                      <div className="text-xs text-gray-500">{formatDateDisplay(evaluacion.fecha)}</div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${getEvaluacionResult(evaluacion, CAMPOS_EVALUACION_PROVEEDOR) === 'APTO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {getEvaluacionResult(evaluacion, CAMPOS_EVALUACION_PROVEEDOR)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Todavia no hay evaluaciones cargadas.</p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Detalle de evaluacion</h2>
        {selectedEvaluation ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-[var(--color-primary)]">{selectedEvaluation.numero_evaluacion}</div>
                <div className="text-sm text-gray-500">{formatDateDisplay(selectedEvaluation.fecha)}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${getEvaluacionResult(selectedEvaluation, CAMPOS_EVALUACION_PROVEEDOR) === 'APTO' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {getEvaluacionResult(selectedEvaluation, CAMPOS_EVALUACION_PROVEEDOR)}
                </span>
                <Link to={`/proveedores/${id}/evaluaciones/${selectedEvaluation.id}/editar`} className="rounded border border-gray-300 px-3 py-1 text-xs font-semibold hover:bg-gray-50">
                  Editar evaluacion
                </Link>
              </div>
            </div>
            {CAMPOS_EVALUACION_PROVEEDOR.map(([key, label]) => (
              <div key={key} className="flex items-center justify-between rounded border border-gray-100 px-3 py-2 text-sm">
                <span>{label}</span>
                <span className={`font-semibold ${selectedEvaluation[key] === 'APTO' ? 'text-green-700' : 'text-red-700'}`}>
                  {selectedEvaluation[key] === 'APTO' ? 'APTO' : 'NO APTO'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">Selecciona una evaluacion para ver el detalle.</p>
        )}
      </section>
    </div>
  );
};

export default ProveedorDetallePage;
