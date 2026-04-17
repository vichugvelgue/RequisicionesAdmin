import React from "react";
import { DatePicker } from "../DatePicker/DatePicker";

export interface DateInputWithClearProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
}

/**
 * Fecha con limpiar; usa calendario (DD-MMM-YYYY en pantalla, valor ISO yyyy-mm-dd).
 */
export function DateInputWithClear(props: DateInputWithClearProps) {
  return <DatePicker placeholder="Seleccionar fecha" {...props} />;
}
