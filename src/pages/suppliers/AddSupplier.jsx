import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import Context from '../../contexts/context';
import { useContext } from 'react';
import { postProviders} from "./services";
import './style.css';
import '../general-style.css'
import { Alert } from '@mui/material';
import AlertTitle from '@mui/material/AlertTitle';

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
      if (response === undefined){
        setIsError(true)
      }else{
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
          <AppBar location={location}/>
        </div>
  
        <div className="title">Nuevo Proveedor</div>
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

        <div className="panel">
          <div className="form-row">
              <div className="input-container">
                <label className="label" htmlFor="nombre-juridico">Nombre Proveedor</label>
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
                <label className="label" htmlFor="actividad">Actividad</label>
                <input
                  type="text"
                  id="actividad"
                  value={activity}
                  onChange={handleAddActivity}
                  placeholder="Actividad"
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
                  className="smalltextbox" 
                />
            </div>
            <div className="form-column">
              <div className="input-container">
                <label className="label" htmlFor="telefono">Télefono</label>
                <input
                  type="text"
                  id="telefono"
                  value={phone}
                  onChange={handleAddPhone}
                  placeholder="+34 000 000 000"
                  className="smalltextbox" 
                />
              </div>
            </div>

            <div className="form-column">
            <div className="input-container">
                <label className="label" htmlFor="Email">Email</label>
                <input
                  type="text"
                  id="Email"
                  value={email}
                  onChange={handleAddEmail}
                  placeholder="ejemplo@gmail.com"
                  className="midtextbox" 
                />
              </div>
            </div>
          </div>

          <div className="form-row">
              <div className="input-container">
                <label className="label" htmlFor="dirección">Dirección</label>
                <input
                  type="text"
                  id="dirección"
                  value={address}
                  onChange={handleAddAdress}
                  placeholder="Dirección fiscal"
                  className="bigtextbox" 
                />
            </div>
            <div className="input-container">
                <label className="label" htmlFor="cuaneta bancaria">Cuenta Bancaria</label>
                <input
                  type="text"
                  id="cuentabcanaria"
                  value={account}
                  onChange={handleAddAccount}
                  placeholder="ES9420805801101234567891"
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
    </>
  );
  
  
}

export default AddSupplier;
