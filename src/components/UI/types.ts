import type { ReactNode } from 'react';

/** Option shape used in Select, RadioGroup, GlobalSearchBar, etc. */
export interface OptionItem {
  value: string;
  label: string;
}

/** Sort state for tables */
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export type ButtonVariant =
  | 'primary'
  | 'primarySm'
  | 'secondary'
  | 'outline'
  | 'outlinePage'
  | 'outlinePageActive'
  | 'dark'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'icon'
  | 'iconAmber'
  | 'iconRed'
  | 'iconSuccess'
  | 'filterToggle';

export type ButtonSize = 'xs' | 'md' | 'xl';

/** Variantes de color para DisplayLabel (etiquetas/chips de solo lectura) */
export type DisplayLabelVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'outline'
  | 'dark'
  | 'ghost';

/** Tamaños estándar para DisplayLabel; usar className para custom */
export type DisplayLabelSize = 'xs' | 'sm' | 'md' | 'xl';

export type InputVariant =
  | 'default'
  | 'search'
  | 'filter'
  | 'disabled'
  | 'numberCell'
  /** Formulario: cantidades / importes alineados a la derecha (misma escala que default). */
  | 'quantity'
  | 'searchLarge'
  | 'gridFilter';

export type StatusBadgeVariant =
  | 'Activa'
  | 'Cancelada'
  | 'Cerrada'
  | 'Borrador'
  | 'Transito'
  | 'Recibido'
  | 'Solicitado';

export type ActionButtonVariant =
  | 'icon'
  | 'iconAmber'
  | 'iconRed'
  | 'iconSuccess';

export interface ActionItem {
  icon: ReactNode;
  onClick: () => void;
  title: string;
  variant?: ActionButtonVariant;
}

export type ConfirmModalVariant = 'neutral' | 'danger';

export type ToastVariant = 'success' | 'error';

/** Props for views that receive setActiveView (e.g. Componentes views) */
export interface SetActiveViewProps {
  setActiveView: (view: string) => void;
}

/** Rango yyyy-mm-dd / yyyy-mm-dd para DateRangePicker en barra de búsqueda */
export interface SearchDateRangeValue {
  start: string;
  end: string;
}

/** TableFilterBar filter types */
export interface TableFilterSearch {
  type: 'search';
  cols?: number;
  /** @deprecated Visual: ya no se muestra label separado; el criterio va en el select del bloque unificado */
  labelCriteria?: string;
  criteriaOptions?: OptionItem[];
  criteriaValue?: string;
  onCriteriaChange?: (value: string) => void;
  /** Etiqueta del bloque completo (ej. "Búsqueda:") */
  labelInput?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  placeholder?: string;
  /** Valor del select que activa el DateRangePicker en lugar del texto */
  dateRangeCriteria?: string;
  dateRangeValue?: SearchDateRangeValue | undefined;
  onDateRangeChange?: (value: SearchDateRangeValue | undefined) => void;
}

export interface TableFilterSelect {
  type: 'select';
  cols?: number;
  label?: string;
  options?: OptionItem[];
  value?: string;
  onChange?: (value: string) => void;
}

export interface TableFilterDate {
  type: 'date';
  cols?: number;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  clearable?: boolean;
}

export interface TableFilterCustom {
  type: 'custom';
  cols?: number;
  children?: ReactNode;
}

export type TableFilter =
  | TableFilterSearch
  | TableFilterSelect
  | TableFilterDate
  | TableFilterCustom;

export interface TableFilterBarAction {
  label: string;
  onClick: () => void;
  variant?: string;
  icon?: ReactNode;
  title?: string;
  disabled?: boolean;
}
