import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createClass } from '../services/classService';

export default ({ handleUpdates }) => {
  const modalRef = useRef(null);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  function executeUpdates() {
    if (typeof handleUpdates === 'function') handleUpdates();
  }

  async function onSubmit(data) {
    const modalElement = modalRef.current;
    if (modalElement) {
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        toast.promise(
          async () => {
            await createClass(data);
            reset();
            executeUpdates();
            modal.hide();
          },
          {
            loading: 'Carregando...',
            success: 'Nova turma cadastrada.',
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
      id="create-class-modal"
      tabIndex="-1"
      aria-labelledby="create-class-modal-label"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5" id="create-class-modal-label">
              Nova Turma
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)} id="create-class-form">
              <div className="form-group mt-3">
                <label htmlFor="name" className="form-label">
                  Digite o nome da turma
                  <span className="text-danger">*</span>
                </label>
                <input
                  {...register('name', {
                    required: {
                      value: true,
                      message:
                        'Por favor, preencha com o nome da turma (Ex: Inglês Instrumental).',
                    },
                    maxLength: {
                      value: 100,
                      message: 'Limite máximo de 100 caracteres.',
                    },
                  })}
                  type="text"
                  id="name"
                  autoComplete="off"
                  placeholder="Nome da turma"
                  className={
                    errors.name ? 'form-control is-invalid' : 'form-control'
                  }
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name?.message}</div>
                )}
              </div>

              <div className="form-group mt-3">
                <label htmlFor="section" className="form-label">
                  Digite a seção da turma
                </label>
                <input
                  {...register('section', {
                    maxLength: {
                      value: 100,
                      message: 'Limite máximo de 100 caracteres.',
                    },
                  })}
                  type="text"
                  id="section"
                  autoComplete="off"
                  placeholder="Seção da turma"
                  className={
                    errors.section ? 'form-control is-invalid' : 'form-control'
                  }
                />
                {errors.section && (
                  <div className="invalid-feedback">
                    {errors.section?.message}
                  </div>
                )}
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              <i className="bi bi-x-lg me-2"></i>
              Fechar
            </button>
            <button form="create-class-form" className="btn btn-primary">
              <i className="bi bi-plus-lg me-2"></i>
              Criar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
