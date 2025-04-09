import { useRef } from 'react';
import toast from 'react-hot-toast';
import { deleteUser } from '../../services/userService';
import { useNavigate } from 'react-router-dom';

export default () => {
  const modalRef = useRef(null);
  const navigate = useNavigate();

  async function handleConfirm() {
    const modalElement = modalRef.current;
    if (modalElement) {
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        toast.promise(
          async () => {
            await deleteUser();
            modal.hide();
            navigate('/signin');
          },
          {
            loading: 'Carregando...',
            success: 'Conta excluída.',
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
      id="confirm-delete-account-modal"
      tabIndex="-1"
      aria-labelledby="confirm-delete-account-modal-label"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2
              className="modal-title fs-5"
              id="confirm-delete-account-modal-label"
            >
              Tem certeza que deseja excluir esta conta?
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
            <button
              onClick={handleConfirm}
              type="button"
              className="btn btn-danger"
            >
              <i className="bi bi-trash3 me-2"></i>
              Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
