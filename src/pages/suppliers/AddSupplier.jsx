import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import Context from '../../contexts/context';
import { useContext } from 'react';
import { postProviders } from "./services";
import './style.css';
import '../general-style.css'
import { Alert } from '@mui/material';

export const AddSupplier = () => {
  const [userToken, setUserToken] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [account, setAccount] = useState('');
  const [nif, setNif] = useState('');
  const [activity, setActivity] = useState('');

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
  const handleAddPhone = (e) => {
    setPhone(e.target.value);
  };

  const handleAddNIF = (e) => {
    setNif(e.target.value);
  };

  const handleAddAdress = (e) => {
    setAddress(e.target.value);
  };
  const handleAddAccount = (e) => {
    setAccount(e.target.value);
  };
  const handleAddActivity = (e) => {
    setActivity(e.target.value);
  };
  const handleAddEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      activity: activity,
      name: name,
      nif: nif,
      address: address,
      email: email,
      phone_number: phone,
      account_number: account,
    };
    setIsSuccess(false);
    setIsError(false);



    const response = await postProviders(userToken, data);
    console.log(response)
    if (response === undefined) {
      setIsError(true)
    } else {
      setIsSuccess(true)
    }


    // Reiniciar los valores de los campos
    setName('')
    setPhone('')
    setAccount('')
    setActivity('')
    setAddress('')
    setEmail('')
    setNif('')

  };

  return (
    <>
      <div className="root">
        <div>
          <AppBar location={location} />
        </div>

        <div className="title">Nuevo proveedor</div>
        {isSuccess && (
          <Alert onClose={() => { setIsSuccess(false) }} severity="success" className="custom-alert">
            La operación se realizó correctamente.
          </Alert>
        )}
        {isError && (
          <Alert severity="error" className="custom-alert" onClose={() => { setIsError(false) }}>
            Hubo un error al realizar la operación.
          </Alert>)}

        <div className="px-3">
          {/* Name & Activity Row */}
          <div className='row'>
            <div className='col-lg-6 col-xs-12 col-md-6'>
              <div className="mb-3">
                <label className="label d-flex" htmlFor="nombre-juridico">Nombre proveedor</label>
                <input
                  type="text"
                  id="nombre-juridico"
                  value={name}
                  onChange={handleAddName}
                  placeholder="Nombre"
                  className="inputTextbox"
                />
              </div>
            </div>
            <div className='col-lg-6 col-md-6 col-xs-12'>
              <div className="mb-3">
                <label className="label d-flex" htmlFor="nombre-juridico">Actividad</label>
                <input
                  type="text"
                  id="nombre-juridico"
                  value={name}
                  onChange={handleAddActivity}
                  placeholder="Actividad"
                  className="inputTextbox"
                />
              </div>
            </div>
          </div>
          {/* NIF, phone, email */}
          <div className='row'>
            <div className='col-lg-4 col-xs-12 col-md-4'>
              <div className="mb-3">
                <label className="label d-flex" htmlFor="nif">NIF</label>
                <input
                  type="text"
                  id="nif"
                  value={nif}
                  onChange={handleAddNIF}
                  placeholder="B-0000000"
                  className="inputTextbox"
                />
              </div>
            </div>
            <div className='col-lg-4 col-md-4 col-xs-12'>
              <div className="mb-3">
                <label className="label d-flex" htmlFor="telefono">Télefono</label>
                <input
                  type="text"
                  id="telefono"
                  value={phone}
                  onChange={handleAddPhone}
                  placeholder="+34 000 000 000"
                  className="inputTextbox"
                />
              </div>
            </div>
            <div className='col-lg-4 col-md-4 col-xs-12'>
              <div className="mb-3">
                <label className="label d-flex" htmlFor="Email">Email</label>
                <input
                  type="text"
                  id="Email"
                  value={email}
                  onChange={handleAddEmail}
                  placeholder="ejemplo@gmail.com"
                  className="inputTextbox"
                />
              </div>
            </div>
          </div>
          {/* Bank acount & Adress Row */}
          <div className='row'>
            <div className='col-lg-6 col-xs-12 col-md-6'>
              <div className="mb-3">
                <label className="label d-flex" htmlFor="dirección">Dirección</label>
                <input
                  type="text"
                  id="dirección"
                  value={address}
                  onChange={handleAddAdress}
                  placeholder="Dirección fiscal"
                  className="inputTextbox"
                />
              </div>
            </div>
            <div className='col-lg-6 col-md-6 col-xs-12'>
              <div className="mb-3">
                <label className="label" htmlFor="cuenta bancaria">Cuenta bancaria</label>
                <input
                  type="text"
                  id="cuentabcanaria"
                  value={account}
                  onChange={handleAddAccount}
                  placeholder="ES9420805801101234567891"
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
    </>
  );


}

export default AddSupplier;
