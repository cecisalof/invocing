import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppBar } from "../../components/appBar/AppBar";
import Context from '../../contexts/context';
import { useContext } from 'react';
import { postExpenseTicket } from "./services";
import { getProviders } from "../suppliers/services";
import './style.css';
import '../general-style.css'
import { Alert } from '@mui/material';

export const AddExpenseTickets = () => {
  const [provider, setProvider] = useState('');
  const [date, setDate] = useState('');
  const [number, setNumber] = useState('');
  const [concept, setConcept] = useState('');
  const [total, setTotal] = useState('');
  const [totalTaxes, setTotalTaxes] = useState('');
  const [totalPretaxes, setTotalPretaxes] = useState('');
  const [taxesPercentage, setTaxesPercentage] = useState('');
  const [currency, setCurrency] = useState('');
  const [file, setManualFile] = useState('');


  const [rowProviders, setrowProviders] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [providersLoaded, setProvidersLoaded] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const location = useLocation();
  const userDataContext = useContext(Context);

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

  useEffect(() => {
    getPanelData();
  }, [userDataContext.userData.token]);

  let isLoading = false; // Class variable to avoid taking too long to save that we are loading (state is not enough to control this). Also avoids multiple request under 1 second
  const getPanelData = async () => {
    if (!userDataContext.userData.token || isLoading) return
    isLoading = true
    try {
      const data = await getProviders(userDataContext.userData.token);
      setrowProviders(data || []);
      setProvidersLoaded(true);
    } catch (error) {
      setrowProviders([]);
      console.log('No hay datos para mostrar.');
      setProvidersLoaded(true); // Si ocurre un error, también establece providersLoaded como true para continuar con la configuración de columnDefs
    }
    setTimeout(()=>{isLoading = false},1000)
  }

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

    const response = await postExpenseTicket(userDataContext.userData.token, formData);
    if (response === undefined) {
      setIsError(true)
    } else {
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
        <AppBar location={location} />
      </div>
      <div className="title">Nuevo gasto</div>
      {isSuccess && (
        <Alert onClose={() => { setIsSuccess(false) }} severity="success" className="custom-alert">
          La operación se realizó correctamente.
        </Alert>
      )}
      {isError && (
        <Alert severity="error" className="custom-alert" onClose={() => { setIsError(false) }}>
          Hubo un error al realizar la operación.
        </Alert>)}

      <div className="">
        <div className="">
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
        {/* <div className="form-row">
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
          </div> */}

        {/* <div className="form-row">
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

            
          </div> */}

        {/* <div className="form-row">
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
          </div> */}

        {/* <div className="form-row">
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
          </div> */}

        {/* <button
          type="button"
          className="btn btn-primary rounded-pill px-4 my-3" onClick={handleSubmit} // Agrega las clases de Bootstrap y estilos personalizados
          style={{ marginTop: '200px', width: '200px' }} // Estilos en línea para margen superior y ancho
        >
          Guardar
        </button> */}

        <div className='row'>
          <div className='col-lg-4 col-xs-12 col-md-6'>
            <div className="mb-3">
              <label className="label" htmlFor="nombre-juridico">Proveedor</label>
              <select
                id="nombre-juridico"
                value={provider}
                onChange={handleAddProvider}
                className="inputTextbox form-select" // Agrega las clases CSS para mantener el mismo estilo
                disabled={!providersLoaded} // Deshabilita el select mientras se cargan las opciones
              >
                {providersLoaded && rowProviders.map(option => (
                  <option key={option.name} value={option.uuid}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className='col-lg-4 col-md-6 col-xs-12'>
            <div className="mb-3">
              <label className="label" htmlFor="address">Numero de factura</label>
              <input
                type="text"
                id="address"
                value={number}
                onChange={handleAddNumber}
                className="inputTextbox"
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-4 col-xs-12 col-md-6'>
            <div className="mb-3">
              <label className="label" htmlFor="nif">Concepto</label>
              <input
                type="text"
                id="nif"
                value={concept}
                onChange={handleAddConcept}
                placeholder=""
                className="inputTextbox"
              />
            </div>
          </div>
          <div className='col-lg-4 col-md-6 col-xs-12'>
            <div className="mb-3">
              <label className="label" htmlFor="Fecha">Fecha</label>
              <input
                type="text"
                id="Fecha"
                value={date}
                onChange={handleAddDate}
                placeholder="yyyy-mm-dd"
                className="inputTextbox"
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-4 col-xs-12 col-md-6'>
            <div className="mb-3">
              <label className="label" htmlFor="invoice_amount">Total</label>
              <input
                type="text"
                id="invoice_amount"
                value={total}
                onChange={handleAddTotal}
                className="inputTextbox"
              />
            </div>
          </div>
          <div className='col-lg-4 col-md-6 col-xs-12'>
            <div className="mb-3">
              <label className="label" htmlFor="taxes_percentage">Porcentaje de impuestos</label>
              <input
                type="text"
                id="taxes_percentage"
                value={taxesPercentage}
                onChange={handleAddTaxes}
                className="inputTextbox"
              />
            </div>
          </div>
          <div className='col-lg-4 col-md-6 col-xs-12'>
            <div className="mb-3">
              <label className="label" htmlFor="currecy">Divisa</label>
              <input
                type="text"
                id="curreny"
                value={currency}
                onChange={handleAddCurrency}
                placeholder="EUR"
                className="inputTextbox"
              />
            </div>
          </div>
        </div>
        <div className='row'>
          <div className='col-lg-4 col-xs-12 col-md-6'>
            <div className="mb-3">
              <label className="label" htmlFor="taxes_percentage">Total de impuestos</label>
              <input
                type="text"
                id="taxes_percentage"
                value={totalTaxes}
                onChange={handleAddTotalTaxes}
                placeholder=""
                className="inputTextbox"
              />
            </div>
          </div>
          <div className='col-lg-4 col-md-6 col-xs-12'>
            <div className="mb-3">
              <label className="label" htmlFor="currecy">Total sin impuestos</label>
              <input
                type="text"
                id="curreny"
                value={totalPretaxes}
                onChange={handleAddTotalPretaxes}
                placeholder=""
                className="inputTextbox"
              />
            </div>
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
