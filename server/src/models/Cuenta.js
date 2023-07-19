const { Schema, model } = require('mongoose');

const cuentaSchema = new Schema(
    {
        tipo: {
            type: String,
            trim: true,
        },
        titular: {
            type: String,
            trim: true,
        },
        banco: {
            type: String,
            trim: true,
        },
        numero_cuenta:  {
            type: String,
            trim: true,
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
    cuentaSchema.index({'$**': 'text'});
module.exports = model('Cuenta', cuentaSchema);
