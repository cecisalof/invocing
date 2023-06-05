import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AppBar } from "../../components/appBar/AppBar";
import { FaCheckCircle, FaCircleNotch } from 'react-icons/fa';
import Context from '../../contexts/context';
import { useContext } from 'react';
import { getProviders } from "../suppliers/services";
import { postInvoice, postInvoiceAutomatic, getSchenduleStatus } from "./services";
import { ProgressBar } from 'react-bootstrap';
import './style.css';
import '../general-style.css'
import { Alert } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';
import dragDrop from '../../assets/icons/drag-and-drop-96.png';

export const AddInvoicesToPay = (props) => {
    const [userToken, setUserToken] = useState('');
    const [progress, setProgress] = useState(0);
    const isLoadingRef = useRef(false);


    const [provider, setProvider] = useState('');
    const [date, setDate] = useState('');
    const [state, setState] = useState('');
    const [number, setNumber] = useState('');
    const [concept, setConcept] = useState('');
    const [paymentType, setPaymentType] = useState('');
    const [total, setTotal] = useState('');
    const [totalTaxes, setTotalTaxes] = useState('');
    const [totalPretaxes, setTotalPretaxes] = useState('');
    const [taxesPercentage, setTaxesPercentage] = useState('');
    const [totalRetention, setTotalRetention] = useState('');
    const [retentionPercentage, setRetentionPercentage] = useState('');
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

  const handleAddState = (e) => {
    setState(e.target.value);
  };

  const handleAddPaymentType = (e) => {
    setPaymentType(e.target.value);
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

  const handleAddRetentionPercentage = (e) => {
    setRetentionPercentage(e.target.value);
  };

  const handleAddTotalPretaxes = (e) => {
    setTotalPretaxes(e.target.value);
  };

  const handleAddTotalRetention = (e) => {
    setTotalRetention(e.target.value);
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
    const response = await postInvoiceAutomatic(userToken, files);
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
        setTimeout(checkStatus, 10000); // Esperar 2 segundos (puedes ajustar el tiempo según tus necesidades)
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

    const data = new FormData();
    data.append('file', file[0]); // Agregar el archivo al objeto FormData

    data.append('is_autoprocessed', false);
    data.append('original_json', JSON.stringify({}));
    data.append('date', date);
    data.append('state', state);
    data.append('number', number);
    data.append('concept', concept);
    data.append('payment_type', paymentType);
    data.append('total_pretaxes', totalPretaxes);
    data.append('total_taxes', totalTaxes);
    data.append('taxes_percentage', taxesPercentage);
    data.append('total_retention', totalRetention);
    data.append('retention_percentage', retentionPercentage);
    data.append('total', total);
    data.append('currency', currency);
    data.append('sender', provider);
    setIsSuccess(false);
    setIsError(false);

      const response = await postInvoice(userToken, data);
      if (response === undefined){
        setIsError(true)
      }else{
        setIsSuccess(true)
      }

    // Reiniciar los valores de los campos

  setProvider('');
  setDate('');
  setState('');
  setNumber('');
  setConcept('');
  setPaymentType('');
  setTotal('');
  setTotalTaxes('');
  setTotalPretaxes('');
  setTaxesPercentage('');
  setTotalRetention('');
  setRetentionPercentage('');
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

    {isSuccess && (
  <Alert severity="success" className="custom-alert">
    <AlertTitle>Success</AlertTitle>
    La operación se realizó correctamente.
  </Alert>
)}
      {isError && (
      <Alert severity="error" className="custom-alert">
        <AlertTitle>Error</AlertTitle>
        Hubo un error al realizar la operación.
      </Alert>)}


      {isLoadingRef.current && (
      <ProgressBar
        now={progress}
        label={progress === 0 ? "0%" : `${progress}%`}
        animated={progress === 0}
        variant="info"
        className="mb-3 custom-width"
      />
    )}

      <div className="panel">
      <div className="input-container">
          <label className="label" htmlFor="file">Archivo</label>
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
                <option value="">Selecciona un proveedor</option>
                {providersLoaded && rowProviders.map(option => (
                <option key={option.name} value={option.uuid}>{option.name}</option>
                ))}
            </select>
            </div>

            <div className="form-column">
              <div className="input-container">
                <label className="label" htmlFor="address">Numero de Factura</label>
                <input
                  type="text"
                  id="address"
                  value={number}
                  onChange={handleAddNumber}
                  placeholder="0000000"
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
                  placeholder="xx €"
                  className="smalltextbox" 
                />
            </div>
            <div className="input-container">
                <label className="label" htmlFor="taxes_percentage">Porcentaje de Impuestos</label>
                <input
                  type="text"
                  id="taxes_percentage"
                  value={taxesPercentage}
                  onChange={handleAddTaxes}
                  placeholder="21"
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
                <label className="label" htmlFor="invoice_amount">Estado</label>
                <select
              id="invoice_amount"
              value={state}
              onChange={handleAddState}
              className="smalltextbox"
            >
              <option value="">Selecciona un estado</option>
              <option value="pending">PENDIENTE</option>
              <option value="received">RECIBIDA</option>
              <option value="payed">PAGADA</option>
              <option value="rejected">RECHAZADO</option>
            </select>

            </div>
            <div className="input-container">
                <label className="label" htmlFor="taxes_percentage">Total de Impuestos</label>
                <input
                  type="text"
                  id="taxes_percentage"
                  value={totalTaxes}
                  onChange={handleAddTotalTaxes}
                  placeholder=""
                  className="smalltextbox" 
                />
            </div>
            <div className="input-container">
                <label className="label" htmlFor="currecy">Total sin Impuestos</label>
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

          <div className="form-row">
              <div className="input-container">
                <label className="label" htmlFor="invoice_amount">Tipo de Pago </label>
                <select
                  type="text"
                  id="invoice_amount"
                  value={paymentType}
                  onChange={handleAddPaymentType}
                  placeholder=""
                  className="smalltextbox"
                  >
              <option value="">Selecciona un tipo de pago</option>
              <option value="direct_debit">Domiciliación</option>
              <option value="cheque">Cheque</option>
              <option value="transfer">Transferencia</option>
              <option value="cash">Efectivo</option>
              <option value="card">Tarjeta</option>
            </select>
            </div>
            <div className="input-container">
                <label className="label" htmlFor="taxes_percentage">Porcentaje de Retenciones</label>
                <input
                  type="text"
                  id="taxes_percentage"
                  value={retentionPercentage}
                  onChange={handleAddRetentionPercentage}
                  placeholder=""
                  className="smalltextbox" 
                />
            </div>
            <div className="input-container">
                <label className="label" htmlFor="currecy">Total Retenciones</label>
                <input
                  type="text"
                  id="curreny"
                  value={totalRetention}
                  onChange={handleAddTotalRetention}
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

export default AddInvoicesToPay;
