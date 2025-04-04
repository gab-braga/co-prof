import React, { useEffect, useRef, useState } from 'react';
import PanelHeader from '../components/PanelHeader';
import CreateClassModal from '../components/CreateClassModal';
import Recorder from '../components/Recorder';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { findClass } from '../services/classService';
import toast from 'react-hot-toast';
import { uploadFile } from '../services/storageService';
import { createRecording } from '../services/recordingService';

export default () => {
  const [isLoading, setIsLoading] = useState(true);

  const [classData, setClassData] = useState({});
  const { id } = useParams(null);
  const navigate = useNavigate();

  async function handleSubmitRecording(audioBlob) {
    const recordingUrl = await toast.promise(
      async () => {
        const response = await uploadFile(audioBlob);
        return response.fileUrl;
      },
      {
        loading: 'Salvando gravação...',
        error: 'Houve um erro. Tente novamente mais tarde.',
      },
    );

    toast.promise(
      async () => {
        const classId = classData.id;
        const data = { classId, recordingUrl };
        await createRecording(data);
        navigate(`/classes/${classId}`);
      },
      {
        loading: 'Carregando...',
        success: 'Nova gravação salva.',
        error: 'Algo deu errado. Tente novamente mais tarde.',
      },
    );
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
  }, []);

  if (!id) return <Navigate to="/classes" />;

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
              <Recorder handleSubmitRecording={handleSubmitRecording} />
            </div>
          )}
        </div>
      </div>

      <CreateClassModal handleUpdates={loadingData} />
    </div>
  );
};
