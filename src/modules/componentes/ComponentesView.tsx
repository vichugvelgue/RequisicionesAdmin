import React, { useState, useEffect } from 'react';
import {
  PageCard,
  ViewHeader,
  BackLink,
  FormSection,
  Label,
  Input,
  Button,
  Select,
  SearchInput,
  RadioGroup,
  SearchableSelect,
  SortableHeader,
  DataTable,
  PaginationBar,
  StatusBadge,
  ActionCell,
  GlobalSearchBar,
  ConfirmModal,
  Toast,
  EmptyState,
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
} from '../../components/UI';
import type {
  SetActiveViewProps,
  SortConfig,
  StatusBadgeVariant,
} from '../../components/UI/types';
import { Plus, Search, Printer, Edit, Ban } from 'lucide-react';

const CRITERIA_OPTIONS = [
  { value: 'Coincidencia', label: 'Coincidencia' },
  { value: 'ID', label: 'ID' },
];

const SAMPLE_OPTIONS = [
  { value: 'a', label: 'Opción A' },
  { value: 'b', label: 'Opción B' },
];

interface SampleRow {
  id: string;
  fecha: string;
  obra: string;
  estatus: StatusBadgeVariant;
}

const SAMPLE_ROWS: SampleRow[] = [
  { id: 'REQ-001', fecha: '26-feb-2026', obra: 'Obra Norte', estatus: 'Activa' },
  { id: 'REQ-002', fecha: '25-feb-2026', obra: 'Obra Sur', estatus: 'Cancelada' },
  { id: 'REQ-003', fecha: '24-feb-2026', obra: 'Oficina Central', estatus: 'Borrador' },
];

