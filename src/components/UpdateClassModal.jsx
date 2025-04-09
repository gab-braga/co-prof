import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { findClass, updateClass } from '../services/classService';

export default ({ id, handleUpdates }) => {
  const [isLoading, setIsLoading] = useState(true);
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
            await updateClass(id, data);
            reset();
            executeUpdates();
            modal.hide();
          },
          {
            loading: 'Carregando...',
            success: 'Alterações concluídas.',
            error: 'Algo deu errado. Tente novamente mais tarde.',
          },
        );
      }
    }
  }

  async function loadData() {
    setIsLoading(true);
    try {
      const data = await findClass(id);
      reset(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [id]);

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id={`update-class-modal-${id}`}
      tabIndex="-1"
      aria-labelledby={`update-class-modal-label-${id}`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2
              className="modal-title fs-5"
              id={`update-class-modal-label-${id}`}
            >
              Editar Turma
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form
              onSubmit={handleSubmit(onSubmit)}
              id={`update-class-form-${id}`}
            >
              <div className="form-group mt-3">
                <label htmlFor={`name-${id}`} className="form-label">
                  Digite o nome da turma
                  <span className="text-danger">*</span>
                </label>
                <input
                  disabled={isLoading}
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
                  id={`name-${id}`}
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
                <label htmlFor={`section-${id}`} className="form-label">
                  Digite a seção da turma
                </label>
                <input
                  disabled={isLoading}
                  {...register('section', {
                    maxLength: {
                      value: 100,
                      message: 'Limite máximo de 100 caracteres.',
                    },
                  })}
                  type="text"
                  id={`section-${id}`}
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
            <button
              form={`update-class-form-${id}`}
              className="btn btn-primary"
            >
              <i className="bi bi-pencil me-2"></i>
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
