import React, { useEffect, useState } from 'react';
import PanelHeader from '../../components/PanelHeader';
import Recorder from '../../components/Recorder';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { uploadFile, uploadMultipleFiles } from '../../services/storageService';
import { createRecording } from '../../services/recordingService';
import { findClass } from '../../services/classService';
import usePreventPageLeave from '../../hooks/usePreventPageLeave';
import useWakeLock from '../../hooks/useWakeLock';
import {
  summarizeTranscript,
  reduceMultipleTranscripts,
  transcribeMultipleAudios
} from '../../services/speechService';
import toast from 'react-hot-toast';

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const { id } = useParams(null);
  const navigate = useNavigate();
  const { enablePreventPageLeave, disablePreventPageLeave } =
    usePreventPageLeave();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();
  
  async function loadClass() {    
    setClassData(null);
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

  async function handleSubmitRecording(recordingData) {
    try {
      enablePreventPageLeave();
      requestWakeLock();
      
      const uploadData = await toast.promise(
        async () => await uploadRecording(recordingData),
        {
          loading: 'Salvando gravação...',
          error: 'Algo deu errado. Tente novamente mais tarde.',
        },
      );

      const transcriptData = await toast.promise(
        async () => await transcribeRecording(uploadData),
        {
          loading: 'Transcrevendo...',
          error: 'Algo deu errado. Tente novamente mais tarde.',
        },
      );

      const summaryData = await toast.promise(
        async () => await generateSummary(transcriptData),
        {
          loading: 'Gerando resumo...',
          error: 'Algo deu errado. Tente novamente mais tarde.',
        },
      );

      await toast.promise(
        async () => {
          return await saveRecording(
            classData.id,
            recordingData,
            uploadData,
            transcriptData,
            summaryData
          )
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
    } finally {
      disablePreventPageLeave();
      releaseWakeLock();
    }
  }

  useEffect(() => {
    loadClass();
  }, [id]);

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
                <Link to="/classes" className="ff-poppins fs-5">Turmas</Link>
                <i
                  className="bi bi-chevron-double-right mx-2"
                  style={{ color: '#8a8a8a' }}
                ></i>
                <h2
                  className="ff-poppins text-truncate fs-5 m-0"
                  style={{ maxWidth: '30ch' }}
                >
                  {classData?.name || 'Carregando...'}

                  {classData?.section && (
                    <span className="ff-roboto text-secondary text-truncate fw-normal fs-6">
                      {" (" + classData.section + ")"}
                    </span>
                  )}
                </h2>
              </div>
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

async function uploadRecording(recordingData) {
  const { recordedBlobs, fullRecordedBlob } = recordingData;
  const segmentedRecordingURLs = await uploadMultipleFiles(recordedBlobs);
  const recordingURL = await uploadFile(fullRecordedBlob);
  return { segmentedRecordingURLs, recordingURL };
}

async function transcribeRecording(uploadData) {
  const { segmentedRecordingURLs } = uploadData;
  const results = await transcribeMultipleAudios(segmentedRecordingURLs);
  const transcripts = results.map(result => result.text);
  const transcript = transcripts.join(" ");
  return { transcripts, transcript };
}

async function generateSummary(transcriptData) {
  const { transcripts } = transcriptData;
  const results = await reduceMultipleTranscripts(transcripts);
  const transcriptsReduced = results.map(result => result.text);
  const transcriptFinal = transcriptsReduced.join(" ");
  return await summarizeTranscript(transcriptFinal);
}

async function saveRecording(
  classId,
  recordingData,
  uploadData,
  transcriptData,
  summaryData
) {
  const { recordingStartTime, recordingStopTime } = recordingData;
  const { transcript } = transcriptData;
  const data = {
    classId,
    recordingStartTime,
    recordingStopTime,
    transcript,
    uploadData,
    summaryData,
  };
  return await createRecording(data);
}