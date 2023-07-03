import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './style.css';
import Context from '../../contexts/context';
import logo from '../../assets/icons/logotramitgo.svg'
import { useContext } from 'react';
import eye from '../../assets/icons/Eye.png';

export const Login = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const userDataContext = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => { // Check if user is already logged in
    if ((userDataContext.userData && userDataContext.userData.token && userDataContext.userData.uuid) && !userDataContext.isInitialLoading) {
      navigate("/", { replace: true });
    }
  }, [userDataContext])

  const isValidEmail = /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/g;

  const validateEmail = () => {
    if (!email || !email.match(isValidEmail)) {
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

  const handleSubmit = () => {
    setError('');
    if (email == "") {
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
    try {
      setIsLoading(true)
      const response = await axios.post('https://data.tramitgo.com/api/login',
        {
          email: email.toLowerCase().trim(),
          password: password
        })
      const data = response.data;
      if (data.error) {
        setError('Error de acceso, ¿puedes revisar tus credenciales?');
        setIsLoading(false)
        return
      }
      userDataContext.updateUserData(data) // Update info with new user!
    } catch (error) {
      console.log(error);
      setError('Error de acceso, inténtalo más tarde');
      setIsLoading(false)
    }
  };

  return (
    <div className="Auth-form-container d-flex justify-content-center align-items-center">
      <form className="Auth-form py-4 rounded" onSubmit={handleSubmit}>
        <div className="Auth-form-content py-2 px-5">
          <div className='d-flex justify-content-center align-items-center mb-3 w-auto'>
            <a href="https://tramitgo.com"><img src={logo} className="img-fluid" alt="Logo" /></a>
          </div>
          <label className="mt-3 mb-1">Email</label>
          <div className="form-group">
            <input
              disabled={isLoading}
              type="email"
              className="form-control mt-1"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <label className="mt-3 mb-1">Contraseña</label>
          <div className="input-group mb-3">
            <input
              disabled={isLoading}
              type={passwordVisible ? "text" : "password"}
              className="form-control"
              placeholder="Contraseña"
              value={password}
              onChange={handlePasswordChange}
            />
            <div className="input-group-append eye-password-icon">
              <span className="input-group-text bg-white"> <img src={eye} alt="Eye" onClick={() => { setPasswordVisible(!passwordVisible) }} /></span>
            </div>
          </div>

          <div className="d-grid gap-2 mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              onClick={handleSubmit}>
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
            ¿Has olvidado la <a href="mailto:hola@codepremmium.es?subject=Cambio de contraseña" rel="noreferrer" target="_blank">contraseña?</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;