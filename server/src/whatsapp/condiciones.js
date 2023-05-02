const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const Condicion = {};
const archivo = `${__dirname}${path.sep}ayuda.txt`;
const Ayuda = fs.readFileSync(archivo, 'utf8');
Condicion.ping = async(message, client)=>{
    console.log('ping ...');
    client.sendMessage(message.from,'conectado a bot chs');
}
Condicion.tasacambio = async(message, client)=>{
    console.log('tasa de cambio ...');
    console.log(global.global_cambio);
    client.sendMessage(message.from,`Tasa de cambio:\nBCV: ${global.global_cambio.USD}\nDolar Today: ${global.global_cambio.dolartoday.dolartoday}`);
}
Condicion.ayuda = async(message, client)=>{
    console.log('Ayuda ...');
    console.log(Ayuda);
    client.sendMessage(message.from, Ayuda);
}
// Sistema CHS
Condicion.informacion = async(message, client)=>{
    const chat = await message.getChat();
    const contact = await message.getContact();
    const directorio = `${__dirname}${path.sep}media${path.sep}chswhatsapp.png`
    const mediaFile = MessageMedia.fromFilePath(directorio);
    await chat.sendMessage(mediaFile, {
        mentions: [contact],
        caption:`Conectado a bot CHS\nAutor: Ing. Yofredd R. Chirino Soto\nTelefono:04127517660`
    });
    // client.sendMessage(message.from,'conectado a bot chs');
}


Condicion.planificacion = async(message, client)=>{
    console.log(message.body)
    let fecha = message.body.split(' ');
    let dia = new Date();
    if (fecha.length>1){
        fecha = fecha[1];
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
    const DB = require(`../models/${'sistemachs_Produccion'}`);
    let dbs = await DB.find({$text: {$search: dia1, $caseSensitive: false}});
    dbs= dbs.filter(f=>f.valores.dia === dia1).map(val=>{
        return {...val.valores}
    });
    let mensaje = `Planificación ${dia} 📝\n`;
    dbs.map(val=>{
        val.produccion.map(v=>{
            mensaje+=`Trompos: ${v.cantidad}\nFormula: ${v.mezcla}\nMateria Prima: 📋\n`;
            v.mp.map(mp=>{
                mensaje+=`   📌${mp.descripcion}   ${mp.cantidadT}\n`;
            })
            mensaje+=`Productos Terminados: 📦\n`;
            v.pt.map(pt=>{
                if(pt.cantidadFinal!==0){
                    mensaje+=`  📦Cant.:${pt.cantidadFinal} de ${pt.descripcion} \n`
                }  
            })
        })
        return val;
    })
    client.sendMessage(message.from,mensaje);
}

Condicion.materiaprima = async(message, client)=>{
    const DB = require(`../models/${'sistemachs_Inventariomp'}`);
    let dbs = await DB.find();
    let mensaje = `Materia Prima 📌:\n`;
    dbs.map(val=>{
        const {descripcion, actual, unidad} = val.valores;
        mensaje+= `     📌${descripcion} Cant.: ${Number(actual).toFixed(2)}${unidad.value} \n`
        return {...val.valores}
    });
    client.sendMessage(message.from,mensaje);
}

Condicion.productoterminado = async(message, client)=>{
    const DB = require(`../models/${'sistemachs_Inventariopt'}`);
    let dbs = await DB.find();
    let mensaje = `Producto Terminado 📦:\n`;
    dbs.map(val=>{
        const {descripcion, actual, unidad} = val.valores;
        mensaje+= `     📦${descripcion} Cant.: ${Number(actual).toFixed(2)}${unidad.value} \n`
        return {...val.valores}
    });
    client.sendMessage(message.from,mensaje);
}

module.exports = Condicion;