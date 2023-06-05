import React from 'react';
import downloadIcon from '../assets/icons/Descarga.png';
import './general-style.css'


export default ({ data }) => {
  return (
    <div className="custom-element">
      <a href={data.file} target="_blank" rel="noopener noreferrer" download>
        <img src={downloadIcon} alt="Descargar" className="download-icon" />
      </a>
    </div>
  );
};