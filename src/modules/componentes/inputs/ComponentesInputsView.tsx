import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageCard,
  ViewHeader,
  BackLink,
  FormSection,
  Label,
  Input,
  DecimalStringCellInput,
  Select,
  SearchInput,
  RadioGroup,
  DateInputWithClear,
  DateRangePicker,
  TextArea,
} from '../../../components/UI';
import { formatDateToDDMMMYYYY } from '../../../utils/dateFormat';

const SELECT_OPTIONS = [
  { value: 'a', label: 'Opción A' },
  { value: 'b', label: 'Opción B' },
  { value: 'c', label: 'Opción C' },
];

/**
 * Página exclusiva de componentes: Inputs.
 */
export function ComponentesInputsView() {
  const navigate = useNavigate();
  const [texto, setTexto] = useState('');
  const [email, setEmail] = useState('');
  const [numero, setNumero] = useState('');
  const [opcion, setOpcion] = useState('');
  const [radioValue, setRadioValue] = useState('a');
  const [busqueda, setBusqueda] = useState('');
  const [demoFechaInicio, setDemoFechaInicio] = useState('');
  const [demoFechaFin, setDemoFechaFin] = useState('');
  const [demoRangoFechas, setDemoRangoFechas] = useState<
    { start: string; end: string } | undefined
  >(undefined);
  const [textoArea, setTextoArea] = useState('');
  const [decimalCantidad, setDecimalCantidad] = useState('1.0000');
  const [decimalPrecio, setDecimalPrecio] = useState('100');

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-6 overflow-auto">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Inputs</h1>
          <BackLink onClick={() => navigate('/')}>
            Volver al Dashboard
          </BackLink>
        </div>
        <p className="text-sm text-slate-600 -mt-2">
          Componentes de formulario usados en el sistema (estilos ERP).
        </p>

        <PageCard>
          <ViewHeader title="Inputs básicos" />

          <div className="p-5 flex flex-col gap-8">
            <FormSection title="Texto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <Label htmlFor="input-texto">Nombre o descripción</Label>
                  <Input
                    id="input-texto"
                    variant="default"
                    placeholder="Escribe aquí..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <Label htmlFor="input-email">Correo electrónico</Label>
                  <Input
                    id="input-email"
                    type="email"
                    variant="default"
                    placeholder="usuario@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="Número">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col max-w-xs">
                  <Label htmlFor="input-numero">Cantidad</Label>
                  <Input
                    id="input-numero"
                    type="number"
                    variant="default"
                    placeholder="0"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                  />
                </div>
                <div className="flex flex-col max-w-xs">
                  <Label htmlFor="input-quantity">Cantidad alineada a la derecha (variant quantity)</Label>
                  <Input
                    id="input-quantity"
                    type="number"
                    variant="quantity"
                    placeholder="0"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="Input deshabilitado">
              <div className="max-w-xs">
                <Label>Fecha (solo lectura)</Label>
                <Input
                  type="date"
                  disabled
                  value="2026-02-26"
                  variant="disabled"
                />
              </div>
            </FormSection>

            <FormSection title="DateRangePicker (rango con dos calendarios)">
              <div className="flex flex-col max-w-md gap-2">
                <Label htmlFor="demo-rango-fechas">Rango de fechas</Label>
                <DateRangePicker
                  id="demo-rango-fechas"
                  value={demoRangoFechas}
                  onChange={setDemoRangoFechas}
                  placeholder="Desde – Hasta (click para abrir)"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Valor:{' '}
                  <span className="font-mono">
                    {demoRangoFechas
                      ? `${demoRangoFechas.start} → ${demoRangoFechas.end}`
                      : '—'}
                  </span>
                </p>
              </div>
            </FormSection>

            <FormSection title="DateInputWithClear (fecha con botón de limpiar)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col max-w-xs">
                  <Label htmlFor="demo-fecha-inicio">Fecha inicio</Label>
                  <DateInputWithClear
                    id="demo-fecha-inicio"
                    value={demoFechaInicio}
                    onChange={setDemoFechaInicio}
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Valor (ISO):{' '}
                    <span className="font-mono">{demoFechaInicio || '—'}</span>
                    {demoFechaInicio ? (
                      <>
                        {' '}
                        · Vista:{' '}
                        <span className="font-mono">
                          {formatDateToDDMMMYYYY(demoFechaInicio)}
                        </span>
                      </>
                    ) : null}
                  </p>
                </div>
                <div className="flex flex-col max-w-xs">
                  <Label htmlFor="demo-fecha-fin">Fecha fin</Label>
                  <DateInputWithClear
                    id="demo-fecha-fin"
                    value={demoFechaFin}
                    onChange={setDemoFechaFin}
                  />
                  <p className="mt-1 text-[11px] text-slate-500">
                    Valor (ISO):{' '}
                    <span className="font-mono">{demoFechaFin || '—'}</span>
                    {demoFechaFin ? (
                      <>
                        {' '}
                        · Vista:{' '}
                        <span className="font-mono">
                          {formatDateToDDMMMYYYY(demoFechaFin)}
                        </span>
                      </>
                    ) : null}
                  </p>
                </div>
              </div>
            </FormSection>

            <FormSection title="Búsqueda con icono">
              <div className="max-w-md">
                <Label>Búsqueda (tamaño por defecto)</Label>
                <SearchInput
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar..."
                />
              </div>
            </FormSection>

            <FormSection title="Select nativo">
              <div className="max-w-xs">
                <Label htmlFor="select-opcion">Opción</Label>
                <Select
                  id="select-opcion"
                  value={opcion}
                  onChange={(e) => setOpcion(e.target.value)}
                >
                  <option value="">Seleccionar...</option>
                  {SELECT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </div>
            </FormSection>

            <FormSection title="RadioGroup">
              <RadioGroup
                label="Tipo de requisición"
                name="demo-radio"
                value={radioValue}
                onChange={(e) => setRadioValue(e.target.value)}
                options={[
                  { value: 'a', label: 'Opción A' },
                  { value: 'b', label: 'Opción B' },
                  { value: 'c', label: 'Opción C' },
                ]}
              />
            </FormSection>

            <FormSection title="Variantes de Input (filtros y celdas)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <Label>Filtro inline (variant filter)</Label>
                  <Input
                    variant="filter"
                    placeholder="Filtrar..."
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <Label>Número en celda (variant numberCell)</Label>
                  <Input
                    type="number"
                    variant="numberCell"
                    placeholder="0.0000"
                    defaultValue="1.5000"
                  />
                </div>
              </div>
            </FormSection>

            <FormSection title="DecimalStringCellInput (decimales fijos al blur)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="demo-decimal-cant">Cantidad (4 decimales)</Label>
                  <DecimalStringCellInput
                    id="demo-decimal-cant"
                    value={decimalCantidad}
                    onChange={setDecimalCantidad}
                    fractionDigits={4}
                  />
                  <p className="text-[11px] text-slate-500">
                    Ej. <span className="font-mono">2</span> → <span className="font-mono">2.0000</span>
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="demo-decimal-pu">Costo unitario (2 decimales)</Label>
                  <DecimalStringCellInput
                    id="demo-decimal-pu"
                    value={decimalPrecio}
                    onChange={setDecimalPrecio}
                    fractionDigits={2}
                  />
                  <p className="text-[11px] text-slate-500">
                    Ej. <span className="font-mono">100</span> → <span className="font-mono">100.00</span>
                  </p>
                </div>
              </div>
            </FormSection>

            <FormSection title="TextArea (textarea de UI)">
              <div className="max-w-md">
                <Label htmlFor="input-textarea">Mensaje</Label>
                <TextArea
                  id="input-textarea"
                  placeholder="Escribe un mensaje..."
                  value={textoArea}
                  onChange={(e) => setTextoArea(e.target.value)}
                />
              </div>
            </FormSection>
          </div>
        </PageCard>
      </div>
    </div>
  );
}
