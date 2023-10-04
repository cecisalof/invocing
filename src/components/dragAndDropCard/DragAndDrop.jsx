import React, { useState, useRef, useEffect } from 'react';
import { postInvoiceAutomatic } from "../../pages/invoicesToPay/services";
import { postExpenseTicketAutomatic } from "../../pages/expensesTickets/services";
// import spinner from '../../assets/icons/spinner.svg';
// import spinnerYellow from '../../assets/icons/spinnerYellow.svg';
import PropTypes from 'prop-types';
import { FaCheckCircle } from 'react-icons/fa';
import cashYellow from '../../assets/icons/cashYellow.png';
import dragDrop from '../../assets/icons/drag-and-drop.png';
// import { ProgressBar } from 'react-bootstrap';
import "./style.css"
import { useSelector, useDispatch } from 'react-redux'
// import { Alert } from '@mui/material';
import { processedFileState } from '../../features/processingFiles/filesSlice'
// import FileWatcherComponent from '../fileWatcher/FileWatcher';

export const DragAndDropCardComponent = (props) => {

  const { type, userToken, setIsError, getPanelData } = props;

  const [isFileUploaded, setIsFileUploaded] = useState(false)
  const [successProgressBarPercentage, setSuccessProgressBarPercentage] = useState(10)
  const [failProgressBarPercentage, setFailProgressBarPercentage] = useState(0)
  const [isFileUploading, setIsFileUploading] = useState(false)

  const dispatch = useDispatch();

  // Reading tasks global state 
  const tasksState = useSelector(state => state.tasks);

  const inputRef = useRef(null)
  const cardRef = useRef(null)

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
    // if (isFileUploading) {
    //   alert("Se está cargando otros archivos, espera a que termine la carga anterior")
    // } else {
    event.preventDefault();
    event.stopPropagation();
    cardRef.current.classList.remove('opacity-05');

    const files = event.dataTransfer.files;
    processFiles(files)
    // }
  };

  const handleClick = () => {
    // if (isFileUploading) return
    inputRef.current.click()
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

  const updateNotificationState = () => {
    tasksState && tasksState.results.map((task, index) => {
      if (index === 0) {
        if (task.result == null) {
          // empujar esta task a notificaciones con estado "procesando"
          console.log('Procesando archivo:', task);
        } else if (task.result.success) {
          // empujar esta task a notificaciones con estado "procesado exitosamente"
          dispatch(processedFileState(task))
          console.log('Archivo procesado y subido:', task.name, index)
        } else if (task.result.error) {
          // empujar esta task a notificaciones con estado "procesado con errores"
          console.log(`El archivo ${task.name} ha fallado:`, task.result.detail);
        }
      }
    })
  }

  const processFiles = async (files) => {
    setIsFileUploading(true) // Showing progress bar
    console.log("Procesando archivos automáticamente...");

    let response = null

    if (type == "invoice") {
      response = await postInvoiceAutomatic(userToken, files)
      setIsFileUploaded(true)
    } else {
      response = await postExpenseTicketAutomatic(userToken, files)
      setIsFileUploaded(true)
    }

    if (!response) {
      // changing global state
      // dispatch(failedProcessedFileState(true));
      setIsError(true)
    }

    setTimeout(() => {
      setIsFileUploaded(false);
      setIsFileUploading(false);
    }, 5000)
  }

  useEffect(() => {
    if (successProgressBarPercentage + failProgressBarPercentage == 100) {
      setTimeout(async () => {
        console.log('Updating grid data...');
        await getPanelData('?year=1'); // getPanelData() to show files in the grid

        // change card view, hide progress bar, setting isFileUploading to false.
        // setIsFileUploading(false);
        // reset progessBar Percentages
        setSuccessProgressBarPercentage(10)
        setFailProgressBarPercentage(0)
      }, 3000);
    }

  }, [successProgressBarPercentage, failProgressBarPercentage])

  useEffect(() => {
    if (tasksState && tasksState.results !== undefined) {
      updateNotificationState();
    }
  }, [tasksState])

  return (
    <>
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
          {/* {isFileUploading && (
          <div>
            <img src={type == "invoice" ? spinner : spinnerYellow} className="loading-icon" />
            <div>Subiendo archivos... </div>
          </div>
        )} */}
          {isFileUploaded && (
            <div className="upload-indicator">
              <FaCheckCircle className="upload-icon" />
              <span className="">Archivos subidos</span>
              <span className="text-drop text-success color-drop small"><br />
                Tus archivos se van a procesar y aparecerán reflejados en unos segundos
              </span>
            </div>
          )}
          {!isFileUploading && (
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
          {/* Progress Bar New: Make it visible when task progress starts */}
          {/* {isFileUploading && (
          <ProgressBar className='my-3'>
            <ProgressBar
              animated
              now={successProgressBarPercentage}
              key={1}
              style={{
                borderRadius: '100px 0 0 100px',
                backgroundColor: '#97A4FF',
              }} />
            <ProgressBar
              animated
              now={failProgressBarPercentage}
              key={2}
              style={{
                borderRadius: '100px 0 0 100px',
                backgroundColor: '#FF6A36',
              }} />
          </ProgressBar>
        )} */}
        </div>
      </div>
      {/* <FileWatcherComponent /> */}
    </>
  );
};

DragAndDropCardComponent.propTypes = {
  userToken: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  setIsError: PropTypes.func.isRequired,
  getPanelData: PropTypes.func,
  getTasksStatus: PropTypes.func,
  tasksState: PropTypes.array,
}