import React, { useState, useMemo, useCallback } from 'react';
import { ChevronDown, ChevronRight, ChevronsUpDown, Filter, X } from 'lucide-react';
import { DataTable, Input, Button, TableResultsInfo } from '../../../components/UI';

export interface EntityColumn<T = any> {
    label: string;
    width: string;
    headerAlign?: 'left' | 'center' | 'right';
    contentAlign?: 'left' | 'center' | 'right';
    /** Key para el filtrado inline. Si no se provee, no se muestra input de filtro en esta columna. */
    filterKey?: string;
    /** Si es true y sortKey está definido, la cabecera ordena ASC/DESC al hacer clic. */
    sortable?: boolean;
    /** Clave en el item para ordenar (misma idea que filterKey). */
    sortKey?: string;
    render: (item: T) => React.ReactNode;
}

function compareSortValues(a: unknown, b: unknown): number {
    if (a === b) return 0;
    if (a == null || a === '') return b == null || b === '' ? 0 : 1;
    if (b == null || b === '') return -1;
    if (typeof a === 'number' && typeof b === 'number' && !Number.isNaN(a) && !Number.isNaN(b)) {
        return a < b ? -1 : 1;
    }
    return String(a).localeCompare(String(b), 'es', { numeric: true, sensitivity: 'base' });
}

interface ExpandableEntityTableProps<T = any> {
    data: T[];
    columns: EntityColumn<T>[];
    /** Función para renderizar la sub-tabla/contenido expandido de una fila. */
    renderSubTable?: (item: T) => React.ReactNode;
    /** Valor inicial de búsqueda global (opcional, para filtrado adicional si el padre no lo filtró). */
    globalSearchTerm?: string;
    /** Criterio de búsqueda coincidente si se usa globalSearchTerm. */
    searchCriteriaKeys?: string[];
    /** Callback cuando cambia el conteo de resultados (opcional). */
    onResultsCountChange?: (count: number) => void;
    /** Props adicionales para el wrapper de la tabla. */
    wrapperClassName?: string;
    /** Si es true, se muestra la barra de resultados al final. */
    showResultsInfo?: boolean;
    /** Total para el componente de info (si es diferente al length de data). */
    totalCount?: number;
    /** Estado controlado de fila expandida (opcional). */
    expandedId?: string | null;
    /** Callback de cambio para estado expandido controlado (opcional). */
    onExpandedIdChange?: (id: string | null) => void;
}

const TH_CLASS = "px-3 py-2 font-bold border-r border-slate-200 text-[11px] text-slate-500 bg-slate-50 transition-all uppercase tracking-wider";
const TH_FILTER = "px-2 py-1.5 border-r border-b border-slate-200 font-normal";
const TD_CLASS = "px-3 py-2 border-r border-slate-100/60 text-xs text-slate-700 last:border-r-0 transition-all";

