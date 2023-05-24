import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { AppBar } from "../../components/appBar/AppBar";
import Context from '../../contexts/context';
import { useContext } from 'react';
import './style.css';

export const AddSupplier = () => {
const [userToken, setUserToken] = useState('');
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');

  const location = useLocation();
  const userDataContext = useContext(Context);

  useEffect(() => {
    let token = userDataContext.userData.token;
    if (token !== null) {
      setUserToken(token);
    }
  }, [userDataContext.userData.token]);

  const handleInputChange1 = (e) => {
    setInput1(e.target.value);
  };

  const handleInputChange2 = (e) => {
    setInput2(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aquí puedes realizar la lógica de añadir los datos o enviar el formulario
    console.log('Input 1:', input1);
    console.log('Input 2:', input2);

    // Reiniciar los valores de los campos
    setInput1('');
    setInput2('');
  };
  
  return (
    <>
      <div className="root">
        <div>
          <AppBar location={location}/>
        </div>
  
        <div className="title">Nuevo Proveedor</div>

        <div className="panel">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
              <div className="input-container">
                <label className="label" htmlFor="nombre-juridico">Nombre Proveedor</label>
                <input
                  type="text"
                  id="nombre-juridico"
                  value={input1}
                  onChange={handleInputChange1}
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
                  value={input2}
                  onChange={handleInputChange2}
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
                  value={input1}
                  onChange={handleInputChange1}
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
                  value={input2}
                  onChange={handleInputChange2}
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
                  value={input1}
                  onChange={handleInputChange1}
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
                  value={input2}
                  onChange={handleInputChange2}
                  placeholder="Dirección fiscal"
                  className="bigtextbox" 
                />
            </div>
            <div className="input-container">
                <label className="label" htmlFor="CP">CP</label>
                <input
                  type="text"
                  id="CP"
                  value={input1}
                  onChange={handleInputChange1}
                  placeholder="Código Postal"
                  className="midtextbox" 
                />
            </div>
          </div>

          <div className="form-row">
          <div className="input-container">
                <label className="label" htmlFor="Forma de pago">Forma de Pago</label>
                <input
                  type="text"
                  id="Forma de pago"
                  value={input2}
                  onChange={handleInputChange2}
                  placeholder="Transferencia"
                  className="smalltextbox" 
                />
              </div>
              <div className="form-column">
              <div className="input-container">
                <label className="label" htmlFor="Sujeto a IVA">Sujeto a IVA</label>
                <input
                  type="text"
                  id="Sujeto a IVA"
                  value={input1}
                  onChange={handleInputChange1}
                  placeholder="21%"
                  className="smalltextbox" 
                />
            </div>
            </div>
            <div className="form-column">
              <div className="input-container">
                <label className="label" htmlFor="Fecha">Fecha</label>
                <input
                  type="text"
                  id="Fecha"
                  value={input2}
                  onChange={handleInputChange2}
                  placeholder="mm/dd/yy"
                  className="midtextbox" 
                />
              </div>
            </div>
          </div>
          <button
              type="button"
              className="btn btn-primary rounded-pill px-4 my-3" // Agrega las clases de Bootstrap y estilos personalizados
              style={{ marginTop: '200px', width: '200px' }} // Estilos en línea para margen superior y ancho
            >
              Guardar
            </button>

        </form>
        </div>
      </div>
    </>
  );
  
  
}

export default AddSupplier;
