const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const {Model} = require('../database/model');
const Condicion = {};
const MensajeCHS =require('./mensajes-chs');
const archivo = `${__dirname}${path.sep}ayuda.txt`;
const Ayuda = MensajeCHS.Ayuda//fs.readFileSync(archivo, 'utf8');

Condicion.ping = async(message, client)=>{
    console.log('ping ...', message.from);
    client.sendMessage(message.from,'conectado a bot chs');
}
Condicion.tasacambio = async(message, client)=>{
    console.log('tasa de cambio ...');
    console.log(global.global_cambio);
    client.sendMessage(message.from,`Tasa de cambio:\nBCV: ${global.global_cambio.USD}\nDolar Today: ${global.global_cambio.dolartoday.dolartoday}`);
}
Condicion.ayuda = async(message, client)=>{
    console.log('Ayuda ...');
    // console.log(Ayuda);
    // client.sendMessage(message.from, Ayuda);
    RespuestaCHS(message, Ayuda)
}
// Sistema CHS
Condicion.Enviar = async(client, mensaje, contactos)=>{
    // console.log(mensaje, contactos)
    // client.sendMessage(contactos[0].id._serialized, mensaje)
    const directorio = `${__dirname}${path.sep}media${path.sep}botchs.png`
    const mediaFile = MessageMedia.fromFilePath(directorio);
    // console.log(contact)
    await client.sendMessage(contactos[0].id._serialized,mediaFile, {
        caption:`BOTCHS\n${MensajeCHS.separado}\n${mensaje}`
    });
}
Condicion.informacion = async(message, client)=>{
    const chat = await message.getChat();
    const contact = await message.getContact();
    const directorio = `${__dirname}${path.sep}media${path.sep}chswhatsapp.png`
    const mediaFile = MessageMedia.fromFilePath(directorio);
    await chat.sendMessage(mediaFile, {
        mentions: [contact],
        caption:`Conectado a bot CHS\nAutor: Ing. Yofredd R. Chirino Soto\nTelefono:04127517660`
    });
    client.sendMessage(message.from,'conectado a bot chs');
    
}

Condicion.planificacion = async(message, client)=>{
    console.log(message.body)
    let fecha = message.body.split(' ');
    let dia = new Date();
    if (fecha.length>2){
        fecha = fecha[2];
        if (fecha.indexOf('-')!==-1){
            fecha = `${fecha.split('-')[2]}-${fecha.split('-')[1]}-${fecha.split('-')[0]}`
        }else{
            fecha = `${fecha.split('/')[2]}-${fecha.split('/')[1]}-${fecha.split('/')[0]}`
        }
        dia = moment(fecha);
    }
    
    const dia1 = moment(dia).format('MM/DD/YYYY');
    dia = moment(dia).format('DD/MM/YYYY');
    
    console.log(fecha, dia);
    const DB = await Model('sistemachs', 'sistemachs_Produccion'); //require(`../models/${'sistemachs_Produccion'}`);
    let dbs = await DB.find({$text: {$search: dia1, $caseSensitive: false}});
    dbs= dbs.filter(f=>f.valores.dia === dia1).map(val=>{
        return {...val.valores}
    });
    // let mensaje = `Planificación ${dia} 📝\n`;
    // dbs.map(val=>{
    //     val.produccion.map(v=>{
    //         mensaje+=`Trompos: ${v.cantidad}\nFormula: ${v.mezcla}\nMateria Prima: 📋\n`;
    //         v.mp.map(mp=>{
    //             mensaje+=`   📌${mp.descripcion}   ${mp.cantidadT}\n`;
    //         })
    //         mensaje+=`Productos Terminados: 📦\n`;
    //         v.pt.map(pt=>{
    //             if(pt.cantidadFinal!==0){
    //                 mensaje+=`  📦Cant.:${pt.cantidadFinal} de ${pt.descripcion} \n`
    //             }  
    //         })
    //     })
    //     return val;
    // })
    // client.sendMessage(message.from,mensaje);
    RespuestaCHS(message, MensajeCHS.Planificacion(dia, dbs))
}

Condicion.materiaprima = async(message, client)=>{
    const DB = await Model('sistemachs', 'sistemachs_Inventariomp');//require(`../models/${'sistemachs_Inventariomp'}`);
    let dbs = await DB.find();
    let mensaje = `Materia Prima 📌:\n`;
    dbs.map(val=>{
        const {descripcion, actual, unidad} = val.valores;
        mensaje+= `📌${descripcion} Cant.: ${Number(actual).toFixed(2)}${unidad.value} \n${MensajeCHS.separadoc}\n`
        return {...val.valores}
    });
    // client.sendMessage(message.from,mensaje);
    RespuestaCHS(message, mensaje);
}

Condicion.productoterminado = async(message, client)=>{
    const DB = await Model('sistemachs', 'sistemachs_Inventariopt');//require(`../models/${'sistemachs_Inventariopt'}`);
    let dbs = await DB.find();
    let mensaje = `Producto Terminado 📦:\n`;
    dbs.map(val=>{
        const {descripcion, actual, unidad} = val.valores;
        mensaje+= `     📦${descripcion} Cant.: ${Number(actual).toFixed(2)}${unidad.value} \n`
        return {...val.valores}
    });
    client.sendMessage(message.from,mensaje);
}

RespuestaCHS = async(message, mensaje)=>{
    const chat = await message.getChat();
    // const contact = await message.getContact();
    const directorio = `${__dirname}${path.sep}media${path.sep}botchs.png`
    const mediaFile = MessageMedia.fromFilePath(directorio);
    // console.log(contact)
    await chat.sendMessage(mediaFile, {
        // mentions: [contact],
        caption:`BOTCHS\n${MensajeCHS.separado}\n${mensaje}`
    });
}

module.exports = Condicion;