const { Schema, model } = require('mongoose');

        const egew_cuenta_wesiSchema = new Schema(
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
            egew_cuenta_wesiSchema.index({'$**': 'text'});
        module.exports = model('Egew_cuenta_wesi', egew_cuenta_wesiSchema);