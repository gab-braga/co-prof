import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX } from '../utils/regex';
import { resetPassword } from '../firebase/auth';
import toast from 'react-hot-toast';

export default () => {
  const modalRef = useRef(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  async function onSubmit(data) {
    const modalElement = modalRef.current;
    if (modalElement) {
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        try {
          await resetPassword(data.email);
          modal.hide();
          toast.success('E-mail enviado!');
        } catch (error) {
          console.log(error);
          toast.error('Algo deu errado. Tente novamente.');
        }
      }
    }
  }

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id="forgotPasswordModal"
      tabIndex="-1"
      aria-labelledby="forgotPasswordModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5" id="forgotPasswordModalLabel">
              Recuperação de Senha
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit(onSubmit)} id="forgot-password-form">
              <div className="form-group mt-3">
                <label htmlFor="emailRecovery" className="form-label">
                  Digite seu e-mail para recuperar senha
                </label>
                <input
                  {...register('email', {
                    required: {
                      value: true,
                      message: 'Por favor, preencha com seu e-mail.',
                    },
                    pattern: {
                      value: EMAIL_REGEX,
                      message: 'E-mail inválido. Verifique e tente novamente.',
                    },
                  })}
                  type="text"
                  id="emailRecovery"
                  className={
                    errors.email ? 'form-control is-invalid' : 'form-control'
                  }
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    {errors.email?.message}
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
              Fechar
            </button>
            <button form="forgot-password-form" className="btn btn-primary">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
