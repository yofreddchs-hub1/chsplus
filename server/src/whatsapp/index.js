const fs = require('fs');
const qrcode = require('qrcode-terminal');
const { Client, LegacySessionAuth, LocalAuth, Buttons, MessageMedia  } = require('whatsapp-web.js');
const Condicion = require('./condiciones');
const CondicionUECLA = require('./condicionesUECLA');
const MensajeUecla = require('./mensajes');
const MensajeCHS = require('./mensajes-chs');
// const client = new Client({
//     authStrategy: new LocalAuth()
// });
/////>>>>>>>>>>>>>>>>>>>>>>>>Whatsapp para SistemaCHS<<<<<<<<<<<<<<<<<<
const wwebVersion = '2.2412.54'
const clientCHS = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({
        clientId: "client-CHS",
        dataPath: "sessions"
    })
   
});

clientCHS.on('qr', (qr) => {
    global[`whatsappqr-chs`] = qr;
    console.log('En espera de whatsapp CHS...')
    global.io.emit('whatsappqr-CHS',{qr, tiempo: new Date()}) //datos:resultado})
    // qrcode.generate(qr, {small:true});
});

clientCHS.on('ready', async() => {
    console.log('Client CHS iniciado!');
    // informacion del dispositico sincronizado
    
    const valor = clientCHS.info
    const contactos = (await clientCHS.getContacts()).filter(f=> f.id && f.id.server==="c.us");
    global[`whatsappqr-chs-dispositivo`] = valor ;
    global[`whatsappqr-chs-contactos`] = contactos ;
    global.io.emit('whatsappqr-CHS',
        {
            qr:undefined, 
            dispositivo:valor, 
            contactos, 
            tiempo: new Date()
        }
    ) //datos:resultado})
    
});

clientCHS.on('message_create', message =>{
    let mensaje = message.body.toLowerCase().trim()//.split(' ')[0];
    if((mensaje.indexOf(MensajeCHS.Yo)!==-1 && mensaje.indexOf(MensajeCHS.Yo)===0)){
        mensaje = mensaje.replace(MensajeCHS.Yo,'').trim();
        console.log('>>>>>>',mensaje);
        if (['',MensajeCHS.Yo].indexOf(mensaje)!==-1){
            mensaje='ayuda';
        }else if (['📝','planificación'].indexOf(mensaje)!==-1
                    || mensaje.indexOf('📝')===0
                    || mensaje.indexOf('planificación')===0
        ){
            mensaje='planificacion';
        }else if(['📌','materia prima'].indexOf(mensaje)!==-1){
            mensaje='materiaprima';
        }else if(['📦','producto terminado'].indexOf(mensaje)!==-1){
            mensaje='productoterminado';
        }
        console.log('<<<<<<',mensaje)
        Condicion[mensaje](message, clientCHS);
    }  

    
    // if(message.body === 'ping'){
    //     client.sendMessage(message.from,'conectado a bot chs');
    // }else if(message.body.toLowerCase() === 'informacion'){
    //     client.sendMessage(message.from,'Sistema CHS 2023');
    // }
});
global.clientCHS = clientCHS;
clientCHS.initialize()

/////>>>>>>>>>>>>>>>>>>>>>>>>Whatsapp para SistemaCHS<<<<<<<<<<<<<<<<<<

//Emojis de trabajo
const yo = MensajeUecla.Yo;
const clientUECLA = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth({
        clientId: "client-UECLA",
        dataPath: "sessions"
    })
});


clientUECLA.on('qr', (qr) => {
    global[`whatsappqr-uecla`]= qr;
    console.log('En espera de whatsapp UECLA...')
    global.io.emit('whatsappqr-UECLA',{qr, tiempo: new Date()}) //datos:resultado})
    // qrcode.generate(qr, {small:true});
});

