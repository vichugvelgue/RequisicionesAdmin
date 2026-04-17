import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageCard,
  ViewHeader,
  BackLink,
  FormSection,
  DisplayLabel,
} from '../../../components/UI';

const VARIANTS = [
  'primary',
  'secondary',
  'success',
  'danger',
  'outline',
  'dark',
  'ghost',
] as const;

const SIZES = ['xs', 'sm', 'md', 'xl'] as const;

/**
 * Página exclusiva de componentes: Labels (DisplayLabel).
 */
export function ComponentesDisplayLabelView() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-6 overflow-auto">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Labels</h1>
          <BackLink onClick={() => navigate('/')}>
            Volver al Dashboard
          </BackLink>
        </div>
        <p className="text-sm text-slate-600 -mt-2">
          Etiquetas/chips de solo lectura para estados, categorías, etc. Tamaños: xs, sm, md, xl. Prop className para custom.
        </p>

        <PageCard>
          <ViewHeader title="Variantes de color" />
          <div className="p-5 flex flex-col gap-8">
            <FormSection title="Por variante">
              <div className="flex flex-wrap gap-2">
                {VARIANTS.map((v) => (
                  <DisplayLabel key={v} variant={v}>
                    {v}
                  </DisplayLabel>
                ))}
              </div>
            </FormSection>
            <FormSection title="Por tamaño (primary)">
              <div className="flex flex-wrap items-center gap-3">
                {SIZES.map((s) => (
                  <DisplayLabel key={s} variant="primary" size={s}>
                    {s}
                  </DisplayLabel>
                ))}
              </div>
            </FormSection>
            <FormSection title="Solo color de texto (withBackground={false})">
              <div className="flex flex-wrap gap-2">
                {VARIANTS.map((v) => (
                  <DisplayLabel key={v} variant={v} withBackground={false}>
                    {v}
                  </DisplayLabel>
                ))}
              </div>
            </FormSection>
            <FormSection title="Ejemplos de uso">
              <div className="flex flex-wrap gap-2">
                <DisplayLabel variant="success">Activa</DisplayLabel>
                <DisplayLabel variant="danger">Cancelada</DisplayLabel>
                <DisplayLabel variant="outline">Borrador</DisplayLabel>
                <DisplayLabel variant="primary" size="sm">OC-2026-001</DisplayLabel>
                <DisplayLabel variant="dark" size="xs" withBackground={false}>Urgente</DisplayLabel>
                <DisplayLabel variant="secondary" size="xl">Aprobado</DisplayLabel>
              </div>
            </FormSection>
          </div>
        </PageCard>
      </div>
    </div>
  );
}
