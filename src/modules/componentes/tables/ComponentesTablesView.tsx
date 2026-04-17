import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  PageCard,
  ViewHeader,
  BackLink,
  FormSection,
  SimpleTable,
  ExpandableSectionsTable,
  ExpandableSectionsInfiniteTable,
  PaginationBar,
  TableFilterBar,
  InfiniteScrollSentinel,
  TableResultsInfo,
} from '../../../components/UI';
import { ExpandableEntityTable, EntityColumn } from './ExpandableEntityTable';
import { useNavigate } from 'react-router-dom';
import type { SortConfig } from '../../../components/UI/types';
import type { TableFilter } from '../../../components/UI/types';
import { Printer, Download, Ban } from 'lucide-react';
import { formatDateToDDMMMYYYY, parseDDMMMYYYY, isDateWithinIsoRange } from '../../../utils/dateFormat';

interface SampleRow extends Record<string, unknown> {
  id: string;
  fecha: string;
  obra: string;
  estatus: string;
}

const COLUMNS = [
  { key: 'id', label: 'ID', width: 'w-24', cellClassName: 'font-bold text-slate-700' },
  { key: 'fecha', label: 'Fecha', cellClassName: 'text-slate-500' },
  { key: 'obra', label: 'Obra' },
  { key: 'estatus', label: 'Estatus' },
];

const SAMPLE_ROWS: SampleRow[] = [
  { id: 'REQ-001', fecha: '26-feb-2026', obra: 'Obra Norte', estatus: 'Activa' },
  { id: 'REQ-002', fecha: '25-feb-2026', obra: 'Obra Sur', estatus: 'Cancelada' },
  { id: 'REQ-003', fecha: '24-feb-2026', obra: 'Oficina Central', estatus: 'Borrador' },
  { id: 'REQ-004', fecha: '23-feb-2026', obra: 'Obra Este', estatus: 'Activa' },
  { id: 'REQ-005', fecha: '22-feb-2026', obra: 'Obra Oeste', estatus: 'Cerrada' },
];

/** Dataset largo para el ejemplo de infinite scroll */
const INFINITE_SCROLL_ROWS: SampleRow[] = Array.from({ length: 80 }, (_, i) => {
  const obras = ['Obra Norte', 'Obra Sur', 'Oficina Central', 'Obra Este', 'Obra Oeste'];
  const estatuses = ['Activa', 'Cancelada', 'Borrador', 'Cerrada'];
  const day = (i % 28) + 1;
  const month = (i % 12) + 1;
  return {
    id: `REQ-${String(100 + i).padStart(3, '0')}`,
    fecha: formatDateToDDMMMYYYY(new Date(2026, month - 1, day)),
    obra: obras[i % obras.length],
    estatus: estatuses[i % estatuses.length],
  };
});

const CRITERIA_OPTIONS = [
  { value: 'todo', label: 'Todo' },
  { value: 'id', label: 'ID' },
  { value: 'obra', label: 'Obra' },
  { value: 'estatus', label: 'Estatus' },
  { value: 'Fecha', label: 'Fecha' },
];

const ESTATUS_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'Activa', label: 'Activa' },
  { value: 'Cancelada', label: 'Cancelada' },
  { value: 'Borrador', label: 'Borrador' },
  { value: 'Cerrada', label: 'Cerrada' },
];

/** Datos de ejemplo para ExpandableSectionsTable (detalle tipo explosión de insumos). */
interface DetalleRow extends Record<string, unknown> {
  id: number;
  clave: string;
  descripcion: string;
  unidad: string;
  cantidad: number;
  costoUnitario: number;
  importe: number;
  percent: number;
  suministro: number;
}