clientUECLA.on('ready', async() => {
    console.log('Client UECLA iniciado!');
    const valor = clientUECLA.info
    const contactos = (await clientUECLA.getContacts()).filter(f=> f.id && f.id.server==="c.us");
    global[`whatsappqr-uecla-dispositivo`] = valor ;
    global[`whatsappqr-uecla-contactos`] = contactos ;
    global.io.emit('whatsappqr-UECLA',
        {
            qr:undefined, 
            dispositivo:valor, 
            contactos, 
            tiempo: new Date()
        }
    )
});

clientUECLA.on('message_create',async (message) =>{
    
    let mensaje = message.body.toLowerCase().trim();
    // console.log(mensaje)
    if (mensaje==='boton'){
        // let button = new Buttons('Button body',[{body:'bt1'},{body:'bt2'},{body:'bt3'}],'title','footer');
        // const button = new Buttons('!Body', [{id:'1', body:'Aceptar'}, {id:'0', body:'Rechazar'}], 'title', 'footer');
        // clientUECLA.sendMessage(message.from, button);
        const media = await MessageMedia.fromUrl('https://via.placeholder.com/350x150.png');
        await clientUECLA.sendMessage(message.from, media);
    }
    if((mensaje.indexOf(yo)!==-1 && mensaje.indexOf(yo)===0) || (mensaje.indexOf('uecla-')!==-1 && mensaje.indexOf('uecla-')===0) || mensaje==='ayuda'){
        mensaje = mensaje.replace(yo,'').trim();
        mensaje = mensaje.replace('uecla-','').trim();
        if (['',' ',yo,'uecla-'].indexOf(mensaje)!==-1){
            mensaje='ayuda';
        }else if (['🪙','tasa de cambio','tasa cambio'].indexOf(mensaje)!==-1){
            mensaje='tasacambio';
        }else if(['información'].indexOf(mensaje)!==-1){
            mensaje='informacion';
        }else if(['costo'].indexOf(mensaje)!==-1 || mensaje.indexOf('costo')!==-1){
            mensaje='mes';
        }else if(['ℹ️','mis datos','misdatos','md','m d'].indexOf(mensaje)!==-1 
                || mensaje.indexOf('mis datos')!==-1 
                || mensaje.indexOf('misdatos')!==-1
                || mensaje.indexOf('md')!==-1 || mensaje.indexOf('m d')!==-1
                || mensaje.indexOf('ℹ️')!==-1
            ){
            mensaje='misdatos';
        }else if(['🗓️','mis mensualidades','mismensualidades','mm','m m'].indexOf(mensaje)!==-1 
            || mensaje.indexOf('mis mensualidades')!==-1 
            || mensaje.indexOf('mismensualidades')!==-1
            || mensaje.indexOf('mm')!==-1 || mensaje.indexOf('m m')!==-1
            || mensaje.indexOf('🗓️')!==-1
            ){
            mensaje='mismensualidades';
        }else if(
            mensaje.indexOf('actualizar movil')!==-1 
            || mensaje.indexOf('actualizarmovil')!==-1
            || mensaje.indexOf('📱')!==-1 
            || mensaje.indexOf('am')!==-1 
            || mensaje.indexOf('a m')!==-1
            || mensaje.indexOf('act. movil')!==-1
        ){
            mensaje='actualizarmovil';
        }else if(['referencia','pago'].indexOf(mensaje)!==-1//mensaje.indexOf('referencia')!==-1 
        ){
            mensaje='referencia';
        }
        
        if(CondicionUECLA[mensaje] === undefined){
            CondicionUECLA['noexiste'](message, clientUECLA);
        }else{
            CondicionUECLA[mensaje](message, clientUECLA);
        }
        
    }
    
    // if(message.body === 'ping'){
    //     client.sendMessage(message.from,'conectado a bot chs');
    // }else if(message.body.toLowerCase() === 'informacion'){
    //     client.sendMessage(message.from,'Sistema CHS 2023');
    // }
});
global.clientUECLA=clientUECLA;
clientUECLA.initialize()

global.condicion={
    clientCHS:Condicion,
    clientUECLA:CondicionUECLA
}
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
