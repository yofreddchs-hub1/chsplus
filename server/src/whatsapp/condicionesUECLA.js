const { MessageMedia } = require('whatsapp-web.js');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const tesseract = require("tesseract.js")
const { Codigo_chs, Hash_chs} = require('../servicios/conexiones');
const { Hash_passwordA } = require('../servicios/encriptado');
const {Model} = require('../database/model');
const CondicionUECLA = {};
const MensajeUecla = require('./mensajes');
const archivo = `${__dirname}${path.sep}ayuda-uecla.txt`;
const Ayuda =  MensajeUecla.Ayuda(MensajeUecla.Yo);//fs.readFileSync(archivo, 'utf8');
const separado=MensajeUecla.separado;
const separadoc=MensajeUecla.separadoc;

const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
}
CondicionUECLA.Enviar = async(client, mensaje, contactos)=>{
    // console.log(mensaje, contactos)
    // client.sendMessage(contactos[0].id._serialized, mensaje)
    const directorio = `${__dirname}${path.sep}media${path.sep}bot.jpg`
    const mediaFile = MessageMedia.fromFilePath(directorio);
    // console.log(contact)
    await client.sendMessage(contactos[0].id._serialized,mediaFile, {
        caption:`BOT\n${MensajeUecla.Colegio}\nhttps://uecolegiolibertadoresdeamerica.com\n${mensaje}`
    });
}
CondicionUECLA.ping = async(message, client)=>{
    console.log('ping ...',message.from, typeof message.from);
    client.sendMessage('584127517660@c.us','conectado a bot UECLA');
    // message.reply('conectado a bot UECLA');

}
CondicionUECLA.tasacambio = async(message, client)=>{
    console.log('tasa de cambio ...');
    // console.log(global.global_cambio);
    //client.sendMessage(message.from,`Tasa de cambio:\nBCV: ${global.global_cambio.USD}`);//\nDolar Today: ${global.global_cambio.dolartoday}
    message.reply(`Tasa de cambio:\nBCV: ${global.global_cambio.USD}`)
}
CondicionUECLA.mes = async(message, client)=>{
    // console.log('mes ...');
    const {cedula}=CondicionUECLA.Parametros(message);
    const contact = await message.getContact();
    const {number} = contact;
    const numero = number.slice(2);
    let representantes= await Buscar_Representante({numero, cedula});
    if (representantes===null){
        Mensaje_noregistrado(message,client,{numero, cedula},MensajeUecla.ActuliarM());//'🤖 MIS MENSUALIDADES "su cedula"');
    }else{
        const Arancel = await Model('uecla', 'uecla_Arancel');
        let aranceles= await Arancel.find();
        aranceles= aranceles.sort((a,b)=> a.valores.periodo.periodo>b.valores.periodo.periodo ? -1 : 1).map(val=>val.valores)
        const mes = Number(aranceles[0].monto);
        let representados=[]
        for (var i = 0; i<representantes.valores.representados.length;i++){
            let est = representantes.valores.representados[i];
            if (est.grado!=='GRADUADO' && (est.estatus.titulo && est.estatus.titulo!=='Graduado')){
                representados=[...representados,{
                    nombres:`${est.nombres} ${est.apellidos}`,
                    mes: est.beca ? mes - (Number(est.beca)*mes/100) : mes
                }]
            }
        }
        
        // client.sendMessage(message.from,`Tasa de cambio:\nBCV: ${global.global_cambio.USD}`);//\nDolar Today: ${global.global_cambio.dolartoday}
        // message.reply(`Mensualidad : Bs. ${(mes*global.global_cambio.USD).toFixed(2)}\nTasa de cambio:\nBCV: ${global.global_cambio.USD}`)
        // client.sendMessage(message.from,`Mensualidad : Bs. ${(mes*global.global_cambio.USD).toFixed(2)}\nTasa de cambio:\nBCV: ${global.global_cambio.USD}`);
        Respuesta(message, client, MensajeUecla.Mensualidad(mes, representados));
    }
}
extrae_monto = (texto)=>{
    
}
////El seprar que estaba trabajando para extraer texto completo
// separar = (texto) =>{
//     let resulta = {dato: texto}
//     if (texto.toLowerCase().indexOf('monto')!==-1){
//         console.log(texto)
//     }
//     if (texto.indexOf(':')!==-1 && texto.toLowerCase().split(':')[0].indexOf('fecha')===-1){ // && texto.split(':').length===2){
//         // operaciones cuando la exprecion poseen :
//         if (texto.toLowerCase().indexOf('operaci')!==-1){
//             console.log('por aqui ...')
//         }
//         let dato = texto.split(':');
//         const campo = dato[0].toLowerCase().trim();
//         dato = dato[1] ? dato[1].trim() : undefined;
//         if((campo.indexOf('operaci')!==-1 && campo.indexOf('n')===campo.length-1)
//                 || (campo.indexOf('operaci')!==-1 && campo.indexOf('mero')!==-1 )
//                 || campo==='ref'
//                 || (campo.indexOf('nro.')!==-1 && campo.indexOf('referencia')!==-1)
//                 || (campo==='referencia' && !isNaN(Number(dato)))
//                 || (campo.indexOf('mero')!==-1 && campo.indexOf('referencia')!==-1 && !isNaN(Number(dato)))
//             ){
//             resulta.campo='referencia';
//             resulta.valor= dato ? dato : undefined;
//         }else if(['banco receptor','banco','banco destino'].indexOf(campo)!==-1){
//             resulta.campo='banco_destino';
//             resulta.valor= dato ? dato : undefined;
//         }else if((campo.indexOf('tel')!==-1 && campo.indexOf('receptor')!==-1)
//                     || campo==='destino'
//                     || (campo.indexOf('tel')!==-1 && campo.indexOf('beneficiario')!==-1)
//                 ){
//             resulta.campo='telef_destino';
//             resulta.valor= dato ? dato : undefined;
//         }else if((campo.indexOf('c')===0 && campo.indexOf('dula')!==-1 && campo.indexOf('receptor')!==-1)
//                     || (campo.indexOf('identificaci')!==-1 && campo.indexOf('n')===campo.length-1)
//                 ){
//             resulta.campo='cedula';
//             resulta.valor= dato ? dato : undefined;
//         }else if((campo.indexOf('monto')!==-1 && campo.indexOf('opera')!==-1)){
//             resulta.campo='monto';
//             resulta.valor= dato ? dato : undefined;
//         }else if(['concepto'].indexOf(campo)!==-1){
//             resulta.campo='concepto';
//             resulta.valor= dato ? dato : undefined;
//         }else if(['fecha'].indexOf(campo)!==-1){
//             resulta.campo='fecha';
//             resulta.valor= dato ? dato : undefined;
//         }
//         if (dato && (!isNaN(Number(dato)) || !isNaN(Number(dato.replace(',','.'))))){
//             resulta.numero = dato;
//         }else if(dato && (!isNaN(Number(dato.split(' ')[0])) && resulta.campo!=='banco-destino')){
//             resulta.numero = dato.split(' ')[0];
//         }
        
