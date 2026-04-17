import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageCard,
  ViewHeader,
  BackLink,
  FormSection,
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
} from '../../../components/UI';

/**
 * Página exclusiva de componentes: Tabs.
 */
export function ComponentesTabsView() {
  const navigate = useNavigate();
  const [activeBasicTab, setActiveBasicTab] = useState<'uno' | 'dos'>('uno');
  const [activeWithBadges, setActiveWithBadges] = useState<'productos' | 'bodega'>('productos');

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-6 overflow-auto">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Tabs</h1>
          <BackLink onClick={() => navigate('/')}>
            Volver al Dashboard
          </BackLink>
        </div>
        <p className="text-sm text-slate-600 -mt-2">
          Componente de pestañas usado para secciones como &quot;Captura de Productos&quot; /
          &quot;Solicitud a Bodega&quot;.
        </p>

        <PageCard>
          <ViewHeader title="Tabs" />

          <div className="p-5 flex flex-col gap-8">
            <FormSection title="Básico">
              <Tabs
                value={activeBasicTab}
                onChange={(val) => setActiveBasicTab(val as 'uno' | 'dos')}
              >
                <TabsList>
                  <TabsTab value="uno" label="Pestaña uno" />
                  <TabsTab value="dos" label="Pestaña dos" />
                </TabsList>

                <TabsPanel value="uno" className="pt-4">
                  <p className="text-xs text-slate-600">
                    Contenido de la <strong>pestaña uno</strong>. Usa este patrón cuando tengas
                    secciones de contenido relacionadas que quieres alternar sin cambiar de vista.
                  </p>
                </TabsPanel>
                <TabsPanel value="dos" className="pt-4">
                  <p className="text-xs text-slate-600">
                    Contenido de la <strong>pestaña dos</strong>. El cambio es controlado por el
                    estado externo vía props <code className="bg-slate-100 px-1 rounded text-[10px]">value</code>{' '}
                    y <code className="bg-slate-100 px-1 rounded text-[10px]">onChange</code>.
                  </p>
                </TabsPanel>
              </Tabs>
            </FormSection>

            <FormSection title="Con badge (ejemplo Captura de Productos)">
              <Tabs
                value={activeWithBadges}
                onChange={(val) => setActiveWithBadges(val as 'productos' | 'bodega')}
              >
                <TabsList>
                  <TabsTab
                    value="productos"
                    label="Productos"
                    badge="2 elementos"
                  />
                  <TabsTab
                    value="bodega"
                    label="Solicitud a Bodega"
                    badge="0 solicitudes"
                  />
                </TabsList>

                <TabsPanel value="productos" className="pt-4">
                  <p className="text-xs text-slate-600">
                    Esta pestaña representa la <strong>Captura de Productos</strong>. El badge
                    suele mostrar el número de partidas (ej. &quot;2 elementos&quot;).
                  </p>
                </TabsPanel>

                <TabsPanel value="bodega" className="pt-4">
                  <p className="text-xs text-slate-600">
                    Esta pestaña representa la sección de <strong>Solicitud a Bodega</strong>. El
                    badge puede mostrar la cantidad de solicitudes generadas.
                  </p>
                </TabsPanel>
              </Tabs>
            </FormSection>
          </div>
        </PageCard>
      </div>
    </div>
  );
}

