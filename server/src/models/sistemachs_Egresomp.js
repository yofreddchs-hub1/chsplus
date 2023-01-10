const { Schema, model } = require('mongoose');

              const sistemachs_egresompSchema = new Schema(
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
                  sistemachs_egresompSchema.index({'$**': 'text'});
              module.exports = model('Sistemachs_egresomp', sistemachs_egresompSchema);