const DETALLE_COLUMNS = [
  { key: 'id', label: 'ID', width: 'w-20', cellClassName: 'text-slate-700 font-medium' },
  { key: 'clave', label: 'Clave', width: 'w-28', cellClassName: 'text-slate-700' },
  { key: 'descripcion', label: 'Descripción', width: 'min-w-[200px]', cellClassName: 'text-slate-700' },
  { key: 'unidad', label: 'Unidad', width: 'w-20', cellClassName: 'text-slate-600 uppercase' },
  { key: 'cantidad', label: 'Cantidad', width: 'w-24', cellType: 'money' as const, cellClassName: 'text-right tabular-nums' },
  { key: 'costoUnitario', label: 'Costo Unitario', width: 'w-28', cellType: 'money' as const, cellClassName: 'text-right tabular-nums' },
  { key: 'importe', label: 'Importe', width: 'w-28', cellType: 'money' as const, cellClassName: 'text-right tabular-nums font-medium' },
  { key: 'percent', label: '%', width: 'w-20', cellClassName: 'text-right tabular-nums' },
  { key: 'suministro', label: 'Suministro', width: 'w-24', cellClassName: 'text-right tabular-nums' },
];

const EXPANDABLE_SECTIONS = [
  {
    id: 'material',
    title: 'Material',
    summary: { importe: 848190.71, percent: 0.85 },
    rows: [
      { id: 10021006, clave: 'IEVAR00003', descripcion: 'CINTA AISLANTE SUPER 33 3M', unidad: 'PIEZA', cantidad: 33.15, costoUnitario: 56.73, importe: 1880.61, percent: 0, suministro: 0 },
      { id: 10021007, clave: 'IEVAR00004', descripcion: 'Driver magnetico para Led 96w 24 VDC', unidad: 'PIEZA', cantidad: 2, costoUnitario: 1890.3, importe: 3780.6, percent: 0, suministro: 0 },
      { id: 10021008, clave: 'IEVAR00005', descripcion: 'CABLE THW 12 AWG 600V', unidad: 'MTS', cantidad: 150.5, costoUnitario: 28.5, importe: 4294.25, percent: 0.01, suministro: 0 },
      { id: 10021009, clave: 'IEVAR00006', descripcion: 'TUBO CONDUIT 1/2 PULGADA', unidad: 'MTS', cantidad: 80, costoUnitario: 45.2, importe: 3616, percent: 0, suministro: 0 },
      { id: 10021010, clave: 'IEVAR00007', descripcion: 'BROCHA PINTURA 4 PULGADAS', unidad: 'PIEZA', cantidad: 12, costoUnitario: 85, importe: 1020, percent: 0, suministro: 0 },
    ] as DetalleRow[],
  },
  {
    id: 'manoObra',
    title: 'Mano de Obra',
    summary: { importe: 143655.14, percent: 0.14 },
    rows: [
      { id: 10001836, clave: 'MOCA-013', descripcion: 'Cabo de oficios', unidad: 'JORNAL', cantidad: 10.25, costoUnitario: 1575.43, importe: 16149.03, percent: 0.02, suministro: 0 },
      { id: 10001837, clave: 'MOCA-014', descripcion: 'Electricista', unidad: 'JORNAL', cantidad: 15, costoUnitario: 1850, importe: 27750, percent: 0.03, suministro: 0 },
      { id: 10001838, clave: 'MOCA-015', descripcion: 'Ayudante electricista', unidad: 'JORNAL', cantidad: 20, costoUnitario: 950.5, importe: 19010, percent: 0.02, suministro: 0 },
    ] as DetalleRow[],
  },
  {
    id: 'herramienta',
    title: 'Herramienta',
    summary: { importe: 4309.65, percent: 0 },
    rows: [
      { id: 10010001, clave: 'HERR-001', descripcion: 'Taladro inalámbrico', unidad: 'PIEZA', cantidad: 2, costoUnitario: 1200, importe: 2400, percent: 0, suministro: 0 },
      { id: 10010002, clave: 'HERR-002', descripcion: 'Cortadora de cable', unidad: 'PIEZA', cantidad: 1, costoUnitario: 1909.65, importe: 1909.65, percent: 0, suministro: 0 },
    ] as DetalleRow[],
  },
];
function makeDetalleRows(sectionPrefix: string, count: number): DetalleRow[] {
  return Array.from({ length: count }, (_, i) => ({
    id: (sectionPrefix === 'A' ? 400000 : 500000) + i,
    clave: `${sectionPrefix}-R${String(i + 1).padStart(3, '0')}`,
    descripcion: `ÍTEM DEMO ${sectionPrefix} ${i + 1}`.toUpperCase(),
    unidad: 'PIEZA',
    cantidad: 1 + (i % 10) * 0.25,
    costoUnitario: 50 + i,
    importe: (1 + (i % 10) * 0.25) * (50 + i),
    percent: 0,
    suministro: 0,
  }));
}