export function ExpandableEntityTable<T extends { id: string }>({
    data,
    columns,
    renderSubTable,
    globalSearchTerm = '',
    searchCriteriaKeys = [],
    wrapperClassName = "flex-1 min-h-0",
    showResultsInfo = true,
    totalCount,
    expandedId: controlledExpandedId,
    onExpandedIdChange,
}: ExpandableEntityTableProps<T>) {
    const [internalExpandedId, setInternalExpandedId] = useState<string | null>(null);
    const [showInlineFilters, setShowInlineFilters] = useState(false);
    const [inlineFilters, setInlineFilters] = useState<Record<string, string>>({});
    const [sortColumnIndex, setSortColumnIndex] = useState<number | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const expandedId = controlledExpandedId !== undefined ? controlledExpandedId : internalExpandedId;

    const toggleExpand = (id: string) => {
        const nextExpanded = expandedId === id ? null : id;
        if (controlledExpandedId === undefined) {
            setInternalExpandedId(nextExpanded);
        }
        onExpandedIdChange?.(nextExpanded);
    };

    const clearFilters = () => {
        setInlineFilters({});
    };

    const filteredData = useMemo(() => {
        return data.filter((item: any) => {
            // Filtro Global (opcional)
            const term = globalSearchTerm.toLowerCase();
            let matchesGlobal = true;
            if (term && searchCriteriaKeys.length > 0) {
                matchesGlobal = searchCriteriaKeys.some(key => {
                    const val = item[key];
                    return val && val.toString().toLowerCase().includes(term);
                });
            }

            // Filtros Inline
            const matchesInline = Object.entries(inlineFilters).every(([key, value]) => {
                if (!value) return true;
                const itemValue = item[key];
                return itemValue && itemValue.toString().toLowerCase().includes(value.toLowerCase());
            });

            return matchesGlobal && matchesInline;
        });
    }, [data, globalSearchTerm, searchCriteriaKeys, inlineFilters]);

    const displayData = useMemo(() => {
        if (sortColumnIndex === null) return filteredData;
        const col = columns[sortColumnIndex];
        if (!col?.sortable || !col.sortKey) return filteredData;
        const key = col.sortKey;
        const dir = sortDirection === 'asc' ? 1 : -1;
        return [...filteredData].sort((a: any, b: any) => dir * compareSortValues(a[key], b[key]));
    }, [filteredData, columns, sortColumnIndex, sortDirection]);

    const handleSortHeaderClick = useCallback(
        (columnIndex: number) => {
            const col = columns[columnIndex];
            if (!col?.sortable || !col.sortKey) return;
            if (sortColumnIndex === columnIndex) {
                setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
            } else {
                setSortColumnIndex(columnIndex);
                setSortDirection('asc');
            }
        },
        [columns, sortColumnIndex],
    );

    return (
        <div className="flex flex-col flex-1 min-h-0 min-w-0">
            <DataTable 
                wrapperClassName={wrapperClassName}
                tableClassName="min-w-[1000px] border-collapse sticky-header"
            >
                <thead className="sticky top-0 z-20 bg-slate-50 border-b border-slate-200">
                    <tr className="bg-slate-50 border-b border-slate-200 sticky top-0 z-30">
                        {renderSubTable && (
                            <th className="px-3 py-2 text-center border-r border-slate-200 bg-slate-50" style={{ width: '40px' }}>
                                <Button
                                    variant="filterToggle"
                                    active={showInlineFilters}
                                    onClick={() => setShowInlineFilters(!showInlineFilters)}
                                    title="Alternar filtros"
                                >
                                    <Filter className="w-3.5 h-3.5" />
                                </Button>
                            </th>
                        )}
                        {columns.map((col, idx) => {
                            const isSortable = Boolean(col.sortable && col.sortKey);
                            const isActiveSort = sortColumnIndex === idx;
                            return (
                                <th
                                    key={idx}
                                    className={`${TH_CLASS} text-${col.headerAlign || 'left'} ${isSortable ? 'select-none' : ''}`}
                                    style={{ width: col.width }}
                                >
                                    {isSortable ? (
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1 w-full hover:text-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSortHeaderClick(idx);
                                            }}
                                            title={`Ordenar por ${col.label}`}
                                        >
                                            <span>{col.label}</span>
                                            {isActiveSort ? (
                                                sortDirection === 'asc' ? (
                                                    <ChevronDown className="w-3.5 h-3.5 shrink-0 rotate-180" aria-hidden />
                                                ) : (
                                                    <ChevronDown className="w-3.5 h-3.5 shrink-0" aria-hidden />
                                                )
                                            ) : (
                                                <ChevronsUpDown className="w-3.5 h-3.5 shrink-0 opacity-40" aria-hidden />
                                            )}
                                        </button>
                                    ) : (
                                        col.label
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                    {showInlineFilters && (
                        <tr className="bg-slate-100/50 border-b border-slate-200 animate-in fade-in slide-in-from-top-1 duration-200">
                            {renderSubTable && (
                                <th className={TH_FILTER}>
                                    {Object.values(inlineFilters).some(v => v !== '') && (
                                        <button
                                            onClick={clearFilters}
                                            className="w-full flex items-center justify-center p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                            title="Limpiar filtros"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                </th>
                            )}
                            {columns.map((col, idx) => (
                                <th key={idx} className={TH_FILTER}>
                                    {col.filterKey && (
                                        <Input
                                            variant="filter"
                                            placeholder="Filtrar..."
                                            value={inlineFilters[col.filterKey] || ''}
                                            onChange={(e) => setInlineFilters(prev => ({ 
                                                ...prev, 
                                                [col.filterKey!]: e.target.value 
                                            }))}
                                            className={col.contentAlign === 'center' ? 'text-center' : ''}
                                        />
                                    )}
                                </th>
                            ))}
                        </tr>
                    )}
                </thead>
                <tbody className="bg-white">
                    {displayData.map((item: any, index) => (
                        <React.Fragment key={item.id}>
                            <tr
                                className={`group border-b border-slate-100/60 hover:bg-blue-50/40 cursor-pointer transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'} ${expandedId === item.id ? 'bg-blue-50/60' : ''}`}
                                onClick={() => renderSubTable && toggleExpand(item.id)}
                            >
                                {renderSubTable && (
                                    <td className="p-2 text-center border-r border-slate-100">
                                        {expandedId === item.id ? (
                                            <ChevronDown className="w-4 h-4 text-blue-600 mx-auto" />
                                        ) : (
                                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 mx-auto" />
                                        )}
                                    </td>
                                )}
                                {columns.map((col, idx) => (
                                    <td 
                                        key={idx} 
                                        className={`${TD_CLASS} text-${col.contentAlign || 'left'}`}
                                    >
                                        {col.render(item)}
                                    </td>
                                ))}
                            </tr>
                            {expandedId === item.id && renderSubTable && (
                                <tr className="bg-slate-50/90 border-b border-slate-200">
                                    {/* Sangrado: Primera columna (Expand) y Segunda columna (ID) */}
                                    <td className="border-r border-slate-200 bg-slate-50/10" />
                                    <td className="border-r border-slate-200 bg-slate-50/10" />
                                    
                                    <td colSpan={columns.length - 1} className="p-0 border-none">
                                        <div className="bg-white m-4 border border-slate-200 rounded-sm shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                            {renderSubTable(item)}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </DataTable>
            {showResultsInfo && (
                <TableResultsInfo visibleCount={displayData.length} totalCount={totalCount ?? data.length} />
            )}
        </div>
    );
};
