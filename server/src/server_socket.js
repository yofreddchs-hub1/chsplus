const User = require('./models/User_api');
global.io = require("socket.io")(global.global_http);
const conexiones = require('./servicios/conexiones');
const  {Ver_datos}= require('./controllers/api.controller');
const tiempo= 5 * (1000)
let usuario = {}
global.io.on('connection', (socket) =>{
    console.log('Usuario conectado', socket.id);
    socket.emit('conectado',{Saludo:'hola',id: socket.id})
    
    socket.on('disconnect',  async()=> {
        console.log('Usuario navegador cerrado', socket.id);

        const usuario = await User.findOne({id_socket:socket.id})
        if (usuario){
            usuario.conectado= false;
            await usuario.save()
            Enviar_usuario();
        }
        
        // delete usuario[socket.id]
    });

    socket.on('desconectar',  async()=> {
        console.log('Usuario cierra login', socket.id);
        const usuario = await User.findOne({id_socket:socket.id});
        if (usuario){
            usuario.conectado= false;
            await usuario.save()
            Enviar_usuario();
        }
        // delete usuario[socket.id]
     });

    socket.on('conectar', async(data)=>{
        let db
        let tipo
        if (data.api && data.api.api!==undefined && data.api.api!=='wesi_chs_server'){
            db = require(`./models/${data.api.api}_User_api`)
            tipo = 1
        }else{
            db = require('./models/User_api')
            tipo = 0
        }
        // let us = await User.findById(data._id);
        let us = await db.findById(data._id);
        if (data._id && us!==null && tipo===0){
            await db.updateOne({_id:data._id},{id_socket:data.id_socket, conectado: true},{ upsert: true });
        }else if (data._id && us!==null && tipo===1){
            us.valores = {...us.valores, id_socket:data.id_socket, conectado: true}
            await db.updateOne({_id:data._id},{valores:us.valores},{ upsert: true });
        }
        Enviar_usuario();
    })
    socket.on('login', async(data) =>{
        await User.updateOne({_id:data._id},{id_socket:socket.id, conectado: true},{ upsert: true });
        Enviar_usuario();
    })
    socket.on ('Presentes',()=>{
        // socket.emit('Usuario_presentes',usuario)
        Enviar_usuario();
    })
    
});

Enviar_usuario = async()=>{
    const usuarios= await User.find();
    global.io.emit('Usuario_presentes',usuarios)    
}
