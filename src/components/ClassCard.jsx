import React from 'react';
import UpdateClassModal from './Modal/UpdateClassModal';
import ConfirmDeleteClassModal from './Modal/ConfirmDeleteClassModal';
import { Link } from 'react-router-dom';

export default ({ id, name, section, className, handleUpdates, ...rest }) => {
  return (
    <div id={id} className={className} {...rest}>
      <div className="border border-2 border-primary p-3 rounded mt-4">
        <div className="d-flex flex-column" style={{ minHeight: '150px' }}>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="fs-5 text-truncate">{name || '...'}</h3>
            <div className="dropdown">
              <button
                type="type"
                data-bs-toggle="dropdown"
                className="btn fs-5 border-0 p-0"
              >
                <i className="bi bi-three-dots-vertical"></i>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target={`#update-class-modal-${id}`}
                    className="btn dropdown-item"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target={`#confirm-delete-class-modal-${id}`}
                    className="btn dropdown-item"
                  >
                    Excluir
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <span className="fs-6 text-secondary text-truncate">
            {section || '...'}
          </span>
          <div className="flex-grow-1 d-flex flex-wrap gap-2 justify-content-end align-items-end">
            <Link
              to={`/classes/${id}`}
              className="btn btn-sm btn-primary text-nowrap"
            >
              <i className="bi bi-box-arrow-up-right me-2"></i>
              Abrir
            </Link>
            <Link
              to={`/classes/${id}/recording`}
              className="btn btn-sm btn-primary text-nowrap"
            >
              <i className="bi bi-mic me-2"></i>
              Gravar
            </Link>
          </div>
        </div>
      </div>

      <UpdateClassModal id={id} handleUpdates={handleUpdates} />
      <ConfirmDeleteClassModal id={id} handleUpdates={handleUpdates} />
    </div>
  );
};
