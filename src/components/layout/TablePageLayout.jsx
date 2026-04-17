import React from 'react';
import { PageCard, ViewHeader } from '../UI';

/**
 * Layout genérico para vistas de listado con tabla.
 * Encapsula el patrón estándar:
 * - Wrapper de página
 * - PageCard
 * - ViewHeader (título, descripción opcional, acción opcional)
 * - Franja superior (topBar) para búsqueda/filtros
 * - Contenido principal (children) para paginación + tabla + extras
 */
export function TablePageLayout({ title, description, action, topBar, children }) {
  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-6 overflow-hidden">
      <PageCard>
        <ViewHeader title={title} description={description} action={action} />

        {topBar && (
          <div className="px-5 py-4 border-b border-slate-200 shrink-0 bg-white">
            {topBar}
          </div>
        )}

        {children}
      </PageCard>
    </div>
  );
}

