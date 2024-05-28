const { database } = require( './databasechs' )
const mongoose = require("mongoose");
const chalk = require('chalk');

const dataSchema = new mongoose.Schema(
    {
        campos: {},
        valores:{},
        eliminado:{
            type:Boolean,
            default:false
        },
        actualizado:String,
        fecha:String,
        seq_chs:{
          type: Number,
          default: 0,
          set:(v)=>{
            return Number(v)+1
          }
        },
        cod_chs:{
          type:String,
        //   unique:true
        },
        hash_chs:String
    }, {
        timestamps: true
    }
);
dataSchema.index({'$**': 'text'});

const Model = async(api, tabla, borrar=false) =>{
    api = typeof api==='string' ? api : api.valores.api
    tabla = tabla.toLowerCase()+'s';
    console.log('Tabla a abrir con model.......',api, tabla);
    let resultado
    try {
        resultado= global.DataBase[api].model(tabla,dataSchema,tabla);
    }catch(error) {
        try{
            console.log(chalk.inverse.green('Creando........',api, tabla))
            const Apis =global.DataBase[global.Principal].model('apis',dataSchema, 'apis');
            let apis = await Apis.find();
            const pos = apis.findIndex(f=> f.valores.api===api);
            if (pos!==-1){
                apis= apis[pos].valores;
                global.DataBase[api] = apis.url!==undefined 
                    ? database(apis.url,api).useDb( apis.nombredb, { useCache: true } ) 
                    : undefined
            }

            resultado = global.DataBase[api]===undefined ? null : global.DataBase[api].model(tabla,dataSchema,tabla);
        }catch(error){
            console.log(chalk.inverse.red('Error........',api, tabla))
            resultado = null
        }
    }
    if (borrar){
        await resultado.find();
        console.log('Borrar>>>>>>>>>>>>>', tabla)
        global.DataBase[api].deleteModel(tabla);
    }
    
    return resultado
    
}

module.exports.Model = Model;