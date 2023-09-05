import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppBar } from "../../components/appBar/AppBar";
import Context from '../../contexts/context';
import { useContext } from 'react';
import { getProviders } from "../suppliers/services";
import { postInvoice } from "./services";
import './style.css';
import '../general-style.css'
import { Alert } from '@mui/material';

export const AddInvoicesToPay = () => {
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
  const [file, setManualFile] = useState('');


  const [rowProviders, setrowProviders] = useState(); // Set rowData to Array of Objects, one Object per Row
  const [providersLoaded, setProvidersLoaded] = useState(false);

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const location = useLocation();
  const userDataContext = useContext(Context);

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

  const handleFileChange = (event) => {
    const file = event.target.files;
    setManualFile(file);
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

    const response = await postInvoice(userDataContext.userData.token, data);
    if (response === undefined) {
      setIsError(true)
    } else {
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
        <AppBar location={location} />
      </div>
      <div className="title">Nueva factura</div>

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
        <div className="input-container mx-3">
          <input type="file" id="file" onChange={handleFileChange} />
        </div>
        <div className="px-3">
          {/* Provider & Invoice Row */}
          <div className='row'>
            <div className='col-lg-6 col-xs-12 col-md-6'>
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
            <div className='col-lg-4 col-xs-12 col-md-6'>
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
          {/* Concept & date Row */}
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
          {/*Total, percentage and currency Row */}
          <div className='row'>
            <div className='col-lg-4 col-xs-12 col-md-6'>
              <div className="mb-3">
                <label className="label d-flex" htmlFor="invoice_amount">Total</label>
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
                <label className="label d-flex" htmlFor="taxes_percentage">Porcentaje de Impuestos</label>
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
                <label className="label d-flex" htmlFor="currecy">Divisa</label>
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
          {/* Status, taxes Row */}
          <div className='row'>
            <div className='col-lg-4 col-xs-12 col-md-6'>
              <div className="mb-3">
                <label className="label" htmlFor="invoice_amount">Estado</label>
                <select
                  id="invoice_amount"
                  value={state}
                  onChange={handleAddState}
                  className="inputTextbox form-select"
                >
                  <option value="pending">Pendiente</option>
                  <option value="received">Recibida</option>
                  <option value="paid">Pagada</option>
                  <option value="rejected">Rechazado</option>
                </select>
              </div>
            </div>
            <div className='col-lg-4 col-md-6 col-xs-12'>
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
          {/* Payment Row */}
          <div className='row'>
            <div className='col-lg-4 col-xs-12 col-md-6'>
              <div className="mb-3">
                <label className="label" htmlFor="invoice_amount">Tipo de pago </label>
                <select
                  type="text"
                  id="invoice_amount"
                  value={paymentType}
                  onChange={handleAddPaymentType}
                  placeholder=""
                  className="inputTextbox form-select"
                >
                  <option value="direct_debit">Domiciliación</option>
                  <option value="cheque">Cheque</option>
                  <option value="transfer">Transferencia</option>
                  <option value="cash">Efectivo</option>
                  <option value="card">Tarjeta</option>
                </select>
              </div>
            </div>
            <div className='col-lg-4 col-md-6 col-xs-12'>
              <div className="mb-3">
                <label className="label" htmlFor="taxes_percentage">Porcentaje de retenciones</label>
                <input
                  type="text"
                  id="taxes_percentage"
                  value={retentionPercentage}
                  onChange={handleAddRetentionPercentage}
                  placeholder=""
                  className="inputTextbox"
                />
              </div>
            </div>
            <div className='col-lg-4 col-md-6 col-xs-12'>
              <div className="mb-3">
                <label className="label" htmlFor="currecy">Total retenciones</label>
                <input
                  type="text"
                  id="curreny"
                  value={totalRetention}
                  onChange={handleAddTotalRetention}
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

    </div>
  );
};

export default AddInvoicesToPay;
