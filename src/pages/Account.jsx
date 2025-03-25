import React, { useEffect, useState } from 'react';
import PanelHeader from '../components/PanelHeader';
import {
  getAuthenticatedUser,
  updateUser,
  updateUserPassword,
} from '../services/userService';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX } from '../utils/regex';
import toast from 'react-hot-toast';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import ConfirmDeleteAccountModal from '../components/ConfirmDeleteAccountModal';

export default () => {
  return (
    <div className="min-vh-100 d-flex flex-column gradient-blue-to-top">
      <PanelHeader />

      <div className="container flex-grow-1">
        <div
          className="bg-white p-4 mt-4 rounded-3 shadow mb-5"
          style={{ minHeight: '70vh' }}
        >
          <div className="row">
            <div className="col-12 col-lg-6">
              <h2 className="ff-popins fs-4">Dados da Conta</h2>

              <FormAccess />
            </div>

            <div className="col-12 col-lg-6 mt-5 mt-lg-0">
              <h2 className="ff-popins fs-4">Alterar Senha</h2>

              <FormPassword />
            </div>

            <div className="col-12 col-lg-6 mt-5">
              <h2 className="ff-popins fs-4">Excluir Conta</h2>

              <button
                data-bs-toggle="modal"
                data-bs-target="#confirm-delete-account-modal"
                className="btn btn-danger w-100 mt-2"
              >
                Excluir Conta
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDeleteAccountModal />
    </div>
  );
};

function FormAccess() {
  const [isLoading, setIsLoading] = useState(true);
  const { logout } = useAuth();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    toast.promise(
      async () => {
        await updateUser(data);
        logout();
      },
      {
        loading: 'Carregando...',
        success: 'Dados atualizados.',
        error: 'Algo deu errado. Tente novamente mais tarde.',
      },
    );
  }

  async function loadingData() {
    setIsLoading(true);
    try {
      const user = await getAuthenticatedUser();
      const { name, email } = user;
      reset({ name, email });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadingData();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group mt-3">
        <label htmlFor="name" className="form-label">
          Nome
        </label>
        <input
          disabled={isLoading}
          {...register('name', {
            required: {
              value: true,
              message: 'Por favor, preencha com seu nome.',
            },
            maxLength: {
              value: 250,
              message: 'Limite máximo de 250 caracteres.',
            },
          })}
          autoComplete="off"
          type="text"
          id="name"
          className={errors.name ? 'form-control is-invalid' : 'form-control'}
        />
        {errors.name && (
          <div className="invalid-feedback">{errors.name?.message}</div>
        )}
      </div>

      <div className="form-group mt-3">
        <label htmlFor="email" className="form-label">
          E-mail
        </label>
        <input
          disabled={isLoading}
          {...register('email', {
            required: {
              value: true,
              message: 'Por favor, preencha com seu e-mail.',
            },
            maxLength: {
              value: 250,
              message: 'Limite máximo de 250 caracteres.',
            },
            pattern: {
              value: EMAIL_REGEX,
              message: 'E-mail inválido. Verifique e tente novamente.',
            },
          })}
          autoComplete="off"
          type="text"
          id="email"
          className={errors.email ? 'form-control is-invalid' : 'form-control'}
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email?.message}</div>
        )}
      </div>

      <button disabled={isLoading} className="btn bg-gradient-blue w-100 mt-4">
        Salvar
      </button>
    </form>
  );
}

function FormPassword() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  function onSubmit(data) {
    toast.promise(
      async () => {
        await updateUserPassword(data);
        navigate('/signin');
      },
      {
        loading: 'Carregando...',
        success: 'Senha atualizada.',
        error: 'Algo deu errado. Tente novamente mais tarde.',
      },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group mt-3">
        <label htmlFor="new-password" className="form-label">
          Nova Senha
        </label>
        <input
          {...register('newPassword', {
            required: {
              value: true,
              message: 'Por favor, preencha com sua nova senha.',
            },
            maxLength: {
              value: 50,
              message: 'Limite máximo de 50 caracteres.',
            },
          })}
          type="password"
          id="new-password"
          className={
            errors.newPassword ? 'form-control is-invalid' : 'form-control'
          }
        />
        {errors.newPassword && (
          <div className="invalid-feedback">{errors.newPassword?.message}</div>
        )}
      </div>

      <div className="form-group mt-3">
        <label htmlFor="confirm-password" className="form-label">
          Confirmar Senha
        </label>
        <input
          {...register('confirmPassword', {
            required: {
              value: true,
              message: 'Por favor, preencha novamente com sua nova senha.',
            },
            maxLength: {
              value: 50,
              message: 'Limite máximo de 50 caracteres.',
            },
          })}
          type="password"
          id="confirm-password"
          className={
            errors.confirmPassword ? 'form-control is-invalid' : 'form-control'
          }
        />
        {errors.confirmPassword && (
          <div className="invalid-feedback">
            {errors.confirmPassword?.message}
          </div>
        )}
      </div>

      <button className="btn bg-gradient-blue w-100 mt-4">Alterar</button>
    </form>
  );
}
