import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AppBar } from "../../components/appBar/AppBar";
import { FaCheckCircle, FaCircleNotch } from 'react-icons/fa';
import Context from '../../contexts/context';
import { useContext } from 'react';
import { postExpenseTicket, postExpenseTicketAutomatic, getSchenduleStatus } from "./services";
import { getProviders } from "../suppliers/services";
import { ProgressBar } from 'react-bootstrap';
import './style.css';
import '../general-style.css'
import dragDrop from '../../assets/icons/drag-and-drop-96.png';
import { Alert } from '@mui/material';

export const AddExpenseTickets = (props) => {
    const [userToken, setUserToken] = useState('');
    const [progress, setProgress] = useState(0);
    const isLoadingRef = useRef(false);

    const [provider, setProvider] = useState('');
    const [date, setDate] = useState('');
    const [number, setNumber] = useState('');
    const [concept, setConcept] = useState('');
    const [total, setTotal] = useState('');
    const [totalTaxes, setTotalTaxes] = useState('');
    const [totalPretaxes, setTotalPretaxes] = useState('');
    const [taxesPercentage, setTaxesPercentage] = useState('');
    const [currency, setCurrency] = useState('');
    const [files, setFiles] = useState([]);
    const [file, setManualFile] = useState('');
    

    const [rowProviders, setrowProviders] = useState(); // Set rowData to Array of Objects, one Object per Row
    const [providersLoaded, setProvidersLoaded] = useState(false);
  
    const [isSuccess, setIsSuccess] = useState(false);
    const [isError, setIsError] = useState(false);
  
    const location = useLocation();
    const userDataContext = useContext(Context);
  
  const [isFileUploaded, setIsFileUploaded] = useState(false);


  useEffect(() => {
    let token = userDataContext.userData.token;
    if (token !== null) {
      setUserToken(token);
    }
  }, [userDataContext.userData.token]);

  const handleAddProvider = (e) => {
    setProvider(e.target.value);
  };

  const handleAddDate = (e) => {
    setDate(e.target.value);
  };

  const handleAddNumber = (e) => {
    setNumber(e.target.value);
  };
  const handleAddTaxes = (e) => {
    setTaxesPercentage(e.target.value);
  };
  const handleAddTotal = (e) => {
    setTotal(e.target.value);
  };
  const handleAddCurrency = (e) => {
    setCurrency(e.target.value);
  };
  const handleAddConcept = (e) => {
    setConcept(e.target.value);
  };


  const handleAddTotalPretaxes = (e) => {
    setTotalPretaxes(e.target.value);
  };


  const handleAddTotalTaxes = (e) => {
    setTotalTaxes(e.target.value);
  };
  
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.add('file-drop-zone-dragging');
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.remove('file-drop-zone-dragging');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.target.classList.remove('file-drop-zone-dragging');
    
    const files = event.dataTransfer.files;
    setFiles(files)
    console.log(files);
    setIsFileUploaded(true);
  };

  useEffect(() => {
    if (userToken !== undefined) {
      getDataProviders(userToken);
    }
  }, [userToken]);

  const getDataProviders = async (userToken) => {
    try {
      const data = await getProviders(userToken);
      setrowProviders(data || []);
      setProvidersLoaded(true);
    } catch (error) {
      setrowProviders([]);
      console.log('No hay datos para mostrar.');
      setProvidersLoaded(true); // Si ocurre un error, también establece providersLoaded como true para continuar con la configuración de columnDefs
    }
  };



  const processFiles = async () => {
    console.log("Procesando archivos automáticamente...");
    isLoadingRef.current = true;
    setIsFileUploaded(false);
    const response = await postExpenseTicketAutomatic(userToken, files);
    const ids = response.data.schendules
    console.log(ids)
    

    const checkStatus = async () => {
      
      const response = await getSchenduleStatus(userToken, ids);
      const statusResponse = response.status
  
      // Verificar si todos los IDs están en el estado "DONE"
      let allDone = true;
      let loadedCount = 0
      

      statusResponse.map((item) => {
        for (const id of ids) {
          allDone = true;
          const status = item[id.toString()]; // Obtener el estado del ID
          if (status === "DONE") {
            loadedCount =  loadedCount + 1; // Incrementar el contador si el estado es "DONE"
            console.log(loadedCount); // Imprimir el número de IDs con estado "DONE"
            const totalCount = ids.length;
            const percentage = Math.round((loadedCount * 100) / totalCount);
            setProgress(percentage); // Actualiza el progreso
          }else{
            allDone = false;
            const totalCount = ids.length;
            const percentage = Math.round((loadedCount * 100) / totalCount);
            setProgress(percentage); // Actualiza el progreso
          }

        }
      });
      if (!allDone) {
        // Si no todos los IDs están en el estado "DONE", esperar un tiempo y volver a verificar
        setTimeout(checkStatus, 30000); // Esperar 2 segundos (puedes ajustar el tiempo según tus necesidades)
      } else {
        console.log("Procesamiento completo");
        //setTimeout(isLoadingRef.current = false, 30000)
      }   
      
    };
    // Iniciar la verificación del estado de los IDs
    await checkStatus();


   };
   const handleFileChange = (event) => {
    const file = event.target.files;
    setManualFile(file);
    console.log(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(); // Crear un objeto FormData
    formData.append('file', file[0]); // Agregar el archivo al objeto FormData

    // Agregar los otros campos al objeto FormData
    formData.append('sender', provider);
    formData.append('is_autoprocessed', false);
    formData.append('original_json', '{}');
    formData.append('date', date);
    formData.append('number', number);
    formData.append('concept', concept);
    formData.append('total_pretaxes', totalPretaxes);
    formData.append('total_taxes', totalTaxes);
    formData.append('taxes_percentage', taxesPercentage);
    formData.append('total', total);
    formData.append('currency', currency);

    setIsSuccess(false);
    setIsError(false);

      const response = await postExpenseTicket(userToken, formData);
      if (response === undefined){
        setIsError(true)
      }else{
        setIsSuccess(true)
      }


    // Reiniciar los valores de los campos

  setDate('');
  setNumber('');
  setConcept('');
  setTotal('');
  setTotalTaxes('');
  setTotalPretaxes('');
  setTaxesPercentage('');
  setCurrency('');
  };

  return (
    <div className="root">
      <div>
        <AppBar location={location}/>
      </div>
      <div
        className="file-drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="drop-message">
          {isLoadingRef.current && progress < 100 ? (
            <div>
              <FaCircleNotch className="loading-icon" />
              <span className="upload-text">Cargando facturas</span>
            </div>
          ) : isFileUploaded ? (
            <div className="upload-indicator">
              <FaCheckCircle className="upload-icon" />
              <span className="upload-text">Archivos subidos</span>
            </div>
          ) : (
            <div>
              <img src={dragDrop} alt="dragDrop"/>
            </div>
          )}
        </div>
        <button className="process-button" onClick={processFiles}>
          Procesar automáticamente
        </button>
      </div>

      {isLoadingRef.current && (
      <ProgressBar
        now={progress}
        label={progress === 0 ? "0%" : `${progress}%`}
        animated={progress === 0}
        variant="info"
        className="mb-3 custom-width"
      />
    )}

    {isSuccess && (
      <Alert onClose={() => {setIsSuccess(false)}} severity="success" className="custom-alert">
        La operación se realizó correctamente.
      </Alert>
    )}
      {isError && (
      <Alert  severity="error" className="custom-alert" onClose={() => {setIsError(false)}}>
        Hubo un error al realizar la operación.
      </Alert>)}

      <div className="panel">
      <div className="input-container">
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
      <div className="form-row">
          <div className="input-container">
            <label className="label" htmlFor="nombre-juridico">Proveedor</label>
            <select
                id="nombre-juridico"
                value={provider}
                onChange={handleAddProvider}
                className="bigtextbox" // Agrega las clases CSS para mantener el mismo estilo
                disabled={!providersLoaded} // Deshabilita el select mientras se cargan las opciones
            >
                {providersLoaded && rowProviders.map(option => (
                <option key={option.name} value={option.uuid}>{option.name}</option>
                ))}
            </select>
            </div>

            <div className="form-column">
              <div className="input-container">
                <label className="label" htmlFor="address">Numero de factura</label>
                <input
                  type="text"
                  id="address"
                  value={number}
                  onChange={handleAddNumber}
                  className="midtextbox" 
                />
              </div>
            </div>
          </div>

          <div className="form-row">
              <div className="input-container">
                <label className="label" htmlFor="nif">Concepto</label>
                <input
                  type="text"
                  id="nif"
                  value={concept}
                  onChange={handleAddConcept}
                  placeholder=""
                  className="bigtextbox" 
                />
            </div>
            <div className="form-column">
              <div className="input-container">
                <label className="label" htmlFor="Fecha">Fecha</label>
                <input
                  type="text"
                  id="Fecha"
                  value={date}
                  onChange={handleAddDate}
                  placeholder="yyyy-mm-dd"
                  className="midtextbox" 
                />
              </div>
            </div>

            
          </div>

          <div className="form-row">
              <div className="input-container">
                <label className="label" htmlFor="invoice_amount">Total</label>
                <input
                  type="text"
                  id="invoice_amount"
                  value={total}
                  onChange={handleAddTotal}
                  className="smalltextbox" 
                />
            </div>
            <div className="input-container">
                <label className="label" htmlFor="taxes_percentage">Porcentaje de impuestos</label>
                <input
                  type="text"
                  id="taxes_percentage"
                  value={taxesPercentage}
                  onChange={handleAddTaxes}
                  className="smalltextbox" 
                />
            </div>
            <div className="input-container">
                <label className="label" htmlFor="currecy">Divisa</label>
                <input
                  type="text"
                  id="curreny"
                  value={currency}
                  onChange={handleAddCurrency}
                  placeholder="EUR"
                  className="midtextbox" 
                />
            </div>
          </div>

          <div className="form-row">
            <div className="input-container">
                <label className="label" htmlFor="taxes_percentage">Total de impuestos</label>
                <input
                  type="text"
                  id="taxes_percentage"
                  value={totalTaxes}
                  onChange={handleAddTotalTaxes}
                  placeholder=""
                  className="bigtextbox" 
                />
            </div>
            <div className="input-container">
                <label className="label" htmlFor="currecy">Total sin impuestos</label>
                <input
                  type="text"
                  id="curreny"
                  value={totalPretaxes}
                  onChange={handleAddTotalPretaxes}
                  placeholder=""
                  className="midtextbox" 
                />
            </div>
          </div>

          <button
              type="button"
              className="btn btn-primary rounded-pill px-4 my-3" onClick={handleSubmit} // Agrega las clases de Bootstrap y estilos personalizados
              style={{ marginTop: '200px', width: '200px' }} // Estilos en línea para margen superior y ancho
            >
              Guardar
            </button>
            
        </div>
      
    </div>
  );
};

export default AddExpenseTickets;
