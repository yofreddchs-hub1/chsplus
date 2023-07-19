const { Schema, model } = require('mongoose');

const estudianteSchema = new Schema(
    {
        cedula: {
            type: String,
            trim: true,
            lowercase: true
        },
        cedula_estudiante: {
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
        grado: {
            type: String,
            default: ''
        },
        seccion:{
            type: String,
            default: ''
        },
        tipo_sangre:{
            type: String,
            default: ''
        },
        estatura: {
            type: String,
            default: ''
        },
        peso: {
            type: String,
            default: ''
        },
        alergias: {
            type: String,
            default: ''
        },
        impedimentos:{
            type: String,
            default: ''
        },
        actividades:{
            type: String,
            default: ''
        },
        traslado:{
            type: String,
            default: ''
        },
        persona_autorizada:{
            type: String,
            default: ''
        },
        persona_autorizada_cedula:{
            type: String,
            default: ''
        },
        persona_autorizada_afinidad:{
            type: String,
            default: ''
        },
        representante_cedula:{
            type: String,
            default: '',
            trim: true,
        },
        representante_nombres:{
            type: String,
            default: '',
            trim: true,
        },
        representante_apellidos:{
            type: String,
            default: '',
            trim: true,
        },
        medico:{
            type: String,
            default: '',
            trim: true,
        },
        beca:{
            type: Number,
            default: 0,
        },
        password:String,
        actualizado: String,
        periodo:[],
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
        _id_representante: String

    }, {
        timestamps: true
    });
    estudianteSchema.index({'$**': 'text'});
module.exports = model('Estudiante', estudianteSchema);
