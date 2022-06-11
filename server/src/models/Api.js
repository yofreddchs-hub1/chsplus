const { Schema, model } = require('mongoose');

const apiSchema = new Schema(
    {
        api: {
          type: String,
          required: true,
          unique: true,
          trim: true,
        },  
        key: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        master:{
            type:Boolean,
            defualt:false
        },
        seq_chs:{
            type:Number,
            default:0,
            set:(v)=>{
                return Number(v)+1
            }
        },
        cod_chs:{
            type:String,
            unique:true
        },
        hash_chs: String
    }, {
        timestamps: true
    });
    apiSchema.index({'$**': 'text'});
module.exports = model('Api', apiSchema);
