import React from 'react';
import PanelHeader from '../components/PanelHeader';
import ClassCard from '../components/ClassCard';

export default () => {
  return (
    <div className="min-vh-100 d-flex flex-column gradient-blue-to-top">
      <PanelHeader />

      <div className="container flex-grow-1">
        <div className="bg-white p-4 mt-4 rounded-3 shadow">
          <div className="d-flex gap-2 flex-wrap justify-content-between align-items-center">
            <h2 className="fs-4">Turmas</h2>
            <div className="d-flex gap-3 flex-wrap">
              <button className="btn btn-secondary">Importar Turmas</button>
              <button className="btn btn-primary">Nova Turma</button>
            </div>
          </div>

          <div className="mt-4 row">
            <ClassCard className="col-12 col-md-6 col-lg-4 col-xl-3" />
            <ClassCard className="col-12 col-md-6 col-lg-4 col-xl-3" />
            <ClassCard className="col-12 col-md-6 col-lg-4 col-xl-3" />
            <ClassCard className="col-12 col-md-6 col-lg-4 col-xl-3" />
          </div>
        </div>
      </div>
    </div>
  );
};
