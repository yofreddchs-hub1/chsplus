const { Schema, model } = require('mongoose');

              const sistemachs_user_apiSchema = new Schema(
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
                  sistemachs_user_apiSchema.index({'$**': 'text'});
              module.exports = model('Sistemachs_user_api', sistemachs_user_apiSchema);