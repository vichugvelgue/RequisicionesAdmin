import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageCard,
  ViewHeader,
  BackLink,
  FormSection,
  Button,
} from '../../../components/UI';
import { Plus, Search, Download, Printer, Edit, Ban } from 'lucide-react';

/**
 * Página exclusiva de componentes: Botones.
 */
export function ComponentesButtonsView() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-6 overflow-auto">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Botones</h1>
          <BackLink onClick={() => navigate('/')}>
            Volver al Dashboard
          </BackLink>
        </div>
        <p className="text-sm text-slate-600 -mt-2">
          Variantes de botón usadas en el sistema (estilos ERP).
        </p>

        <PageCard>
          <ViewHeader title="Variantes de botón" />
          <div className="p-5 flex flex-col gap-8">
            <FormSection title="Principales">
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                  Nueva Requisición
                </Button>
                <Button
                  variant="primary"
                  size="xs"
                  leftIcon={<Search className="w-3.5 h-3.5" />}
                >
                  Buscar
                </Button>
                <Button
                  variant="secondary"
                  leftIcon={<Download className="w-3.5 h-3.5" />}
                >
                  Exportar
                </Button>
                <Button variant="dark" leftIcon={<Plus className="w-4 h-4" />}>
                  Guardar Documento
                </Button>
              </div>
            </FormSection>
            <FormSection title="Secundarios y outline">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">Ant</Button>
                <Button variant="outline">Sig</Button>
                <Button variant="ghost">Cancelar</Button>
                <Button variant="danger">Sí, Cancelar</Button>
              </div>
            </FormSection>
            <FormSection title="Acciones en tabla (iconos)">
              <div className="flex flex-wrap gap-2">
                <Button variant="icon" title="Imprimir">
                  <Printer className="w-4 h-4" />
                </Button>
                <Button variant="iconAmber" title="Editar">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="iconRed" title="Cancelar">
                  <Ban className="w-4 h-4" />
                </Button>
              </div>
            </FormSection>
            <FormSection title="Pequeños (éxito)">
              <Button variant="success" size="xs" leftIcon={<Plus className="w-3 h-3" />}>
                Agregar
              </Button>
            </FormSection>
          </div>
        </PageCard>
      </div>
    </div>
  );
}
