const chatCtrl = {};
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const {Model} = require('../database/model');


Verificar = async(DB, verificar, datos) =>{
    let continuar = true;
    let resultado= null;
    if (verificar){
        if (typeof verificar==='string'){
            resultado = await DB.findOne({[verificar]:datos[verificar]})
        }else{
            for(var i=0; i<verificar.length; i++){
                const val = verificar[i];
                continuar = await Verificar(DB, val, datos)
            }
        }
    }
    continuar = resultado===null ? continuar : false;
    return continuar;
}
chatCtrl.RegistroChat=async(valores)=>{
    const {datos, User, nuevo, api}=valores;
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
        const continuar = await Verificar(DB, verificar, nuevo)
        console.log(continuar);
    }

    return resultado;
}
module.exports = chatCtrl;