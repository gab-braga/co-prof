import React, { useEffect, useState } from 'react';
import PanelHeader from '../components/PanelHeader';
import Recorder from '../components/Recorder';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { findClass } from '../services/classService';
import { uploadFile, uploadMultipleFiles } from '../services/storageService';
import { createRecording } from '../services/recordingService';
import { transcribeMultipleAudios } from '../services/speechService';
import toast from 'react-hot-toast';

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState({});

  const { id } = useParams(null);
  const navigate = useNavigate();

  async function handleSubmitRecording(recording) {
    try {
      const {
        segmentedRecordingURLs,
        recordingURL
      } = await toast.promise(
        async () => {
          const { recordedBlobs, fullRecordedBlob } = recording;
          const segmentedRecordingURLs = await uploadMultipleFiles(recordedBlobs);
          const recordingURL = await uploadFile(fullRecordedBlob);

          return {
            segmentedRecordingURLs,
            recordingURL
          };
        },
        {
          loading: 'Salvando gravação...',
          error: 'Houve um erro. Tente novamente mais tarde.',
        },
      );

      const transcription = await toast.promise(
        async () => {
          const results = await transcribeMultipleAudios(segmentedRecordingURLs)
          const transcriptions = results.map(result => result.transcription.text);
          const transcription = transcriptions.join(" ");

          return transcription;
        },
        {
          loading: 'Transcrevendo...',
          error: 'Algo deu errado. Tente novamente mais tarde.',
        },
      );

      await toast.promise(
        async () => {
          const { recordingStartTime, recordingStopTime } = recording;
          const data = {
            classId: classData.id,
            transcription,
            recordingStartTime,
            recordingStopTime,
            segmentedRecordingURLs,
            recordingURL
          };

          await createRecording(data);
        },
        {
          loading: 'Finalizando...',
          error: 'Algo deu errado. Tente novamente mais tarde.',
        },
      );

      toast.success('Nova gravação salva.');
      navigate(`/classes/${classData.id}`);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadingData() {
    setIsLoading(true);
    try {
      const classData = await findClass(id);
      setClassData(classData);
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
          <div className="d-flex gap-2 flex-wrap justify-content-between align-items-start overflow-x-auto">
            <div className="d-flex flex-column">
              <div className="d-flex align-items-center mb-2">
                <h2
                  className="fs-4 text-truncate m-0"
                  style={{ maxWidth: '30ch' }}
                >
                  {classData.name || '...'}
                </h2>
                <i
                  className="bi bi-chevron-double-left ms-3 me-2"
                  style={{ color: '#8a8a8a' }}
                ></i>
                <Link to="/classes">Turmas</Link>
              </div>
              {classData.section && (
                <span className="text-secondary text-truncate">
                  {classData.section}
                </span>
              )}
            </div>

            <div className="d-flex gap-3 flex-wrap">
              <Link to={`/classes/${id}`} className="btn btn-primary">
                <i className="bi bi-box-arrow-up-right me-2"></i>
                Gravações
              </Link>
            </div>
          </div>

          <div className="flex-grow-1 pt-4 d-flex">
            {isLoading ? (
              <p className="fw-medium" style={{ color: '#8a8a8a' }}>
                Carregando...
              </p>
            ) : (
              <div className="flex-grow-1 d-flex justify-content-center align-items-center">
                <Recorder handleSubmitRecording={handleSubmitRecording} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
