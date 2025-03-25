import React, { useEffect, useState } from 'react';
import PanelHeader from '../components/PanelHeader';
import ClassCard from '../components/ClassCard';
import { findAllClasses } from '../services/classService';
import CreateClassModal from '../components/CreateClassModal';

export default () => {
  const [classes, setClasses] = useState([]);

  async function loadingData() {
    const data = await findAllClasses();
    setClasses(data);
  }

  useEffect(() => {
    loadingData();
  }, []);

  return (
    <div className="min-vh-100 d-flex flex-column gradient-blue-to-top">
      <PanelHeader />

      <div className="container flex-grow-1">
        <div
          className="bg-white p-4 mt-4 rounded-3 shadow mb-5"
          style={{ minHeight: '70vh' }}
        >
          <div className="d-flex gap-2 flex-wrap justify-content-between align-items-center">
            <h2 className="fs-4">Turmas</h2>
            <div className="d-flex gap-3 flex-wrap">
              <button className="btn btn-secondary">Importar Turmas</button>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#create-class-modal"
              >
                Nova Turma
              </button>
            </div>
          </div>

          <div className="mt-4 row">
            {classes.map(({ id, name, section }) => (
              <ClassCard
                key={id}
                {...{ id, name, section }}
                handleUpdates={loadingData}
                className="col-12 col-md-6 col-lg-4 col-xl-3"
              />
            ))}
          </div>
        </div>
      </div>

      <CreateClassModal updateClasses={loadingData} />
    </div>
  );
};
