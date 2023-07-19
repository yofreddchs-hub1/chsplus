const { Schema, model } = require('mongoose');

const nominaSchema = new Schema(
    {
        cedula: {
            type: String,
            trim: true,
            lowercase: true
        },
        apellidos: {
            type: String,
            default: '',
            trim: true,
        },
        nombres: {
            type: String,
            default: '',
            trim: true,
        },
        
        cargo: {
            type: String,
            default: ''
        },
        actualizado: String,
        quincena: String,
        valor: {default : 0, type:Number},
        total: {default : 0, type:Number},
        descuento: {default : 0, type:Number},
        neto: {default : 0, type:Number},
        horadia: {default : 0, type:Number},
        clase: {
            type:String,
            default:'0'
        },
        seq_chs:{
          type: Number,
          default:0,
          set:(v)=>{
               return Number(v)+1;
          }
        },
        cod_chs: {
          type: String,
          unique: true
        },
        hash_chs: String

    }, {
        timestamps: true
    });
    nominaSchema.index({'$**': 'text'});
module.exports = model('Nomina', nominaSchema);
