import React, {
  createContext,
  useContext,
  type ReactNode,
  type MouseEvent,
} from 'react';

interface TabsContextValue {
  value: string;
  onChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ value, onChange, children, className = '' }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div
      className={`flex items-center gap-4  border-b border-brand-neutral/20 px-4 py-2 overflow-x-auto scrollbar-thin ${className}`.trim()}
    >
      {children}
    </div>
  );
}

export interface TabsTabProps {
  value: string;
  label: ReactNode;
  badge?: ReactNode;
  className?: string;
}

export function TabsTab({ value, label, badge, className = '' }: TabsTabProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    return null;
  }
  const isActive = ctx.value === value;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (value !== ctx.value) {
      ctx.onChange(value);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center gap-2 pb-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${isActive
        ? 'border-brand-primary text-brand-primary'
        : 'border-transparent text-brand-neutral/70 hover:text-brand-neutral'
        } ${className}`.trim()}
    >
      <span>{label}</span>
      {badge && (
        <span className="bg-brand-secondary/30 text-brand-primary py-0.5 px-2 rounded-full text-[10px]">
          {badge}
        </span>
      )}
    </button>
  );
}

export interface TabsPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsPanel({ value, children, className = '' }: TabsPanelProps) {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;
  return <div className={className}>{children}</div>;
}

