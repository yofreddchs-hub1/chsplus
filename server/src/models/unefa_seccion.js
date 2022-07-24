const { Schema, model } = require('mongoose');

              const unefa_seccionSchema = new Schema(
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
                      hash_chs:String
                  }, {
                      timestamps: true
                  });
                  unefa_seccionSchema.index({'$**': 'text'});
              module.exports = model('Unefa_seccion', unefa_seccionSchema);