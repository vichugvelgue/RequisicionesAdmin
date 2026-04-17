import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageCard,
  ViewHeader,
  BackLink,
  FormSection,
  Label,
  SearchableSelect,
} from '../../../components/UI';
import { OBRAS_MOCK, COMPRADORES_MOCK } from '../../../data/mockCatalogos';

const SAMPLE_OPTIONS = [
  { value: 'a', label: 'Opción A' },
  { value: 'b', label: 'Opción B' },
  { value: 'c', label: 'Opción C' },
  { value: 'd', label: 'Opción D' },
  { value: 'e', label: 'Opción E' },
];

/**
 * Página exclusiva de componentes: SearchableSelect.
 */
export function ComponentesSearchableSelectView() {
  const navigate = useNavigate();
  const [sampleValue, setSampleValue] = useState('');
  const [obraValue, setObraValue] = useState('');
  const [compradorValue, setCompradorValue] = useState('');

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-6 overflow-auto">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">
            SearchableSelect
          </h1>
          <BackLink onClick={() => navigate('/')}>
            Volver al Dashboard
          </BackLink>
        </div>
        <p className="text-sm text-slate-600 -mt-2">
          Select con búsqueda interna (estilos ERP). Incluye dropdown, input
          de búsqueda y lista filtrable.
        </p>

        <PageCard>
          <ViewHeader title="SearchableSelect" />

          <div className="p-5 flex flex-col gap-8">
            <FormSection title="Lista corta (ejemplo genérico)">
              <div className="max-w-md">
                <Label>Selecciona una opción</Label>
                <SearchableSelect
                  value={sampleValue}
                  onChange={setSampleValue}
                  options={SAMPLE_OPTIONS}
                  placeholder="Selecciona una opción..."
                />
              </div>
            </FormSection>

            <FormSection title="Obras (catálogo real)">
              <div className="max-w-md">
                <Label>Obra</Label>
                <SearchableSelect
                  value={obraValue}
                  onChange={setObraValue}
                  options={OBRAS_MOCK}
                  placeholder="Selecciona una obra..."
                />
              </div>
            </FormSection>

            <FormSection title="Compradores (catálogo real)">
              <div className="max-w-md">
                <Label>Comprador</Label>
                <SearchableSelect
                  value={compradorValue}
                  onChange={setCompradorValue}
                  options={COMPRADORES_MOCK}
                  placeholder="Selecciona comprador..."
                />
              </div>
            </FormSection>

            <FormSection title="Deshabilitado">
              <div className="max-w-md">
                <Label>SearchableSelect deshabilitado</Label>
                <SearchableSelect
                  value=""
                  onChange={() => {}}
                  options={SAMPLE_OPTIONS}
                  placeholder="Deshabilitado..."
                  disabled
                />
              </div>
            </FormSection>
          </div>
        </PageCard>
      </div>
    </div>
  );
}
