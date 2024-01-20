const encriptadoCtrl = {};
const crypto = require('crypto-js');
const key='W3S1-Ch5_4p15@53RvEr';
const key1='CHS_W3S1P4Y_InG.Y0Fr3dD';

encriptadoCtrl.Hash_texto = async(texto) =>{
  // const hash = crypto.createHash('sha512');
  // await hash.update(key + texto);
  // const resultado = await hash.digest('hex');
  // return resultado;
  var resultado = await crypto.SHA512(key + texto);
  resultado = resultado.toString(crypto.enc.Hex)
  return resultado;

}


encriptadoCtrl.Hash_password = async(texto) =>{
  // const hash = crypto.createHash('sha256');
  // await hash.update(key + texto);
  // const resultado = await hash.digest('hex');
  // return resultado;
  let resultado = crypto.SHA256(key + texto);
  resultado = resultado.toString(crypto.enc.Hex)
  return resultado;

}

encriptadoCtrl.Hash_passwordA = async(texto) =>{
  let resultado = crypto.SHA256(key1 + texto);
  resultado = resultado.toString(crypto.enc.Hex)
  return resultado;

}

encriptadoCtrl.Hash_array = async(dato) =>{
  // const hash = crypto.createHash('sha512');
  // await hash.update(key + JSON.stringify(dato));
  // const resultado = await hash.digest('hex');
  // return resultado;
  var resultado = await crypto.SHA512(key + JSON.stringify(dato));
  resultado = resultado.toString(crypto.enc.Hex)
  return resultado;

}

module.exports = encriptadoCtrl;
