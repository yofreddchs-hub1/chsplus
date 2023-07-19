const { Schema, model } = require('mongoose');

const reciboSchema = new Schema(
    {
        recibo: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        cedula: {
            type: String,
            trim: true,
        },
        nombres: {
            type: String,
            trim: true,
        },
        apellidos: {
            type: String,
            trim: true,
        },
        correo: {
            type: String,
            trim: true,
        },
        concepto: [ {
            descripcion: String , 
            montod: String, 
            montob: String, 
        }],
        metodo_pago:[
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
            default:0,
        },
        valorcambio: {
            type: Number,
        },
        total_dolar:{
            type: Number,
            default:0,
        },
        abono_dolar:{
            type: Number,
            default:0,
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
    reciboSchema.index({'$**': 'text'});
module.exports = model('Recibo', reciboSchema);
