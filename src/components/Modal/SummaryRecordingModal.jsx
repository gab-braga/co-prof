import React from 'react';
import useClipboard from '../../hooks/useClipboard';
import { formatRecordingTitle } from '../../utils/date';
import { formatSummaryText } from '../../utils/format';

export default ({ recording }) => {
  const { copyToClipboard, isCopied } = useClipboard();

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
            <h2 className="fs-5">Resumo</h2>
            <p dangerouslySetInnerHTML={{__html: recording?.summaryData?.summary }}></p>
            
            <h2 className="fs-5">Marcos</h2>
            <ul>
              {recording?.summaryData?.actionItems?.map((item, index) => (
                  <li key={`${index}-action-item-${recording.id}`}>{item}</li>
              ))}
            </ul>

            <h2 className="fs-5">Conceitos Chave</h2>
            <ul>
              {recording?.summaryData?.keyConcepts?.map((item, index) => (
                  <li key={`${index}-action-item-${recording.id}`}>{item}</li>
              ))}
            </ul>

            <h2 className="fs-5">Exemplos</h2>
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
            <button onClick={() => {
              const text = formatSummaryText(recording.summaryData);
              copyToClipboard(text);
            }} type="button" className="btn btn-primary">
              <i className={`bi bi-${isCopied ? "clipboard-check" : "clipboard"} me-2`}></i>
              Copiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