export function ComponentesView({ setActiveView }: SetActiveViewProps) {
  const [criteria, setCriteria] = useState('Coincidencia');
  const [searchText, setSearchText] = useState('');
  const [radioValue, setRadioValue] = useState('a');
  const [selectValue, setSelectValue] = useState('a');
  const [searchableValue, setSearchableValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'id',
    direction: 'asc',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'productos' | 'bodega'>('productos');

  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), 3000);
    return () => clearTimeout(t);
  }, [toastVisible]);

  const totalItems = SAMPLE_ROWS.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handleSort = (key: string) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-6 overflow-auto">
      <div className="max-w-4xl mx-auto w-full space-y-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Componentes UI</h1>
          <BackLink onClick={() => setActiveView('Dashboard')}>
            Volver al Dashboard
          </BackLink>
        </div>

        <PageCard>
          <ViewHeader
            title="PageCard + ViewHeader"
            action={
              <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
                Acción principal
              </Button>
            }
          />
          <div className="p-5 border-b border-slate-200">
            <FormSection title="FormSection" subtitle="(ejemplo)">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="demo-input">Label + Input</Label>
                  <Input
                    id="demo-input"
                    variant="default"
                    placeholder="Texto..."
                  />
                </div>
                <div>
                  <Label>Select</Label>
                  <Select
                    value={selectValue}
                    onChange={(e) => setSelectValue(e.target.value)}
                  >
                    <option value="a">Opción A</option>
                    <option value="b">Opción B</option>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>SearchInput</Label>
                  <SearchInput
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Buscar..."
                  />
                </div>
                <div className="md:col-span-2">
                  <RadioGroup
                    label="RadioGroup"
                    name="demo-radio"
                    value={radioValue}
                    onChange={(e) => setRadioValue(e.target.value)}
                    options={[
                      { value: 'a', label: 'Opción A' },
                      { value: 'b', label: 'Opción B' },
                    ]}
                  />
                </div>
                <div>
                  <Label>SearchableSelect</Label>
                  <SearchableSelect
                    value={searchableValue}
                    onChange={setSearchableValue}
                    options={SAMPLE_OPTIONS}
                    placeholder="Selecciona..."
                  />
                </div>
              </div>
            </FormSection>
          </div>

          <div className="p-5 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-3">
              GlobalSearchBar
            </h3>
            <GlobalSearchBar
              searchCriteria={criteria}
              onSearchCriteriaChange={setCriteria}
              criteriaOptions={CRITERIA_OPTIONS}
              searchText={searchText}
              onSearchTextChange={setSearchText}
              onSearch={() => {}}
              onExport={() => {}}
            />
          </div>

          <div className="p-5 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Botones</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="primary">Primario</Button>
              <Button variant="secondary">Secundario</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Peligro</Button>
              <Button
                variant="primarySm"
                leftIcon={<Search className="w-3.5 h-3.5" />}
              >
                Buscar
              </Button>
            </div>
          </div>

          <div className="p-5 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-3">
              StatusBadge
            </h3>
            <div className="flex flex-wrap gap-2">
              <StatusBadge variant="Activa">Activa</StatusBadge>
              <StatusBadge variant="Cancelada">Cancelada</StatusBadge>
              <StatusBadge variant="Borrador">Borrador</StatusBadge>
              <StatusBadge variant="Cerrada">Cerrada</StatusBadge>
              <StatusBadge variant="Transito">Tránsito</StatusBadge>
              <StatusBadge variant="Recibido">Recibido</StatusBadge>
              <StatusBadge variant="Solicitado">Solicitado</StatusBadge>
            </div>
          </div>

          <div className="p-5 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Tabs</h3>
            <Tabs
              value={activeTab}
              onChange={(val) => setActiveTab(val as 'productos' | 'bodega')}
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
                  Contenido de la pestaña <strong>Productos</strong>. Aquí
                  podrías renderizar la tabla de captura de productos.
                </p>
              </TabsPanel>

              <TabsPanel value="bodega" className="pt-4">
                <p className="text-xs text-slate-600">
                  Contenido de la pestaña <strong>Solicitud a Bodega</strong>.
                  Aquí iría la tabla de solicitudes a almacén.
                </p>
              </TabsPanel>
            </Tabs>
          </div>

          <div className="p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-3">
              PaginationBar
            </h3>
            <PaginationBar
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>

          <div className="p-5 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-3">
              DataTable + SortableHeader + ActionCell
            </h3>
            <DataTable>
              <thead className="text-[11px] text-slate-500 bg-slate-50 sticky top-0 z-30 border-b border-slate-200 shadow-sm">
                <tr>
                  <SortableHeader
                    columnKey="id"
                    label="ID"
                    width="w-24"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    columnKey="fecha"
                    label="Fecha"
                    sortConfig={sortConfig}
                    onSort={handleSort}
                  />
                  <th className="px-3 py-2 font-bold border-r border-slate-200">
                    Obra
                  </th>
                  <th className="px-3 py-2 font-bold border-r border-slate-200">
                    Estatus
                  </th>
                  <th className="px-3 py-2 font-bold text-center border-b border-slate-200">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="uppercase">
                {SAMPLE_ROWS.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-100/60 hover:bg-blue-50/50 ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    <td className="px-3 py-2 font-bold text-slate-700 border-r border-slate-100/60">
                      {row.id}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100/60 text-slate-500">
                      {row.fecha}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100/60">
                      {row.obra}
                    </td>
                    <td className="px-3 py-2 border-r border-slate-100/60">
                      <StatusBadge variant={row.estatus}>
                        {row.estatus}
                      </StatusBadge>
                    </td>
                    <ActionCell
                      zebra={idx % 2 !== 0}
                      actions={[
                        {
                          icon: <Printer className="w-4 h-4" />,
                          onClick: () => {},
                          title: 'Imprimir',
                        },
                        {
                          icon: <Edit className="w-4 h-4" />,
                          onClick: () => {},
                          title: 'Editar',
                          variant: 'iconAmber',
                        },
                        {
                          icon: <Ban className="w-4 h-4" />,
                          onClick: () => {},
                          title: 'Cancelar',
                          variant: 'iconRed',
                        },
                      ]}
                    />
                  </tr>
                ))}
              </tbody>
            </DataTable>
          </div>

          <div className="p-5 border-t border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-3">
              EmptyState
            </h3>
            <EmptyState
              title="No hay partidas agregadas aún."
              description="Usa la barra superior para buscar y agregar productos rápidamente."
            />
          </div>

          <div className="p-5 border-t border-slate-200 flex gap-3">
            <Button variant="primary" onClick={() => setToastVisible(true)}>
              Mostrar Toast
            </Button>
            <Button variant="danger" onClick={() => setModalOpen(true)}>
              Abrir Modal
            </Button>
          </div>
        </PageCard>
      </div>

      <Toast
        visible={toastVisible}
        title="¡Partida de catálogo agregada!"
        description="Verifica la cantidad en el grid principal."
        icon={<Plus className="w-3.5 h-3.5 text-white" />}
      />

      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)}
        title="Confirmar acción"
        icon={<Ban className="w-5 h-5" />}
        variant="danger"
        confirmLabel="Sí, confirmar"
        cancelLabel="Cancelar"
      >
        <p className="text-sm text-slate-600">
          ¿Estás seguro de realizar esta acción?
        </p>
      </ConfirmModal>
    </div>
  );
}
