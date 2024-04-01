// Cargar módulos de request-promise y JSDOM
const paginaCtrl = {};
const rp = require('request-promise');
const {Model} = require('../database/model')
const JSDOM = require('jsdom').JSDOM;
const { Hash_chs, Codigo_chs } =require('../servicios/conexiones')
// const fs = require('fs');
const axios = require('axios');
const chalk = require('chalk');
const {bcvDolar} = require('bcv-divisas');

paginaCtrl.valor_dolar = async() =>{
  const Tasa = await Model(global.Principal,'tasacambios');
  const ultimo = await Tasa.find().sort({$natural:-1}).limit(1);
  let anterior = {};
  if (ultimo.length!==0){
    global.global_cambio=ultimo[0].valores;
    anterior= ultimo[0].valores;
  }
  //console.log(valornuevo);
  // try{
  //   bcvDolar().then(valor1=>{
  //     global.global_cambio={
  //       'USD':valor1['_dolar'], 
  //       dolartoday:'error' ,
  //       'wesi > wesi':1,
  //       'VED > VED':1,
  //       'wesi > USD': valor1 && valor1['_dolar'] ? 1 / Number(valor1['_dolar']) : global.global_cambio['wesi > USD'] ? global.global_cambio['wesi > USD'] : 0,
  //       'VED > USD': valor1 && valor1['_dolar'] ? 1 / Number(valor1['_dolar']) : global.global_cambio['VED > USD'] ? global.global_cambio['VED > USD'] : 0,
  //       'USD > wesi': valor1 && valor1['_dolar'] ? Number(valor1['_dolar']) : global.global_cambio['USD > wesi'] ? global.global_cambio['USD > wesi'] : 0,
  //       'USD > VED': valor1 && valor1['_dolar'] ? Number(valor1['_dolar']) : global.global_cambio['USD > VED'] ? global.global_cambio['USD > VED'] : 0,
  //     }
  //     global.io.emit('Actualizar_tasa',{tasa:global.global_cambio});
  //   })
  // }catch(error) {
  //   console.log('>>>>>>>>>>>>>>.Error con bcv-divisas.<<<<<<<<<<<<')
  // }
  // const valor = await axios.get('https://s3.amazonaws.com/dolartoday/data.json')
  // .then(function (response) {
  //   // handle success
  //   // console.log(response.data._timestamp, response.data.USD);
  //   return response
  // })
  // .catch(function (error) {
  //   // handle error
  //   console.log(chalk.inverse.red('Error con dolartoday'))//,error);
  // })
  
  const valor = await axios.post(
    'https://dolartoday.com/wp-admin/admin-ajax.php',
    new URLSearchParams({
      'action': 'dt_currency_calculator_handler',
      'amount': '1'
    })
  )
  .then((res)=>{
    let dolar = res.data["Dólar Paralelo"]
    dolar= Number(dolar.replace('Bs. ', ''))
    return dolar
  })
  .catch(function (error) {
      // handle error
      console.log(chalk.inverse.red('Error con dolartoday'))//,error);
  });
  // console.log('por banco de venezuela')
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
        // console.log('>>>>>>>',array, valor);
        global.global_cambio={
          [array[0]]:Number(array[1]), 
          dolartoday:valor ? valor : 0,
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
    console.log(chalk.inverse.red('Error-BCV'))//,error);
    // global.global_cambio=valor && valor.data && valor.data.USD ? valor.data.USD.sicad2 : global.global_cambio;
    // global.global_cambio={
    //   'USD':'error', 
    //   dolartoday:valor && valor.data ? valor.data.USD : global.global_cambio.dolartoday ? global.global_cambio.dolartoday : 0 ,
    //   'wesi > wesi':1,
    //   'VED > VED':1,
    //   'wesi > USD': valor && valor.data ? 1 / Number(valor.data.USD.sicad2) : global.global_cambio['wesi > USD'] ? global.global_cambio['wesi > USD'] : 0,
    //   'VED > USD': valor && valor.data ? 1 / Number(valor.data.USD.sicad2) : global.global_cambio['VED > USD'] ? global.global_cambio['VED > USD'] : 0,
    //   'USD > wesi': valor && valor.data ? Number(valor.data.USD.sicad2) : global.global_cambio['USD > wesi'] ? global.global_cambio['USD > wesi'] : 0,
    //   'USD > VED': valor && valor.data ? Number(valor.data.USD.sicad2) : global.global_cambio['USD > VED'] ? global.global_cambio['USD > VED'] : 0,
    // }
    global.global_actualizando=false
    
  }
  console.log('Tasa de cambio>>>>>>', global.global_cambio.USD, global.global_cambio.dolartoday)
  if ((global.global_cambio.USD!==anterior.USD || global.global_cambio.dolartoday!==anterior.dolartoday) && global.global_cambio.USD!==0 ){
    console.log('Cambiar la tasa de cambio>>>>>>', global.global_cambio.USD!==anterior.USD , global.global_cambio.USD, anterior.USD)
    const cod_chs = await Codigo_chs({...global.global_cambio, fecha: new Date()});
    const hash_chs = await Hash_chs({cod_chs, valores:global.global_cambio});
    const nuevo = new Tasa({valores:global.global_cambio, cod_chs, hash_chs});
    await nuevo.save();
  }
  console.log(chalk.inverse.green('Cambio actualizado....', ))
  global.io.emit('Actualizar_tasa',{tasa:global.global_cambio});
  if(global.global_tiempo_dolar) clearTimeout(global.global_tiempo_dolar)

  global.global_tiempo_dolar=setTimeout(()=>{
    paginaCtrl.valor_dolar()
  }, 30 * 60000)
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