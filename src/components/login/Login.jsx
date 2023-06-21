import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './style.css';
import Context from '../../contexts/context';
import { useContext } from 'react'; 

export const Login = () => {
    const [email, setEmail] = useState("cecilia@codepremium.es");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("Y4098842A");
    const [isLoading, setIsLoading] = useState(false);
    const userDataContext = useContext(Context);
    const navigate = useNavigate();
    
    useEffect( () => { // Check if user is already logged in
      if (userDataContext.userData && userDataContext.userData.token && userDataContext.userData.uuid) {
        console.log('Already logged in!')
        navigate("/", { replace: true });
      }
    }, [userDataContext])
    
    const isValidEmail = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/g;

    const validateEmail = () => {
      if (!email || !email.match(isValidEmail)){
        setError('El email parece incorrecto, ¿puedes revisarlo?');
        return false
      }
      return true
    }

    const handleEmailChange = (event) => {
      setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    }

   const handleClick = () => {
    setError('');
    if (email == ""){ 
      setError("Introduce tu email de acceso");
      return
    } 
    if (!validateEmail()) return;
    
    if (password == "") {
      setError("Introduce tu contraseña");
      return
    }

    getToken();
   }
  
   const getToken = async () => {
    try{
      setIsLoading(true)
      const response = await axios.post('https://data.tramitgo.com/api/login',
        {
          email: email.toLowerCase().trim(),
          password: password
        })
      const data = response.data;
      if(data.error){
        setError('Error de acceso, ¿puedes revisar tus credenciales?');
        setIsLoading(false)
        return
      }
      userDataContext.updateUserData(data) // Update info with new user!
    } catch (error){
      console.log(error);
      setError('Error de acceso, inténtalo más tarde');
      setIsLoading(false)
    }
 };

  return (
      <div className="Auth-form-container d-flex justify-content-center align-items-center">
        <form className="Auth-form py-4 rounded">
          <div className="Auth-form-content py-2 px-5">
            <div className='d-flex justify-content-center align-items-center mb-3 w-auto'>
              <img src="logo.png" className="img-fluid" alt="Logo" />
            </div>
            <h3 className="Auth-form-title mb-3 text-center">Inicio de Sesión</h3>
            <div className="form-group mt-3">
              <label>Email</label>
              <input
                disabled={isLoading}
                type="email"
                className="form-control mt-1"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="form-group mt-3">
              <label>Contraseña</label>
              <input
                disabled={isLoading}
                type="password"
                className="form-control mt-1"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button 
                type="button" 
                className="btn btn-primary"
                disabled={isLoading}
                onClick={handleClick}>
                {!isLoading && <span>
                  Iniciar sesión
                </span>}
                {isLoading && <span>
                  Cargando... <span className="spinner-border spinner-border-sm" role="status"></span>
                </span>}
              </button>
            </div>
            <span className="small text-danger">{error}</span>
            <p className="forgot-password text-right mt-2">
              ¿Has olvidado la <a href="#">contraseña?</a>
            </p>
          </div>
        </form>
      </div>
  );
}

export default Login;