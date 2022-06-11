const archivo = './datos.js';
const { Hash_texto, Hash_password } = require('../servicios/encriptado');
const conexiones = {};
const fs = require('fs');
const path = require('path');
var jwt = require('jsonwebtoken');
const axios = require('axios');
const moment = require('moment');
const { RSA_PKCS1_OAEP_PADDING } = require('constants');
const valores={KEY:'UMSCHST5-2021/ychs'}

conexiones.Token = async (tokenData) =>{
  
  var token = jwt.sign(tokenData, valores.KEY, {
  //  expiresIn: 60 * 60 * 24 // expires in 24 hours
  });
  return token;
}

conexiones.VerificarToken = async (token) =>{
  // const valores= global.valoreschs;
  return await jwt.verify(token, valores.KEY, function(err, user) {
      if (err) {
        //  console.log('error-token-verificar');
         return {Respuesta:'Error'}
      } else {
        // console.log(user);
        return {Respuesta:'OK', user};
      }
    })

}

conexiones.Codigo_chs = async (valor) =>{

  return await Hash_password(JSON.stringify(valor));
}

conexiones.Hash_chs = async(valor) =>{
  // const valores= global.valoreschs;
  let nuevo = {};
  Object.keys(valor).map(val=>{
    if (['hash_chs'].indexOf(val)===-1){
      nuevo= {...nuevo, [val]:valor[val]};
    }
  })
  // console.log('nuevo',nuevo);
  var token = jwt.sign(nuevo, valores.KEY);
  return token;
}

conexiones.Enviar = async(options) =>{
  const resultado= await axios(options)
      .then(respuesta =>{
        
        return respuesta
      })
      .catch(err => {
        console.log('error', options.url)
        // this.setState({cargando:false, progreso:0})
        return {Error:true}
      } );

  if (resultado.Error) return resultado

  return resultado.data

}
module.exports = conexiones;
