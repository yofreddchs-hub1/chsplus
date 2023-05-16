const { Schema, model } = require('mongoose');

const actividad_estudianteSchema = new Schema(
    {
        periodo:  {
            type: String,
            trim: true,
        },
        asignatura:  {
            type: String,
            trim: true,
        },
        grado:  {
            type: String,
            trim: true,
        },
        cedula_estudiante: {
            type: String,
            trim: true,
            lowercase: true
        },
        nombres_estudiante:  {
            type: String,
            trim: true,
        },
        apellidos_estudiante:  {
            type: String,
            trim: true,
        },
        cedula_docente: {
            type: String,
            trim: true,
            lowercase: true
        },
        nombres_docente:  {
            type: String,
            trim: true,
        },
        apellidos_docente:  {
            type: String,
            trim: true,
        },
        actividad:  {
            type: String,
            trim: true,
        },
        nota:  {
            type: Number,
        },
        ponderacion:  {
            type: Number,
        },
        _id_estudiante: String,
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
    actividad_estudianteSchema.index({'$**': 'text'});
module.exports = model('Actividad_estudiante', actividad_estudianteSchema);
