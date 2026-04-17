import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageCard,
  ViewHeader,
  BackLink,
  FormSection,
  Label,
  FileUpload,
  Toast,
} from '../../../components/UI';

/**
 * Página exclusiva de componentes: File Upload (drag-and-drop y click).
 * Con archivos seleccionados se muestra: izquierda = cuadrado para subir, derecha = lista con opción de quitar.
 */
export function ComponentesFileUploadView() {
  const navigate = useNavigate();
  const [basicFiles, setBasicFiles] = useState<File[]>([]);
  const [multiFiles, setMultiFiles] = useState<File[]>([]);
  const [toastVisible, setToastVisible] = useState(false);

  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), 3000);
    return () => clearTimeout(t);
  }, [toastVisible]);

  const handleBasicSelect = (files: File[]) => {
    setBasicFiles(files);
    setToastVisible(true);
  };

  const handleMultipleSelect = (files: File[]) => {
    setMultiFiles(files);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-6 overflow-auto">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">File Upload</h1>
          <BackLink onClick={() => navigate('/')}>
            Volver al Dashboard
          </BackLink>
        </div>
        <p className="text-sm text-slate-600 -mt-2">
          Componente de carga de archivos con drag-and-drop y click para abrir el
          selector (estilos ERP).
        </p>

        <PageCard>
          <ViewHeader title="FileUpload" />

          <div className="p-5 flex flex-col gap-8">
            <FormSection
              title="Básico (un archivo)"
              subtitle="Arrastra un archivo o haz clic. Al elegir, verás a la izquierda el cuadrado para subir y a la derecha la lista con opción de quitar."
            >
              <div className="flex flex-col gap-2">
                <Label>Seleccionar archivo</Label>
                <FileUpload
                  onFilesSelected={handleBasicSelect}
                  selectedFiles={basicFiles}
                  onClear={() => setBasicFiles([])}
                  onRemoveFile={(index) => setBasicFiles((prev) => prev.filter((_, i) => i !== index))}
                />
              </div>
            </FormSection>

            <FormSection
              title="Múltiple y tipo (Excel)"
              subtitle="Varios archivos; solo .xlsx y .xls. Izquierda: cuadrado para subir. Derecha: lista con quitar por archivo."
            >
              <div className="flex flex-col gap-2">
                <Label>Archivos Excel</Label>
                <FileUpload
                  multiple
                  accept=".xlsx,.xls"
                  placeholder="Arrastra archivos Excel o haz clic"
                  onFilesSelected={handleMultipleSelect}
                  selectedFiles={multiFiles}
                  onClear={() => setMultiFiles([])}
                  onRemoveFile={(index) => setMultiFiles((prev) => prev.filter((_, i) => i !== index))}
                />
              </div>
            </FormSection>

            <FormSection
              title="Deshabilitado"
              subtitle="Estado disabled."
            >
              <FileUpload
                disabled
                onFilesSelected={() => {}}
                placeholder="Zona deshabilitada"
              />
            </FormSection>
          </div>
        </PageCard>
      </div>

      <Toast
        visible={toastVisible}
        title="Archivo seleccionado correctamente."
        variant="success"
      />
    </div>
  );
}
