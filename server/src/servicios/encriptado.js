const encriptadoCtrl = {};
const crypto = require('crypto');
const key='W3S1-Ch5_4p15@53RvEr';


encriptadoCtrl.Hash_texto = async(texto) =>{
  const hash = crypto.createHash('sha512');
  await hash.update(key + texto);
  const resultado = await hash.digest('hex');
  return resultado;

}


encriptadoCtrl.Hash_password = async(texto) =>{
  const hash = crypto.createHash('sha256');
  await hash.update(key + texto);
  const resultado = await hash.digest('hex');
  return resultado;

}

encriptadoCtrl.Hash_array = async(dato) =>{
  const hash = crypto.createHash('sha512');
  await hash.update(key + JSON.stringify(dato));
  const resultado = await hash.digest('hex');
  return resultado;

}

module.exports = encriptadoCtrl;
