// Cargar módulos de request-promise y JSDOM
const paginaCtrl = {};
// const rp = require('request-promise');
// const JSDOM = require('jsdom').JSDOM;
// const fs = require('fs');
const axios = require('axios');

paginaCtrl.valor_dolar = async() =>{
  axios.get('https://s3.amazonaws.com/dolartoday/data.json')
  .then(function (response) {
    // handle success
    // console.log(response.data._timestamp, response.data.USD);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
  .then(function () {
    // always executed
  });
  // config = {
  //   url: '/',
  //   method: 'get',
  //   baseURL: 'https://s3.amazonaws.com/dolartoday/data.json',//?email=absolutestige2020%40gmail.com&password=Nomerecuerdo2023',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'X-Requested-With': 'XMLHttpRequest'
  //   }
  // };
  //   return await axios
  //   .request(config)
  //   .then(function(response) {
  //     // handle success
  //     console.log(response.data);
      
  //     return response.data
  //   })
  //   .catch(function(error) {
  //     // handle error
  //     console.log(error);
  //   })
  //   .finally(function() {
  //     // always executed
  //   });
  // rp('https://www.amolatina.com').then(html => {
  //   console.log('aquieo')
  //   // Generar DOM a partir de HTML
  //   const dom = new JSDOM(html);

  //   // Generar objeto jQuery a partir de DOM
  //   const $ = require('jquery')(dom.window);

  //   const div = $.find('#hbs-cheers-animation');
  //   console.log(div)
  //   $(div).each((i, d) => {
  //     // Imprimir en la consola el texto alternativo de cada imagen
  //     console.log($(d).text())
  //     // console.log(data);
  //     // console.log(array);
  //   });
    
  // });
}

module.exports = paginaCtrl;