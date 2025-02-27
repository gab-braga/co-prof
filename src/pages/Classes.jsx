import React from 'react';
import Header from '../components/Header';

export default () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />

      <div className="container flex-grow-1">
        <h1>Classes</h1>
      </div>
    </div>
  );
};
