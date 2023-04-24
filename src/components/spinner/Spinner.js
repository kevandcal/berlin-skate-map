import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import './Spinner.css';

export function Spinner({ size }) {
  return (
    <div id="spinner-container">
      <FontAwesomeIcon
        icon={faSpinner}
        spin
        style={{ fontSize: size }}
      />
    </div>
  )
}
