import React, { useEffect, useRef } from 'react';
import { formatRecordingTitle } from '../../utils/date';

export default ({ recording }) => {
  const audioRef = useRef(null);
  const modalRef = useRef(null);

  function handleModalHidden() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }

  useEffect(() => {
    const eventName = 'hidden.bs.modal';

    if (modalRef.current) {
      modalRef.current.addEventListener(eventName, handleModalHidden);
    }

    return () => {
      if (modalRef.current) {
        modalRef.current.removeEventListener(eventName, handleModalHidden);
      }
    };
  }, []);

  return (
    <div
      ref={modalRef}
      className="modal fade"
      id={`listen-recording-modal-${recording.id}`}
      tabIndex="-1"
      aria-labelledby={`listen-recording-modal-label-${recording.id}`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2
              className="modal-title text-uppercase fs-5"
              id={`listen-recording-modal-label-${recording.id}`}
            >
              {formatRecordingTitle(recording)}
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <audio ref={audioRef} controls className="w-100">
              <source src={recording.recordingURL} type="audio/mp3" />
            </audio>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              <i className="bi bi-x-lg me-2"></i>
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
