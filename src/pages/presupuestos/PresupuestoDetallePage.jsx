import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../lib/axios';
import { confirmToast } from '../../lib/confirmToast';
import { formatDateDisplay } from '../../lib/date';

const formatMoney = (value) => new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS'
}).format(Number(value || 0));

const PresupuestoDetallePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [presupuesto, setPresupuesto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    const fetchPresupuesto = async () => {
      try {
        const { data } = await api.get(`/api/presupuestos/${id}`);
        setPresupuesto(data);
      } catch (error) {
        toast.error('No se pudo cargar el presupuesto');
        navigate('/presupuestos');
      } finally {
        setLoading(false);
      }
    };

    fetchPresupuesto();
  }, [id, navigate]);

  const handlePdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const response = await api.get(`/api/presupuestos/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      toast.error('No se pudo generar el PDF');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await confirmToast({
      title: 'Eliminar presupuesto',
      description: 'El registro quedara desactivado logicamente.',
      confirmLabel: 'Eliminar'
    });

    if (!confirmed) return;

    try {
      await api.delete(`/api/presupuestos/${id}`);
      toast.success('Presupuesto eliminado');
      navigate('/presupuestos');
    } catch (error) {
      toast.error('No se pudo eliminar el presupuesto');
    }
  };

  if (loading) return <div className="font-['var(--font-body)']">Cargando...</div>;
  if (!presupuesto) return null;

  return (
    <div className="space-y-6 font-['var(--font-body)']">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Presupuesto</p>
          <h1 className="section-title">Presupuesto {presupuesto.numero}</h1>
          <p className="section-subtitle mt-2">Emitido el {formatDateDisplay(presupuesto.fecha)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handlePdf} disabled={isGeneratingPdf} className="toolbar-button disabled:opacity-60">
            {isGeneratingPdf ? 'Generando PDF...' : 'Generar PDF'}
          </button>
          <Link to={`/presupuestos/${id}/editar`} className="secondary-button">Editar</Link>
          <button type="button" onClick={handleDelete} className="danger-button">Eliminar</button>
        </div>
      </div>

      <section className="panel p-6">
        <div className="mb-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Cliente</p>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Datos del cliente</h2>
        </div>
        <div className="detail-grid md:grid-cols-2 xl:grid-cols-4">
          <div className="detail-item"><span className="detail-item-label">Numero</span>{presupuesto.numero}</div>
          <div className="detail-item"><span className="detail-item-label">Fecha</span>{formatDateDisplay(presupuesto.fecha)}</div>
          <div className="detail-item"><span className="detail-item-label">Tipo</span>{presupuesto.cliente_tipo === 'EXISTENTE' ? 'Cliente existente' : 'Cliente nuevo'}</div>
          <div className="detail-item"><span className="detail-item-label">Items</span>{presupuesto.items_count}</div>
          <div className="detail-item xl:col-span-2"><span className="detail-item-label">Nombre / entidad</span>{presupuesto.cliente_nombre}</div>
          <div className="detail-item"><span className="detail-item-label">Contacto</span>{presupuesto.cliente_contacto || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">Localidad</span>{presupuesto.cliente_localidad || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">GLN</span>{presupuesto.cliente_gln || '-'}</div>
          <div className="detail-item xl:col-span-3"><span className="detail-item-label">Direccion</span>{presupuesto.cliente_direccion || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">Total</span>{formatMoney(presupuesto.importe_total)}</div>
          {presupuesto.cliente_id ? (
            <div className="detail-item xl:col-span-4">
              <span className="detail-item-label">Ficha del cliente</span>
              <Link to={`/clientes/${presupuesto.cliente_id}`} className="table-link">Ver cliente</Link>
            </div>
          ) : null}
        </div>
      </section>

      <section className="panel p-6">
        <div className="mb-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Contenido</p>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Items</h2>
        </div>
        <div className="data-table-wrap !shadow-none">
          <table className="data-table min-w-[860px]">
            <thead>
              <tr>
                <th>Item</th>
                <th>Descripcion</th>
                <th>Cantidad</th>
                <th>Precio unitario</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {presupuesto.items.map((item) => (
                <tr key={item.id}>
                  <td className="font-semibold">{item.numero_item}</td>
                  <td>{item.descripcion}</td>
                  <td>{item.cantidad}</td>
                  <td>{formatMoney(item.precio_unitario)}</td>
                  <td>{formatMoney(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-6">
        <div className="mb-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Condiciones</p>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Entrega y pago</h2>
        </div>
        <div className="detail-grid md:grid-cols-2 xl:grid-cols-4">
          <div className="detail-item"><span className="detail-item-label">Forma de entrega</span>{presupuesto.forma_entrega || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">Condicion de pago</span>{presupuesto.condicion_pago || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">Mantenimiento de oferta</span>{presupuesto.mantenimiento_oferta || '-'}</div>
          <div className="detail-item"><span className="detail-item-label">Leyenda</span>Cadena de frio sin devolucion</div>
        </div>
      </section>

      <section className="panel p-6">
        <div className="mb-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Notas</p>
          <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">Observaciones</h2>
        </div>
        <p className="text-sm leading-6 text-gray-600">{presupuesto.observaciones || 'Sin observaciones cargadas.'}</p>
      </section>

      <div>
        <Link to="/presupuestos" className="ghost-link">Volver a presupuestos</Link>
      </div>
    </div>
  );
};

export default PresupuestoDetallePage;
