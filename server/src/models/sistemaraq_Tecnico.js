const { Schema, model } = require('mongoose');

              const sistemaraq_tecnicoSchema = new Schema(
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
                  sistemaraq_tecnicoSchema.index({'$**': 'text'});
              module.exports = model('Sistemaraq_tecnico', sistemaraq_tecnicoSchema);