import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import './style.css';
import Context from '../../contexts/context';
import { useContext } from 'react'; 

export const Login = () => {
    const [email, setEmail] = useState("cecilia@codepremium.es");
    const [password, setPassword] = useState("Y4098842A");
    const userDataContext = useContext(Context);
    const navigate = useNavigate();
    
  useEffect( () => { // Check if user is already logged in
    if (userDataContext.userData && userDataContext.userData.token && userDataContext.userData.uuid) {
      console.log('Already logged in!')
      navigate("/", { replace: true });
    }
  }, [userDataContext])
    
    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    const validateEmail = (e) => {
        setEmail(e.target.value.toLowerCase().trim());
        if  (email && email.match(isValidEmail)){
            setEmail(e.target.value)
        } else{
          console.log('Formato de email incorrecto');
        }
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value.trim());
    }

   const handleClick = () => {
    if (email !== "" && password !== "") {
      getToken();
    }
   }
  
   const getToken = async () => {
    try{
      const response = await axios.post('https://data.tramitgo.com/api/login',
        {
          email: email,
          password: password
        })
      const data = response.data;
      userDataContext.updateUserData(data) // Update info with new user!
    } catch (error){
      console.log(error);
    }
 };

  return (
      <div className="Auth-form-container">
        <form className="Auth-form">
          <div className="Auth-form-content">
            <div className='logo'>
              <img src="logo.png" className="img-fluid" alt="Logo" />
            </div>
            <h3 className="Auth-form-title">Inicio de Sesión</h3>
            <div className="form-group mt-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control mt-1"
                placeholder="Email"
                value={email}
                onChange={validateEmail}
              />
            </div>
            <div className="form-group mt-3">
              <label>Contraseña</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="d-grid gap-2 mt-3">
              <button type="button" className="btn btn-primary"
                onClick={handleClick}>
                Iniciar sesión
              </button>
            </div>
            <p className="forgot-password text-right mt-2">
              ¿Has olvidado la <a href="#">contraseña?</a>
            </p>
          </div>
        </form>
      </div>
  );
}

export default Login;