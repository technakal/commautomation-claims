import React from 'react';

const Modal = props => {
  const { title, text, onConfirm, onCancel } = props;
  return (
    <div className="modal">
      <h3>{title}</h3>
      <p>{text}</p>
      <div>
        <button onClick={onCancel}>Cancel!</button>
        <button onClick={onConfirm}>Proceed</button>
      </div>
    </div>
  );
};

export default Modal;
