const { Schema, model } = require('mongoose');

const arancelSchema = new Schema(
    {
        periodo: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        descripcion:  {
            type: String,
            trim: true,
        },
        monto: {
            type: Number,
        },
        mes_inicia: Number,
        mes_fin: Number,
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
    arancelSchema.index({'$**': 'text'});
module.exports = model('Arancel', arancelSchema);
