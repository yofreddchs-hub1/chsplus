const hashCtrl = {};
const crypto = require('crypto');
const key='W3S1-Ch5_4p15@53RvEr';

hashCtrl.Hash_m = async(texto) =>{
    const hash = crypto.createHash('sha256');
    await hash.update(texto + key);
    const resultado = await hash.digest('hex');
    return resultado;
  
}

hashCtrl.Hash_wesi = async(dato) =>{
  const hash = crypto.createHash('sha256');
  await hash.update(JSON.stringify(dato) + key  );
  const resultado = await hash.digest('hex');
  return resultado;

}

module.exports = hashCtrl;
