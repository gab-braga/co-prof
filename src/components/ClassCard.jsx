import React from 'react';

export default ({ name, description, className, ...rest }) => {
  return (
    <div className={className} {...rest}>
      <div className="border border-2 border-primary p-3 rounded mt-4">
        <div className="d-flex flex-column" style={{ minHeight: '150px' }}>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="fs-4 text-truncate">{name || '...'}</h3>
            <button className="btn fs-4 border-0 p-0">
              <i className="bi bi-three-dots-vertical"></i>
            </button>
          </div>
          <span className="fs-6 text-secondary text-truncate">
            {description || '...'}
          </span>
          <div className="flex-grow-1 d-flex flex-wrap gap-2 justify-content-end align-items-end">
            <button className="btn btn-sm btn-primary">Abrir</button>
            <button className="btn btn-sm btn-primary">Gravar</button>
          </div>
        </div>
      </div>
    </div>
  );
};
