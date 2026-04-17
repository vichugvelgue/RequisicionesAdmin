import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageCard,
  ViewHeader,
  BackLink,
  FormSection,
  Button,
  ConfirmModal,
  Toast,
  EmptyState,
} from '../../../components/UI';
import { Plus, Ban } from 'lucide-react';

/**
 * Página exclusiva de componentes: Feedback.
 */
export function ComponentesFeedbackView() {
  const navigate = useNavigate();
  const [toastVisible, setToastVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), 3000);
    return () => clearTimeout(t);
  }, [toastVisible]);

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 lg:p-6 overflow-auto">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">Feedback</h1>
          <BackLink onClick={() => navigate('/')}>
            Volver al Dashboard
          </BackLink>
        </div>
        <p className="text-sm text-slate-600 -mt-2">
          Toast, ConfirmModal, EmptyState (estilos ERP).
        </p>

        <PageCard>
          <ViewHeader title="Feedback" />
          <div className="p-5 flex flex-col gap-8">
            <FormSection title="Toast">
              <Button variant="primary" onClick={() => setToastVisible(true)}>
                Mostrar Toast
              </Button>
            </FormSection>
            <FormSection title="ConfirmModal">
              <Button variant="danger" onClick={() => setModalOpen(true)}>
                Abrir modal de confirmación
              </Button>
            </FormSection>
            <FormSection title="EmptyState">
              <EmptyState
                title="No hay partidas agregadas aún."
                description="Usa la barra superior para buscar y agregar productos."
              />
            </FormSection>
          </div>
        </PageCard>
      </div>

      <Toast
        visible={toastVisible}
        title="¡Partida agregada!"
        description="Verifica la cantidad en el grid."
        icon={<Plus className="w-3.5 h-3.5 text-white" />}
      />

      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={() => setModalOpen(false)}
        title="Confirmar acción"
        icon={<Ban className="w-5 h-5 text-red-600" />}
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
