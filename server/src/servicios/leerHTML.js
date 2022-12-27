// Cargar módulos de request-promise y JSDOM
const paginaCtrl = {};
const rp = require('request-promise');
const JSDOM = require('jsdom').JSDOM;
// const fs = require('fs');
const axios = require('axios');

paginaCtrl.valor_dolar = async() =>{
  const valor = await axios.get('https://s3.amazonaws.com/dolartoday/data.json')
  .then(function (response) {
    // handle success
    // console.log(response.data._timestamp, response.data.USD);
    return response
  })
  .catch(function (error) {
    // handle error
    console.log('Error con dolartoday')//,error);
  })
  // .then(function () {
  //   // always executed
  // });
  // console.log(valor.data._timestamp, valor.data.USD.sicad1);
  // global.global_actualizando=true
  
  try{
    let resultado = await rp({uri: 'http://www.bcv.org.ve/tasas-informativas-sistema-bancario', rejectUnauthorized: false}).then(html => {
      // Generar DOM a partir de HTML
      const dom = new JSDOM(html);

      // Generar objeto jQuery a partir de DOM
      const $ = require('jquery')(dom.window);

      const div = $.find('#dolar');
      $(div).each((i, d) => {
        // Imprimir en la consola el texto alternativo de cada imagen
        let array=$(d).text().trim().split('\t \n');
        array[1]=array[1].trim();
        const direct= __dirname.replace('servicios','data/datos.json');
        // let data = fs.readFileSync(direct, 'utf8');
        // data= JSON.parse(data);
        // data.cambio= array;
        // fs.writeFileSync(direct, JSON.stringify(data, null, 2));
        // console.log(data);
        // console.log(array);
        // console.log(array)
        array[1]=array[1].replace(',','.')
        console.log('>>>>>>>',array);
        global.global_cambio={
          [array[0]]:Number(array[1]), 
          dolartoday:valor.data.USD,
          'wesi > wesi':1,
          'VED > VED':1,
          'wesi > USD': 1 / Number(array[1]),
          'VED > USD': 1 / Number(array[1]),
          'USD > wesi': Number(array[1]),
          'USD > VED': Number(array[1]),
        }
        global.global_actualizando=false;
        return {[array[0]]:array[1]};
      })
      
    });
  }catch(error) {
    console.log('Error-BCV',error)//,error);
    global.global_cambio=valor.data.USD.sicad2;
    global.global_cambio={
      'USD':'error', 
      dolartoday:valor.data.USD,
      'wesi > wesi':1,
      'VED > VED':1,
      'wesi > USD': 1 / Number(valor.data.USD.sicad2),
      'VED > USD': 1 / Number(valor.data.USD.sicad2),
      'USD > wesi': Number(valor.data.USD.sicad2),
      'USD > VED': Number(valor.data.USD.sicad2),
    }
    global.global_actualizando=false
    
  }

  console.log('Cambio actualizado....', )
  global.io.emit('Actualizar_tasa',{tasa:global.global_cambio});
  if(global.global_tiempo_dolar) clearTimeout(global.global_tiempo_dolar)

  global.global_tiempo_dolar=setTimeout(()=>{
    paginaCtrl.valor_dolar()
  }, 5 * 60000)
}

// paginaCtrl.valor_dolar = async() =>{
//   global.global_actualizando=true
//   rp('http://www.bcv.org.ve').then(html => {

//     // Generar DOM a partir de HTML
//     const dom = new JSDOM(html);

//     // Generar objeto jQuery a partir de DOM
//     const $ = require('jquery')(dom.window);

//     const div = $.find('#dolar');
//     $(div).each((i, d) => {
//       // Imprimir en la consola el texto alternativo de cada imagen
//       let array=$(d).text().trim().split('\t \n');
//       array[1]=array[1].trim();
//       const direct= __dirname.replace('servicios','data/datos.json');
//       // let data = fs.readFileSync(direct, 'utf8');
//       // data= JSON.parse(data);
//       // data.cambio= array;
//       // fs.writeFileSync(direct, JSON.stringify(data, null, 2));
//       // console.log(data);
//       // console.log(array);
//       console.log(array)
//       global.global_actualizando=false
//     });
    
//   });
// }

module.exports = paginaCtrl;