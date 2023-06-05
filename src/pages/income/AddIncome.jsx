import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import Context from '../../contexts/context';
import { useContext } from 'react';
import { postIncome} from "./services";
import './style.css';
import '../general-style.css'
import { Alert } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';

export const AddIncome = () => {
const [userToken, setUserToken] = useState('');

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [concept, setConcept] = useState('');
  const [nif, setNif] = useState('');
  const [invoiceAmount, setInvoiceAmount] = useState('');
  const [currency, setCurrency] = useState('');
  const [taxesPercentage, setTaxesPercentage] = useState('');

  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const location = useLocation();
  const userDataContext = useContext(Context);

  useEffect(() => {
    let token = userDataContext.userData.token;
    if (token !== null) {
      setUserToken(token);
    }
  }, [userDataContext.userData.token]);

  const handleAddName = (e) => {
    setName(e.target.value);
  };
  const handleAddDate = (e) => {
    setDate(e.target.value);
  };

  const handleAddNIF = (e) => {
    setNif(e.target.value);
  };

  const handleAddAdress = (e) => {
    setAddress(e.target.value);
  };
  const handleAddNumber = (e) => {
    setNumber(e.target.value);
  };
  const handleAddTaxes = (e) => {
    setTaxesPercentage(e.target.value);
  };
  const handleAddInvoice = (e) => {
    setInvoiceAmount(e.target.value);
  };
  const handleAddCurrency = (e) => {
    setCurrency(e.target.value);
  };
  const handleAddConcept = (e) => {
    setConcept(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      date: date,
      name: name,
      nif: nif,
      address: address,
      number: number,
      concept: concept,
      taxes_percentage: taxesPercentage,
      invoice_amount: invoiceAmount,
      currency: currency
    };
    setIsSuccess(false);
    setIsError(false);

      const response = await postIncome(userToken, data);
      if (response === undefined){
        setIsError(true)
      }else{
        setIsSuccess(true)
        window.open(response.data.file, '_blank');
      }


    // Reiniciar los valores de los campos
    setName('')
    setNumber('')
    setConcept('')
    setCurrency('')
    setAddress('')
    setDate('')
    setCurrency('')
    setNif('')
    setInvoiceAmount('')
    setTaxesPercentage('')

  };
  
  return (
    <>
      <div className="root">
        <div>
          <AppBar location={location}/>
        </div>
  
        <div className="title">Nueva Factura a Emitir</div>
        
        {isSuccess && (
      <Alert onClose={() => {setIsSuccess(false)}} severity="success" className="custom-alert">
        <AlertTitle>Success</AlertTitle>
        La operación se realizó correctamente.
      </Alert>
    )}
      {isError && (
      <Alert  severity="error" className="custom-alert" onClose={() => {setIsError(false)}}>
        <AlertTitle>Error</AlertTitle>
        Hubo un error al realizar la operación.
      </Alert>)}

        <div className="panel">
          <div className="form-row">
              <div className="input-container">
                <label className="label" htmlFor="nombre-juridico">Nombre Cliente</label>
                <input
                  type="text"
                  id="nombre-juridico"
                  value={name}
                  onChange={handleAddName}
                  placeholder="Nombre"
                  className="bigtextbox" 
                />
            </div>
            <div className="form-column">
              <div className="input-container">
                <label className="label" htmlFor="address">Dirección</label>
                <input
                  type="text"
                  id="address"
                  value={address}
                  onChange={handleAddAdress}
                  placeholder="Dirección fiscal"
                  className="midtextbox" 
                />
              </div>
            </div>
          </div>

          <div className="form-row">
              <div className="input-container">
                <label className="label" htmlFor="nif">NIF</label>
                <input
                  type="text"
                  id="nif"
                  value={nif}
                  onChange={handleAddNIF}
                  placeholder="B-0000000"
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
                <label className="label" htmlFor="invoice_amount">Importe Factura</label>
                <input
                  type="text"
                  id="invoice_amount"
                  value={invoiceAmount}
                  onChange={handleAddInvoice}
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
                <label className="label" htmlFor="number">Numero de Factura</label>
                <input
                  type="text"
                  id="number"
                  value={number}
                  onChange={handleAddNumber}
                  placeholder="000000000"
                  className="bigtextbox"
                />
              </div>
            <div className="form-column">
              <div className="input-container">
                <label className="label" htmlFor="concept">Concepto</label>
                <input
                  type="text"
                  id="concept"
                  value={concept}
                  onChange={handleAddConcept}
                  placeholder="Concepto"
                  className="midtextbox" 
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
    </>
  );
  
  
}

export default AddIncome;
