
const chalk = require('chalk');
const {Hash_chs, Codigo_chs} = require('./servicios/conexiones');
const { Hash_texto, Hash_password } = require('./servicios/encriptado');
const {Tablas} = require('./controllers/api.controller');
const {Model} = require('./database/model');
const { RegistroChat, VerContactos, Mensajes, NuevoMensaje } = require('./controllers/chat.controller');

const io = require("socket.io")(global.global_http,
    {
       cors:{origin:"*"} 
    }    
);
const tiempo= 5 * (1000)
let usuario = {}
let databd = {};
global.io = io.of('/').on('connection', (socket) =>{
    //socket.handshake.headers: host destino,origen de la peticion
    //socket.handshake.auth: se pueden enviar datos 
    console.log(chalk.green('Usuario conectado', socket.handshake.auth.username, socket.handshake.auth.api, socket.handshake.auth.tipo));
    Enviar_usuario(socket);
    socket.emit('conectado',{Saludo:'hola',id: socket.id, tasa: global.global_cambio})
    // console.log(global.io.engine.clientsCount)
    socket.on('disconnect',  async()=> {
        console.log(chalk.red('Usuario navegador cerrado', socket.id, socket.handshake.auth.username, socket.handshake.auth.api, socket.handshake.auth.tipo));

        // const usuario = await User.findOne({id_socket:socket.id})
        // if (usuario){
        //     usuario.conectado= false;
        //     await usuario.save()
        //     Enviar_usuario(socket);
        // }
        
        // delete usuario[socket.id]
        Enviar_usuario(socket);
    });

    socket.on('desconectar',  async()=> {
        console.log('Usuario cierra login', socket.id);
        // const usuario = await User.findOne({id_socket:socket.id});
        // if (usuario){
        //     usuario.conectado= false;
        //     await usuario.save()
        //     Enviar_usuario(socket);
        // }
        // delete usuario[socket.id]
     });

    socket.on('conectar', async(data)=>{
        // let db
        // let tipo
        // if (data.api && data.api.api!==undefined && data.api.api!=='wesi_chs_server'){
        //     db = require(`./models/${data.api.api}_User_api`)
        //     tipo = 1
        // }else{
        //     db = require('./models/User_api')
        //     tipo = 0
        // }
        // // let us = await User.findById(data._id);
        // let us = await db.findById(data._id);
        // if (data._id && us!==null && tipo===0){
        //     await db.updateOne({_id:data._id},{id_socket:data.id_socket, conectado: true},{ upsert: true });
        // }else if (data._id && us!==null && tipo===1){
        //     us.valores = {...us.valores, id_socket:data.id_socket, conectado: true}
        //     await db.updateOne({_id:data._id},{valores:us.valores},{ upsert: true });
        // }
        Enviar_usuario(socket);
    })
    socket.on('tasa_cambio',()=>{
        global.io.to(socket.id).emit('Actualizar_tasa',{tasa: global.global_cambio});
    })
    socket.on('login', async(data) =>{
        // await User.updateOne({_id:data._id},{id_socket:socket.id, conectado: true},{ upsert: true });
        Enviar_usuario(socket);
    })
    socket.on ('Presentes',()=>{
        // socket.emit('Usuario_presentes',usuario)
        Enviar_usuario(socket);
    })
    socket.on('Sincronizado', (data)=>{
        socket.broadcast.emit('Actualizar', {tablas:data.tablase});
        socket.emit('Sincronizado', data.fechaf);
    })
    socket.on('Elimniar', (data)=>{
        socket.broadcast.emit('Eliminar', data);
    })
    socket.on('ActualizarPago', (data)=>{
        socket.emit('ActualizarPago', data);
    })
    socket.on('Sincronizar', async(data)=>{
        const {tabla, datos, fecha, fechaa, Api} = data;
        const cantidades = 25;
        const pag = data.pag ? data.pag : 0;
        console.log(chalk.blue(`Sincronizando >>> ${tabla} ${fecha} ${Api}, Pagina: ${pag}`));
        let cantidad;
        let dbs=[]
        let DB ;//= await Model(Api, tabla);
        try{
            DB = await Model(Api, tabla);//require(`./models/${tabla}`);
        }catch(error) {
            console.log(chalk.inverse.red(`Error en sincronizar >>>> (${tabla})`));
            global.io.to(socket.id).emit('Sincronizando', {Respuesta:'Error', ...data, cantidad, datos:dbs})
            return
        }
        for (let i=0; i<datos.length;i++){
            const newdatos=datos[i];
            try{
              let cod_chs = await Codigo_chs({...newdatos.valores});
              const hash_chs = await Hash_chs({...newdatos, cod_chs})
              await DB.updateOne({_id:newdatos._id},{...newdatos, cod_chs, hash_chs},{ upsert: true });
            }catch(error) {
                
              console.log(chalk.inverse.red(`Error, al amacenar datos en ${tabla} ${newdatos} ${error}`));    
              await DB.updateOne({_id:newdatos._id},{...newdatos},{ upsert: true });
            }
            // console.log('data', data)
            if (data.tabla.indexOf('Eliminados')!==-1){
              console.log('Elimninar>>>>',newdatos.tabla)
              const DBE = await Model(Api, newdatos.tabla);//require(`./models/${newdatos.tabla}`);
              await DBE.deleteOne({_id:newdatos.valores._id});
            }
        }
        console.log(chalk.green(`Sincronizado >>>>>>... ${tabla} ${fecha}`));
        cantidad = await DB.estimatedDocumentCount();
        if (fecha===null || fecha===undefined){
            // cantidad = await DB.estimatedDocumentCount();
            dbs = await DB.find()
                // .sort({createdAt:-1})
                .limit(cantidades)
                .skip(pag*cantidades).exec();
            console.log(chalk.inverse.yellow(`Enviar ${tabla}, Pagina: ${pag}/${cantidad/cantidades}.......`));
        }else{
            let fechan = new Date(fecha);
            // fechan.setDate(fechan.getDate()-1);
            let fechana = new Date(fechaa);
            // fechana.setDate(fechana.getDate()-1);
            // cantidad = await DB.estimatedDocumentCount()
            console.log(fechan,fechana);
            dbs = await DB.find({$or:[{createdAt:{$gte:fechan}}, {updatedAt:{$gte:fechana}}]})
                        //   .sort({createdAt:-1})
                          .limit(cantidades)
                          .skip(pag*cantidades).exec();
            // cantidad = dbs.length
            
            console.log(chalk.inverse.yellow(`Enviar despues de  ${tabla} , Pagina: ${pag}/${cantidad/cantidades}....... ${fechan}, ${dbs.length}, ${fechana}`));
        }

        global.io.to(socket.id).emit('Sincronizando', {Respuesta:'Ok', ...data, cantidad, datos:dbs, cantidades, pag, fecha, fechaa, fechaf:new Date()})
    })
    // lo nuevo para trabajo local
    socket.on('Modificaciones', async(data)=>{
        const {api, codigo_navegador, tablas, datos, pagina, total, cantidadP} = data; 
        const DB= await Model(api, tablas[0]);
        let nuevodatos=[];
        let npagina = pagina;
        console.log('......',codigo_navegador, pagina ,datos.length, total)
        //acauliza segun modificacion de modificaciones
        if(datos.length!==0){
            let tablasm=[];
            for (var j =0; j<datos.length; j++){
                let valor = datos[j];
                let clientes=valor.valores.clientes;
                const pos = clientes.indexOf('servidor');
                if (pos===-1){
                    clientes=['servidor',...clientes]
                    console.log(clientes)
                }
                const {tabla} =valor.valores
                tablasm=[...tablasm, tabla];
                if(pos===-1 && valor.valores.origen!=='servidor'){
                    console.log('actualizar valor ...');
                    let anteriorM= await DB.findOne({'valores._id_registro':valor.valores._id_registro});
                    if (anteriorM!==null && new Date(anteriorM.updatedAt)>new Date(valor.updatedAt)){
                        console.log('Actualizar con anterior')
                        valor= anteriorM;
                    }
                    const {_id_registro, newdatos, tipo, origen} =valor.valores;
                    
                    const NDB= await Model(api, tabla);
                    delete newdatos.local
                    // console.log(newdatos)
                    if (tipo!=='Eliminar'){
                        //crea o actualiza registro
                        delete newdatos.hash_chs
                        console.log('Crea o actualiza>>>>>>>>>')
                        await NDB.updateOne({_id:newdatos._id},{...newdatos},{ upsert: true })
                    }else{
                        console.log('Eliminar>>>>>>>>>')
                        await NDB.deleteOne({_id:newdatos._id});
                    }
                    //actualiza o crea modificacion
                    
                    await DB.updateOne({
                        _id:valor._id,
                    },{
                        valores:{
                            _id_registro,
                            tabla,
                            tipo,
                            newdatos,
                            origen,
                            clientes
                        }
                    },{ upsert: true })

                    const nuevo= await DB.findOne({_id:valor._id});
                    nuevodatos=[...nuevodatos, nuevo]
                }else{
                    // const anterior = await DB.findOne({_id:valor._id})
                    // if (anterior===null || (anterior!==null && new Date(anterior.updatedAt)>new Date(valor.updatedAt))){
                        // console.log('>>>')
                        await DB.updateOne({_id:valor._id},{...valor, valores:{...valor.valores, clientes}},{ upsert: true })
                    // }
                }
                
                // if(valor.valores.origen==='servidor'){    
                //     nuevodatos=[...nuevodatos, {...valor, valores:{...valor.valores, clientes}}]
                // }
                
            }
            global.io.to(socket.id).emit('Actualizar', {tablas: tablasm}) 
        }

        if (nuevodatos.length!==0){
            console.log('actualizar modificaciones de:', codigo_navegador)
            global.io.to(socket.id).emit('Actualizar_modificacion', {codigo_navegador, nuevodatos, pagina})
            return 
        }
        let totals = await DB.estimatedDocumentCount();
        // if (nuevodatos.length!==0 || total>totals){
        //     console.log('.....por aqui.....',totals)
        //     global.io.to(socket.id).emit('Actualizar_modificacion', {codigo_navegador, nuevodatos, pagina})
        //     return
        // }else if(datos.length!==0){
        //     global.io.to(socket.id).emit('Actualizar_modificacion_fin', {codigo_navegador})
        // }

        //Cacular total de cambios de database
        let total_cambios = 0;
        for (var i=1; i<tablas.length;i++){
            const NDB= await Model(api, tablas[i]);
            const ntotal = await NDB.estimatedDocumentCount();
            total_cambios+=ntotal;
        }
        // let cambios = await DB.find();
        if (totals!==total_cambios && totals<total_cambios){//Para actualizar todos los datos
            console.log('por aqui');
            npagina=0;
            await DB.deleteMany(); 
            for (var i=1; i<tablas.length;i++){
                const NDB= await Model(api, tablas[i]);
                const valores = await NDB.find();
                for (var j=0; j<valores.length; j++){
                    let nuevo = valores[j];
                    const _id_registro =`${tablas[i]}-Nuevo-${String(nuevo._id)}`
                    await DB.updateOne({
                        "valores._id_registo":_id_registro,
                    },{
                        valores:{
                            _id_registro,
                            tabla:tablas[i],
                            tipo:'Nuevo',
                            newdatos:nuevo,
                            origen:'servidor',
                            clientes:['servidor']
                        }
                    },{ upsert: true })
                }
            }
            totals = await DB.estimatedDocumentCount();
            console.log('Listo', totals)
            // global.io.to(socket.id).emit('Actualizar_local', {Respuesta:'Todos', codigo_navegador})  
        }
        const modificaciones = await DB.find().sort({updatedAt:-1});
        // console.log(total, totals, total_cambios)
        let cambios = porpagina(modificaciones,npagina,cantidadP,(dato)=>{
            const pos = dato.valores.clientes.indexOf(codigo_navegador);
            return pos===-1
        })
        if (cambios.resulta.length === 0 && total<totals){
            cambios = porpagina(modificaciones,npagina,cantidadP,(dato)=>{
                return true 
            })
        }
        console.log('>>>>> Respuesta', codigo_navegador, cambios.resulta.length, totals)
        global.io.to(socket.id).emit('Actualizar_local', 
            { 
                codigo_navegador,
                pagina:npagina,
                cantidadP,
                datos:cambios,
                totals
            }
        )  
        if(cambios.resulta.length===0){
            // setTimeout(async() => {
                let usuarios= await Enviar_usuario(socket, false);
                usuarios = usuarios.filter(f=>f.codigo_navegador!==codigo_navegador);
                let ultimo = await DB.find().sort({updatedAt:-1}).limit(1);
                ultimo = ultimo.length!==0 ? ultimo[0].valores.clientes : null;
                if (ultimo){
                    for (var i=0; i<usuarios.length;i++){
                        const usuario = usuarios[i];
                        if (ultimo.indexOf(usuario.codigo_navegador)===-1 && usuario.codigo_navegador){
                            console.log(codigo_navegador, usuario.codigo_navegador, ultimo);
                            global.io.emit('Actualizar_local_verifica', 
                                { 
                                    codigo_navegador: usuario.codigo_navegador,
                                    pagina:npagina,
                                    cantidadP,
                                    datos:cambios,
                                    totals
                                }
                            )                   
                        }
                    }
                }
            // }, 1000);
        }


    })
    socket.on('Actualizando', async(data)=>{
        const {api, codigo_navegador, tabla, pagina, cantidadP} = data; 
        console.log('>>>>>....',tabla,pagina,cantidadP)
        if (tabla===undefined){
            console.log(chalk.inverse.red(`Tabla actualizando no existe`));
            return
        }
        const DB= await Model(api, tabla);
        const datos = await DB.find()
                .limit(cantidadP)
                .skip(pagina*cantidadP).exec();
        
        global.io.to(socket.id).emit('Actualizando_Cliente', {codigo_navegador, tabla, pagina, cantidadP, datos})
        
    })

});
//Para buscar un grupo de datos
const porpagina = (datos, paginaA, cantidad, condicion)=>{
    const inicio = paginaA * cantidad;
    const fin = cantidad;
    const total = datos.length;
    let ultimo = inicio;
    let resulta=[];
    for (var i=inicio; i<datos.length; i++){
       const dato = datos[i];
       ultimo=i;
       if (condicion(dato)){
         resulta=[...resulta,dato]
       }
       if (resulta.length===fin){
         break;
       }
    }
    return {resulta, total, ultimo}
}

