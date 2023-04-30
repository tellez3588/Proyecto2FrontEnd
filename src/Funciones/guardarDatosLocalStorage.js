
//Funcion para guardar los datos en el localStorage
function guardarDatosLS(user, code, token){

          localStorage.setItem('token', JSON.stringify(token));
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('code', JSON.stringify(code));

}

export { guardarDatosLS };