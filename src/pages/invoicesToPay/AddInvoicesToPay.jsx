import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppBar } from "../../components/appBar/AppBar";
import { FaCheckCircle } from 'react-icons/fa';
import Context from '../../contexts/context';
import { useContext } from 'react';
import { getProviders } from "../suppliers/services";

export const AddInvoicesToPay = (props) => {
    const [userToken, setUserToken] = useState('');

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
    
  
    const [isLoading, setIsLoading] = useState(false);

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

  const processFiles = () => {
    console.log("Procesando archivos automáticamente...");
    setIsFileUploaded(false);
    // Realiza las operaciones de procesamiento de archivos aquí
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    }



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
          {isFileUploaded ? (
            <div className="upload-indicator">
              <FaCheckCircle className="upload-icon" />
              Archivo subido
            </div>
          ) : (
            <div>
              Arrastra y suelta los archivos aquí
            </div>
          )}
        </div>
        <button className="process-button" onClick={processFiles}>
          Procesar automáticamente
        </button>
      </div>

      <div className="panel">
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
                <option key={option.name} value={option.name}>{option.name}</option>
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
                  placeholder="dd/mm/yyyy"
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
                <input
                  type="text"
                  id="invoice_amount"
                  value={state}
                  onChange={handleAddState}
                  placeholder=""
                  className="smalltextbox" 
                />
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
                <input
                  type="text"
                  id="invoice_amount"
                  value={paymentType}
                  onChange={handleAddPaymentType}
                  placeholder=""
                  className="smalltextbox" 
                />
            </div>
            <div className="input-container">
                <label className="label" htmlFor="taxes_percentage">Porcentaje de Retenciones</label>
                <input
                  type="text"
                  id="taxes_percentage"
                  value={retentionPercentage}
                  onChange={handleAddRetentionPercentage}
                  placeholder="21"
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
