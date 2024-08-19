
const chalk = require('chalk');
const {Hash_chs, Codigo_chs} = require('./servicios/conexiones');
const { Hash_texto, Hash_password } = require('./servicios/encriptado');
const {Tablas} = require('./controllers/api.controller');
const {Model} = require('./database/model');
const { RegistroChat } = require('./controllers/chat.controller');

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
});

Enviar_usuario = async(socket)=>{
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
    
    global.io.emit("users", {users, userID:socket.id});
    // global.io.emit('Usuario_presentes',usuarios)    
}

global.chat = io.of('/chat').on('connection', (socket)=> {
    console.log('cliente:',socket.id, socket.handshake.auth);
    socket.emit('conectado',{id: socket.id})
    
    socket.on('disconnect',  async()=> {
        console.log(chalk.red('App desconectada de chat',socket.id));
    });
    socket.on('Registrar',async(valores)=>{
        console.log('Registrar',valores.nuevo)
        const respuesta = await RegistroChat({...valores, User:socket.handshake.auth})
        socket.emit('Registrado', respuesta);
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