//     }else if(texto.toLowerCase().indexOf('monto')!== -1){
//             resulta.campo='monto';
//             console.log(texto);

//     }else if(texto.toLowerCase().trim()=== 'telf origen'
//                 || (texto.toLowerCase().indexOf('celular')!==-1 && texto.toLowerCase().indexOf('origen')!==-1)    
//     ){
//         resulta.campo='telef_origen';
//     }else if(texto.toLowerCase().trim()=== 'telf beneficiario'
//                 || (texto.toLowerCase().indexOf('celular')!==-1 && texto.toLowerCase().indexOf('destino')!==-1)    
//     ){
//         resulta.campo='telef_destino';
//     }else if((texto.toLowerCase().indexOf('banco')!==-1 && texto.toLowerCase().indexOf('receptor')!==-1)    
//     ){
//         resulta.campo='banco_destino';
//     }else if((texto.toLowerCase().indexOf('banco')!==-1 && texto.toLowerCase().indexOf('emisor')!==-1)    
//     ){
//         resulta.campo='banco_origen';
//     }else if(texto.toLowerCase().trim()=== 'concepto'){
//         resulta.campo='concepto';
//     }else if(texto.toLowerCase().trim()=== 'fecha'){
//         resulta.campo='fecha';
//     }else if(texto.indexOf('/')!==-1 && texto.indexOf(':')!==-1){
//         resulta.valor=texto;
//     }else{    
//         let dato = texto.split(' ');
//         for (var i=0; i<dato.length;i++){
//             let data= dato[i].trim().replace(':','');
            
