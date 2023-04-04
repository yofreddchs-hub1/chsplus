const { Schema, model } = require('mongoose');

              const sistemaraq_personalcudrillaSchema = new Schema(
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
                  sistemaraq_personalcudrillaSchema.index({'$**': 'text'});
              module.exports = model('Sistemaraq_personalcudrilla', sistemaraq_personalcudrillaSchema);