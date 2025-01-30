import React from 'react';
import CoProfIcon from '../assets/co-prof-blue.svg';

export default () => {
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
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <a className="nav-link text-primary fs-5" href="#">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-primary fs-5" href="#">
                    Link
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
