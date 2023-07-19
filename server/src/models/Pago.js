const { Schema, model } = require('mongoose');

const pagoSchema = new Schema(
    {
        transferencia:[
            {
                id: Number,
                forma_pago: String,
                fecha: String,
                cedula: String,
                monto: Number,
                referencia: String,
                banco_origen: String,
                banco_destino: String
            }
        ],
        cedula_representante: {
            type: String,
            required: true,
            trim: true,
        },
        monto: {
            type: Number,
            default:0,
        },
        total: {
            type: Number,
            default:0,
        },
        abono: {
            type: Number,
            default:0,
        },
        bolivar: {
            type: Number,
            default:0,
        },
        dolar: {
            type: Number,
        },
        valorcambio: {
            type: Number,
            default:0,
        },
        total_dolar:{
            type: Number,
            default:0,
        },
        abono_dolar:{
            type: Number,
            default:0,
        },
        filename: [String],
        fileid: [String],
        estatus:{
            type:String,
            default:'0',
        },
        descripcion:{
            type:String,
            default:'',
        },
        mensualidad:[
            {
                descripcion: String , 
                montod: String, 
                montob: String, 
            }
        ],
        pago:[
            {
                _id: String , periodo: String, 
                nombres: String, apellidos: String,
                cedula: String, label: String,
                campo: String,
            }
        ],
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
    pagoSchema.index({'$**': 'text'});
module.exports = model('Pago', pagoSchema);
