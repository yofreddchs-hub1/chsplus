const { Schema, model } = require('mongoose');

              const wesi_chs_server_user_apiSchema = new Schema(
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
                  wesi_chs_server_user_apiSchema.index({'$**': 'text'});
              module.exports = model('Wesi_chs_server_user_api', wesi_chs_server_user_apiSchema);