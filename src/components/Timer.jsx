import React from 'react';

export default ({ time }) => {
  function format(ms) {
    const date = new Date(ms);
    return date.toISOString().substring(11, 19);
  }

  return (
    <div>
      <span className="ff-roboto-mono fs-5" style={{ color: '#8a8a8a' }}>
        {format(time)}
      </span>
    </div>
  );
};
