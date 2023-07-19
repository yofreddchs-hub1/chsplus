const { Schema, model } = require('mongoose');

const articuloSchema = new Schema(
    {
        nombre: {
            required: true,
            type: String,
        },
        filename: [String],
        fileid: [String],
        descripcion:  {
            type: String,
        },
        precio:{
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
    articuloSchema.index({'$**': 'text'});
module.exports = model('Articulo', articuloSchema);
