import { useRef } from 'react';
import toast from 'react-hot-toast';
import { deleteRecording } from '../../services/recordingService';

export default ({ id, handleUpdates }) => {
  const modalRef = useRef(null);

  function executeUpdates() {
    if (typeof handleUpdates === 'function') handleUpdates();
  }

  async function handleConfirm() {
    const modalElement = modalRef.current;
    if (modalElement) {
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        toast.promise(
          async () => {
            await deleteRecording(id);
            executeUpdates();
            modal.hide();
          },
          {
            loading: 'Carregando...',
            success: 'Gravação excluída.',
            error: 'Algo deu errado. Tente novamente mais tarde.',
          },
        );
      }
    }
  }

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id={`confirm-delete-recording-modal-${id}`}
      tabIndex="-1"
      aria-labelledby={`confirm-delete-recording-modal-label-${id}`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2
              className="modal-title fs-5"
              id={`confirm-delete-recording-modal-label-${id}`}
            >
              Tem certeza que deseja excluir?
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">Esta ação não poderá ser desfeita.</div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              <i className="bi bi-x-lg me-2"></i>
              Fechar
            </button>
            <button onClick={handleConfirm} className="btn btn-danger">
              <i className="bi bi-trash3 me-2"></i>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
