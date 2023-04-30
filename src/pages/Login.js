import React, { useState, useEffect } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../Funciones/api';
import { guardarDatosLS } from '../Funciones/guardarDatosLocalStorage';

import '../styles/Login.css'

function Login() {

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [newsSource, setNewsSource] = useState([]);
  const [confirmationMsg, setConfirmationMsg] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getNewsSource();
    msgConfirmation();
  }, []);

  const getNewsSource = async () => {
    try {
      const datos = await api.getData();
      setNewsSource(datos);
      console.log(datos)
    } catch (error) {
      console.log(error);
    }
  };

  const msgConfirmation = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const confirmationMsg = urlParams.get('msg');
    if (confirmationMsg) {
      setConfirmationMsg(confirmationMsg);
    }
  }

  const passwordLess = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/login', { email });
      if (response) {
        alert("Se un link a su correo para poder ingresar a su cuenta")
        localStorage.setItem('token', JSON.stringify(response.data.tokenSession));
        localStorage.setItem('user', JSON.stringify(response.data.data));
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };




  const handlesubmit = async (e) => {

    try {

      e.preventDefault();

      await axios.post('http://localhost:4000/api/login',
            {'email' : email,
             'password' : pwd},
            {
                headers:
                {'Content-Type' : 'application/json'}
            }).then(function (response){

      if (response) {
        console.log(response)
        guardarDatosLS(response.data.data, response.data.code, response.data.tokenSession);
        const userInput = prompt('Por favor, ingrese el código de verificación:');
        const user = JSON.parse(localStorage.getItem('user'));
        const storedCode = JSON.parse(localStorage.getItem('code'));
        console.log(userInput);

        if (userInput === JSON.stringify(storedCode)) {
          if (user.role !== 'admin') {
            const filtered = newsSource.filter((obj) => {
              return obj.userId === user._id;
            });

            if(filtered.length > 0){
              console.log(filtered)                       
              navigate("/home");
            }else{
              navigate("/newsSource");
            }
            
          } else {
            navigate('/adminPage');
          }
        } else {
          console.log('codigo incorrecto');
        }
      }})
    } catch (error) {
      console.log(error);
    }

  }



  return (
    <>
      {confirmationMsg && (
        <div className="confirmation-message">{confirmationMsg}</div>
      )}
      <Form className='container col-lg-6 col-md-8 col-sm-12 p-5' onSubmit={handlesubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>E-mail</Form.Label>
          <Form.Control type="text" placeholder="Enter Username" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-5" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
        </Form.Group>
        <Container className='d-grid gap-3 d-md-flex justify-content-md-center'>
          <Button className='col-md-5' variant="primary" size="lg" type='submit'>
            Ingresar
          </Button>
          <Button className='col-md-5' variant="success" size="lg" onClick={()=>{passwordLess()}}>
            Passwordless Authentication
          </Button>
        </Container> <br />

        <p className='container col-lg-6 col-md-8 col-sm-12 p-4'> Si no tiene cuenta <a href="./registro" target="_blank" rel="noreferrer"> Registrese aqui</a></p>

      </Form>

    </>

  )
}

export default Login
