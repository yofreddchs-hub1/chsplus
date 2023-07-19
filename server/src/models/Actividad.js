const { Schema, model } = require('mongoose');

const actividadSchema = new Schema(
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
        cedula: {
            type: String,
            trim: true,
            lowercase: true
        },
        nombres:  {
            type: String,
            trim: true,
        },
        apellidos:  {
            type: String,
            trim: true,
        },
        _id_docente: String,
        titulo:  {
            type: String,
            trim: true,
        },
        descripcion:  {
            type: String,
            trim: true,
        },
        link:  {
            type: String,
            trim: true,
        },
        ponderacion:  {
            type: Number,
            default:0,
        },
        fecha_inicio:{
            type: String,
            trim: true,
        },
        fecha_entrega:  {
            type: String,
            trim: true,
        },
        activa: Boolean,
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
    actividadSchema.index({'$**': 'text'});
module.exports = model('Actividad', actividadSchema);
