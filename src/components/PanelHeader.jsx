import React, { useEffect } from 'react';
import CoProfIconLight from '../assets/co-prof-white.svg';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import toast from 'react-hot-toast';

export default () => {
  const { logout } = useAuth();

  function handleLogout() {
    toast.promise(
      async () => {
        await logout();
      },
      {
        loading: 'Carregando...',
        error: 'Algo deu errado. Verifique e tente novamente.',
        success: null,
      },
    );
  }

  function resetBodyStyles() {
    document.body.removeAttribute('style');
  }

  useEffect(() => resetBodyStyles, []);

  return (
    <header className="py-2">
      <nav
        className="navbar navbar-expand-md container"
        aria-label="Menu Lateral"
      >
        <div className="container-fluid">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-3">
            <img src={CoProfIconLight} alt="CoProf" />
            <h1 className="m-0 text-light ff-poppins">CoProf</h1>
          </Link>
          <button
            className="navbar-toggler border-0 shadow-none"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#sideMenu"
            aria-controls="sideMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="offcanvas offcanvas-end text-bg-dark"
            tabIndex="-1"
            id="sideMenu"
            aria-labelledby="sideMenuLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="sideMenuLabel">
                Menu
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end align-items-md-center flex-grow-1 pe-3">
                <li className="nav-item">
                  <NavLink className="nav-link fs-5 text-light" to="/classes">
                    Turmas
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link fs-5 text-light" to="/account">
                    Conta
                  </NavLink>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleLogout}
                    className="nav-link fs-5 text-light"
                  >
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
