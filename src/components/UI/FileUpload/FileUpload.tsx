import React, { useRef, useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';

export interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  /** Archivos actualmente seleccionados (controlado). Si se pasa, se muestran dentro del componente. */
  selectedFiles?: File[];
  /** Se llama al pulsar "Limpiar" para vaciar la selección. Recomendado cuando se usa selectedFiles. */
  onClear?: () => void;
  /** Se llama al quitar un archivo de la lista (índice). Para uso con múltiples archivos. */
  onRemoveFile?: (index: number) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxSize?: number;
  placeholder?: string;
  /** Texto cuando ya hay archivo(s) para indicar reemplazo. */
  replaceHint?: string;
  /** Leyenda cuando la lista está vacía. */
  emptyListLabel?: string;
  /** Clase Tailwind para la altura del componente (ej. 'h-[88px]'). */
  heightClass?: string;
  className?: string;
}

const DEFAULT_PLACEHOLDER =
  'Arrastra archivos aquí o haz clic para seleccionar';
const DEFAULT_REPLACE_HINT = '';
const DEFAULT_EMPTY_LIST_LABEL = 'Aún no hay archivos';

function filterByMaxSize(files: File[], maxSize: number): File[] {
  return maxSize > 0 ? files.filter((f) => f.size <= maxSize) : files;
}

export function FileUpload({
  onFilesSelected,
  selectedFiles,
  onClear,
  onRemoveFile,
  accept,
  multiple = false,
  disabled = false,
  maxSize,
  placeholder = DEFAULT_PLACEHOLDER,
  replaceHint = DEFAULT_REPLACE_HINT,
  emptyListLabel = DEFAULT_EMPTY_LIST_LABEL,
  heightClass = 'h-[88px]',
  className = '',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList?.length) return;
      const files = Array.from(fileList);
      const filtered = maxSize != null ? filterByMaxSize(files, maxSize) : files;
      if (filtered.length) onFilesSelected(filtered);
    },
    [onFilesSelected, maxSize]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    []
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  const handleZoneClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      if ((e.target as HTMLElement).closest('[data-fileupload-clear]')) return;
      inputRef.current?.click();
    },
    [disabled]
  );

  const handleRemoveFile = useCallback(
    (e: React.MouseEvent, index: number) => {
      e.preventDefault();
      e.stopPropagation();
      onRemoveFile?.(index);
    },
    [onRemoveFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      e.target.value = '';
    },
    [handleFiles]
  );

  const normalClasses =
    'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50/50';
  const dragClasses = 'border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/20';
  const disabledClasses =
    'cursor-not-allowed bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-100 hover:border-slate-200';

  const zoneClasses =
    'rounded border-2 border-dashed text-slate-600 transition-colors outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 flex items-center justify-center shrink-0 ' +
    (disabled ? disabledClasses : isDragging ? dragClasses : normalClasses);

  const files = selectedFiles ?? [];
  const hasFiles = files.length > 0;

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        className="hidden"
        aria-hidden
      />
      <div className={`grid grid-cols-6 gap-3 w-full ${heightClass} ${className}`}>
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          className={`${zoneClasses} col-span-2 min-w-0 h-full cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleZoneClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          title={hasFiles ? replaceHint : placeholder}
        >
          <div className="flex flex-col items-center justify-center gap-1 px-1 text-center">
            <Upload className={`w-5 h-5 shrink-0 ${disabled ? 'text-slate-500' : 'text-slate-400'}`} aria-hidden />
            <span className="text-[10px] text-slate-500 leading-tight">Arrastra o haz clic para cargar archivos</span>
          </div>
        </div>
        <div className="col-span-4 flex flex-col min-w-0 min-h-0 gap-1 overflow-hidden border border-slate-200 rounded bg-white">
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr>
                  <th className="px-3 py-1.5 font-bold border-b border-r border-slate-200 text-[11px] text-slate-500 text-left bg-slate-50 sticky top-0 z-10">
                    Nombre archivo
                  </th>
                  <th className="px-3 py-1.5 font-bold border-b border-slate-200 text-[11px] text-slate-500 text-center bg-slate-50 w-20 min-w-[5rem] sticky top-0 z-10">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {hasFiles ? (
                  files.map((f, i) => (
                    <tr key={`${f.name}-${i}`} className="border-b border-slate-100/60 hover:bg-blue-50/50">
                      <td className="px-3 py-1.5 border-r border-slate-100/60 text-slate-700 truncate max-w-0" title={f.name}>
                        {f.name}
                      </td>
                      <td className="px-3 py-1.5 border-slate-100/60 text-center">
                        {onRemoveFile && (
                          <button
                            type="button"
                            data-fileupload-clear
                            onClick={(e) => handleRemoveFile(e, i)}
                            className="p-0.5 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors inline-flex items-center justify-center"
                            title="Quitar archivo"
                            aria-label={`Quitar ${f.name}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="px-3 py-3 text-slate-400 italic text-center" aria-live="polite">
                      {emptyListLabel}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
