import React from 'react';
import PropTypes from 'prop-types';
import downloadIcon from '../assets/icons/Descarga.png';
import './general-style.css';

const CustomElement = ({ data }) => {
  return (
    <div className="custom-element">
      <a href={data.file} target="_blank" rel="noopener noreferrer" download>
        <img src={downloadIcon} alt="Descargar" className="download-icon" />
      </a>
    </div>
  );
};

CustomElement.propTypes = {
  data: PropTypes.shape({
    file: PropTypes.string.isRequired,
  }).isRequired,
};

export default CustomElement;
