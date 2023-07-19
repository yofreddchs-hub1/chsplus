const { Schema, model } = require('mongoose');

const mensualidadSchema = new Schema(
    {
        periodo: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        cedula_estudiante:  {
            type: String,
            trim: true,
        },
        nombres:{
            type: String,
            trim: true,
        },
        apellidos:{
            type: String,
            trim: true,
        },
        cedula_representante: {
            type: String,
            trim: true,
        },
        inscripcion: {
            type: Boolean,
            default : false
        },
        inscripciont: {
            type: String,
            default : ""
        },
        septiembre: {
            type: Boolean,
            default : false
        },
        septiembret: {
            type: String,
            default : ""
        },
        octubre: {
            type: Boolean,
            default : false
        },
        octubret: {
            type: String,
            default : ""
        },
        noviembre:{
            type: Boolean,
            default : false
        },
        noviembret: {
            type: String,
            default : ""
        },
        diciembre: {
            type: Boolean,
            default : false
        },
        diciembret: {
            type: String,
            default : ""
        },
        enero: {
            type: Boolean,
            default : false
        },
        enerot: {
            type: String,
            default : ""
        },
        febrero: {
            type: Boolean,
            default : false
        },
        febrerot: {
            type: String,
            default : ""
        },
        marzo: {
            type: Boolean,
            default : false
        },
        marzot: {
            type: String,
            default : ""
        },
        abril: {
            type: Boolean,
            default : false
        },
        abrilt: {
            type: String,
            default : ""
        },
        mayo: {
            type: Boolean,
            default : false
        },
        mayot: {
            type: String,
            default : ""
        },
        junio: {
            type: Boolean,
            default : false
        },
        juniot: {
            type: String,
            default : ""
        },
        julio: {
            type: Boolean,
            default : false
        },
        juliot: {
            type: String,
            default : ""
        },
        agosto: {
            type: Boolean,
            default : false
        },
        agostot: {
            type: String,
            default : ""
        },
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
        hash_chs: String,
        _id_estudiante: String,
        _id_representante: String

    }, {
        timestamps: true
    });
    mensualidadSchema.index({'$**': 'text'});
module.exports = model('Mensualidad', mensualidadSchema);
