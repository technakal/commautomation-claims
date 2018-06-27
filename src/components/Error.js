import React from 'react';

const ErrorDisplay = props => {
  const { errorMessage } = props;
  return (
    <div className="error-modal">
      <p>{errorMessage}</p>
      <button className="error-button">Dismiss</button>
    </div>
  );
};

export default ErrorDisplay;
