import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageCard, ViewHeader, BackLink, FormSection, Label, Button } from '../../../components/UI';
import { Plus } from 'lucide-react';
import { TablePageLayout } from '../../../components/layout/TablePageLayout';

/**
 * Página exclusiva de componentes: Layout.
 */
export function ComponentesLayoutView() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-6 overflow-auto">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Layout</h1>
          <BackLink onClick={() => navigate('/')}>
            Volver al Dashboard
          </BackLink>
        </div>
        <p className="text-sm text-slate-600 -mt-2">
          PageCard, ViewHeader, BackLink, FormSection (estilos ERP).
        </p>

        <PageCard>
          <ViewHeader
            title="PageCard + ViewHeader"
            badge={
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">
                Borrador
              </span>
            }
            action={
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Acción principal
              </Button>
            }
          />
          <div className="p-5">
            <FormSection title="FormSection" subtitle="(subtítulo opcional)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Campo ejemplo</Label>
                  <input
                    type="text"
                    placeholder="Contenido del bloque..."
                    className="w-full bg-white border border-slate-300 text-slate-700 py-1.5 px-2.5 rounded text-xs"
                    readOnly
                  />
                </div>
              </div>
            </FormSection>
          </div>
        </PageCard>

        <PageCard>
          <ViewHeader title="TablePageLayout (ejemplo embebido)" />
          <div className="p-5">
            <p className="text-xs text-slate-500 mb-3">
              Ejemplo de cómo se vería una vista de listado usando{' '}
              <code className="bg-slate-100 px-1 rounded text-[10px]">TablePageLayout</code>.
            </p>
            <div className="border border-dashed border-slate-300 rounded-md overflow-hidden">
              <TablePageLayout
                title="Requisiciones"
                description="Listado de requisiciones usando el layout genérico de tabla."
                action={
                  <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                    Nueva Requisición
                  </Button>
                }
                topBar={
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-600">
                      Aquí iría la barra de búsqueda global o filtros principales.
                    </span>
                    <Button variant="secondary" size="xs">
                      Acción ejemplo
                    </Button>
                  </div>
                }
              >
                <div className="p-4 text-[11px] text-slate-600">
                  <p className="mb-1">
                    Contenido principal (paginación + tabla de datos) iría aquí.
                  </p>
                  <p>
                    El prompt de tablas usará este layout para generar vistas completas de
                    listado con tablas, filtros y acciones.
                  </p>
                </div>
              </TablePageLayout>
            </div>
          </div>
        </PageCard>
      </div>
    </div>
  );
}