//             if(data.indexOf('Bs.')!==-1){
//                 resulta.campo='monto';
//             }else if(texto.toLowerCase().indexOf('exitos')===-1 &&
//                         (['referencia','ref'].indexOf(data.toLowerCase())!==-1 || (data.toLowerCase().indexOf('operaci')!==-1 && ['operacion','operacion.','ioperacion'].indexOf(data.toLowerCase())===-1))){
//                 console.log('porrkkdkls lksdl sl')
//                 resulta.campo='referencia';
//             }else if(['fecha'].indexOf(data.toLowerCase())!==-1 || resulta.campo==='fecha'){
//                 resulta.campo='fecha';
//                 if (data.indexOf('/')!==-1){
//                     resulta.valor=data.toLowerCase().replace('fecha','').replace(':','');
//                 }
//             }else if(['celular','telf'].indexOf(data.toLowerCase())!==-1){
//                 resulta.campo='celular';
//             }else if(!resulta.campo && ['emisor','receptor'].indexOf(data.toLowerCase())!==-1 || data.toLowerCase().indexOf('banco')!==-1){
//                 resulta.campo='banco';
//             }else if(!resulta.campo && ['destino'].indexOf(data.toLowerCase())!==-1 ){
//                 resulta.campo='destino';
//             }else if(data.toLowerCase().indexOf('v-')!==-1 || data.toLowerCase().indexOf('identificaci')!==-1){
//                 resulta.campo='cedula';
//                 resulta.numero= data.toLowerCase().replace('v-','');
//             }
//             // if (resulta.campo==='banco'){
//             //     resulta.valor=data;
//             // }
//             if (!isNaN(Number(data)) || !isNaN(Number(data.replace(',','.')))){
//                 resulta.numero = data;
//             }
//             if(!resulta.campo && resulta.numero){
//                 if(resulta.dato.toLowerCase().indexOf('operaci')!==-1 && resulta.dato.toLowerCase().indexOf('mero')!==-1){
//                     resulta.campo='referencia'
//                 }
//             }
//         }
//     }    
//     // if(resulta.campo || resulta.numero)
//     //     console.log(resulta);
//     return resulta    
// }
extrae_monto = (texto)=>{
    let resultado
    let dato = texto.replace('8s.','').replace('Bs','').replace('N°','').split(' ');
    for (var i=0; i<dato.length;i++){
        let data= dato[i].trim();
        if (!isNaN(Number(data)) || !isNaN(Number(data.replace(',','.')))){
            resultado=data//Number(data.replace(',','.'));
        }
    }
    return resultado;
}
//Solo extrar referencia, monto, concepto, fecha
separar = (texto) =>{
    let resulta = {dato: texto}
    let fecha;
    let hora;
    if (texto.indexOf('/')!==-1 || texto.indexOf('-')!==-1){
        let nuevo= texto.split(' ');
        for (var j=0; j< nuevo.length; j++){
            const d = nuevo[j];
            if ((d.indexOf('/')!==-1 || d.indexOf('-')!==-1)  && d!=='/' && d!=='-'){
                fecha=d;
            }else if(d.indexOf(':')!==-1 && d.toLowerCase().indexOf('fecha')===-1){
                hora = d;
            }
        }
        if (!isNaN(Date.parse(fecha))){
            if (hora){
                fecha +=" "+ hora;
            }
        }   
    }
    
    // if (texto.toLowerCase().indexOf('referencia')!==-1){
    //     console.log('>>>>',texto)
    // }
    if(fecha){
        resulta.campo='fecha';
        resulta.valor= fecha;
    }else if (texto.indexOf(':')!==-1 ){ //&& texto.toLowerCase().split(':')[0].indexOf('fecha')===-1// && texto.split(':').length===2){
        // operaciones cuando la exprecion poseen :
        if (texto.toLowerCase().indexOf('referencia')!==-1){
            console.log('por aqui ...')
        }
        let dato = texto.split(':');
        const campo = dato[0].toLowerCase().trim();
        dato = dato[1] ? dato[1].trim() : undefined;
        if((campo.indexOf('operaci')!==-1 && campo.indexOf('n')===campo.length-1)
                || (campo.indexOf('operaci')!==-1 && campo.indexOf('mero')!==-1 )
                || campo==='ref'
                || (campo.indexOf('nro.')!==-1 && campo.indexOf('referencia')!==-1)
                || (campo==='referencia' && !isNaN(Number(dato)))
                || (campo.indexOf('mero')!==-1 && campo.indexOf('referencia')!==-1 && !isNaN(Number(dato)))
            ){
            resulta.campo='referencia';
            resulta.valor= dato ? dato : undefined;
        }else if((campo.indexOf('monto')!==-1 && campo.indexOf('opera')!==-1)
                    || (campo==='monto' && !isNaN(Number(dato.replace(',','.'))))
                    || (campo.indexOf('monto')!==-1 && campo.indexOf('s.')!==-1)
                    || campo==='monto'
        ){
            resulta.campo='monto';
            resulta.valor= dato ? extrae_monto(dato) : undefined; //Number(dato.replace(',','.'))
            resulta.numero = dato ? extrae_monto(dato) : undefined;
        }else if(['concepto'].indexOf(campo)!==-1){
            resulta.campo='concepto';
            resulta.valor= dato ? dato : undefined;
        }else if(['fecha'].indexOf(campo)!==-1){
            resulta.campo='fecha';
            resulta.valor= dato ? dato : undefined;
        }
        if (!resulta.numero && dato && (!isNaN(Number(dato)) || !isNaN(Number(dato.replace(',','.'))))){
            resulta.numero = dato;
        }else if(dato && (!isNaN(Number(dato.split(' ')[0])) && resulta.campo!=='banco-destino')){
            resulta.numero = dato.split(' ')[0];
        }
        
    }else if(texto.toLowerCase().indexOf('monto')!== -1
                || texto.indexOf('Bs')!== -1
                || texto.indexOf('8s.')!== -1
    ){
            resulta.campo='monto';
            resulta.numero = extrae_monto(texto);
            // Buscar el valor del monto
            // let dato = texto.replace('8s.','').split(' ');
            // for (var i=0; i<dato.length;i++){
            //     let data= dato[i].trim();
            //     if (!isNaN(Number(data)) || !isNaN(Number(data.replace(',','.')))){
            //         resulta.numero=data//Number(data.replace(',','.'));
            //     }
            // }

    }else if(texto.toLowerCase().indexOf('numero de')!==-1
                || texto.toLowerCase().indexOf('tu tpago n°')!==-1
    ){
        resulta.numero= extrae_monto(texto);
        console.log('<<<<<', texto)
        if(resulta.numero || texto.toLowerCase().indexOf('referencia')!==-1){
            resulta.campo='referencia';
        }else{
            resulta.numero= undefined;
        }
    }else if(texto.toLowerCase().trim()=== 'concepto'){
        resulta.campo='concepto';
    }else if(texto.toLowerCase().trim()=== 'fecha'){
        resulta.campo='fecha';
    }else if(texto.indexOf('/')!==-1 && texto.indexOf(':')!==-1){
        resulta.valor=texto;
    }else{ 
        if (texto.toLowerCase().indexOf('referencia')!==-1){
            console.log('>>>>',texto)
        }   
        let dato = texto.split(' ');
        for (var i=0; i<dato.length;i++){
            let data= dato[i].trim().replace(':','');
            if (data.toLowerCase().indexOf('referencia')!==-1){
                console.log('>>>>',data)
            }    
            if(data.indexOf('Bs.')!==-1){
                resulta.campo='monto';
            }else if(texto.toLowerCase().indexOf('exitos')===-1 &&
                        (['referencia','ref'].indexOf(data.toLowerCase())!==-1 || (data.toLowerCase().indexOf('operaci')!==-1 && ['operacion','operacion.','ioperacion'].indexOf(data.toLowerCase())===-1))
                    )
            {
                console.log('>>>>>>',texto)
                resulta.campo='referencia';
            }else if(['fecha'].indexOf(data.toLowerCase())!==-1 || resulta.campo==='fecha'){
                resulta.campo='fecha';
                if (data.indexOf('/')!==-1){
                    resulta.valor=data.toLowerCase().replace('fecha','').replace(':','');
                }
            }
            if (data.length>2 && (!isNaN(Number(data)) || !isNaN(Number(data.replace(',','.'))))){
                resulta.numero = data;
            }
            if(!resulta.campo && resulta.numero){
                if(resulta.dato.toLowerCase().indexOf('operaci')!==-1 && resulta.dato.toLowerCase().indexOf('mero')!==-1){
                    resulta.campo='referencia'
                }
            }
        }
    }    
    // if(resulta.campo || resulta.numero)
    //     console.log(resulta);
    return resulta    
}

