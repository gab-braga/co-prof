import React from 'react';
import Background from '../assets/background02.png';
import CoProfIcon from '../assets/co-prof-square.svg';
import { Link } from 'react-router-dom';

export default () => {
  return (
    <div className="min-vh-100 row p-3" style={{ '--bs-gutter-x': '0' }}>
      <div
        className="d-none d-md-block rounded-3 overflow-hidden col-md-6 p-0"
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
      <div className="col-12 col-md-6 px-4 py-5">
        <div className="d-flex align-items-center gap-3">
          <img src={CoProfIcon} alt="CoProf" />
          <h1 className="ff-poppins m-0">Cadastre-se</h1>
        </div>

        <form className="mt-5">
          <span className="text-">
            Já está cadastrado? <Link to="/signin">Acesse</Link>
          </span>

          <div className="form-group mt-3">
            <label htmlFor="name" className="form-label">
              Nome
            </label>
            <input type="text" id="name" className="form-control" />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="email" className="form-label">
              E-mail
            </label>
            <input type="text" id="email" className="form-control" />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="senha" className="form-label">
              Senha
            </label>
            <input type="password" id="senha" className="form-control" />
          </div>

          <button className="w-100 btn bg-gradient-blue mt-4">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};
