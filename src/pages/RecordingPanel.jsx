import React, { useEffect, useState } from 'react';
import PanelHeader from '../components/PanelHeader';
import { findClass } from '../services/classService';
import CreateClassModal from '../components/CreateClassModal';
import { Link, useParams } from 'react-router-dom';
import ButtonRecord from '../components/ButtonRecord/ButtonRecord';

let interval = null;

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [pulse, setPulse] = useState(0);
  const { id } = useParams();

  function startRecording() {
    if (!isRecording) {
      setIsRecording(true);
      interval = setInterval(() => {
        const value = Math.ceil(Math.random() * 30);
        setPulse(value);
      }, 500);
    } else {
      setIsRecording(false);
      if (interval) clearInterval(interval);
      setPulse(0);
    }
  }

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

    return () => {
      if (interval) clearInterval(interval);
    };
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
          ) : (
            <div className="flex-grow-1 d-flex justify-content-center align-items-center">
              <div
                className="mt-4 mx-4 px-4 py-5 w-100 rounded"
                style={{ maxWidth: '400px', backgroundColor: '#EEEEEE' }}
              >
                <div className="w-100 d-flex flex-column gap-2 justify-content-center align-items-center">
                  <h3 className="fs-5">Iniciar Gravação</h3>
                  <div className="p-4">
                    <ButtonRecord
                      onClick={startRecording}
                      isRecording={isRecording}
                      pulse={pulse}
                    />
                  </div>
                  <div>
                    <span
                      className="ff-roboto-mono fs-5"
                      style={{ color: '#8a8a8a' }}
                    >
                      00:00:00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateClassModal handleUpdates={loadingData} />
    </div>
  );
};