ProcesarRecibo = (texto)=>{
    let resultado ={};
    let anterior;
    const datos = texto.split("\n");
    console.log(texto);
    for (var i =0; i<datos.length; i++){
        const data = datos[i].trim()//.replace('\n',"");
        // console.log(data, isNaN(Number(data)))
        const resp = separar(data);
        if (!anterior && resp.campo && (resp.numero || resp.valor)){
            resultado[resp.campo]=  resp.numero ? resp.numero : resp.valor;
        }else if (!anterior && resp.campo){
            anterior=resp.campo;
            let mas=1;
            while (resultado[anterior]) {
                anterior=resp.campo + '-' + mas;
                mas++;
            } 
             
        }else if (anterior){ // anterior
            resultado[anterior]= resp.numero ? resp.numero : resp.dato;
            anterior=false;
            if(resp.campo && (resp.numero || resp.valor)){
                resultado[resp.campo]=  resp.numero ? resp.numero : resp.valor;
            }
        }
       
    }
    console.log(resultado)
    return resultado
}
CondicionUECLA.referencia = async(msg, client)=>{
    // Bancos Listo para octener referencia en pago movil
    // Mercantil, Banco Venezuela, Provincial, Tesoro, Banesco, BancaAmiga, Bicentenario
    const {cedula} = CondicionUECLA.Parametros(msg);
    console.log('referencia')
    const contact = await msg.getContact();
    const {number} = contact;
    const numero = number.slice(2);
    const Referencia = await Model('uecla', 'uecla_Whatsapp_Capture');
    // const directorio = `${__dirname}${path.sep}media${path.sep}recibo.png`
    // const img = fs.readFileSync(directorio)
    let representantes= await Buscar_Representante({numero, cedula});
    if(representantes===null){
        Mensaje_noregistrado(msg,client,{numero, cedula},MensajeUecla.ActuliarM());
    }else if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        // do something with the media data here
        // console.log(media);
        var buffer = Buffer.from(media.data, 'base64');
        tesseract
            .recognize(buffer)
            .then(async(text) => {
                // console.log("Result:", text.data ? text.data.text : text)
                const datos = await ProcesarRecibo(text.data.text);
                if (datos.referencia && !isNaN(Number(datos.referencia))){
                    const ref = await Buscar_Referencia({referencia:datos.referencia})
                    let dat='';
                    ['Fecha','Monto','Concepto'].map(v=>{
                        if (datos[v.toLowerCase()]){
                            dat+=`✅ ${v}: ${datos[v.toLowerCase()]}\n`
                        }
                    })
                    if (ref===null){
                        const valores = {
                            referencia:datos.referencia,
                            estatus:'0',
                            numero,
                            datos, media,
                            representante:{
                                _id:representantes._id,
                                cedula:representantes.valores.cedula,
                                nombres:representantes.valores.nombres,
                                apellidos:representantes.valores.apellidos,
                            }
                        };
                        let cod_chs = await Codigo_chs({...valores});
                        let hash_chs = await Hash_chs({...valores, cod_chs})
                        const Nuevo = new Referencia({valores, cod_chs, hash_chs, actualizado:`Sistema-${numero}`});
                        await Nuevo.save();
                        // msg.reply(`✅ Referencia: ${datos.referencia}\n${dat}Recibida con éxito\nDesde: ${numero}\nA: ${representantes.valores.nombres} ${representantes.valores.apellidos}`);
                        Respuesta(msg, client, MensajeUecla.ReferenciaAceptada(datos,dat,numero, representantes));
                        
                    }else{
                        // msg.reply(`✔️ Referencia en espera de ser procesada\n✅ Referencia: ${datos.referencia}\nRecibida con éxito el:\n${moment(ref.createdAt).format("DD/MM/YYYY HH:mm a")}\nDesde: ${numero}\nA:${representantes.valores.nombres} ${representantes.valores.apellidos}`);
                        Respuesta(msg, client, MensajeUecla.ReferenciaEspera(datos,ref,numero, representantes));
                    }
                }else{
                    msg.reply('❌ no se reconoce referencia\n'+text.data.text);
                }
                

                
            })
            .catch((error) => {
                console.log(error.message)
            })
    }
}
CondicionUECLA.misdatos = async(message, client)=>{
    const {cedula} = CondicionUECLA.Parametros(message);
    const contact = await message.getContact();
    const {number} = contact;
    const numero = number.slice(2);
    
    let representantes= await Buscar_Representante({numero, cedula});
    
    if (representantes===null){
        Mensaje_noregistrado(message,client,{numero, cedula},MensajeUecla.ActuliarM());//'🤖 MIS DATOS "su cedula" "su contraseña"'
    }else{
        const repre =representantes.valores; 
        Respuesta(message,client, MensajeUecla.Representante(repre))
    }
    
}
CondicionUECLA.actualizarmovil = async(message, client)=>{
    const {cedula, telefono, clave} = CondicionUECLA.Parametros(message);
    const contact = await message.getContact();
    const {number} = contact;
    const numero = number.slice(2);
    let representantes= await Buscar_Representante({numero, cedula});
    const Representante = await Model('uecla', 'uecla_Representante');
    
    if (representantes===null){
        Mensaje_noregistrado(message,client,{numero, cedula},MensajeUecla.ActuliarM());//MensajeUecla.AyudaActulizar//'🤖 ACTUALIZAR MOVIL "su cedula" "contraseña"'
    }else{
        let repre =representantes;
        const anterior =repre.valores.telefono_movil;
        let clavec= await Hash_passwordA(clave ? clave : cedula);
        clavec=clavec.toUpperCase();
        
        if ((repre.valores.password && repre.valores.password===clavec) || (repre.valores.password===undefined && clave===repre.valores.cedula)){
            const nuevo = {...repre.valores, telefono_movil:telefono ? telefono : number, whatsapp_contacto:message.from};
            const hash_chs = await Hash_chs({...nuevo})
            await Representante.updateOne({_id:repre._id},{valores:nuevo, hash_chs, actualizado:repre.valores.cedula+'-'+numero},{ upsert: true });
            global.io.emit('Actualizar',{tabla:'uecla_Representante'}) //datos:resultado})
        }
        // message.reply(
        Respuesta(message,client, MensajeUecla.MoviActualizado(repre, clavec, clave, telefono, number, anterior));
//         client.sendMessage(message.from,`ACTUALIZAR TELEFONO MOVIL  
// ${separado}
// ${repre.valores.nombres} ${repre.valores.apellidos}
// ${repre.valores.password===clavec ? telefono || number ?  `✅ Numero de telefono actualizado de ${anterior} a ${telefono ? telefono : number}` : '❌ No indico el nuevo numero ❌' : clave || cedula ? '❌ Contraseña Invalida ❌' : '❌ No indico contraseña ❌' }
// `)
    }
}
CondicionUECLA.mismensualidades = async(message, client)=>{
    const {cedula}=CondicionUECLA.Parametros(message);
    const contact = await message.getContact();
    const {number} = contact;
    const numero = number.slice(2);
    let representantes= await Buscar_Representante({numero, cedula});
    
    if (representantes===null){
        Mensaje_noregistrado(message,client,{numero, cedula},MensajeUecla.ActuliarM());//'🤖 MIS MENSUALIDADES "su cedula"');
    }else{
        const lista=['inscripcion','septiembre','octubre','noviembre','diciembre','enero','febrero','marzo','abril','mayo','junio','julio','agosto']
        const repre =representantes.valores; 
        const Mensualidad = await Model('uecla', 'uecla_Mensualidad');
        let representa=[]
        // let representa = await repre.representados.map(async (val)=>{
        for (var i = 0; i<repre.representados.length;i++){
            const val = repre.representados[i];
            let meses = await Mensualidad.find({$or:[{"valores._id_estudiante":val._id},{"valores.cedula":val.cedula}]});
            let porpagar={};
            meses.map(v=>{ 
                lista.map(lis=>{
                    if(!v.valores[lis]){
                        porpagar[v.valores.periodo]= porpagar[v.valores.periodo] ? porpagar[v.valores.periodo]+ `, ${lis.toUpperCase()}` : lis.toUpperCase() 
                    }
                })
            })
            representa=[...representa, {...val, porpagar}]

        }//)
        Respuesta(message, client, MensajeUecla.MensualidadesM(repre,representa))

    }
    
}
CondicionUECLA.pendientes = async(message, client)=>{
    const {cedula}=CondicionUECLA.Parametros(message);
    const contact = await message.getContact();
    const {number} = contact;
    const numero = number.slice(2);
    let representantes= await Buscar_Representante({numero, cedula});
    
    if (representantes===null){
        Mensaje_noregistrado(message,client,{numero, cedula},MensajeUecla.ActuliarM());//'🤖 MIS MENSUALIDADES "su cedula"');
    }else{
        const lista=['inscripcion','septiembre','octubre','noviembre','diciembre','enero','febrero','marzo','abril','mayo','junio','julio','agosto']
        const repre =representantes.valores; 
        const Mensualidad = await Model('uecla', 'uecla_Mensualidad');
        let representa=[]
        // let representa = await repre.representados.map(async (val)=>{
        for (var i = 0; i<repre.representados.length;i++){
            const val = repre.representados[i];
            let meses = await Mensualidad.find({$or:[{"valores._id_estudiante":val._id},{"valores.cedula":val.cedula}]});
            let porpagar={};
            meses.map(v=>{ 
                lista.map(lis=>{
                    if(!v.valores[lis]){
                        porpagar[v.valores.periodo]= porpagar[v.valores.periodo] ? porpagar[v.valores.periodo]+ `, ${lis.toUpperCase()}` : lis.toUpperCase() 
                    }
                })
            })

            representa=[...representa, {...val, porpagar}]

        }//)
        Respuesta(message, client, MensajeUecla.MensualidadesM(repre,representa))
    }
}
CondicionUECLA.noexiste = async(message, client)=>{
    const contact = await message.getContact();
    const {number, name, pushname, id} = contact;
    const informacion = `Hola @${name ? name : pushname ? pushname : number}
NO PUEDO AYUDARTE CON:
    ${message.body}
${separado}
${Ayuda}
`;
    // client.sendMessage(message.from, informacion);
    Respuesta(message,client, informacion);
}
CondicionUECLA.ayuda = async(message, client)=>{
    const contact = await message.getContact();
    const {number, name, pushname, id} = contact;
    console.log('Ayuda ...');
    const ayudan = MensajeUecla.Ayuda(MensajeUecla.Yo)
    const informacion = `Hola @${name ? name : pushname ? pushname : number}
` + ayudan
    // client.sendMessage(message.from, informacion);
    Respuesta(message, client, informacion, true);
}
CondicionUECLA.informacion = async(message, client)=>{
    const chat = await message.getChat();
    const contact = await message.getContact();
    const directorio = `${__dirname}${path.sep}media${path.sep}bot.jpg`
    const mediaFile = MessageMedia.fromFilePath(directorio);
    await chat.sendMessage(mediaFile, {
        mentions: [contact],
        caption:`BOT\n${MensajeUecla.Colegio}\nhttps://uecolegiolibertadoresdeamerica.com\n${MensajeUecla.MisDatos}`
    });
    // client.sendMessage(message.from,'conectado a bot chs');
}
Respuesta = async(message, client, mensaje, cabezera=false)=>{
    const chat = await message.getChat();
    const contact = await message.getContact();
    const directorio = `${__dirname}${path.sep}media${path.sep}bot.jpg`
    const mediaFile = MessageMedia.fromFilePath(directorio);
    // console.log(contact)
    if (cabezera){
        await chat.sendMessage(mediaFile, {
            // mentions: [contact],
            caption:`BOT\n${MensajeUecla.Colegio}\nhttps://uecolegiolibertadoresdeamerica.com\n${separado}\n${mensaje}`
        });
    }else{
        
        client.sendMessage(message.from,`${separado}\n${mensaje}`);
    }
}
CondicionUECLA.Parametros = (message)=>{
    let resultado={};
    const datos = message.body.toLowerCase().split(" ");
    console.log(datos);
    datos.map((dat)=>{
        let valor = dat.replace('\n',"").replace('"',"").replace('"',"").replace('.',"").replace('.',"")
        console.log(valor);
        //cedula
        if(valor.length===8 && !isNaN(Number(valor)) && !resultado.cedula){
            resultado.cedula= valor
        }else if (valor.length>9 && !isNaN(Number(valor)) && !resultado.telefono){
            resultado.telefono= valor
        }else if ([`${MensajeUecla.Yo}${MensajeUecla.Informa}`,`${MensajeUecla.Informa}`, `${MensajeUecla.Yo}${MensajeUecla.Mensualidades}`, `${MensajeUecla.Mensualidades}` , `${MensajeUecla.Yo}${MensajeUecla.Celular}`, `${MensajeUecla.Celular}`].indexOf(valor)==-1 
                    && 'mis datos'.indexOf(valor)===-1 
                    && 'mis mensualidades'.indexOf(valor)===-1 
                    && 'actualizar movil'.indexOf(valor)===-1 
                ){
            resultado.clave=valor
        }
    })
    console.log(resultado)
    return resultado
}
Mensaje_noregistrado = async(message, client, datos, ayuda)=>{
    const {numero,cedula}= datos;
// message.reply(
    Respuesta(message, client, MensajeUecla.NoRegistrado(numero, ayuda, cedula))
}

Buscar_Representante = async(dato)=>{
    const {numero, cedula} = dato;
    const Representante = await Model('uecla', 'uecla_Representante');
    let representantes= await Representante.find();
    representantes= representantes.filter(f=> 
        String(f.valores.telefono_movil).indexOf(numero)!==-1 
        || String(f.valores.telefono_fijo).indexOf(numero)!==-1 
        || String(f.valores.telefono_trabajo).indexOf(numero)!==-1
        || f.valores.cedula === cedula
    );
    if (representantes.length!==0){
        return representantes[0]
    }
    return null
}
Buscar_Referencia = async(dato)=>{
    const {referencia} = dato;
    const Referencia = await Model('uecla', 'uecla_Whatsapp_Capture');
    let ref= await Referencia.find({"valores.referencia":referencia});
    ref= ref.filter(f=> 
        f.valores.datos.referencia === referencia
    );
    if (ref.length!==0){
        return ref[0]
    }
    return null
}
module.exports = CondicionUECLA;