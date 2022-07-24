const colegioCtrl = {};
const path = require('path');
const fs = require('fs');
const { Hash_texto, Hash_password } = require('../servicios/encriptado');
const { Codigo_chs, Hash_chs} = require('../servicios/conexiones');
const {Verifica_api, Tablas} = require('../controllers/api.controller');


Buscar = async(tabla, dato, campo='_id') =>{
    const BD = require(`../models/${tabla}`);
    let resultado = await BD.find({$text: {$search: dato, $caseSensitive: true}})
    if (resultado.length!==0){
        console.log(campo.indexOf('.'))
        if (campo.indexOf('.')===-1){
            resultado= resultado.filter(f=> f.valores[campo]===dato);
        }else{
            campo= campo.split('.')
            resultado= resultado.filter(f=> f.valores[campo[0]][campo[1]]===dato);
        }
    }
    return resultado;
}

Guardar_Mensualidades = async(Mensualidades, User) =>{
    await Tablas('colegio_mensualidad');
    const Mensualidad= require(`../models/colegio_mensualidad`);
    let mensualidades= [];
    for (var i=0; i<Mensualidades.meses.length; i++){
        const mes= Mensualidades.meses[i];
        const pos = mensualidades.findIndex(f=> f._id_estudiante===mes._id && f.periodo===mes.periodo)
        if (pos===-1){
            mensualidades= [...mensualidades,
                {
                    _id_estudiante:mes._id, cedula:mes.cedula, nombres:mes.nombres, apellidos:mes.apellidos,
                    periodo: mes.periodo, [mes.value]: true, [`mensaje-${mes.value}`]:'Cancelado'
                }
            ]
        }else{
            mensualidades[pos]={...mensualidades[pos],
                [mes.value]: true, [`mensaje-${mes.value}`]:'Cancelado'
            }
        }
    }
    for (var i=0; i<mensualidades.length; i++){
        const mensual= mensualidades[i];
        let mensualidad = await Buscar('colegio_mensualidad', mensual._id_estudiante, '_id_estudiante');
        mensualidad= mensualidad.filter(f=> f.valores.periodo===mensual.periodo);
        if (mensualidad.length===0){
            let valores= mensual;
            let cod_chs = await Codigo_chs({...valores});
            const hash_chs = await Hash_chs({...valores, cod_chs})
            const Nuevo = new Mensualidad({valores, cod_chs, hash_chs, actualizado:User.username});
            await Nuevo.save();

        }else{
            let dato=mensualidad[0];
            let valores = dato.valores;
            valores={...valores, ...mensual}
            const hash_chs = await Hash_chs({...valores, cod_chs: dato.cod_chs})
            await Mensualidad.updateOne({_id:dato._id},{valores, hash_chs, actualizado:User.username},{ upsert: true });
        }
    }
}

colegioCtrl.Mensualidades = async (req, res) =>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    const igual= await Verifica_api(Api, true);
    if (hashn===hash && igual) {
        datos= JSON.parse(datos);
        let mensualidades=[];
        for (var i=0; i<datos.Representados.length; i++){
            const estu= datos.Representados[i];
            let mensualidad = await Buscar('colegio_mensualidad', estu._id, '_id_estudiante');
            mensualidades=[...mensualidades, ...mensualidad];
        }
        res.json({Respuesta:'Ok', mensualidades});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}

colegioCtrl.Solvencias = async (req, res) =>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    const igual= await Verifica_api(Api, true);
    if (hashn===hash && igual) {
        datos= JSON.parse(datos);
        let estudiantes = await Buscar('colegio_estudiante', datos.grado, 'grado.titulo');
        estudiantes = estudiantes.filter(f=> f.valores.seccion && f.valores.seccion.titulo===datos.seccion && f.valores.estatus && f.valores.estatus.value==='inscrito');
        estudiantes = estudiantes.map(val=>{
            return {...val.valores}
        })
        let mensualidades=[];
        for (var i=0; i<estudiantes.length; i++){
            const estu= estudiantes[i];
            let mensualidad = await Buscar('colegio_mensualidad', estu._id, '_id_estudiante');
            mensualidad = mensualidad.map(val=>{
                return {...val.valores}
            })
            mensualidad = mensualidad.filter(f=> f.periodo===datos.periodo);
            mensualidades=[...mensualidades, ...mensualidad];
        }
        res.json({Respuesta:'Ok', estudiantes, mensualidades});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}
colegioCtrl.EnviarPago = async (req, res) =>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    const igual= await Verifica_api(Api, true);
    if (hashn===hash && igual) {
        await Tablas('colegio_representante');
        await Tablas('colegio_recibo');
        const Representante = require(`../models/colegio_representante`);
        const Recibo = require(`../models/colegio_recibo`);
        datos= JSON.parse(datos);
        let representante = await Representante.findOne({_id: datos.Representante})
        representante.valores.abono= datos.Totales.abono.toFixed(3);
        representante.valores.abonod= datos.Totales.abonod.toFixed(2);

        let hash_chs = await Hash_chs({...representante.valores, cod_chs: representante.cod_chs})
        await Representante.updateOne({_id:representante._id},{valores:representante.valores, hash_chs, actualizado:User.username},{ upsert: true });
        //En mensualidades
        await Guardar_Mensualidades(datos.Mensualidades, User)
        
        //En Recibo
        
        let ultimo = await Recibo.find().limit(1).sort({$natural:-1});
        if (ultimo.length===0){
            const direct= __dirname.replace('controllers',`data${path.sep}datos.js`);
            let data = JSON.parse(fs.readFileSync(direct, 'utf8'));
            ultimo=data.Recibo
        }else{
            ultimo=Number(ultimo[0].valores.recibo)+1;
        }
        let recibo={
            recibo:ultimo,
            representante:representante.valores,
            Formas_pago: datos.Formas_pago,
            mensualidades:datos.Mensualidades,
            subtotalvalor: datos.Subtotalvalor,
            totales: datos.Totales,
            valorcambio: datos.valorCambio
        }
        let cod_chs = await Codigo_chs({...recibo});
        hash_chs = await Hash_chs({...recibo, cod_chs})
        const Nuevo = new Recibo({valores:recibo, cod_chs, hash_chs, actualizado:User.username});
        await Nuevo.save();
        res.json({Respuesta:'Ok', dato:Nuevo});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}

colegioCtrl.Resumen = async (req, res)=>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    const igual= await Verifica_api(Api, true);
    if (hashn===hash && igual) {
        datos= JSON.parse(datos);
        let mensualidad = await Buscar('colegio_mensualidad', datos._id, '_id_estudiante');
        mensualidad = mensualidad.map(val=>{
            return {...val.valores}
        })
        let recibos = await Buscar('colegio_recibo', datos.representante._id, 'representante._id');
        recibos= recibos.filter(f=> f.valores.mensualidades.meses.filter(fi=> fi._id===datos._id));
        res.json({Respuesta:'Ok', datos, mensualidad, recibos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}
module.exports = colegioCtrl;