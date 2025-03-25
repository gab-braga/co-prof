import React, { useEffect, useState } from 'react';
import PanelHeader from '../components/PanelHeader';
import { findClass } from '../services/classService';
import CreateClassModal from '../components/CreateClassModal';
import { Link, useParams } from 'react-router-dom';
import ButtonRecord from '../components/ButtonRecord/ButtonRecord';
import Timer from '../components/Timer';

let intervalPulse = null;
let intervalTimer = null;

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState({});
  const [isRecording, setIsRecording] = useState(false);
  const [pulse, setPulse] = useState(0);
  const [time, setTime] = useState(0);
  const { id } = useParams();

  function startRecording() {
    if (!isRecording) {
      setIsRecording(true);
      startPulse();
      startTimer();
    } else {
      setIsRecording(false);
      onDestroy();
      setPulse(0);
      setTime(0);
    }
  }

  function startPulse() {
    intervalPulse = setInterval(() => {
      const value = Math.ceil(Math.random() * 30);
      setPulse(value);
    }, 500);
  }

  function startTimer() {
    intervalTimer = setInterval(() => {
      setTime((time) => time + 100);
    }, 100);
  }

  function onDestroy() {
    if (intervalPulse) clearInterval(intervalPulse);
    if (intervalTimer) clearInterval(intervalTimer);
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

    return () => onDestroy();
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
                    <Timer time={time} />
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
