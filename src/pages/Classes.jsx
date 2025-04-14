import React, { useEffect, useState } from 'react';
import PanelHeader from '../components/PanelHeader';
import ClassCard from '../components/ClassCard';
import { findAllClasses } from '../services/classService';
import CreateClassModal from '../components/Modal/CreateClassModal';

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState([]);

  async function loadingData() {
    setIsLoading(true);
    try {
      const data = await findAllClasses();
      setClasses(data);
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
    <div className="min-vh-100 d-flex flex-column gradient-blue-to-top">
      <PanelHeader />

      <div className="container flex-grow-1">
        <div
          className="d-flex flex-column bg-white p-4 mt-4 rounded-3 shadow mb-5"
          style={{ minHeight: '70vh' }}
        >
          <div className="d-flex gap-2 flex-wrap justify-content-between  align-items-start">
            <h2 className="fs-4">Turmas</h2>

            <div className="d-flex gap-3 flex-wrap">
              <button className="btn btn-secondary text-nowrap">
                <i className="bi bi-arrow-bar-down me-2"></i>
                Importar Turmas
              </button>
              <button
                className="btn btn-primary text-nowrap"
                data-bs-toggle="modal"
                data-bs-target="#create-class-modal"
              >
                <i className="bi bi-plus-lg me-2"></i>
                Nova Turma
              </button>
            </div>
          </div>

          <div className="flex-grow-1 pt-4">
            {isLoading ? (
              <p className="fw-medium" style={{ color: '#8a8a8a' }}>
                Carregando...
              </p>
            ) : !classes || classes.length == 0 ? (
              <p className="fw-medium" style={{ color: '#8a8a8a' }}>
                Nenhuma turma cadastrada.
              </p>
            ) : (
              <div className="row g-4 align-content-start">
                {classes.map(({ id, name, section }) => (
                  <ClassCard
                    key={id}
                    {...{ id, name, section }}
                    handleUpdates={loadingData}
                    className="col-12 col-md-6 col-lg-4 col-xl-3"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateClassModal handleUpdates={loadingData} />
    </div>
  );
};
