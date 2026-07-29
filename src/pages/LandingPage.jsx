import React from 'react';
import { Link } from 'react-router-dom';
import TermopharmaLogo from '../components/TermopharmaLogo';
import './LandingPage.css';

const operationAreas = [
  'Stock y lotes',
  'Ingresos',
  'Egresos',
  'Remitos',
  'Proveedores',
  'Clientes',
  'Ordenes de compra',
  'Presupuestos',
  'Documentacion',
  'Evaluaciones'
];

const previewRows = [
  { area: 'Lote', detail: 'Seguimiento activo', status: 'Vto. 45 dias' },
  { area: 'Remito', detail: 'Pendiente de control', status: 'Interno' },
  { area: 'Proveedor', detail: 'Documentacion apta', status: 'Vigente' },
  { area: 'Ingreso', detail: 'Movimiento registrado', status: 'Trazable' }
];

const LandingPage = () => {
  return (
    <main className="fm-page">
      <header className="fm-nav">
        <a className="fm-brand" href="/" aria-label="Farmami">
          <img src="/farmami-logo.svg" alt="Farmami" />
        </a>

        <nav className="fm-nav-links" aria-label="Navegacion publica">
          <a href="#alcance">Alcance</a>
          <a href="#termopharma">Termopharma</a>
          <Link to="/login" className="fm-nav-login">Acceso privado</Link>
        </nav>
      </header>

      <section className="fm-hero" aria-labelledby="fm-hero-title">
        <div className="fm-hero-copy">
          <p className="fm-eyebrow">Gestion interna para droguerias</p>
          <h1 id="fm-hero-title">Sistema privado para operaciones de drogueria.</h1>
          <p className="fm-lede">
            Farmami organiza stock, lotes, documentacion, proveedores, clientes y movimientos
            vinculados a la distribucion de medicamentos.
          </p>

          <div className="fm-actions">
            <Link to="/login" className="fm-button fm-button-primary">Acceso privado</Link>
            <a href="#alcance" className="fm-button fm-button-secondary">Ver alcance</a>
          </div>

          <p className="fm-usage-note">
            Actualmente utilizado por Termopharma DGroup en procesos reales de inventario,
            remitos, documentacion y control operativo.
          </p>
        </div>

        <div className="fm-preview" aria-label="Representacion abstracta del sistema Farmami">
          <div className="fm-preview-panel">
            <div className="fm-preview-topbar">
              <span />
              <span />
              <span />
              <strong>Farmami</strong>
            </div>

            <div className="fm-preview-body">
              <aside className="fm-preview-menu" aria-hidden="true">
                <span className="is-active">Inventario</span>
                <span>Movimientos</span>
                <span>Remitos</span>
                <span>Documentacion</span>
              </aside>

              <div className="fm-preview-content">
                <div className="fm-preview-heading">
                  <div>
                    <span>Control operativo</span>
                    <strong>Lotes y movimientos</strong>
                  </div>
                  <em>Acceso autorizado</em>
                </div>

                <div className="fm-preview-cards">
                  <article>
                    <span>Stock</span>
                    <strong>Ordenado</strong>
                  </article>
                  <article>
                    <span>Docs.</span>
                    <strong>Aptas</strong>
                  </article>
                  <article>
                    <span>Alertas</span>
                    <strong>Revisar</strong>
                  </article>
                </div>

                <div className="fm-preview-table">
                  {previewRows.map((row) => (
                    <div className="fm-preview-row" key={`${row.area}-${row.detail}`}>
                      <span>{row.area}</span>
                      <strong>{row.detail}</strong>
                      <em>{row.status}</em>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="alcance" className="fm-section fm-scope" aria-labelledby="fm-scope-title">
        <div className="fm-section-heading">
          <p className="fm-eyebrow">Alcance operativo</p>
          <h2 id="fm-scope-title">Herramientas para ordenar el trabajo diario.</h2>
        </div>

        <div className="fm-scope-grid">
          {operationAreas.map((area) => (
            <article className="fm-scope-item" key={area}>
              <span aria-hidden="true" />
              <h3>{area}</h3>
            </article>
          ))}
        </div>
      </section>

      <section id="termopharma" className="fm-section fm-client" aria-labelledby="fm-client-title">
        <div className="fm-client-card">
          <div className="fm-client-logo">
            <TermopharmaLogo compact />
          </div>
          <div className="fm-client-copy">
            <p className="fm-eyebrow">Implementacion activa</p>
            <h2 id="fm-client-title">Termopharma DGroup utiliza Farmami en operacion real.</h2>
            <p>
              La plataforma acompana procesos internos de inventario, documentacion, remitos
              y control operativo dentro de un entorno de distribucion de medicamentos.
            </p>
          </div>
        </div>
      </section>

      <section className="fm-access" aria-labelledby="fm-access-title">
        <div>
          <p className="fm-eyebrow">Acceso restringido</p>
          <h2 id="fm-access-title">Disponible solo para usuarios autorizados.</h2>
        </div>
        <Link to="/login" className="fm-button fm-button-primary">Entrar al sistema</Link>
      </section>
    </main>
  );
};

export default LandingPage;
