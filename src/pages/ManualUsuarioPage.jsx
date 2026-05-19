import React from 'react';
import { Link } from 'react-router-dom';
import { manualTermopharma } from '../content/manualTermopharma';

const renderSection = (section) => (
  <section key={section.heading} className="panel p-6">
    <h2 className="font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">
      {section.heading}
    </h2>

    {section.paragraphs?.map((paragraph) => (
      <p key={paragraph} className="mt-3 text-sm leading-7 text-gray-700">
        {paragraph}
      </p>
    ))}

    {section.bullets?.length ? (
      <ul className="mt-4 space-y-2 text-sm leading-7 text-gray-700">
        {section.bullets.map((item) => (
          <li key={item} className="rounded-2xl bg-[var(--color-surface-muted)] px-4 py-3">
            {item}
          </li>
        ))}
      </ul>
    ) : null}

    {section.ordered?.length ? (
      <ol className="mt-4 space-y-2 text-sm leading-7 text-gray-700">
        {section.ordered.map((item, index) => (
          <li key={item} className="rounded-2xl bg-[var(--color-surface-muted)] px-4 py-3">
            <span className="mr-2 font-semibold text-[var(--color-primary)]">{index + 1}.</span>
            {item}
          </li>
        ))}
      </ol>
    ) : null}

    {section.trailingParagraphs?.map((paragraph) => (
      <p key={paragraph} className="mt-3 text-sm leading-7 text-gray-700">
        {paragraph}
      </p>
    ))}

    {section.subsections?.length ? (
      <div className="mt-6 space-y-5 border-t border-gray-100 pt-5">
        {section.subsections.map((subsection) => (
          <div key={subsection.heading} className="rounded-3xl border border-gray-100 bg-white px-5 py-4 shadow-sm">
            <h3 className="font-['var(--font-heading)'] text-xl font-bold text-[var(--color-primary)]">
              {subsection.heading}
            </h3>

            {subsection.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-7 text-gray-700">
                {paragraph}
              </p>
            ))}

            {subsection.bullets?.length ? (
              <ul className="mt-4 space-y-2 text-sm leading-7 text-gray-700">
                {subsection.bullets.map((item) => (
                  <li key={item} className="rounded-2xl bg-[var(--color-surface-muted)] px-4 py-3">
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {subsection.ordered?.length ? (
              <ol className="mt-4 space-y-2 text-sm leading-7 text-gray-700">
                {subsection.ordered.map((item, index) => (
                  <li key={item} className="rounded-2xl bg-[var(--color-surface-muted)] px-4 py-3">
                    <span className="mr-2 font-semibold text-[var(--color-primary)]">{index + 1}.</span>
                    {item}
                  </li>
                ))}
              </ol>
            ) : null}

            {subsection.trailingParagraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 text-sm leading-7 text-gray-700">
                {paragraph}
              </p>
            ))}
          </div>
        ))}
      </div>
    ) : null}
  </section>
);

const ManualUsuarioPage = () => {
  return (
    <div className="space-y-8 font-['var(--font-body)']">
      <section className="panel overflow-hidden bg-[var(--color-primary)] text-white">
        <div className="grid gap-6 px-6 py-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Ayuda interna</p>
            <h1 className="font-['var(--font-heading)'] text-4xl font-bold">{manualTermopharma.title}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-white/80">
              {manualTermopharma.subtitle}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/15 bg-white/10 p-5 text-sm text-white/85">
            <div className="font-semibold uppercase tracking-[0.12em] text-white/60">Version</div>
            <div className="mt-2 text-lg font-semibold">{manualTermopharma.version}</div>
            <Link to="/dashboard" className="mt-5 inline-flex rounded-xl bg-white px-4 py-2 font-semibold text-[var(--color-primary)]">
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {manualTermopharma.sections.slice(0, 4).map((section) => (
          <article key={section.heading} className="panel panel-muted p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">Seccion</p>
            <div className="mt-3 font-['var(--font-heading)'] text-2xl font-bold text-[var(--color-primary)]">
              {section.heading}
            </div>
          </article>
        ))}
      </section>

      <div className="space-y-6">
        {manualTermopharma.sections.map(renderSection)}
      </div>
    </div>
  );
};

export default ManualUsuarioPage;
