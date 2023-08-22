import React, { useState, useRef, useEffect } from 'react';
import { postInvoiceAutomatic } from "../../pages/invoicesToPay/services";
import { postExpenseTicketAutomatic } from "../../pages/expensesTickets/services";
import spinner from '../../assets/icons/spinner.svg';
import spinnerYellow from '../../assets/icons/spinnerYellow.svg';
import PropTypes from 'prop-types';
// import { FaCheckCircle } from 'react-icons/fa';
import cashYellow from '../../assets/icons/cashYellow.png';
import dragDrop from '../../assets/icons/drag-and-drop.png';
import { ProgressBar } from 'react-bootstrap';
import "./style.css"
import {
  taskStatus
} from "../../pages/invoicesToPay/services";

export const DragAndDropCardComponent = ({ type, userToken, setIsError, onFinishedUploading }) => {

  // const [isFileUploaded, setIsFileUploaded] = useState(false)
  const [successProgressBarPercentage, setSuccessProgressBarPercentage] = useState(10)
  const [failProgressBarPercentage, setFailProgressBarPercentage] = useState(0);
  const [isFileUploading, setIsFileUploading] = useState(false)
  const [tasksState, setTasksState] = useState([])

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

  const getTasksStatus = async () => {
    console.log('Checking file upload status')
    try {
      const data = await taskStatus(userToken)
      setTasksState(data.data)
    } catch (error) {
      setTasksState([])
      console.log('No hay datos para mostrar.')
    }
  };

  // const processFiles = async (files) => {
  //   setIsFileUploading(true) // SHOWING BAR
  //   console.log("Procesando archivos automáticamente...")
  //   getTasksStatus() // file processing status result
  //   let response = null
  //   // let scheduleStatus = null;
  //   if (type == "invoice") {
  //     response = await postInvoiceAutomatic(userToken, files)
  //     // if (response) {
  //     await checkStatus(response) // checks file upload process
  //     // }
  //     // console.log(response);
  //     // scheduleStatus = await getSchenduleStatus(userToken, response.data.schedules);
  //     // setFileLoadingProcessResponse(scheduleStatus);
  //   } else {
  //     response = await postExpenseTicketAutomatic(userToken, files)
  //   }

  //   setTimeout(
  //     await onFinishedUploading(),
  //     setIsFileUploading(false),
  //     setIsFileUploaded(true)
  //     , 5000) // getPanelData()

  //   if (!response) {
  //     setIsError(true)
  //   }
  //   setTimeout(() => {
  //     setIsFileUploaded(false);
  //   }, 5000)
  // };


  const updateBarPercentage = () => {
    for (const [i, fileQueue] of tasksState.entries()) { // fileQueue represents each file queue in getTasksStatus().

      // if (fileQueue.success + fileQueue.fail < fileQueue.totals) { // not all files had been uploaded
      //   console.log('getTasksStatus again!');
      //   setTimeout(() => {
      //     getTasksStatus() // Wait 10 secs & re-run getTasksStatus()
      //   }, 10000);
      // }

      // fileQueue.items is an array with processed files in each file queue in getTasksStatus().
      i == 0 && fileQueue.items.map((items) => {
        console.log(items);
        if (items.result == null) {
          console.log('getTasksStatus again!')
          setTimeout(() => {
            getTasksStatus() // Wait 10 secs & re-run getTasksStatus()
          }, 10000);

        } else if (items.result.success) {
          console.log('Archivo success!')

          // change bar percentage first
          setSuccessProgressBarPercentage(Math.round((fileQueue.success * 100) / fileQueue.total))

          setTimeout(async () => {
            console.log('getting panel data!');
            await onFinishedUploading // getPanelData() to show files in the grid
            // change card view, hide progress bar, setting isFileUploading to false.
            setIsFileUploading(false);
          }, 3000);

        } else if (items.result.error) {
          console.log('some items fails:', items.result.detail);

          // change bar percentage first
          setFailProgressBarPercentage(Math.round((fileQueue.fail * 100) / fileQueue.total));

          setTimeout(async () => {
            console.log('getting panel data!');
            await onFinishedUploading; // getPanelData() to show files in the grid
             // change card view, hide progress bar, setting isFileUploading to false.
             setIsFileUploading(false);
          }, 3000);
        }
      })
    }
  }

  const processFiles = async (files) => {
    setIsFileUploading(true) // Showing progress bar
    console.log("Procesando archivos automáticamente...");

    let response = null

    if (type == "invoice") {
      response = await postInvoiceAutomatic(userToken, files)

    } else {
      response = await postExpenseTicketAutomatic(userToken, files)
    }

    if (!response) {
      setIsError(true)
    }

    // setTimeout(() => {
    //   setIsFileUploaded(false);
    // }, 5000)
  }

  useEffect(() => {
    if (tasksState.length !== 0) {
      updateBarPercentage()
    }
  }, [tasksState])

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
            <div>Subiendo archivos... </div>
          </div>
        )}
        {/* {isFileUploaded && (
          <div className="upload-indicator">
            <FaCheckCircle className="upload-icon" />
            <span className="">Archivos subidos</span>
            <span className="text-drop text-success color-drop small"><br />
              Tus archivos se van a procesar y aparecerán reflejados en unos segundos
            </span>
          </div>
        )} */}
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
        {isFileUploading && (
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
        )}
      </div>
    </div>
  );
};

DragAndDropCardComponent.propTypes = {
  userToken: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  setIsError: PropTypes.func.isRequired,
  onFinishedUploading: PropTypes.func,
  getTasksStatus: PropTypes.func,
  tasksState: PropTypes.array
}