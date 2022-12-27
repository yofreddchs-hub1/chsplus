// var Parse = require('parse/node');
// Parse.initialize("KybeAcWWDXFPO0LSZXxGWMOqWvnAcgLn1VzoIQuK","6iSkcT98R1SJCpTWYfTgG4tMnscDCYFiKbdVzh7O"); //PASTE HERE YOUR Back4App APPLICATION ID AND YOUR JavaScript KEY
// Parse.serverURL = 'https://parseapi.back4app.com/'

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

// async function run(){
//   const blockchain = new Blockchain();
//   // const bloque1 = new Block_wesi({data:'Bloque 1 '});
//   // const bloque2 = new Block_wesi({data:'Bloque 1 '});
//   // const bloque3 = new Block_wesi({data:'Bloque 3 '});

//   // await blockchain.addBlock(bloque1);
//   // await blockchain.addBlock(bloque2);
//   // await blockchain.addBlock(bloque3);
  
//   // blockchain.print();
//   for (let i = 0; i < 10; i++){
//     const block = await blockchain.addBlock({bloque:`Bloque ${i}`, informacion:'to'});
//     console.log(block.toString());
//   }

// }
http.listen(port, ()=>{
// http.listen(port, ()=>{
  console.log('Servidor iniciado', port, host);
  // setTimeout(()=>{
    valor_dolar()
    // run()
  // }, 1 * 60000)

})

// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const httpServer = createServer();
// global.io = new Server(httpServer);

// // global.io = new WebSocketServer(http)
// require('./src/server_socket');