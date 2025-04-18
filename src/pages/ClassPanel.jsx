import React, { useEffect, useState } from 'react';
import PanelHeader from '../components/PanelHeader';
import { Link, useParams } from 'react-router-dom';
import { findClass } from '../services/classService';
import { findRecordingsByClassId } from '../services/recordingService';
import { formatRecordingTitle } from '../utils/date';
import ListenRecordingModal from '../components/Modal/ListenRecordingModal';
import TranscriptionRecordingModal from '../components/Modal/TranscriptionRecordingModal';

export default () => {
  const [isLoading, setIsLoading] = useState(true);
  const [classData, setClassData] = useState({});
  const [recordings, setRecordings] = useState([]);
  const { id } = useParams();

  async function loadingData() {
    setIsLoading(true);
    try {
      const data = await findClass(id);
      const recordings = await findRecordingsByClassId(id);
      setClassData(data);
      setRecordings(recordings);
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
            ) : !recordings || recordings.length == 0 ? (
              <p className="fw-medium" style={{ color: '#8a8a8a' }}>
                Nenhuma gravação encontrada.
              </p>
            ) : (
              <div className="w-100 flex-1 overflow-x-auto">
                <table
                  className="table table-striped w-100"
                  style={{ minWidth: '650px' }}
                >
                  <tbody>
                    {recordings.map((recording) => (
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
                            data-bs-target={`#transcription-recording-modal-${recording.id}`}
                          >
                            <i className="bi bi-journal-text me-2"></i>
                            Transcrição
                          </button>
                        </td>
                        <td className="p-2">
                          <button className="btn btn-primary btn-sm text-nowrap">
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
                                  data-bs-target={'#update-recording-modal'}
                                  className="btn dropdown-item"
                                >
                                  Editar
                                </button>
                                <button
                                  type="button"
                                  data-bs-toggle="modal"
                                  data-bs-target={
                                    '#confirm-delete-recording-modal'
                                  }
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

      {recordings.map((recording) => (
        <div key={recording.id}>
          <ListenRecordingModal recording={recording} />
          <TranscriptionRecordingModal recording={recording} />
        </div>
      ))}
    </div>
  );
};
