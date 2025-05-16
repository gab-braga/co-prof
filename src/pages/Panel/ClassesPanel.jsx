import React, { useEffect, useState } from 'react';
import PanelHeader from '../../components/PanelHeader';
import ClassCard from '../../components/ClassCard';
import CreateClassModal from '../../components/Modal/CreateClassModal';
import { findAllClasses } from '../../services/classService';

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [classes, setClasses] = useState(null);

  async function loadClasses() {
    setClasses(null);
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

  async function handleImportClasses() {
    try {
      const url = "https://accounts.google.com/o/oauth2/v2/auth?client_id=509264289385-ghng06ld79ith85khod9j9ot6v9njb69.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fco-prof-5f18e.web.app/authorization&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.courses.readonly%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.coursework.students%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fclassroom.rosters.readonly&access_type=offline&prompt=consent";
      const data = window.open(url, "Auth", "width=1000,height=500");
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadClasses();
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
            <h2 className="ff-poppins fs-5">Turmas</h2>

            <div className="d-flex gap-3 flex-wrap">
              <button onClick={handleImportClasses} className="btn btn-secondary text-nowrap">
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
                    handleUpdates={() => loadClasses()}
                    className="col-12 col-md-6 col-lg-4 col-xl-3"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CreateClassModal handleUpdates={() => loadClasses()} />
    </div>
  );
};
