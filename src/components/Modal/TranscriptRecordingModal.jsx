import React from 'react';
import { formatRecordingTitle } from '../../utils/date';

export default ({ recording }) => {
  return (
    <div
      className="modal fade"
      id={`transcript-recording-modal-${recording.id}`}
      tabIndex="-1"
      aria-labelledby={`transcript-recording-modal-label-${recording.id}`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2
              className="modal-title text-uppercase fs-5"
              id={`transcript-recording-modal-label-${recording.id}`}
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
          <div className="modal-body">{recording.transcript}</div>
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
