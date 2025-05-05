import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatRecordingTitle } from '../../utils/date';
import PanelHeader from '../../components/PanelHeader';
import ListenRecordingModal from '../../components/Modal/ListenRecordingModal';
import TranscriptRecordingModal from '../../components/Modal/TranscriptRecordingModal';
import SummaryRecordingModal from '../../components/Modal/SummaryRecordingModal';
import { findClass } from '../../services/classService';
import { findRecordingsByClassId } from '../../services/recordingService';
import ConfirmDeleteRecordingModal from '../../components/Modal/ConfirmDeleteRecordingModal';

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState(null);
  const [classRecordings, setClassRecordings] = useState(null);
  const { id } = useParams();

  async function loadClass() {    
    setClassData(null);
    setClassRecordings(null);
    setIsLoading(true);
    try {
      const classData = await findClass(id);
      const classRecordings = await findRecordingsByClassId(id);
      setClassData(classData);
      setClassRecordings(classRecordings);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClass();
  }, [id]);

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
              <Link
                to={`/classes/${id}/recording`}
                className="btn btn-primary text-nowrap"
              >
                <i className="bi bi-mic me-2"></i>
                Gravar
              </Link>
            </div>
          </div>

          <div className="flex-grow-1 pt-4 d-flex">
            {isLoading ? (
              <p className="fw-medium" style={{ color: '#8a8a8a' }}>
                Carregando...
              </p>
            ) : !classRecordings || classRecordings.length == 0 ? (
              <p className="fw-medium" style={{ color: '#8a8a8a' }}>
                Nenhuma gravação encontrada.
              </p>
            ) : (
              <div className="w-100 flex-1 overflow-x-auto">
                <table
                  className="table table-striped w-100"
                  style={{ minWidth: '650px' }}
                >
                  <thead>
                    <tr>
                      <th style={{ color: "#8a8a8a" }}>Título</th>
                      <th style={{ color: "#8a8a8a" }}>Gravação</th>
                      <th style={{ color: "#8a8a8a" }}>Transcrição</th>
                      <th style={{ color: "#8a8a8a" }}>Resumo</th>
                      <th style={{ color: "#8a8a8a" }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(classRecordings) &&
                      classRecordings.map((recording) => (
                        <tr key={recording.id}>
                          <td className="p-2 w-100">
                            <span className="text-nowrap text-uppercase">
                              {formatRecordingTitle(recording)}
                            </span>
                          </td>
                          <td className="p-2">
                            <button
                              className="btn btn-primary btn-sm text-nowrap"
                              data-bs-toggle="modal"
                              data-bs-target={`#listen-recording-modal-${recording.id}`}
                            >
                              <i className="bi bi-headphones me-2"></i>
                              Gravação
                            </button>
                          </td>
                          <td className="p-2">
                            <button
                              className="btn btn-primary btn-sm text-nowrap"
                              data-bs-toggle="modal"
                              data-bs-target={`#transcript-recording-modal-${recording.id}`}
                            >
                              <i className="bi bi-journal-text me-2"></i>
                              Transcrição
                            </button>
                          </td>
                          <td className="p-2">
                            <button
                              className="btn btn-primary btn-sm text-nowrap"
                              data-bs-toggle="modal"
                              data-bs-target={`#summary-recording-modal-${recording.id}`}
                            >
                              <i className="bi bi-file-text me-2"></i>
                              Resumo
                            </button>
                          </td>
                          <td className="p-2">
                            <div className="dropdown">
                              <button
                                type="type"
                                data-bs-toggle="dropdown"
                                className="btn fs-5 border-0 p-0"
                              >
                                <i className="bi bi-three-dots-vertical"></i>
                              </button>
                              <ul className="dropdown-menu">
                                <li>
                                  <button
                                    type="button"
                                    data-bs-toggle="modal"
                                    data-bs-target={`#confirm-delete-recording-modal-${recording.id}`}
                                    className="btn dropdown-item"
                                  >
                                    Excluir
                                  </button>
                                </li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {Array.isArray(classRecordings) &&
        classRecordings.map((recording) => (
          <div key={`modals-${recording.id}`}>
            <ListenRecordingModal recording={recording} />
            <TranscriptRecordingModal recording={recording} />
            <SummaryRecordingModal recording={recording} />
            <ConfirmDeleteRecordingModal id={recording.id} handleUpdates={loadClass} />
          </div>
        ))}
    </div>
  );
};
