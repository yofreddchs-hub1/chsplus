const { Schema, model } = require('mongoose');

const quincenaSchema = new Schema(
    {
        _id_docente: String,
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
        quincena: String,
        dias:[],
       
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
    quincenaSchema.index({'$**': 'text'});
module.exports = model('Quincena', quincenaSchema);
