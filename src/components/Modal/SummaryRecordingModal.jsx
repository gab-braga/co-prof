import React from 'react';
import { formatRecordingTitle } from '../../utils/date';

export default ({ recording }) => {
  return (
    <div
      className="modal fade"
      id={`summary-recording-modal-${recording.id}`}
      tabIndex="-1"
      aria-labelledby={`summary-recording-modal-label-${recording.id}`}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h2
              className="modal-title text-uppercase fs-5"
              id={`summary-recording-modal-label-${recording.id}`}
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
            <h2 class="fs-5">Resumo</h2>
            <p>
              {recording?.summaryData?.summary}
            </p>
            
            <h2 class="fs-5">Marcos</h2>
            <ul>
              {recording?.summaryData?.actionItems?.map((item, index) => (
                  <li key={`${index}-action-item-${recording.id}`}>{item}</li>
              ))}
            </ul>

            <h2 class="fs-5">Conceitos Chave</h2>
            <ul>
              {recording?.summaryData?.keyConcepts?.map((item, index) => (
                  <li key={`${index}-action-item-${recording.id}`}>{item}</li>
              ))}
            </ul>

            <h2 class="fs-5">Exemplos</h2>
            <ul>
              {recording?.summaryData?.examples?.map((item, index) => (
                  <li key={`${index}-action-item-${recording.id}`}>{item}</li>
              ))}
            </ul>
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
