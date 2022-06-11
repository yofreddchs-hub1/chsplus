const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
          type: String,
          required: true,
          unique: true,
          trim: true,
          lowercase: true
        },
        cedula:String,
        token:String,
        nombres: String,
        password:String,
        categoria:String,
        foto: String,
        'foto-id': String,
        actualizado:String,
        conectado: Boolean,
        id_socket: String,
        api: String,
        master:Boolean,
        coordenadas:{}, 
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
    userSchema.index({'$**': 'text'});
module.exports = model('User_api', userSchema);