Enviar_usuario = async(socket, enviar=true)=>{
    // const User = require(`./models/${socket.handshake.auth.api ? socket.handshake.auth.api+'_':''}User_api`);
    // console.log(`./models/${socket.handshake.auth.api}_User_api`)
    // const usuarios= await User.find();
    const users = [];
    const sockets = await  global.io.fetchSockets();
    // console.log(sockets.map(v=>v.handshake.auth))
    for (let [id, socket] of global.io.sockets) {
        users.push({
        userID: id,
        ...socket.handshake.auth,
        });
    }
    if (enviar){
        global.io.emit("users", {users, userID:socket.id});
    }
    return users
    // global.io.emit('Usuario_presentes',usuarios)    
}

Buscar_usuario = async(socketE, valores)=>{
    const {Usuario1, Usuario2} = valores;
    let users = [];
    
    for (let [id, socket] of global.chat.sockets) {
        users.push({
        userID: id,
        ...socket.handshake.auth,
        });
    }
    users= users.filter(f=>  f.username===Usuario2.username);//f.username===Usuario1.username ||
    console.log(users)
    return users
}
global.chat = io.of('/chat').on('connection', (socket)=> {
    console.log('cliente chafand:',socket.id, socket.handshake.auth);
    socket.emit('conectado',{id: socket.id})
    
    socket.on('disconnect',  async()=> {
        console.log(chalk.red('App desconectada de chat',socket.id));
    });
    socket.on('Registrar',async(valores)=>{
        console.log('Registrar')
        const respuesta = await RegistroChat({...valores, User:socket.handshake.auth})
        global.chat.to(socket.id).emit('Registrado', respuesta);
        // socket.emit('Registrado', respuesta);
    })
    socket.on('Contactos',async(valores)=>{
        console.log(valores.data.length, valores.User)
        const contactos = await VerContactos({valores:valores.data, User:valores.User})//socket.handshake.auth});
        
        global.chat.to(socket.id).emit('Miscontactos', contactos);
    })
    socket.on('Mensajes',async(valores)=>{
        const destinos = await Buscar_usuario(socket, valores);
        const respuesta = await Mensajes(valores);
        global.chat.to(socket.id).emit('Mensaje', respuesta);
        if (destinos.length>0){
            global.chat.to(destinos[0].userID).emit('Mensaje', respuesta);
            global.chat.to(destinos[0].userID).emit('ActualizarCHS');
        }
    })
    socket.on('NuevoMensaje',async(valores)=>{
        const destinos = await Buscar_usuario(socket, valores);
        const respuesta = await NuevoMensaje(valores);
        // global.chat.to(socket.id).emit('RecibirMensaje', respuesta);
        // global.chat.to(destinos[0].userID).emit('RecibirMensaje', respuesta);
        global.chat.to(socket.id).emit('RecibirMensaje', respuesta);
        if (destinos.length>0){
            global.chat.to(destinos[0].userID).emit('RecibirMensaje', respuesta);
            global.chat.to(destinos[0].userID).emit('ActualizarCHS');
        }

    })
    socket.on('Agregado',(nuevo)=>{
        socket.auth={...socket.auth, ...nuevo};
        console.log('Agregado:', nuevo, socket.handshake.auth);
        // socket.disconnect().connect();
    })
    socket.on('message', (datos)=>{
      console.log('MMMMMMMMMMMMMMMMMMMM',datos);
    });
  
});

global.rtchs = io.of('/rtchs').on('connection', (socket)=> {
    console.log('cliente de rtchs:',socket.id, socket.handshake.auth);
    socket.emit('conectado',{id: socket.id})
    
    socket.on('disconnect',  async()=> {
        console.log(chalk.red('App desconectada de rtchs',socket.id));
    });
    
  
});