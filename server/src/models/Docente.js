const { Schema, model } = require('mongoose');

const docenteSchema = new Schema(
    {
        cedula: {
            type: String,
            trim: true,
            lowercase: true
        },
        sexo:{
            type: String,
            default: ''
        },
        apellidos: {
            type: String,
            default: '',
            trim: true,
        },
        nombres: {
            type: String,
            default: '',
            trim: true,
        },
        correo:{
            type: String,
            default: '',
            lowercase: true,
            trim: true,
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
        grado:[
            {id:Number, grado: String, seccion:String}
        ],
        asignatura:[
            {id:Number ,asignatura: String, grado: String}
        ],
        password:String,
        actualizado: String,
        filename: [String],
        fileid: [String],
        hora_lunes: {default : 0, type:Number},
        hora_martes: {default : 0, type:Number},
        hora_miercoles: {default : 0, type:Number},
        hora_jueves: {default : 0, type:Number},
        hora_viernes: {default : 0, type:Number},
        hora_sabado: {default : 0, type:Number},
        hora_domingo: {default : 0, type:Number},
        valor: {default : 0, type:Number},
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
    });
    docenteSchema.index({'$**': 'text'});
module.exports = model('Docente', docenteSchema);
