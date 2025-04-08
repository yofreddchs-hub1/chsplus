const path = require('path');
const express= require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
// var io = require("socket.io")(http);
// const axios = require('axios');

// const Blockchain = require('./src/wesi-block/blockchain');
// const Block_wesi = require('./src/wesi-block/block');

// const {Verificar_bonos_mes, Enviar} = require('./src/servicios/conexiones')
global.global_http= http;
global.actualizar_mes=false
require('./src/database/inicio');
require('./src/server_socket');
//Quitar whatsapp para raqlan
// ver como configurar bien
require('./src/whatsapp');
const {Model} = require('./src/database/model')
const {valor_dolar} = require('./src/servicios/leerHTML');

require('dotenv').config({path:'./server/variables.env'})

//Importar variable
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3500;
// settings
app.set('port', port );
// console.log(__dirname);
app.use(express.static(path.join(__dirname,`build`, 'principal')));
// app.use('/uecla',express.static(path.join(__dirname,`build`, 'uecla')));

// app.use(`/chsplus`,express.static(path.join(__dirname,`build`, 'principal')));

const Inicio = async()=>{
  console.log('Inicio...',global.Principal);
  const Apis = await Model(global.Principal,'Api')
  const apis = await Apis.find();
  console.log('Apis>>>>>>////',apis.length);
  apis.map(api=>{
    if (api.valores.direccion){
      console.log(api.valores.direccion)
      app.use(`/${api.valores.direccion}`,express.static(path.join(__dirname,`build`, api.valores.direccion)));
    }
    return
  })
  // middlewares
app.use(cors());

// app.use(express.json());
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ limit: '5mb', extended: true}));


const dir_arch = __dirname.replace(`${path.sep}server${path.sep}src`,'')+`${path.sep}archivos`;
app.use('/api/imagen',express.static(`${dir_arch}${path.sep}imagenes`));
app.use('/api/archivos',express.static(`${dir_arch}`));
app.use('/api/chat',express.static(`${dir_arch}${path.sep}chat`))

app.use('/api', require('./src/routers/api'));

app.get('*',async(req,res) =>{
  
  const direccion = req.originalUrl.split('/')[1];
  console.log('<<<<<<<<<<<>>',direccion)
  const Apis = await Model(global.Principal,'Api')
  const api = await Apis.findOne({'valores.direccion':direccion});
  console.log(api)
  if (api!==null){
    res.sendFile(path.join(__dirname,'build',direccion,'index.html'));
    return
  }else{
    res.sendFile(path.join(__dirname,'build','principal','index.html'));
  }
  
  // var options = {
  //   root: path.join(__dirname, `build`, 'principal'),
  //   dotfiles: 'deny',
  //   headers: {
  //     'x-timestamp': Date.now(),
  //     'x-sent': true
  //   }
  // }
  // var filename= 'index.html';
  // res.sendFile(filename, options, function (err) {
  //   if (err) {
  //     next(err)
  //   } else {
  //     console.log('Sent:', filename)
  //   }
  // })
  // res.json(Object.keys(req))
  // res.sendFile(path.join(__dirname,'build','principal','index.html'));
});

  http.listen(port, ()=>{
    // http.listen(port, ()=>{
      console.log('Servidor iniciado nueva version', port, host);
      // setTimeout(()=>{
        valor_dolar()
      //   // run()
      // }, 1 * 10000)
    
    })
}

Inicio()


// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const httpServer = createServer();
// global.io = new Server(httpServer);

// // global.io = new WebSocketServer(http)
// require('./src/server_socket');