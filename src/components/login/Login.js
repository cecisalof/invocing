import React, { useState } from 'react';

const axios = require('axios').default;

const Login = () => {
    const [email, setEmail] = useState("");
    console.log('email', email);
    const [password, setPassword] = useState("");
    console.log('password', password);
    
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
        setPassword(event.target.value.toLowerCase().trim());
    }
//     const getToken = async () => {
//     try{
//       const response = await axios.post(BASE_URL + API_URL.LOGIN,
//         {
//           email: email,
//           password: password
//         })
//       const data = response.data;
//     //   setUserInfo(data);
//     //   setUserToken(data.token);
//     } catch (error){
//       console.log("Entra en error Login");
//       console.log(error.response.data);
//     }

//  };

  return (
    <div className="App">
      <div class="container-fluid text-center px-4 py-4">
      <div class="mb-3 row">
        <label for="staticEmail" class="col-sm-2 col-form-label">Email</label>
        <div class="col-sm-10">
            <input type="email" class="form-control" id="exampleFormControlInput1" placeholder="" 
                value={email}
                onChange={validateEmail}
            />
        </div>
      </div>
      <div class="mb-3 row">
        <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
        <div class="col-sm-10">
          <input type="password" class="form-control" id="inputPassword" 
            value={password}
            onChange={handlePasswordChange}
            />
        </div>
      </div>
      <button type="button" class="btn btn-outline-primary">Iniciar sesión</button>
      </div>
    </div>
  );
}

export default Login;