const { Schema, model } = require('mongoose');

              const uecla_reciboSchema = new Schema(
                  {
                      campos: {},
                      valores:{},
                      actualizado:String,
                      seq_chs:{
                        type: Number,
                        default: 0,
                        set:(v)=>{
                          return Number(v)+1
                        }
                      },
                      cod_chs:{
                        type:String,
                        unique:true
                      },
                      hash_chs:String,
                      fecha:Date
                  }, {
                      timestamps: true
                  });
                  uecla_reciboSchema.index({'$**': 'text'});
              module.exports = model('Uecla_recibo', uecla_reciboSchema);