const EXPANDABLE_SECTIONS_INFINITE = [
  {
    id: 'demo-a',
    title: 'Sección demo A',
    summary: { importe: 125000 },
    rows: makeDetalleRows('A', 55),
  },
  {
    id: 'demo-b',
    title: 'Sección demo B',
    summary: { importe: 89000 },
    rows: makeDetalleRows('B', 48),
  },
];


/**
 * Página exclusiva de componentes: Tablas.
 */
export function ComponentesTablesView() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(2);
  const totalItems = SAMPLE_ROWS.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const paginatedRows = SAMPLE_ROWS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const [searchCriteria, setSearchCriteria] = useState('todo');
  const [searchText, setSearchText] = useState('');
  const [estatusFilter, setEstatusFilter] = useState('');
  const [filterBarStartDate, setFilterBarStartDate] = useState('');
  const [filterBarEndDate, setFilterBarEndDate] = useState('');
  const [filteredByBar, setFilteredByBar] = useState<SampleRow[]>(SAMPLE_ROWS);

  const applyFilterBar = () => {
    let result = SAMPLE_ROWS;
    if (estatusFilter) {
      result = result.filter((r) => r.estatus === estatusFilter);
    }
    if (searchCriteria === 'Fecha' && (filterBarStartDate || filterBarEndDate)) {
      result = result.filter((r) => {
        const d = parseDDMMMYYYY(r.fecha);
        return isDateWithinIsoRange(d, filterBarStartDate, filterBarEndDate);
      });
    } else if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      result = result.filter((r) => {
        if (searchCriteria === 'id') return r.id.toLowerCase().includes(q);
        if (searchCriteria === 'obra') return r.obra.toLowerCase().includes(q);
        if (searchCriteria === 'estatus')
          return r.estatus.toLowerCase().includes(q);
        return (
          r.id.toLowerCase().includes(q) ||
          r.obra.toLowerCase().includes(q) ||
          r.estatus.toLowerCase().includes(q)
        );
      });
    }
    setFilteredByBar(result);
  };

  const filterBarFilters: TableFilter[] = useMemo(
    () => [
      {
        type: 'search',
        cols: 6,
        criteriaOptions: CRITERIA_OPTIONS,
        criteriaValue: searchCriteria,
        onCriteriaChange: setSearchCriteria,
        labelInput: 'Búsqueda:',
        searchValue: searchText,
        onSearchChange: setSearchText,
        placeholder: 'Término de búsqueda...',
        dateRangeCriteria: 'Fecha',
        dateRangeValue: filterBarStartDate
          ? { start: filterBarStartDate, end: filterBarEndDate || filterBarStartDate }
          : undefined,
        onDateRangeChange: (v) => {
          if (!v) {
            setFilterBarStartDate('');
            setFilterBarEndDate('');
            return;
          }
          setFilterBarStartDate(v.start);
          setFilterBarEndDate(v.end);
        },
      },
      {
        type: 'select',
        cols: 2,
        label: 'Estatus',
        options: ESTATUS_OPTIONS,
        value: estatusFilter,
        onChange: setEstatusFilter,
      },
    ],
    [searchCriteria, searchText, estatusFilter, filterBarStartDate, filterBarEndDate]
  );

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'fecha',
    direction: 'desc',
  });
  const [showInlineFilters, setShowInlineFilters] = useState(false);
  const [inlineFilters, setInlineFilters] = useState({
    id: '',
    fecha: '',
    obra: '',
    estatus: '',
  });

  // Estado para el ejemplo de infinite scroll (sección 7): filter bar + visible count
  const infiniteScrollRef = useRef<HTMLDivElement>(null);
  const infiniteScrollPageSize = 10;
  const [infiniteScrollSearchCriteria, setInfiniteScrollSearchCriteria] = useState('todo');
  const [infiniteScrollSearchText, setInfiniteScrollSearchText] = useState('');
  const [infiniteScrollStartDate, setInfiniteScrollStartDate] = useState('');
  const [infiniteScrollEndDate, setInfiniteScrollEndDate] = useState('');
  const [infiniteScrollEstatusFilter, setInfiniteScrollEstatusFilter] = useState('');
  const [infiniteScrollFiltered, setInfiniteScrollFiltered] = useState<SampleRow[]>(INFINITE_SCROLL_ROWS);
  const [infiniteScrollVisibleCount, setInfiniteScrollVisibleCount] = useState(infiniteScrollPageSize);

  const applyInfiniteScrollFilters = useCallback(() => {
    let result = INFINITE_SCROLL_ROWS;
    if (infiniteScrollEstatusFilter) {
      result = result.filter((r) => r.estatus === infiniteScrollEstatusFilter);
    }
    if (
      infiniteScrollSearchCriteria === 'Fecha' &&
      (infiniteScrollStartDate || infiniteScrollEndDate)
    ) {
      result = result.filter((r) => {
        const d = parseDDMMMYYYY(r.fecha);
        return isDateWithinIsoRange(d, infiniteScrollStartDate, infiniteScrollEndDate);
      });
    } else if (infiniteScrollSearchText.trim()) {
      const q = infiniteScrollSearchText.toLowerCase().trim();
      result = result.filter((r) => {
        if (infiniteScrollSearchCriteria === 'id') return r.id.toLowerCase().includes(q);
        if (infiniteScrollSearchCriteria === 'obra') return r.obra.toLowerCase().includes(q);
        if (infiniteScrollSearchCriteria === 'estatus')
          return r.estatus.toLowerCase().includes(q);
        return (
          r.id.toLowerCase().includes(q) ||
          r.obra.toLowerCase().includes(q) ||
          r.estatus.toLowerCase().includes(q)
        );
      });
    }
    setInfiniteScrollFiltered(result);
    setInfiniteScrollVisibleCount(infiniteScrollPageSize);
  }, [
    infiniteScrollEstatusFilter,
    infiniteScrollSearchText,
    infiniteScrollSearchCriteria,
    infiniteScrollStartDate,
    infiniteScrollEndDate,
  ]);

  const infiniteScrollTotal = infiniteScrollFiltered.length;
  const infiniteScrollVisibleData = useMemo(
    () => infiniteScrollFiltered.slice(0, infiniteScrollVisibleCount),
    [infiniteScrollFiltered, infiniteScrollVisibleCount]
  );
  const handleInfiniteLoadMore = useCallback(() => {
    setInfiniteScrollVisibleCount((prev) =>
      Math.min(prev + infiniteScrollPageSize, infiniteScrollTotal)
    );
  }, [infiniteScrollTotal]);

  const infiniteScrollFilterBarFilters: TableFilter[] = useMemo(
    () => [
      {
        type: 'search',
        cols: 6,
        criteriaOptions: CRITERIA_OPTIONS,
        criteriaValue: infiniteScrollSearchCriteria,
        onCriteriaChange: setInfiniteScrollSearchCriteria,
        labelInput: 'Búsqueda:',
        searchValue: infiniteScrollSearchText,
        onSearchChange: setInfiniteScrollSearchText,
        placeholder: 'Término de búsqueda...',
        dateRangeCriteria: 'Fecha',
        dateRangeValue: infiniteScrollStartDate
          ? {
              start: infiniteScrollStartDate,
              end: infiniteScrollEndDate || infiniteScrollStartDate,
            }
          : undefined,
        onDateRangeChange: (v) => {
          if (!v) {
            setInfiniteScrollStartDate('');
            setInfiniteScrollEndDate('');
            return;
          }
          setInfiniteScrollStartDate(v.start);
          setInfiniteScrollEndDate(v.end);
        },
      },
      {
        type: 'select',
        cols: 2,
        label: 'Estatus',
        options: ESTATUS_OPTIONS,
        value: infiniteScrollEstatusFilter,
        onChange: setInfiniteScrollEstatusFilter,
      },
    ],
    [
      infiniteScrollSearchCriteria,
      infiniteScrollSearchText,
      infiniteScrollEstatusFilter,
      infiniteScrollStartDate,
      infiniteScrollEndDate,
    ]
  );

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleInlineFilterChange = (key: string, value: string) => {
    setInlineFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearInlineFilters = () => {
    setInlineFilters({ id: '', fecha: '', obra: '', estatus: '' });
  };

  const sortedAndFilteredRows = useMemo(() => {
    let result = SAMPLE_ROWS.filter((row) => {
      return (
        String(row.id || '')
          .toLowerCase()
          .includes((inlineFilters.id || '').toLowerCase()) &&
        String(row.fecha || '')
          .toLowerCase()
          .includes((inlineFilters.fecha || '').toLowerCase()) &&
        String(row.obra || '')
          .toLowerCase()
          .includes((inlineFilters.obra || '').toLowerCase()) &&
        String(row.estatus || '')
          .toLowerCase()
          .includes((inlineFilters.estatus || '').toLowerCase())
      );
    });
    const { key, direction } = sortConfig;
    result = [...result].sort((a, b) => {
      const aVal = a[key as keyof SampleRow];
      const bVal = b[key as keyof SampleRow];
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [inlineFilters, sortConfig]);

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-6 overflow-auto">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Tablas</h1>
          <BackLink onClick={() => navigate('/')}>
            Volver al Dashboard
          </BackLink>
        </div>
        <p className="text-sm text-slate-600 -mt-2">
          SimpleTable: sencilla, con paginación, con acciones base
          (Ver/Editar/Eliminar) y con acciones custom.
        </p>

        <PageCard>
          <ViewHeader title="Tablas" />

          <div className="p-5 flex flex-col gap-8">
            <FormSection title="1. Tabla sencilla (solo encabezado y datos)">
              <p className="text-xs text-slate-500 mb-2">
                Sin props de acciones. Solo{' '}
                <code className="bg-slate-100 px-1 rounded">columns</code> y{' '}
                <code className="bg-slate-100 px-1 rounded">data</code>.
              </p>
              <SimpleTable
                columns={COLUMNS}
                data={SAMPLE_ROWS}
                wrapperClassName="max-h-64"
              />
            </FormSection>

            <FormSection title="2. Tabla con paginación">
              <p className="text-xs text-slate-500 mb-2">
                Mismo SimpleTable con{' '}
                <code className="bg-slate-100 px-1 rounded">data</code>{' '}
                paginado y PaginationBar arriba.
              </p>
              <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
                itemsPerPageOptions={[2, 5, 10]}
              />
              <SimpleTable
                columns={COLUMNS}
                data={paginatedRows}
                wrapperClassName="max-h-64"
              />
            </FormSection>

            <FormSection title="3. Tabla con acciones base (Ver, Editar, Eliminar)">
              <p className="text-xs text-slate-500 mb-2">
                Props <code className="bg-slate-100 px-1 rounded">onView</code>,{' '}
                <code className="bg-slate-100 px-1 rounded">onEdit</code>,{' '}
                <code className="bg-slate-100 px-1 rounded">onDelete</code>. En
                este ejemplo solo hacen console.log.
              </p>
              <SimpleTable
                columns={COLUMNS}
                data={SAMPLE_ROWS}
                onView={(row) => console.log('Ver', row)}
                onEdit={(row) => console.log('Editar', row)}
                onDelete={(row) => console.log('Eliminar', row)}
                wrapperClassName="max-h-64"
              />
            </FormSection>

            <FormSection title="4. Tabla con acciones custom">
              <p className="text-xs text-slate-500 mb-2">
                Prop{' '}
                <code className="bg-slate-100 px-1 rounded">customActions</code>.
              </p>
              <SimpleTable
                columns={COLUMNS}
                data={SAMPLE_ROWS}
                customActions={[
                  {
                    icon: <Printer className="w-4 h-4" />,
                    onClick: (row) => console.log('Imprimir', row),
                    title: 'Imprimir',
                    variant: 'icon',
                  },
                  {
                    icon: <Download className="w-4 h-4" />,
                    onClick: (row) => console.log('Exportar', row),
                    title: 'Exportar',
                    variant: 'icon',
                  },
                  {
                    icon: <Ban className="w-4 h-4" />,
                    onClick: (row) => console.log('Cancelar', row),
                    title: 'Cancelar',
                    variant: 'iconRed',
                  },
                ]}
                wrapperClassName="max-h-64"
              />
            </FormSection>

            <FormSection title="5. TableFilterBar (filtros + tabla)">
              <p className="text-xs text-slate-500 mb-2">
                <code className="bg-slate-100 px-1 rounded">filters</code>,{' '}
                <code className="bg-slate-100 px-1 rounded">onApply</code>,{' '}
                <code className="bg-slate-100 px-1 rounded">actions</code>.
              </p>
              <TableFilterBar
                filters={filterBarFilters}
                gridCols={12}
                onApply={applyFilterBar}
                applyLabel="Buscar"
                actions={[
                  {
                    label: 'Exportar',
                    icon: <Download className="w-3.5 h-3.5" />,
                    onClick: () => console.log('Exportar', filteredByBar),
                    title: 'Exportar a Excel',
                  },
                ]}
                className="mb-4"
              />
              <SimpleTable
                columns={COLUMNS}
                data={filteredByBar}
                wrapperClassName="max-h-64"
              />
            </FormSection>

            <FormSection title="6. Tabla con sort y filtros inline">
              <p className="text-xs text-slate-500 mb-2">
                sortConfig + onSort; showInlineFilters, onToggleInlineFilters,
                inlineFilters, onInlineFilterChange, onClearInlineFilters.
              </p>
              <SimpleTable
                columns={COLUMNS}
                data={sortedAndFilteredRows}
                getRowKey={(row) => String(row.id)}
                sortConfig={sortConfig}
                onSort={handleSort}
                showInlineFilters={showInlineFilters}
                onToggleInlineFilters={() =>
                  setShowInlineFilters((v) => !v)
                }
                inlineFilters={inlineFilters}
                onInlineFilterChange={handleInlineFilterChange}
                onClearInlineFilters={clearInlineFilters}
                onView={(row) => console.log('Ver', row)}
                onEdit={(row) => console.log('Editar', row)}
                wrapperClassName="max-h-64"
              />
            </FormSection>

            <FormSection title="7. Tabla con infinite scroll">
              <p className="text-xs text-slate-500 mb-2">
                TableFilterBar + contenedor con <code className="bg-slate-100 px-1 rounded">overflow-auto</code>, SimpleTable con{' '}
                <code className="bg-slate-100 px-1 rounded">scrollContainer="parent"</code> e{' '}
                <code className="bg-slate-100 px-1 rounded">InfiniteScrollSentinel</code>. Acciones Ver y Editar.
              </p>
              <TableFilterBar
                filters={infiniteScrollFilterBarFilters}
                gridCols={12}
                onApply={applyInfiniteScrollFilters}
                applyLabel="Buscar"
                actions={[
                  {
                    label: 'Exportar',
                    icon: <Download className="w-3.5 h-3.5" />,
                    onClick: () => console.log('Exportar', infiniteScrollFiltered),
                    title: 'Exportar a Excel',
                  },
                ]}
                className="mb-4"
              />
              <div
                ref={infiniteScrollRef}
                className="max-h-64 overflow-auto border border-slate-200 rounded-md"
              >
                <SimpleTable
                  columns={COLUMNS}
                  data={infiniteScrollVisibleData}
                  getRowKey={(row) => String(row.id)}
                  wrapperClassName="min-h-0"
                  scrollContainer="parent"
                  onView={(row) => console.log('Ver', row)}
                  onEdit={(row) => console.log('Editar', row)}
                />
                <InfiniteScrollSentinel
                  rootRef={infiniteScrollRef}
                  onLoadMore={handleInfiniteLoadMore}
                  disabled={infiniteScrollVisibleCount >= infiniteScrollTotal}
                />
              </div>
              <TableResultsInfo
                visibleCount={infiniteScrollVisibleData.length}
                totalCount={infiniteScrollTotal}
                className="mt-2 px-0 py-0 text-xs border-none bg-transparent rounded-none"
              />
            </FormSection>

            <FormSection title="8. Tabla con secciones expandibles (dropdown)">
              <p className="text-xs text-slate-500 mb-2">
                <code className="bg-slate-100 px-1 rounded">ExpandableSectionsTable</code>:
                secciones con título y totales que se abren/cierran al hacer clic.
                Mismo estilo que SimpleTable.
              </p>
              <ExpandableSectionsTable<DetalleRow>
                sections={EXPANDABLE_SECTIONS}
                columns={DETALLE_COLUMNS}
                getRowKey={(row) => row.id}
                defaultExpanded={true}
                wrapperClassName="max-h-96"
              />
            </FormSection>

            <FormSection title="9. Secciones expandibles + infinite scroll">
              <p className="text-xs text-slate-500 mb-2">
                <code className="bg-slate-100 px-1 rounded">ExpandableSectionsInfiniteTable</code>:
                mismas secciones que arriba, con carga progresiva por sección al hacer scroll.
              </p>
              <ExpandableSectionsInfiniteTable<DetalleRow>
                sections={[...EXPANDABLE_SECTIONS_INFINITE]}
                columns={DETALLE_COLUMNS}
                getRowKey={(row) => row.id}
                pageSize={15}
                resetKey="componentes-demo-infinite-sections"
                defaultExpanded={true}
                wrapperClassName="max-h-80 border border-slate-200 rounded-md"
              />
            </FormSection>

            <FormSection title="10. ExpandableEntityTable (Tabla Maestra-Detalle Estándar)">
              <div className="space-y-4">
                <div className="bg-blue-50/50 border-l-4 border-blue-400 p-3 rounded-r-md">
                  <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1">Concepto</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Este componente es el nuevo estándar para vistas que requieran una estructura **Maestro-Detalle**. Implementa automáticamente:
                    <br/>• Filtrado global y filtros inline por columna.
                    <br/>• Expansión de filas con sangrado visual alineado a la 3ra columna.
                    <br/>• Inferencia de tipos robusta mediante genéricos.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-md p-3">
                    <p className="text-xs font-bold text-slate-700 mb-2">Props Obligatorias</p>
                    <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                      <li><code>data</code>: Array de objetos (debe incluir el campo <code>id</code>).</li>
                      <li><code>columns</code>: Definición de columnas tipo <code>EntityColumn</code>.</li>
                    </ul>
                  </div>
                  <div className="border border-slate-200 rounded-md p-3">
                    <p className="text-xs font-bold text-slate-700 mb-2">Props Opcionales</p>
                    <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                      <li><code>renderSubTable</code>: Renderizador para el detalle expandido.</li>
                      <li><code>globalSearchTerm</code>: Término para búsqueda sincronizada.</li>
                      <li><code>searchCriteriaKeys</code>: Keys del objeto para el filtro global.</li>
                      <li><code>showResultsInfo</code>: Si debe mostrar el contador de resultados.</li>
                    </ul>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-medium pt-2">Demostración en vivo:</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                  <ExpandableEntityTable<SampleRow>
                    data={SAMPLE_ROWS}
                    columns={[
                      { label: 'ID', width: '15%', filterKey: 'id', render: (r) => <span className="font-bold">{r.id}</span> },
                      { label: 'Obra', width: '35%', filterKey: 'obra', render: (r) => r.obra },
                      { label: 'Estatus', width: '25%', filterKey: 'estatus', render: (r) => <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] uppercase">{r.estatus}</span> },
                      { label: 'Fecha', width: '25%', render: (r) => r.fecha },
                    ]}
                    renderSubTable={(row) => (
                      <div className="p-4 bg-slate-50/30">
                        <p className="text-[11px] font-bold text-slate-500 uppercase mb-2">Detalle de {row.id}</p>
                        <SimpleTable
                          columns={[
                            { key: 'concepto', label: 'Concepto' },
                            { key: 'valor', label: 'Valor' },
                          ]}
                          data={[
                            { concepto: 'Ubicación', valor: row.obra },
                            { concepto: 'Fecha de Creación', valor: row.fecha },
                            { concepto: 'Estado Actual', valor: row.estatus },
                          ]}
                        />
                      </div>
                    )}
                  />
                </div>
              </div>
            </FormSection>
          </div>
        </PageCard>
      </div>
    </div>
  );
}
