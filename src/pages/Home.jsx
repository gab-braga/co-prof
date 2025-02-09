import React from 'react';
import IllustrationEducator from '../assets/illustration_educator.svg';

export default () => {
  return (
    <>
      <div className="d-flex flex-column flex-lg-row justify-content-lg-between align-items-lg-center gap-4 mt-4">
        <span
          className="text-center text-lg-start fs-1 text-primary"
          style={{ maxWidth: '35ch' }}
        >
          Gere <strong>resumos automáticos</strong> das suas aulas para seus
          alunos.
        </span>
        <img
          src={IllustrationEducator}
          alt="Ilustração de um professor em sala de aula."
        />
      </div>

      <div className="bg-gradient-blue rounded-3 p-4 p-lg-5 mb-3 mt-5">
        <span className="text-center fs-1 text-white">
          Melhore o <strong>Aproveitamento</strong> das suas aulas.{' '}
          <strong>Automatize</strong> geração de resumos com <strong>IA</strong>
          !
        </span>
      </div>
    </>
  );
};
