const { Schema, model } = require('mongoose');

const representanteSchema = new Schema(
    {
        cedula: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        apellidos: {
            type: String,
            default: '',
            trim: true,
        },
        nombres: {
            type: String,
            default: '',
            trim: true
        },
        parentesco: {
            type: String,
            default: ''
        },
        lugar_nacimiento: {
            type: String,
            default: ''
        },
        fecha_nacimiento: {
            type: String,
            default: ''
        },
        correo:{
            type: String,
            default: '',
            trim: true,
            lowercase: true
        },
        telefono_movil:{
            type: String,
            default: ''
        },
        telefono_fijo: {
            type: String,
            default: ''
        },
        direccion:{
            type: String,
            default: ''
        },
        municipio: {
            type: String,
            default: ''
        },
        parroquia: {
            type: String,
            default: ''
        },
        sector:{
            type: String,
            default: ''
        },
        profesion: {
            type: String,
            default: ''
        },
        lugar_trabajo: {
            type: String,
            default: ''
        },
        direccion_trabajo: {
            type: String,
            default: '',
        },
        telefono_trabajo: {
            type: String,
            default: '',
            trim: true,
        },
        representados:[
            {
               cedula: String,
               nombres: String,
               apellidos: String,
               _id_estudiante: String
            }
        ],
        abono:{
            type:Number,
            default:0,
        },
        abono_dolar:{
            type:Number,
            default:0,
        },
        password:String,
        actualizado:String,
        seq_chs:{
          type: Number,
          default:0,
          set:(v)=>{
               return Number(v)+1;
          }
        },
        cod_chs: {
          type: String,
          unique: true
        },
        hash_chs: String

    }, {
        timestamps: true
    }
);
representanteSchema.index({'$**': 'text'});
// representanteSchema.index({cedula: 'text', nombres: 'text', apellidos:'text'});
module.exports = model('Representante', representanteSchema);
