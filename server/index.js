const path = require('path');
const express= require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
// var io = require("socket.io")(http);
const axios = require('axios');

const {Verificar_bonos_mes, Enviar} = require('./src/servicios/conexiones')
global.global_http= http;
global.actualizar_mes=false
require('./src/database');
require('./src/server_socket');

const {valor_dolar} = require('./src/servicios/leerHTML');

require('dotenv').config({path:'./server/variables.env'})

//Importar variable
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3500;
// settings
app.set('port', port );
// console.log(__dirname);
app.use(express.static(path.join(__dirname,`build`)));

// middlewares
app.use(cors());

// app.use(express.json());
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ limit: '5mb', extended: true}));


const dir_arch = __dirname.replace('/server/src','')+'/archivos/imagenes';
app.use('/api/imagen',express.static(`${dir_arch}`))

app.use('/api', require('./src/routers/api'));

app.get('*',(req,res) =>{
  res.sendFile(path.join(__dirname,'build','index.html'));
});


http.listen(port, ()=>{
// http.listen(port, ()=>{
  console.log('Servidor iniciado', port, host);
  valor_dolar()
})
