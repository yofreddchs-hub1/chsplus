const { Schema, model } = require('mongoose');

              const unefapostgrado_estudianteSchema = new Schema(
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
                  unefapostgrado_estudianteSchema.index({'$**': 'text'});
              module.exports = model('Unefapostgrado_estudiante', unefapostgrado_estudianteSchema);