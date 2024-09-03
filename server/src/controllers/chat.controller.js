const chatCtrl = {};
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const {Model} = require('../database/model');
const { Codigo_chs, Hash_chs} = require('../servicios/conexiones');

const api = 'ChatFanb';
Verificar = async(DB, verificar, datos) =>{
    let continuar = true;
    let resultado= null;
    if (verificar){
        if (typeof verificar==='string'){
            resultado = await DB.findOne({[`valores.${verificar}`]:datos[verificar]})
        }else{
            for(var i=0; i<verificar.length; i++){
                const val = verificar[i];
                continuar = await Verificar(DB, val, datos)
                resultado= continuar.resultado;
                continuar= continuar.continuar;
            }
        }
    }
    continuar = resultado===null ? continuar : false;
    return {continuar, resultado};
}

chatCtrl.VerContactos=async(valores)=>{
    
    valores = valores.map(val=>{
        let telefonos = val.phoneNumbers 
            ?   val.phoneNumbers.map(tel=> {
                    let numero = tel.number.replace('+58 ','+58').replace('+58','0').replace('-','');
                    return numero
                }) 
            :   []
        return {...val, telefonos}
    })
    const DB = await Model('ChatFanb','chatfanb_usuario');
    let usuarios = await DB.find();
    usuarios = usuarios.map(f=>{return {...f.valores, _id:f._id}})
    let nuevof=[];
    let nuevosf=[];
    for (var i=0; i<valores.length; i++){
        // const usuario = {...usuarios[i].valores, _id: usuarios[i]._id};
        const usuario = valores[i];
        const pos = usuarios.findIndex(f=> usuario.telefonos.indexOf(f.telefono.replace('+58','0'))!==-1)//valores.findIndex(f=> f.telefonos.indexOf(usuario.telefono.replace('+58','0'))!==-1);
        if (pos!==-1){
            nuevof=[...nuevof,{
                ...usuario, 
                _id:usuarios[pos]._id, 
                foto:usuarios[pos].foto, 
                token:usuarios[pos].token, 
                username: usuarios[pos].username, 
                telefono:usuarios[pos].telefono, 
                chatfanb:true,
                nombres:usuarios[pos].nombres 
            }]
        }else{
            nuevosf=[...nuevosf, usuario];
        }
    }
    nuevof = nuevof.sort((a,b)=> a.name>b.name ? 1 : -1);
    nuevosf = nuevosf.sort((a,b)=> a.name>b.name ? 1 : -1);

    return [...nuevof, ...nuevosf]
}
chatCtrl.RegistroChat=async(valores)=>{
    const {datos, User, nuevo, api, actualizar}=valores;
    const {table, verificar} = datos;
    let resultado ={
        Respuesta:table ? 'Ok' : 'Error',
        Mensaje:!table ? 'No se envio "table"' : ''
    }
    if (table){
        const DB = await Model(api, `${api}_${table}`);//require(`../models/${dato.tabla}`);
        if (DB===null){
            resultado={
                Respuesta: 'Error',
                Mensaje: `La app "${api}" no esta resgistrada`  
            }
        }
        const continuar = await Verificar(DB, verificar, nuevo);
        if (continuar.continuar){
            let cod_chs = await Codigo_chs({telefono: nuevo.telefono, nombres: nuevo.telefono, date: new Date()});
            const Nuevo = new DB({valores:{...nuevo, ...User, username:nuevo.telefono}, cod_chs, actualizado:nuevo.telefono});
            await Nuevo.save();
            resultado.nuevo={
                _id:Nuevo._id,
                valores:{
                    ...Nuevo.valores,
                    _id:Nuevo._id
                }
            }
            
        }else if (actualizar){
            await DB.updateOne({_id:nuevo._id},{valores:nuevo, actualizado:User.username},{ upsert: true });
            resultado.nuevo={
                _id:nuevo._id,
                valores:{
                    ...nuevo
                }
            }
        }else{
            resultado={
                Respuesta: 'Error',
                Mensaje: `El ${nuevo.telefono} ya se encuentra registrado`,
                nuevo:{
                    _id: continuar.resultado._id,
                    valores:{
                        ...continuar.resultado.valores,
                        _id: continuar.resultado._id
                    }
                },
                valores
            } 
        }

    }

    return resultado;
}

tabla_mensajes = async(valores) =>{
    const {Usuario1, Usuario2} = valores;
    const usuario =[Usuario1.username, Usuario2.username].sort();
    const DB = await Model(api, `${api}_mensajes_${usuario[0]}_${usuario[1]}`);//require(`../models/${dato.tabla}`);
    return DB
}

chatCtrl.Mensajes= async(valores)=>{
    const DB = await tabla_mensajes(valores);
    let mensajes =await DB.find();
    mensajes= mensajes.map(val=>{return {...val.valores, _id:String(val._id)}});
    return mensajes;
}

chatCtrl.NuevoMensaje = async(valores)=>{
    let {Usuario1, messages}= valores;
    const DB = await tabla_mensajes(valores);
    messages.createdAt = new Date();
    messages.enviado = true;
    let cod_chs = await Codigo_chs(messages);
    const Nuevo = new DB({valores:{...messages }, cod_chs, actualizado:Usuario1.username});
    await Nuevo.save();
    let mensajes =await DB.find().sort({$natural:-1}).limit(10);
    mensajes= mensajes.map(val=>{return {...val.valores, _id:String(val._id)}});
    return mensajes

}

chatCtrl.GuardarArchivoChat=async(req, res)=>{
    let archivos = {};
    req.files.map(val=>{
        archivos[val.fieldname]=`/api/archivos/${req.headers.destino ? `${req.headers.destino}/` : ``}${val.mimetype.indexOf('image')!==-1 ?`imagenes/` : `documentos/`}${val.filename}`//[...newdatos['filename'],req.files[val][0].filename];
        return val;
    })
    res.json({Respuesta:'Ok', mensaje: 'Fino', archivos});
    
}
module.exports = chatCtrl;