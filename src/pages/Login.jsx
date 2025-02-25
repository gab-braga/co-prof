import React from 'react';
import Background from '../assets/background01.png';
import CoProfIcon from '../assets/co-prof-square.svg';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EMAIL_REGEX } from '../utils/regex';
import { login } from '../firebase/auth';
import toast, { Toaster } from 'react-hot-toast';

export default () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  async function onSubmit(data) {
    toast.promise(
      async () => {
        await login(data);
        navigate('/');
      },
      {
        loading: 'Carregando..',
        error: 'E-mail ou senha incorretos.',
        success: null,
      },
    );
  }

  return (
    <div className="min-vh-100 row p-3" style={{ '--bs-gutter-x': '0' }}>
      <div
        className="d-none d-md-block rounded-3 overflow-hidden col-md-6 col-lg-8 p-0"
        style={{
          backgroundImage: `url('${Background}')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div
          className="w-100 h-100 bg-primary"
          style={{ opacity: '50%' }}
        ></div>
      </div>

      <div className="col-12 col-md-6 col-lg-4 px-sm-4 py-5">
        <div className="d-flex flex-wrap align-items-center gap-3">
          <img src={CoProfIcon} alt="CoProf" />
          <h1 className="ff-poppins m-0">Login</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
          <span>
            Ainda não tem conta? <Link to="/signup">Cadastre-se</Link>
          </span>

          <div className="form-group mt-3">
            <label htmlFor="email" className="form-label">
              E-mail
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
              id="email"
              className={
                errors.email ? 'form-control is-invalid' : 'form-control'
              }
            />
            {errors.email && (
              <div class="invalid-feedback">{errors.email?.message}</div>
            )}
          </div>

          <div className="form-group mt-3">
            <label htmlFor="senha" className="form-label">
              Senha
            </label>
            <input
              {...register('password', {
                required: {
                  value: true,
                  message: 'Por favor, preencha com sua senha.',
                },
              })}
              type="password"
              id="senha"
              className={
                errors.password ? 'form-control is-invalid' : 'form-control'
              }
            />
            {errors.password && (
              <div class="invalid-feedback">{errors.password?.message}</div>
            )}
          </div>

          <button className="w-100 btn bg-gradient-blue mt-4">Entrar</button>
        </form>

        <div className="text-end mt-3">
          <Link to="/signin">Esqueci minha senha</Link>
        </div>
      </div>

      <Toaster />
    </div>
  );
};
