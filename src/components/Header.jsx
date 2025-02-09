import React from 'react';
import CoProfIcon from '../assets/co-prof-blue.svg';
import { Link, NavLink } from 'react-router-dom';

export default () => {
  const [logged] = React.useState(false);

  return (
    <header className="py-2">
      <nav
        className="navbar navbar-expand-md container"
        aria-label="Menu Lateral"
      >
        <div className="container-fluid">
          <a href="/" className="navbar-brand d-flex align-items-center gap-3">
            <img src={CoProfIcon} alt="CoProf" />
            <h1 className="m-0 text-primary ff-poppins">CoProf</h1>
          </a>
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
            className="offcanvas offcanvas-end"
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
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end align-items-md-center flex-grow-1 pe-3">
                {logged ? (
                  <>
                    <li className="nav-item">
                      <NavLink className="nav-link text-primary fs-5" to="/">
                        Home
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink
                        className="nav-link text-primary fs-5"
                        to="/account"
                      >
                        Conta
                      </NavLink>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link
                        className="btn btn-outline-primary mb-3 mb-md-0 me-md-3"
                        to="/signin"
                      >
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="btn bg-gradient-blue" to="/signup">
                        Cadastre-se
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
