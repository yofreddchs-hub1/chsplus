const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, LegacySessionAuth, LocalAuth  } = require('whatsapp-web.js');
const Condicion = require('./condiciones');

const client = new Client({
    authStrategy: new LocalAuth()
});
 
client.on('qr', (qr) => {
    global.whatsappqr = qr;
    console.log(qr)
    global.io.emit('whatsappqr',{qr}) //datos:resultado})
    // qrcode.generate(qr, {small:true});
});
client.on('ready', () => {
    console.log('Client iniciado!');
});

client.on('message', message =>{
    let mensaje = message.body.toLowerCase().split(' ')[0];
    console.log('>>>>>>',mensaje);
    if (['📝','planificación'].indexOf(mensaje)!==-1){
        mensaje='planificacion';
    }else if(['📌','materia prima'].indexOf(mensaje)!==-1){
        mensaje='materiaprima';
    }else if(['📦','producto terminado'].indexOf(mensaje)!==-1){
        mensaje='productoterminado';
    }  

    Condicion[mensaje](message, client);
    // if(message.body === 'ping'){
    //     client.sendMessage(message.from,'conectado a bot chs');
    // }else if(message.body.toLowerCase() === 'informacion'){
    //     client.sendMessage(message.from,'Sistema CHS 2023');
    // }
});
client.initialize()


// const SESSION_FILE_PATH = './session.json';
// let sessionData;
// let client;

// const withOutSession = () =>{
//     console.log('No tenemos session guardada');
//     client =  new Client({
//         authStrategy: new LegacySessionAuth({
//             session: sessionData // saved session object
//         })
//     });
     
//     client.on('qr', (qr) => {
//         global.whatsappqr = qr;
//         console.log(qr)
//         global.io.emit('whatsappqr',{qr}) //datos:resultado})
//         // qrcode.generate(qr, {small:true});
//     });

//     client.on('authenticated', (session) => {
//         sessionData = session;
//         console.log(session);
//         fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
//             if (err) {
//                 console.error(err);
//             }
//         });
//     });
//     client.initialize();
// }

// const withSession = () =>{
//     sessionData = require(SESSION_FILE_PATH);
//     client = new Client({
//         authStrategy: new LegacySessionAuth({
//             session: sessionData
//         })
//     });
//     client.on('ready', () => {
//         console.log('Client iniciado!');
//     });
    
//     client.on('message', message =>{
//         if(message.body === 'Hello'){
//             client.sendMessage(message.from,'hola');
//         }
//     });

//     client.on('auth_failure',()=>{
//         console.log('error en autentificar whatsapp');
//     });
//     client.initialize();
// }

// (fs.existsSync(SESSION_FILE_PATH)) ? withSession() : withOutSession()
