import React, { useEffect, useState } from 'react';
import PanelHeader from '../components/PanelHeader';
import { Link, useParams } from 'react-router-dom';
import { findClass } from '../services/classService';

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState({});
  const [recordings, setRecordings] = useState([]);
  const { id } = useParams();

  async function loadingData() {
    setIsLoading(true);
    try {
      const data = await findClass(id);
      setClassData(data);
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
          <div className="d-flex gap-2 flex-wrap justify-content-between align-items-start">
            <div className="d-flex flex-column">
              <h2 className="fs-4 text-truncate">{classData.name || '...'}</h2>
              {classData.section && (
                <span className="text-secondary text-truncate">
                  {classData.section}
                </span>
              )}
            </div>

            <div className="d-flex gap-3 flex-wrap">
              <Link to={`/classes/${id}`} className="btn btn-primary">
                Gravações
              </Link>
            </div>
          </div>

          {isLoading ? (
            <p className="fw-medium mt-4" style={{ color: '#8a8a8a' }}>
              Carregando...
            </p>
          ) : !recordings || recordings.length == 0 ? (
            <p className="fw-medium mt-4" style={{ color: '#8a8a8a' }}>
              Nenhuma gravação encontrada.
            </p>
          ) : (
            <div className="flex-grow-1 ">Gravações</div>
          )}
        </div>
      </div>
    </div>
  );
};
