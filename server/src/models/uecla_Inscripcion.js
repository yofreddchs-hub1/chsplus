const { Schema, model } = require('mongoose');

              const uecla_inscripcionSchema = new Schema(
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
                  uecla_inscripcionSchema.index({'$**': 'text'});
              module.exports = model('Uecla_inscripcion', uecla_inscripcionSchema);