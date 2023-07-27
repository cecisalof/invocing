import React, { useState, useRef } from 'react';
import { postInvoiceAutomatic } from "../../pages/invoicesToPay/services";
import { postExpenseTicketAutomatic } from "../../pages/expensesTickets/services";
import spinner from '../../assets/icons/spinner.svg';
import spinnerYellow from '../../assets/icons/spinnerYellow.svg';
import PropTypes from 'prop-types';
import { FaCheckCircle } from 'react-icons/fa';
import cashYellow from '../../assets/icons/cashYellow.png';
import dragDrop from '../../assets/icons/drag-and-drop.png';
import "./style.css"

export const DragAndDropCardComponent = ({ type, userToken, setError, onFinishedUploading, getTasksStatus }) => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const inputRef = useRef(null);
  const cardRef = useRef(null);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    cardRef.current.classList.add('opacity-05');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    cardRef.current.classList.remove('opacity-05');
  };

  const handleDrop = (event) => {
    if (isFileUploading) {
      alert("Se está cargando otros archivos, espera a que termine la carga anterior")
    } else {
      event.preventDefault();
      event.stopPropagation();
      cardRef.current.classList.remove('opacity-05');

      const files = event.dataTransfer.files;
      processFiles(files)
    }
  };

  const handleClick = () => {
    if (isFileUploading) return
    inputRef.current.click();
  }

  const handleFileUpload = async (event) => {
    const fileObj = event.target.files;
    if (!fileObj) {
      return;
    }

    await processFiles(fileObj);
    // 👇️ reset file input
    event.target.value = null;
  };


  const processFiles = async (files) => {
    console.log(files);
    console.log("Procesando archivos automáticamente...");
    getTasksStatus();
    let response = null
    setIsFileUploading(true)
    if (type == "invoice") {
      response = await postInvoiceAutomatic(userToken, files);
    } else {
      response = await postExpenseTicketAutomatic(userToken, files);
    }
    await onFinishedUploading() // getPanelData
    setIsFileUploading(false)

    if (!response || response.status < 200 || response.status >= 300) {
      if (response.status == 402) {
        setError("Has excedido tu cutoa de facturas mensual. Escribe a info@codepremium.es para aumentarla")
      }else{
        setError("Hubo un error al subir los ficheros")
      }
      return
    }else{
      setIsFileUploaded(true)
    }
    setTimeout(() => {
      setIsFileUploaded(false);
    }, 3000)
  };

  return (
    <div
      className={"file-drop-zone opacity-hover-08 w-100 m-0 p-0 d-flex flex-column justify-content-center align-items-center file-drop-zone-" + type}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      ref={cardRef}
    >
      <input
        style={{ display: 'none' }}
        ref={inputRef}
        type="file"
        onChange={handleFileUpload}
      />
      <div className="p-0 m-0">
        {isFileUploading && (
          <div>
            <img src={type == "invoice" ? spinner : spinnerYellow} className="loading-icon" />
            <span className="blue">Subiendo archivos... </span>
          </div>
        )}
        {isFileUploaded && (
          <div className="upload-indicator">
            <FaCheckCircle className="upload-icon" />
            <span className="">Archivos subidos</span>
            <span className="text-drop text-success color-drop small"><br />
              Tu archivo se va a procesar y aparecerá reflejado en unos segundos
            </span>
          </div>
        )}
        {!isFileUploading && !isFileUploaded && (
          <div>
            <img src={type == "invoice" ? dragDrop : cashYellow} alt="dragDrop" className='cards-logo' />
            <div>
              <span className="text-drop color-drop">
                Procesar {type == "invoice" ? "facturas" : "gastos"} automáticamente
              </span>
              <span className="text-drop color-drop small"><br />
                Haz click para buscar tus {type == "invoice" ? "facturas" : "gastos"} o arrastrálos directamente aquí
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

DragAndDropCardComponent.propTypes = {
  userToken: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired,
  onFinishedUploading: PropTypes.func,
  getTasksStatus: PropTypes.func
};