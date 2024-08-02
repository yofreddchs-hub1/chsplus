const colegioCtrl = {};
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const { Hash_texto, Hash_password } = require('../servicios/encriptado');
const { Codigo_chs, Hash_chs} = require('../servicios/conexiones');
const {Verifica_api, Tablas} = require('../controllers/api.controller');
const {Model} = require('../database/model');

// valores de las tablas para el sistema de colegio
// valores para uecla
const tabla_mensualidad = 'uecla_Mensualidad';//'colegio_mensualidad'; 
const tabla_recibo = 'uecla_Recibo';//'colegio_recibo';
const tabla_estudiante = 'uecla_Estudiante'; //'colegio_estudiante'
const tabla_representante = 'uecla_Representante'; // 'colegio_representante'
const tabla_pago = 'uecla_Pago'; // 'colegio_pago'
const tabla_referencia= 'uecla_Referencia';
const tabla_whatsapp_referencia = 'uecla_Whatsapp_Capture';
const tabla_inscripcion ='uecla_Inscripcion';
const tabla_horario = 'uecla_horario';
const tabla_aula = 'uecla_Aula';
const tabla_nota = 'uecla_nota';
const tabla_asignatura= 'uecla_asignatura';
const tabla_docente = 'uecla_docente';
const tabla_evaluacion = 'uecla_evaluacion';

Buscar = async(tabla, dato, Api, campo='_id') =>{
    const BD = await Model(Api, tabla);//require(`../models/${tabla}`);
    let resultado = dato===undefined ? await BD.find() : await BD.find({[`valores.${campo}`]:dato})//BD.find({[`${campo}`]:dato})//await BD.find({$text: {$search: dato, $caseSensitive: true}})
    if (resultado.length!==0){
        // console.log(campo.indexOf('.'))
        if (campo.indexOf('.')===-1){
            resultado= resultado.filter(f=> f.valores[campo]===dato);
        }else{
            campo= campo.split('.')
            if (dato!==undefined)
                resultado= resultado.filter(f=> f.valores[campo[0]][campo[1]]===dato);
        }
    }
    return resultado;
}

Guardar_Mensualidades = async(Mensualidades, User, Api) =>{
    const Mensualidad= await Model(Api, tabla_mensualidad);//require(`../models/${tabla_mensualidad}`);
    const Estudiante = await Model(Api, tabla_estudiante);//require(`../models/uecla_Estudiante`);
    const Inscripcion = await Model(Api, tabla_inscripcion);//require(`../models/uecla_Inscripcion`);
    let inscripcion = await Inscripcion.find();
    inscripcion= inscripcion.sort((a,b) => a.valores.periodo> b.valores.periodo ? -1 : 1).filter(f=> f.valores.estatus);
    // console.log(Mensualidades)
    let mensualidades= [];
    for (var i=0; i<Mensualidades.meses.length; i++){
        const mes= Mensualidades.meses[i];
        if (mes.value==='inscripcion' && inscripcion.length!==0 && inscripcion[0].valores.periodo===mes.periodo){
            // console.log('por aqui', mes.value, mes.periodo)
            let estudiante = await Estudiante.findOne({_id:mes._id});
            estudiante.valores.estatus={
              _id :1,
              titulo :"Inscrito",
              value: "inscrito",
              permisos:""
            }
            // console.log(estudiante);
            const hash_chs = await Hash_chs({...estudiante.valores, cod_chs: estudiante.cod_chs})
            // await Mensualidad.updateOne({_id:estudiante._id},{valores:estudiante.valores, hash_chs, actualizado:User.username},{ upsert: true });
            await Estudiante.updateOne({_id:estudiante._id},{valores:estudiante.valores, hash_chs, actualizado:User.username},{ upsert: true });
        }
        const pos = mensualidades.findIndex(f=> (f._id_estudiante===mes._id || f.cedula===mes.cedula) && f.periodo===mes.periodo)
        if (pos===-1){
            mensualidades= [...mensualidades,
                {
                    _id_estudiante:mes._id, cedula:mes.cedula, nombres:mes.nombres, apellidos:mes.apellidos,
                    grado:mes.grado, seccion:mes.seccion,
                    periodo: mes.periodo, [mes.value]: true, [`mensaje-${mes.value}`]:'Cancelado'
                }
            ]
        }else{
            mensualidades[pos]={...mensualidades[pos],
                [mes.value]: true, [`mensaje-${mes.value}`]:'Cancelado',
                _id_estudiante:mes._id
            }
        }
    }
    // console.log(mensualidades)
    for (var i=0; i<mensualidades.length; i++){
        const mensual= mensualidades[i];
        let mensualidad = await Ver_Mensualidades({cedula:mensual.cedula, _id:mensual._id_estudiante}, Api); //await Buscar(tabla_mensualidad, mensual._id_estudiante, Api, '_id_estudiante');

        // console.log('........>>>>>>>', mensualidad)
        mensualidad= mensualidad.filter(f=> f.valores.periodo===mensual.periodo);
        if (mensualidad.length===0){
            let valores= mensual;
            let cod_chs = await Codigo_chs({...valores, fecha: new Date()});
            cod_chs= cod_chs===null ? new Date() : cod_chs;
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
        mensualidades= await colegioCtrl.Resumen_Mensualidades(datos.Representados, Api);
        // for (var i=0; i<datos.Representados.length; i++){
        //     const estu= datos.Representados[i];
        //     let mensualidad =await Ver_Mensualidades(estu,Api); // await Buscar(tabla_mensualidad, estu._id, Api, '_id_estudiante');
        //     mensualidades=[...mensualidades, ...mensualidad];
        //     // mensualidad = await Buscar('uecla_Mensualidad', estu.cedula, Api,'cedula');
        //     // mensualidad.map(men=>{
        //     //     const pos= mensualidades.findIndex(f=>f.valores.periodo===men.valores.periodo);
        //     //     if (pos===-1){
        //     //         mensualidades=[...mensualidades, {
        //     //             _id:men._id,
        //     //             actualizado: men.actualizado,
        //     //             cod_chs:men.cod_chs,
        //     //             createdAt: men.createdAt,
        //     //             hash_chs: men.hash_chs,
        //     //             seq_chs:men.seq_chs,
        //     //             updatedAt:men.updatedAt, 
        //     //             valores:{...men.valores, _id_estudiante:estu._id}
        //     //         }];
        //     //     }
        //     // })
        // }
        
        res.json({Respuesta:'Ok', ...mensualidades});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}

colegioCtrl.Resumen_Mensualidades = async (Representados, Api)=>{
    let mensualidades=[];
    let solventes={}
    Representados= Representados===null ? [] : Representados;
    for (var i=0; i<Representados.length; i++){
        const estu= Representados[i];
        if(solventes[estu._id]===undefined){
            solventes[estu._id]={solvente: true, periodos:[]};
        }
        let mensualidad =await Ver_Mensualidades(estu,Api); // await Buscar(tabla_mensualidad, estu._id, Api, '_id_estudiante');
        // const lista = ['inscripcion','septiembre','octubre','noviembre','diciembre','enero','febrero','marzo','abril','mayo','junio','julio','agosto']
        const lista = ['inscripcion','enero','febrero','marzo','abril','mayo','junio','julio','agosto', 'septiembre','octubre','noviembre','diciembre'];
        let solvente = true;
        for (var j=0; j<mensualidad.length;j++){
            const ano = mensualidad[j].valores;
            // console.log(ano)
            let pendiente = {solvente:true, periodo:ano.periodo, pendiente:[]}
            for(var k=0;k<lista.length;k++){
                const val = lista[k];
                if(!ano[val]){
                    pendiente.solvente=false;
                    pendiente.pendiente=[...pendiente.pendiente, val];
                    solvente=false;
                }
                
            }
            solventes[estu._id].periodos=[...solventes[estu._id].periodos,pendiente].sort((a,b)=>a.periodo>b.periodo ? 1 : -1)

            if (solventes[estu._id].solvente && !solvente){
                solventes[estu._id].solvente=false
            }
        }
        mensualidades=[...mensualidades, ...mensualidad];
    }
    
    return {mensualidades, solventes}
}
const Ver_Mensualidades = async(estu, Api)=>{
    let mensualidades=[];
    let mensualidad = await Buscar(tabla_mensualidad, estu._id, Api, '_id_estudiante');
    mensualidades=[...mensualidades, ...mensualidad];
    mensualidad = await Buscar(tabla_mensualidad, estu.cedula, Api, 'cedula');
    // mensualidad.map(men=>{
    for(var i=0;i<mensualidad.length;i++){
        const men= mensualidad[i];
        const pos= mensualidades.findIndex(f=>f.valores.periodo===men.valores.periodo);
        if (pos===-1){
            mensualidades=[...mensualidades, {
                _id:men._id,
                actualizado: men.actualizado,
                cod_chs:men.cod_chs,
                createdAt: men.createdAt,
                hash_chs: men.hash_chs,
                seq_chs:men.seq_chs,
                updatedAt:men.updatedAt, 
                valores:{...men.valores, _id_estudiante:estu._id}
            }];
        }
    }//)
    return mensualidades;
}
Actulizar_Inscripcion = async( Api)=>{
    const Estudiante = await Model(Api, tabla_estudiante);
    const Inscripcion = await Model(Api, tabla_inscripcion);
    const Mensualidad = await Model(Api,tabla_mensualidad);
    let inscripcion = await Inscripcion.find();
    inscripcion= inscripcion.sort((a,b) => a.valores.periodo> b.valores.periodo ? -1 : 1);
    inscripcion = inscripcion.length!==0 ? inscripcion[0].valores.periodo : '';
    const periodo = inscripcion;
    let estudiantes = await Estudiante.find({'valores.estatus':undefined});
    let mensualidades = await Mensualidad.find({'valores.periodo':periodo});
    let sincronizado=[{
        titulo:tabla_estudiante,
        progreso: 0*100 / Number(estudiantes.length),
        guardar: estudiantes.length,
        guardado: 0
    }]; 
    console.log('Actualizar inscripcion de ', estudiantes.length, mensualidades.length);
    global.io.emit('Sincronizando_uecla',{tabla:tabla_estudiante, guardar:estudiantes.length, guardado:0, sincronizado}) //datos:resultado})
    for (var i=0; i< estudiantes.length;i++){
        let f = estudiantes[i];
        if (!f.valores.estatus){
            let guardar=false;
            if (['Graduado','graduado','GRADUADO'].indexOf(f.valores.grado)!==-1){
                f.valores.estatus={_id: 2, titulo: "Graduado", value: "graduado", permisos: ""};
                guardar=true;
            }else if (['Retirado','retirado','RETIRADO'].indexOf(f.valores.grado)!==-1){
                f.valores.estatus={_id: 3, titulo: "Retirado", value: "retirado", permisos: ""};
                guardar=true;
            }else{
                // let mensualidad = await Ver_Mensualidades(f, Api);
                const pos = mensualidades.findIndex(data=> data.valores._id===f._id || data.valores.cedula===f.valores.cedula);
                // console.log(pos, pos!==-1 ? mensualidades[pos].valores.inscripcion : false);
                // if (mensualidad.length>1)
                //     console.log(pos, i,'Meses: '+mensualidad.length, mensualidad.length!==0 ? mensualidad[mensualidad.length-1].valores.periodo : 'no tiene', periodo, f.valores.grado, f._id)
                if (pos!==-1 && mensualidades[pos].valores.inscripcion){
                    // console.log(pos, i);
                    f.valores.estatus={_id: 1, titulo: "Inscrito", value: "inscrito", permisos: ""};
                    guardar=true;
                }
                // else{
                //     f.valores.estatus={_id: 3, titulo: "Retirado", value: "retirado", permisos: ""};
                //     // guardar=true;
                // }
            }
            if (guardar){
                const hash_chs = await Hash_chs({...f});
                await Estudiante.updateOne({_id:f._id},{valores:f.valores, hash_chs, actualizado:'Sistema_actualizacion_inscripcion'},{ upsert: true });
            }    
        }
        sincronizado[0].progreso= Number(i+1)*100 / Number(estudiantes.length);
        sincronizado[0].guardar = estudiantes.length;
        sincronizado[0].guardado = i+1;
        global.io.emit('Sincronizando_uecla',{tabla:tabla_estudiante, guardar:estudiantes.length, guardado:i+1, sincronizado})
    }
    console.log('>>>>>>>>>>finalizado>>>>>>>>>')
    // 
                // 
                
                //{ _id: 1, titulo: 'Inscrito', value: 'inscrito', permisos: '' }
}
colegioCtrl.Verificar_Inscripcion = async(req,res)=>{
    let {User, Api, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api}));
    const igual= await Verifica_api(Api, true);
    if (hashn===hash && igual) {
        Actulizar_Inscripcion(Api);
        res.json({Respuesta:'Ok' });
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
        const Mensualidad = await Model(Api,tabla_mensualidad);
        let Mensualidades = await Mensualidad.find({'valores.periodo':datos.periodo});
        let estudiantes = await Buscar(tabla_estudiante, datos.grado, Api, 'grado.titulo');
        let nuevo=[];
        for (var i=0;i<estudiantes.length; i++){
            let f = estudiantes[i];
            if (datos.seccion && f.valores.seccion && f.valores.seccion.titulo===datos.seccion 
                && f.valores.estatus && f.valores.estatus.value==='inscrito'
                || datos.seccion===undefined && f.valores.estatus && f.valores.estatus.value==='inscrito'){
                nuevo=[...nuevo, f.valores]
            }
        }

        estudiantes= [...nuevo];
        let mensualidades=[];
        for (var i=0; i<estudiantes.length; i++){
            const estu= estudiantes[i];
            
            const pos = Mensualidades.findIndex(f=>f.valores._id_estudiante===estu._id || f.valores.cedula===estu.cedula );
            let mensualidad = {}
            if (pos!==-1){
                mensualidad = {_id:Mensualidades[pos]._id, ...Mensualidades[pos].valores}
                mensualidades=[...mensualidades, mensualidad];
            }
            // let mensualidad = await Buscar(tabla_mensualidad, estu._id, '_id_estudiante');
            // let mensualidad = await Ver_Mensualidades(estu, Api);
            // mensualidad = mensualidad.map(val=>{
                // return {_id:val._id, ...val.valores}
            // })
            // mensualidad = mensualidad.filter(f=> f.periodo===datos.periodo);
            // mensualidades=[...mensualidades, mensualidad];
        }
       
        res.json({Respuesta:'Ok', estudiantes, mensualidades});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}

colegioCtrl.Notas = async (req, res) =>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    const igual= await Verifica_api(Api, true);
    if (hashn===hash && igual) {
        datos= JSON.parse(datos);
        const Mensualidad = await Model(Api,tabla_mensualidad);
        const Notas = await Model(Api,tabla_nota);
        const Evaluaciones = await Model(Api,tabla_evaluacion);
        let Mensualidades = await Mensualidad.find({'valores.periodo':datos.periodo});
        let estudiantes = await Buscar(tabla_estudiante, datos.grado, Api, 'grado.titulo');
        let asignaturas = await Buscar(tabla_asignatura, datos.grado, Api, 'grado.titulo');
        let nuevanotas={}
        let evaluaciones= []
        if (datos.tipo==='docente'){
            evaluaciones= await Evaluaciones.find(
                {
                    $and:[
                        {'valores.periodo':datos.periodo},
                        {'valores.grado':datos.grado},
                        {'valores.seccion':datos.seccion},
                        {'valores.docente._id':datos.docente._id},
                        {'valores.asignatura._id':datos.asignatura._id}
                    ]
                }
            );
            evaluaciones = evaluaciones.map(f=>{
                return {
                    _id:f._id, ...f.valores, titulo:f.valores.nombre, field:`nota-${f._id}`, createdAt: f.createdAt
                }
            }).sort((a,b) => a.lapso._id> b.lapso._id ? 1 : -1);
        }
        
        asignaturas = asignaturas.map(f=>{
            return {_id:f._id, ...f.valores, titulo:f.valores.abreviacion ? f.valores.abreviacion : f.valores.asignatura  , field:`nota-${f._id}`}
        });
        let lapso=null;
        let titulos=[];
        let titulosa=[];
        if (datos.tipo==='seccion'){
            // titulos = asignaturas
            for (var i=0; i<asignaturas.length; i++){
                const asig= asignaturas[i];
                titulos=[...titulos,
                    {...asig, titulo: `${asig.titulo} 1er LAPSO`,field:`1lapso-${asig._id}`},
                    {...asig, titulo: `${asig.titulo} 2do LAPSO`,field:`2lapso-${asig._id}`},
                    {...asig, titulo: `${asig.titulo} 3er LAPSO`,field:`3lapso-${asig._id}`}
                ]
            }
        }else{
            evaluaciones.map((val, i)=>{
                if (lapso===null){
                    lapso=val.lapso;
                }
                if (lapso.value===val.lapso.value){
                    titulosa=[...titulosa,val] 
                }
                if (lapso.value!==val.lapso.value){
                    titulos=[...titulos, ...titulosa.sort((a,b) => a.createdAt> b.createdAt ? 1 : -1),
                        {
                            _id:`Error-${lapso.value}`,
                            titulo:`${lapso.titulo}`,
                            field:`${lapso.value}-${datos.asignatura._id}`
                        },
                    ];
                    titulosa=[val];
                    lapso=val.lapso;
                }
                if (i===evaluaciones.length-1){
                    titulos=[...titulos, ...titulosa.sort((a,b) => a.createdAt> b.createdAt ? 1 : -1),
                        {
                            _id:`Error-${lapso.value}`,
                            titulo:`${lapso.titulo}`,
                            field:`${lapso.value}-${datos.asignatura._id}`
    
                        }
                    ]
                }
            });
        }
        // let titulos = datos.tipo==='seccion' 
        //     ?   asignaturas   
        //     :   [...evaluaciones,
        //             {
        //                 _id:'Error-total',
        //                 titulo:'Total',
        //                 field:`total-${datos.asignatura._id}`

        //             }
        //         ];
        
        titulos.map(f=>{
            nuevanotas[f._id]={titulo:f.titulo, nota:null};
        })
        
        let nuevo=[];
        for (var i=0;i<estudiantes.length; i++){
            let f = estudiantes[i];
            if (datos.seccion && f.valores.seccion && f.valores.seccion.titulo===datos.seccion 
                && f.valores.estatus && f.valores.estatus.value==='inscrito'
                || datos.seccion===undefined && f.valores.estatus && f.valores.estatus.value==='inscrito'){
                nuevo=[...nuevo, f.valores]
            }
        }

        estudiantes= [...nuevo];
        let seccion=[];
        
        for (var i=0; i<estudiantes.length; i++){
            const estu= estudiantes[i];
            const pos = Mensualidades.findIndex(f=>f.valores._id_estudiante===estu._id || f.valores.cedula===estu.cedula );
            if (pos!==-1){
                let Asigna ={} 
                let nota = await Notas.find({
                    $and:[
                        {"valores._id_estudiante":estu._id},
                        {'valores.periodo':datos.periodo},
                        // {'valores.grado':datos.grado},
                        // {'valores.seccion':datos.seccion},
                        // {'valores.asignatura._id':datos.asignatura._id},
                        // {'valores.docente._id':datos.docente._id},
                    ]
                });
                nota = nota.map(val=>{
                    return {_id:val._id, ...val.valores}
                })
                const posnota = datos.asignatura ?  nota.findIndex(item=> item.asignatura._id===datos.asignatura._id) : -1;
                if (datos.tipo==='seccion'){
                    // console.log(nota)
                    Object.keys(nuevanotas).map(val=>{
                        const materia = nuevanotas[val];
                        
                        const posn= nota.findIndex(item=> item.asignatura._id===val);
                        if (posn!==-1){
                            Asigna[`1lapso-${val}`]=nota[posn][`1lapso-${val}`];
                            Asigna[`2lapso-${val}`]=nota[posn][`2lapso-${val}`];
                            Asigna[`3lapso-${val}`]=nota[posn][`3lapso-${val}`];
                        }else{
                            Asigna[`1lapso-${val}`]= materia.nota;
                            Asigna[`2lapso-${val}`]= materia.nota;
                            Asigna[`3lapso-${val}`]= materia.nota;
                        }
                        // Asigna[`nota-${val}`]=nota===null ? materia.nota : nota[`nota-${val}`];
                        // Asigna[`nota-${val}`]= materia.nota;
                        // Asigna[materia.titulo]=materia.nota;
                    })
                    
                }else{
                    Object.keys(nuevanotas).map(val=>{
                        const materia = nuevanotas[val];
                        const posn= nota.findIndex(item=> item[`nota-${val}`]);
                        if (posn!==-1){
                            Asigna[`nota-${val}`]=nota[posn][`nota-${val}`];
                        }else{
                            Asigna[`nota-${val}`]= materia.nota;
                        }
                        // Asigna[`nota-${val}`]=nota===null ? materia.nota : nota[`nota-${val}`];
                        // Asigna[`nota-${val}`]= materia.nota;
                        // Asigna[materia.titulo]=materia.nota;
                    })
                }
                if (posnota!==-1){
                    // Asigna[`total-${datos.asignatura._id}`]=nota[posnota][`total-${datos.asignatura._id}`];
                    Asigna={...Asigna, ...nota[posnota]}
                }
                // nota = nota===null ? nota : {_id:nota._id , ...nota.valores}

                
                // console.log(Asigna)
                seccion=[...seccion, 
                    {
                        _id: posnota!==-1 ? nota[posnota]._id : undefined,
                        _id_estudiante: estu._id, periodo:datos.periodo,
                        cedula:estu.cedula,
                        nombres:estu.nombres, apellidos:estu.apellidos,
                        grado:estu.grado, seccion:estu.seccion,
                        ...Asigna
                    }
                ];
            }
            
        }
        // for (var i=0; i<seccion.length; i++){
        //     const estu= seccion[i];
        //     const nota = await Notas.findOne({
        //         $and:[
        //             {"valores._id_estudiante":estu._id_estudiante},
        //             {'valores.periodo':datos.periodo},
        //             // {'valores.grado':datos.grado},
        //             // {'valores.seccion':datos.seccion},
        //             {'valores.asignatura._id':datos.asignatura._id},
        //             // {'valores.docente._id':datos.docente._id},
        //         ]
        //     });
        //     // console.log(nota)
        // }
        res.json({Respuesta:'Ok', estudiantes, seccion, asignaturas, nuevanotas, titulos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}

colegioCtrl.EnviarPago = async (req, res) =>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    const igual= await Verifica_api(Api, true);
    const fecha = new Date();
    if (hashn===hash && igual) {
        // await Tablas(tabla_representante);
        // await Tablas(tabla_recibo);
        const Representante = await Model(Api, tabla_representante);//require(`../models/${tabla_representante}`);
        const Recibo = await Model(Api, tabla_recibo);//require(`../models/${tabla_recibo}`);
        const Pago = await Model(Api, tabla_pago); 
        datos= JSON.parse(datos);
        let representante = await Representante.findOne({_id: datos.Representante});
       
        let datonuevo = {...datos};
        datonuevo.fecha = new Date();
        datonuevo.Data = {
            cedula: representante.valores.cedula, 
            nombres:representante.valores.nombres, 
            apellidos:representante.valores.apellidos
        }
        // console.log('>>>>>>>>>>>>>>>>>>>',datos);
        if (datos.pago===true){
            datonuevo.estatus = '0';
            let cod_chs = await Codigo_chs({...datonuevo,fecha: new Date() });
            cod_chs= cod_chs===null ? new Date() : cod_chs;
            let hash_chs = await Hash_chs({...datonuevo, cod_chs})
            const Nuevo = new Pago({valores:datonuevo, fecha:datonuevo.fecha, cod_chs, hash_chs, actualizado:User.username});
            await Nuevo.save();

            res.json({Respuesta:'Ok', pagoEnviado: true, dato:Nuevo});
            global.io.emit('ActualizarPago','Pendiente')
            return
        }else if(datos.id_pago!==undefined && datos.Pendiente==='Aprobado'){
            // await Pago.deleteOne({_id:datos.id_pago});
            await Pago.updateOne({_id:datos.id_pago},{eliminado:true, actualizado:User.username},{ upsert: true });
        }else if(datos.id_pago!==undefined && datos.Pendiente==='Rechazar'){
            // console.log('Por aqui por rechazado ..............')
            datonuevo.estatus = '1';
            let anterior = await Pago.findOne({_id:datonuevo.id_pago})
            let hash_chs = await Hash_chs({...datonuevo, cod_chs: anterior.cod_chs})
            await Pago.updateOne({_id:datonuevo.id_pago},{valores:datonuevo, hash_chs, actualizado:User.username},{ upsert: true });
            res.json({Respuesta:'Ok', pagoEnviado: true});
            global.io.emit('ActualizarPago','Pendiente')
            return
        }
        representante.valores.abono= Number(datos.Totales.abono).toFixed(3);
        representante.valores.abonod= Number(datos.Totales.abonod).toFixed(2);

        let hash_chs = await Hash_chs({...representante.valores, cod_chs: representante.cod_chs})
        await Representante.updateOne({_id:representante._id},{valores:representante.valores, hash_chs, actualizado:User.username},{ upsert: true });
        if (!datos.venta){
            //En mensualidades
            await Guardar_Mensualidades(datos.Mensualidades, User, Api)
        }
        //En Recibo
        
        let ultimo = await Recibo.find().limit(1).sort({createdAt:-1});//.sort({'valores.recibo':-1});
        if (ultimo.length===0){
            const direct= __dirname.replace('controllers',`data${path.sep}datos.js`);
            let data = JSON.parse(fs.readFileSync(direct, 'utf8'));
            ultimo=data.Recibo
        }else{

            const ultimo1= ultimo[0].valores;
            console.log('Comparar...','Representante:',_.isEqual(ultimo1.representante,representante.valores),'Forma de pago:',_.isEqual(ultimo1.Formas_pago, datos.Formas_pago))
            if (_.isEqual(ultimo1.representante,representante.valores) 
                && _.isEqual(ultimo1.Formas_pago, datos.Formas_pago) 
                && _.isEqual(ultimo1.mensualidades,datos.Mensualidades)
                && _.isEqual(ultimo1.subtotalvalor,datos.Subtotalvalor)
                && _.isEqual(ultimo1.totales,datos.Totales)){
                
                    console.log('El recibo esta repetido........')
                    res.json({Respuesta:'Ok', Mensaje:'Datos enviado ya fueron procesado con aterioridad', dato:ultimo[0]});
                    return
            }
            
            ultimo=Number(ultimo1.recibo)+1;
            // ultimo=Number(ultimo[0].valores.recibo)+1;
        }
        // console.log(chalk.inverse.red(ultimo))
        let recibo={
            recibo:String(ultimo),
            representante:representante.valores,
            Formas_pago: datos.Formas_pago,
            mensualidades:datos.Mensualidades,
            subtotalvalor: datos.Subtotalvalor,
            totales: datos.Totales,
            valorcambio: datos.valorCambio,
            fecha
        }
        let cod_chs = await Codigo_chs({...recibo, fecha: new Date()});
        cod_chs= cod_chs===null ? new Date() : cod_chs;
        hash_chs = await Hash_chs({...recibo, cod_chs})
        const Nuevo = new Recibo({valores:recibo, fecha: moment(fecha).format('YYYY-MM-DD'), cod_chs, hash_chs, actualizado:User.username});
        await Nuevo.save();
        global.io.emit('ActualizarPago','Pagado')
        //Si verificar
        Act_Referencia(User,Api)
        res.json({Respuesta:'Ok', dato:Nuevo});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}

colegioCtrl.Resumen = async (req, res)=>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    // const igual= await Verifica_api(Api, true);
    if (hashn===hash) {// && igual) {
        datos= JSON.parse(datos);
        // let mensualidad = await Buscar(tabla_mensualidad, datos._id, '_id_estudiante');
        let mensualidad = await Ver_Mensualidades(datos, Api);
        mensualidad = mensualidad.map(val=>{
            return {...val.valores}
        }).sort((a,b)=> a.periodo>b.periodo ? -1 : 1);
        let recibos = datos.representante && datos.representante._id  ? await Buscar(tabla_recibo, datos.representante._id, Api, 'representante._id'): [];
        let recibos1 = datos.representante && datos.representante._id  ? await Buscar(tabla_recibo, datos.representante.cedula, Api, 'representante.cedula'): [];
        recibos1.map(val=>{
            const pos = recibos.findIndex(f=>String(f._id)===String(val._id))
            if(pos===-1){
                recibos = [...recibos, val]
            }
            return val
        })
        recibos= recibos.sort((a,b)=> Number(a.valores.recibo)>Number(b.valores.recibo) ? -1 : 1)
        // recibos= recibos.filter(f=> f.valores.mensualidades.meses.filter(fi=> fi._id===datos._id));

        res.json({Respuesta:'Ok', datos, mensualidad, recibos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}

Total_Registro = async(BD)=>{
    let registros = [];
    const cantidad=50;
    const count = await BD.estimatedDocumentCount();
    let pagina = 0;
    while(registros.length<count){
        const dbs = await BD.find().limit(cantidad).skip(pagina*cantidad).sort({fecha:-1}).exec();
        // console.log(dbs[0].fecha, dbs[dbs.length-1].fecha)
        pagina++;
        registros=[...registros, ...dbs]
    }
    
    // console.log(count, registros.length)

}

colegioCtrl.Recibos = async (req, res)=>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    // const igual= await Verifica_api(Api, true);
    if (hashn===hash) {// && igual) {
        datos= JSON.parse(datos);
        var MyDate = new Date();
        // var MyOffset = (MyDate.getTimezoneOffset()) / -60;
        let {inicio,fin}= datos;
        inicio = new Date(inicio)//.toISOString();
        // inicio.setHours(MyOffset,0,0,1);
        // inicio = inicio.toISOString()
        fin = new Date(fin)
        // fin.setHours(23+MyOffset,59,59,999);
        // fin= fin.toISOString();
        inicio= moment(inicio).format('YYYY-MM-DD');
        fin= moment(fin).format('YYYY-MM-DD');
        const BD = await Model(Api, tabla_recibo);
        let recibos =  await BD.find({ fecha: { $gte: inicio, $lte:fin } });
        let nuevo=[]
        for(var i=0; i<recibos.length; i++){
            let data= recibos[i];
            const lista_subtotal=['abono','abonod','total','totald'];
            const lista_totales=['abono','abonod','bolivar','dolar','restand','restan','total','totald'];
            for (var c=0;c<lista_subtotal.length;c++){
                if (typeof data.valores.subtotalvalor[lista_subtotal[c]]==='object'){
                    data.valores.subtotalvalor[lista_subtotal[c]] = Number(String(data.valores.subtotalvalor[lista_subtotal[c]]))
                } 
            }
            for (var c=0;c<lista_totales.length;c++){
                if (typeof data.valores.totales[lista_totales[c]]==='object'){
                    data.valores.totales[lista_totales[c]] = Number(String(data.valores.totales[lista_totales[c]]))
                } 
            }
            nuevo=[...nuevo, data];
        }
        recibos=[...nuevo]
        
        recibos= recibos.sort((a,b)=> Number(a.valores.recibo)>Number(b.valores.recibo) ? -1 : 1)
        // recibos= recibos.filter(f=> f.valores.mensualidades.meses.filter(fi=> fi._id===datos._id));

        res.json({Respuesta:'Ok', datos, recibos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}

Realizar_Sincronizacion = async(datos, User, Api)=>{
    let sincronizado= [...datos.seleccion];
    if (datos.destino==='Nuevo'){
        for (var i=0; i<datos.seleccion.length; i++){
            const data =datos.seleccion[i];
            // await Tablas(data.origen);
            // await Tablas(data.destino);
            const Origen = await Model(Api, data.origen);//require(`../models/${data.origen}`);
            const Destino = await Model(Api, data.destino);//require(`../models/${data.destino}`);
            const Representante = await Model(Api, tabla_representante);//require('../models/uecla_Representante');
            const Estudiante = await Model(Api, tabla_estudiante);//require('../models/uecla_Estudiante');
            sincronizado[i].titulo=data.destino;
            // global.io.emit('Sincronizando_uecla',{tabla:data.destino, guardar:'Calculando...', guardado:0, sincronizado}) //datos:resultado})
            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', data.origen)
            const cantidad = await Origen.estimatedDocumentCount();
            global.io.emit('Sincronizando_uecla',{tabla:data.destino, guardar:cantidad, guardado:0, sincronizado}) //datos:resultado})
            // const Valores = await Origen.find()//.sort({createdAt:-1})//.limit(1000);
            if (data.origen==='Recibo'){
                const Valores = await Origen.find().sort({createdAt:-1});
                for (var j=0; j < Valores.length; j++){
                    const valor= {...Valores[j]._doc ? Valores[j]._doc : Valores[j] };
                    let representante = await Representante.find({'valores.cedula':valor.cedula});
                    representante = representante.length>0 ? {_id : representante[0]._id,  ...representante[0].valores} : null;
                    let Formas_pago =[];
                    for(var k=0;k<valor.metodo_pago.length;k++){
                    //const Formas_pago= valor.metodo_pago.map(v=>{
                        let v= valor.metodo_pago[k];
                        let pos = data.campos[0].lista.findIndex(f=>f._id===v.banco_origen);
                        let pos1 = data.campos[0].lista.findIndex(f=>f._id===v.banco_destino);
                        let bancoo= pos!==-1 ? data.campos[0].lista[pos].titulo : v.banco_origen===undefined ? null : v.banco_origen;
                        let bancod= pos1!==-1 ? data.campos[0].lista[pos1].titulo : v.banco_destino===undefined ? null : v.banco_destino;
                        Formas_pago=[...Formas_pago,
                            {id:v.id, fecha: v.fecha, 
                                monto:v.monto, referencia:v.referencia,
                                bancoo, 
                                bancod,
                                _id:v.forma_pago,
                                titulo: v.forma_pago!=='4' ? data.campos[1].lista[v.forma_pago].titulo : 'Pago Móvil',
                                value: v.forma_pago!=='4' ? data.campos[1].lista[v.forma_pago].value : 'pagomovil',
                                moneda: ['3'].indexOf(v.forma_pago)!==-1 ? '$' : 'Bs'
                            }
                        ]
                        // return {id:v.id, fecha: v.fecha, 
                        //         monto:v.monto, referencia:v.referencia,
                        //         bancoo:v.banco_origen, bancod:v.banco_destino,
                        //         _id:v.forma_pago
                        //     }
                    }//)
                    let periodoa='';
                    let meses = [];
                    for (var k=0;k< valor.concepto.length; k++){
                    //valor.concepto.map(async(v,i)=>{
                        let v = valor.concepto[k];
                        let periodo = v.descripcion.split('(');
                        // tipo de pago realizado segun mensualidad
                        let value = periodo[0].toLowerCase().trim();
                        value = value==='inscripción' ? 'inscripcion' : value;
                        // obtener el periodo de cancelacion 
                        periodo = periodo.length>1 ? periodo[1].split(')') : [''];
                        periodo = periodo[0];
                        if (['', ' ', null].indexOf(periodo)===-1){
                            periodoa=periodo
                        }else{
                            periodo=periodoa;
                        }
                        let nombres = v.descripcion.split('de '); 
                        nombres = nombres.length>1 ? nombres[1].split(' ').filter((f,i)=>['1ro','1er','2do','3ro', '3er','4to','5to', 'año', 'A', 'B' , 'C'].indexOf(f)===-1) : nombres[0];
                        //se obtiene los datos del estudiante
                        let estudiante=null
                        if (representante  && representante.representados){
                            for (var l=0; l<representante.representados.length ; l++){
                                let est = representante.representados[l];
                            //representante.representados.map(async (est)=>{
                                if((v.descripcion.indexOf(est.nombres)!==-1 && v.descripcion.indexOf(est.apellidos)!==-1) ||
                                (v.descripcion.indexOf(est.nombres.split(' ')[0])!==-1 && v.descripcion.indexOf(est.apellidos.split(' ')[0])!==-1)
                                ){
                                    let nuevo = await Estudiante.find({'valores.cedula':est.cedula});
                                    nuevo = nuevo.length>0 ? nuevo[0] : null;
                                    estudiante={_id :nuevo!==null ? String(nuevo._id) : null, cedula: est.cedula, nombres:est.nombres, apellidos:est.apellidos}
                                }
                            }
                            //)
                        }
                        if (estudiante===null && v.descripcion==='Abono'){
                            estudiante={
                                _id:'Abono-2', value:'abono', cedula:'Abono',
                                apellidos:'Quedan',nombres:'Abono'
                            }
                        }else if(estudiante===null && v.descripcion==='Abono anterior') {
                            estudiante={
                                _id:'Abono-1', value:'abono_anterior', cedula:'Abono_anterior',
                                apellidos:'Anterior',nombres:'Abono'
                            }
                        }
                        if (estudiante===null){
                            
                            // console.log('>><<<><><><><>', v.descripcion, representante && representante.representados ? representante.representados :'sin representados');
                        }
                        let montod = v.montod.replace('$','').replace(' ','');
                        montod= Number(montod);
                        let monto = v.montob.replace('Bs.S','').trim();
                        monto= monto.replace(' ','');
                        monto= monto.replace('.','');
                        monto= monto.replace(' ','');
                        monto= monto.replace(',','.');
                        monto= monto.replace(' ','');
                        if (monto.indexOf('-')!==-1){
                            monto = monto.replace('-','').trim();
                            monto = `-${monto}`;
                        }
                        monto= Number(monto);
                        meses=[...meses, {
                            id:k+1,
                            value, periodo,
                            descripcion: v.descripcion,
                            ...estudiante,
                            montod,
                            monto
                        }]
                        // return{
                        //     id:i+1,
                        //     value, periodo,
                        //     descripcion: v.descripcion,
                        //     ...estudiante
                        // }
                    }//)
                                        
                    let nuevo = {
                        _id: valor._id,
                        valores:{
                            sistema_viejo:true,
                            fecha:valor.createdAt,
                            recibo:valor.recibo,
                            valorcambio:valor.valorcambio,
                            representante: representante!==null ? representante : {
                                cedula:valor.cedula, nombres: valor.nombres, 
                                apellidos:valor.apellidos, correo: valor.correo
                            },
                            Formas_pago,
                            mensualidades:{
                                meses
                            },
                            subtotalvalor:{
                                abono:valor.abono,
                                abonod:valor.abono_dolar,
                                totald:valor.dolar,
                                total:valor.bolivar
                            },
                            totales:{
                                bolivar:valor.bolivar,
                                total:valor.total,
                                abono:valor.abono,
                                restan:valor.abono,
                                dolar:valor.dolar,
                                totald:valor.total_dolar,
                                abonod:valor.abono_dolar,
                                restand:valor.abono_dolar,
                            }
                        },
                        createdAt: valor.createdAt,
                        fecha:moment(valor.createdAt).format('YYYY-MM-DD')
                    };
                    // console.log(valor.cedula, representante.length);
                    let cod_chs = await Codigo_chs({...nuevo, fecha: new Date()});
                    cod_chs= cod_chs===null ? new Date() : cod_chs;
                    let hash_chs = await Hash_chs({...nuevo, cod_chs})
                    await Destino.updateOne({_id:nuevo._id},{...nuevo, cod_chs, hash_chs, actualizado:User.username},{ upsert: true });
                    sincronizado[i].progreso= Number(j+1)*100 / Number(Valores.length);
                    sincronizado[i].guardar = Valores.length;
                    sincronizado[i].guardado = j+1;
                    global.io.emit('Sincronizando_uecla',{tabla:data.destino, guardar:Valores.length, guardado:j+1, sincronizado}) //datos:resultado})
                }

            }else{
                const Valores = await Origen.find();
                for (var j=0; j < Valores.length; j++){
                    const valor= {...Valores[j]._doc ? Valores[j]._doc : Valores[j] };
                    let nuevo = {};
                    // if(valor.cod_chs===null){
                    //     console.log(valor);
                    // }
                    if (data.campos && valor.cod_chs!==null){
                        // data.campos.map(async (val)=>{
                        for (var k=0; k<data.campos.length; k++){
                            const val = data.campos[k];
                            if (val.multiple && val.lista){
                                let datos=[];
                                valor[val.origen].map(dat=>{
                                    let dato={};
                                    const camp = val.origend ? val.origend : val.origen;
                                    const pos = val.lista.findIndex(f=>f._id===dat[camp] || String(f.titulo).toLowerCase()===String(dat[camp]).toLowerCase());
                                    if (pos!==-1){
                                        val.campos.map(cam=>{
                                            dato[cam]=val.lista[pos][cam];
                                        });
                                        datos=[...datos, dato]
                                    }
                                });
                                nuevo[val.destino]= datos;
                            }else if(val.multiple && val.table){
                                const Table =  await Model(Api, val.table);//require(`../models/${val.table}`);
                                const camp = val.origend ? val.origend : val.origen;
                                // console.log(camp, valor[val.origen])
                                let datos=[];
                                for (let cont=0; cont<valor[val.origen].length; cont++){
                                    const data = valor[val.origen][cont];
                                    // console.log(data)
                                    try{
                                        const resp= await Table.findOne({_id:data[camp]})
                                        // console.log(resp, camp,data[camp] );
                                        if (resp!==null){
                                            let dato = {};
                                            val.campos.map(cam=>{
                                                dato[cam]=resp[`valores`] ? resp[`valores`][`${cam}`] :resp[`${cam}`];
                                            });
                                            nuevo[val.destino]=dato;
                                            datos= [...datos, dato];
                                        }else{
                                            // nuevo[val.destino]= valor[val.origen];
                                            
                                        }
                                        
                                    }catch(error) {
                                            console.log('Error con >>>>>', valor[val.origen] )
                                            // nuevo[val.destino]= valor[val.origen]
                                    }
                                }
                                nuevo[val.destino]=datos;
                            }else if (val.lista){
                                const pos = val.lista.findIndex(f=>f._id===valor[val.origen] || String(f.titulo).toLowerCase()===String(valor[val.origen]).toLowerCase());
                                nuevo[val.destino]= pos==-1 ?  valor[val.origen] : val.lista[pos];
                            }else if (val.table){
                            const Table =  await Model(Api, val.table);//require(`../models/${val.table}`);
                            try{
                                    const resp= await Table.findOne({_id:valor[val.origen]})
                                    // console.log(resp, val.origen,valor[val.origen] );
                                    if (resp!==null){
                                        let dato = {};
                                        val.campos.map(cam=>{

                                            dato[cam]=resp[`valores`] ? resp[`valores`][`${cam}`] :resp[`${cam}`];
                                        });
                                        nuevo[val.destino]=dato;
                                    }else{
                                        nuevo[val.destino]= valor[val.origen];
                                    }
                                    
                            }catch(error) {
                                    console.log('Error con >>>>>', valor[val.origen] )
                                    nuevo[val.destino]= valor[val.origen]
                            }
                                
                            }else{
                                nuevo[val.destino]= valor[val.origen]
                            }
                            
                        }//)
                        
                        let cod_chs = await Codigo_chs({...nuevo, fecha: new Date()});
                        cod_chs= cod_chs===null ? new Date() : cod_chs;
                        let hash_chs = await Hash_chs({...nuevo, cod_chs})
                        await Destino.updateOne({_id:nuevo._id},{...nuevo, cod_chs, hash_chs, actualizado:User.username},{ upsert: true });

                        // sincronizado[i].progreso= Number(j+1)*100 / Number(Valores.length);
                        // sincronizado[i].guardar = Valores.length;
                        // sincronizado[i].guardado = j+1;
                        // global.io.emit('Sincronizando_uecla',{tabla:data.destino, guardar:Valores.length, guardado:j+1, sincronizado}) //datos:resultado})
                    }
                    sincronizado[i].progreso= Number(j+1)*100 / Number(Valores.length);
                    sincronizado[i].guardar = Valores.length;
                    sincronizado[i].guardado = j+1;
                    global.io.emit('Sincronizando_uecla',{tabla:data.destino, guardar:Valores.length, guardado:j+1, sincronizado}) //datos:resultado})
                }
            }
        }
    }
}

colegioCtrl.Sincronizar_uecla = async (req, res)=>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    // const igual= await Verifica_api(Api, true);
    if (hashn===hash) {// && igual) {
        datos= JSON.parse(datos);
        Realizar_Sincronizacion(datos, User, Api);
        res.json({Respuesta:'Ok', datos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}

Act_Referencia = async(User, Api)=>{
    // console.log('por actualizar referencia.....')
    const cantidad=50;
    const Recibo = await Model(Api, tabla_recibo);
    const Referencia = await Model(Api, tabla_referencia);
    const ReferenciaW = await Model(Api, tabla_whatsapp_referencia);
    let continuar = true;
    let pag=0;
    while (continuar){
        let recibos = await Recibo.find()
                                .sort({createdAt:-1}) //.sort({'valores.recibo':-1})
                                .limit(cantidad)
                                .skip(pag*cantidad).exec();
        for (let i=0; i<recibos.length; i++){
            const recibo=recibos[i].valores.recibo;
            const dato = recibos[i].valores.Formas_pago;
            for (let j=0; j<dato.length; j++){
                const forma = dato[j];
                const nuevo={
                    recibo,
                    titulo:forma.titulo,
                    value:forma.value,
                    moneda:['efectivodolar','zelle'].indexOf(forma.value)!==-1 ? '$' : forma.moneda,
                    bancoo:forma.bancoo,
                    bancod:forma.bancod,
                    referencia:forma.referencia,
                    fecha:forma.fecha,
                    monto:forma.monto
                }
                if (nuevo.referencia){
                    const anterior = await Referencia.findOne({'valores.referencia':forma.referencia});
                    const anteriorw= await ReferenciaW.findOne({'valores.referencia':forma.referencia});
                    if (anteriorw!==null){
                        let valorw = {...anteriorw.valores, estatus:'1', recibo};
                        const hash_chs = await Hash_chs({...valorw, cod_chs:anteriorw.cod_chs});
                        await ReferenciaW.updateOne({_id:anteriorw._id},{valores:valorw, hash_chs, actualizado:User.username},{ upsert: true });
                    }

                    if (anterior!==null){
                        // console.log('Referencia repetida...', forma.referencia, recibo, anterior.valores.recibo)
                        continuar=false;
                        break;
                    }
                    let cod_chs = await Codigo_chs({...nuevo, fecha: new Date()});
                    cod_chs= cod_chs===null ? new Date() : cod_chs;
                    const hash_chs = await Hash_chs({...nuevo, cod_chs})
                    const Nuevo = new Referencia({valores:nuevo, fecha: moment().format('YYYY-MM-DD'), cod_chs, hash_chs, actualizado:User.username});
                    await Nuevo.save();
                    
                    // console.log('Guardar referencia recibo...',recibo, pag, i, j)
                }
                
            }
        }
        pag+=1;
        // console.log('Siguiente pagina....', pag, continuar)
    }

}
colegioCtrl.Actualizar_Referencia = async (req, res)=>{
    let {User, Api, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api}));
    // const igual= await Verifica_api(Api, true);
    if (hashn===hash) {// && igual) {
        Act_Referencia(User, Api);
        res.json({Respuesta:'Ok'});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}

colegioCtrl.Promover = async (req, res) =>{
    let {User, Api, Periodo, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, Periodo}));
    // const igual= await Verifica_api(Api, true);
    if (hashn===hash) {// && igual) {
        console.log(Periodo);
        const Mensualidad = await Model(Api,tabla_mensualidad);
        let Mensualidades = await Mensualidad.find({'valores.periodo':Periodo});
        let estudiantes = await Buscar(tabla_estudiante, '5to año', Api, 'grado.titulo');
        let nuevo=[];
        let solventes = [];
        let nosolventes =[];
        for (var i=0;i<estudiantes.length; i++){
            
            const estu= estudiantes[i];
            // nuevo=[...nuevo, {_id:estu._id, ...estu.valores}]
            const meses = await colegioCtrl.Resumen_Mensualidades([{_id:estu._id, ...estu.valores}],Api)
            // if (f.valores.estatus && f.valores.estatus.value==='inscrito'){
            //     nuevo=[...nuevo, f]
            // }else{
            //     no =[...no,f];
            // }
            
            // const pos = Mensualidades.findIndex(f=>f.valores._id===estu._id || f.valores.cedula===estu.cedula );
            // const meses = await Ver_Mensualidades(estu, Api);
            
            let solven=true;
            const lista = ['inscripcion','septiembre','octubre','noviembre','diciembre','enero','febrero','marzo','abril','mayo','junio','julio','agosto']
            let pendientes = [];
            for (var j=0; j<meses.length;j++){
                const ano = meses[j].valores;
                // console.log(ano)
                let pendiente = {solvente:true, periodo:ano.periodo, pendiente:[]}
                for(var k=0;k<lista.length;k++){
                    const val = lista[k];
                    if(!ano[val]){
                        pendiente.solvente=false;
                        pendiente.pendiente=[...pendiente.pendiente, val];
                        solven=false;
                    }
                    
                }
                pendientes=[...pendientes, pendiente]
                               
            }
            if (solven){
                solventes=[...solventes, 
                            {
                                _id_estudiante: estu._id, 
                                nombres:estu.valores.nombres, 
                                apellidos:estu.valores.apellidos,
                                pendientes
                            }
                ];
            }else{
                nosolventes=[...nosolventes, 
                            {
                                _id_estudiante: estu._id, 
                                nombres:estu.valores.nombres, 
                                apellidos:estu.valores.apellidos,
                                pendientes
                            }
                ];
            }

        }
        
        
        res.json({Respuesta:'Ok', solventes, nosolventes});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}

colegioCtrl.LeerHorarioU = async (req, res) =>{
    let {user, api, datos, hash} = req.body;
    user= typeof user==='string' ? JSON.parse(user) : user;
    const hashn = await Hash_texto(JSON.stringify({user, api, datos}));
    const igual= await Verifica_api(api, true);
    if (hashn===hash && igual) {
        datos= JSON.parse(datos);
        let horario = await Buscar_HorarioU(datos, api)
        res.json({Respuesta:'Ok', horario});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}

colegioCtrl.DisponibilidadHorarioU = async (req, res) =>{
    let {user, api, datos, hash} = req.body;
    user= typeof user==='string' ? JSON.parse(user) : user;
    const hashn = await Hash_texto(JSON.stringify({user, api, datos}));
    const igual= await Verifica_api(api, true);
    if (hashn===hash && igual) {
        datos= JSON.parse(datos);
        //await Tablas(table);
        const Horario = await Model(api,tabla_horario);//require(`../models/${table}`);
        const Aula = await Model(api,tabla_aula);//require(`../models/unefa_aula`);
        let aulas = await Aula.find();
        let horarios = await Horario.find({[`valores.periodo`]:datos.periodo});//({$text: {$search: datos.periodo, $caseSensitive: true}})
        horarios= horarios.filter(f=> {
            const o = datos.docentes ? datos.docentes.filter(f1=> f1._id===f.valores._id_tipo) : [];
            const a = aulas.filter(f1=> String(f1._id)===f.valores._id_tipo);
            return (f.valores.periodo===datos.periodo && o.length!==0) || (f.valores.periodo===datos.periodo && a.length!==0)
        })
        aulas= aulas.filter(f=>{
            const pos1= horarios.findIndex(v=>v.valores._id_tipo===String(f._id))
            let libre= false;
            if (pos1===-1){
                libre=true;
            }else{
                libre= Ver_disponibilidad(datos, horarios[pos1])
            }
            return libre
        }).map(v=>{return {...v.valores, titulo:v.valores.nombre, _id:v._id}})
        let docentes = datos.docentes ? datos.docentes.filter(f=>{
            const pos1= horarios.findIndex(v=>v.valores._id_tipo===String(f._id))
            let libre= false;
            if (pos1===-1){
                libre=true;
            }else{
                
                libre= Ver_disponibilidad(datos, horarios[pos1])
            }
            return libre
        }) : []; 
        docentes = docentes.map(v=>{return {...v}})
        res.json({Respuesta:'Ok', aulas, docentes});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}

colegioCtrl.GuardarHorarioU = async (req, res) =>{
    let {user, api, datos, hash} = req.body;
    user= typeof user==='string' ? JSON.parse(user) : user;
    const hashn = await Hash_texto(JSON.stringify({user, api, datos}));
    const igual= await Verifica_api(api, true);
    if (hashn===hash && igual) {
        datos= JSON.parse(datos);
        
        const nuevo = datos.nuevo
        //Limpiar
        let hor = await Buscar_HorarioU(datos, api);
        if (hor.length!==0){
            hor= {...hor[0].valores, _id: hor[0]._id}
            await Comparar_horarioU(hor, nuevo, user,api, true);
        }
        //Cargar datos
        datos.horario = await Comparar_horarioU(datos, nuevo, user, api);
        delete datos.nuevo
        let horario= await Guardar_horarioU(datos, user,api);
        
        res.json({Respuesta:'Ok', datos, horario, nuevo});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}
Buscar_HorarioU= async(datos, Api, campo='_id_tipo')=>{
    // await Tablas(tabla_horario);
    const Horario = await Model(Api, tabla_horario);//require(`../models/unefa_horario`);
    let horario= []
    try {
        horario = await Horario.find({[`valores.${campo}`]:datos[campo]});//({$text: {$search: datos[campo], $caseSensitive: true}})
    }catch(error) {
        console.log('Error-buscarhoraio colegio',Api, datos);    
    }
    horario= horario.filter(f=> f.valores[campo]===datos[campo] && f.valores.periodo===datos.periodo) 
    return horario
}

Comparar_horarioU = async(datos, nuevo, user, api, limpiar=false)=>{
    const {horario, periodo}= datos
    let resultado=horario;
    for (var i=0; i<horario.length; i++){
        let fila= horario[i];
        for (var j=0; j<fila.length; j++){
            let columna= fila[j];
            if (columna.valor!=='' && j!==0){
                //Para Docente
                if(columna.docente && columna.docente._id){
                    let hor = await Buscar_HorarioU({_id_tipo:columna.docente._id, periodo},api);
                    resultado[i][j] = await Verificar_horasU(datos, i, j, hor, nuevo, columna, limpiar, user, columna.docente._id, columna.docente.titulo, 'docente',api)
                    if (resultado[i][j].mensaje!==''){
                        let cont = 0;
                        while(resultado[i-cont][j].espacio===0 && i-cont>0){
                            cont++;
                            resultado[i-cont][j].mensaje=resultado[i][j].mensaje;
                        }
                    }
                    
                }
                //Para Aula
                if(columna.aula && columna.aula._id){
                    let hor = await Buscar_HorarioU({_id_tipo:columna.aula._id, periodo},api);
                    resultado[i][j] = await Verificar_horasU(datos, i, j, hor, nuevo, columna, limpiar, user, columna.aula._id, columna.aula.titulo, 'aula', api)
                    if (resultado[i][j].mensaje!==''){
                        let cont = 0;
                        while(resultado[i-cont][j].espacio===0 && i-cont>0){
                            cont++;
                            resultado[i-cont][j].mensaje=resultado[i][j].mensaje;
                        }
                    }
                }
            }
        }
        
    }
    return resultado
}

Verificar_horasU = async (datos, i, j, hor, nuevo, columna, limpiar, user,codigo_id_tipo, codigo_titulo, codigo_tipo, api)=>{
    const {periodo, _id_tipo, titulo}= datos;
    if (hor.length===0){
        hor=nuevo.map((val,i)=>{
            if (i===0){
                return val
            }else{
                return val.map((v,j)=>{
                    if (j===0){
                        return {...v}
                    }else{
                        return {dia:v.dia, hora:v.hora, espacio: 1, valor:'', mensaje:''}
                    }
                    
                })
            }
            
        })
        if (!limpiar){
            hor[i][j]={
                ...columna,
                seccion:{
                    _id:_id_tipo,
                    titulo,
                }
            }
        }
        
        let valores={
            _id_tipo:codigo_id_tipo, periodo, tipo:codigo_tipo,
            titulo: codigo_titulo,
            horario:hor
        }
        await Guardar_horarioU(valores, user, api)
    }else{
        hor=hor[0];
        hor.valores._id=hor._id;
        hor=hor.valores;
        let guardar = true
        // if (!limpiar)
        
        if (hor.horario[i][j].valor==='' && !limpiar){
            let espacio=columna.espacio===0 ? 0 : 1;
            if (columna.espacio>espacio){
                let salir=false
                while (espacio<columna.espacio && !salir){
                    if (hor.horario[i+espacio][j].valor===''){
                        espacio++;
                    }else{
                        salir=true
                    }
                }
            }
            hor.horario[i][j]={
                ...columna,
                espacio,
                seccion:{
                    _id:_id_tipo,
                    titulo,
                },
                tipo:codigo_tipo
            }
            
        }else if (hor.horario[i][j].valor!=='' && hor.horario[i][j].valor === columna.valor && hor.horario[i][j].seccion.titulo === titulo && limpiar){
            hor.horario[i][j]={dia:nuevo[i][j].dia, hora:nuevo[i][j].hora, espacio: 1, valor:'', mensaje:''};
            if (hor.horario[i+1][j].espacio===0) hor.horario[i+1][j].espacio=1;
            
        }else if(hor.horario[i][j].valor==='' && limpiar){
            guardar=false;
        }else if(!limpiar){
            hor.horario[i][j].mensaje=`Existe un choque de horario, el ${columna.dia} a las ${columna.hora}, entre "${titulo} y ${hor.horario[i][j].seccion.titulo}"`;
            if (columna.mensaje===''){
                columna.mensaje=`Existe un choque de horario, el ${columna.dia} a las ${columna.hora}, con ${codigo_tipo} "${codigo_titulo}", entre "${titulo} y ${hor.horario[i][j].seccion.titulo}"`;
            }else{
                columna.mensaje+=` y con ${codigo_tipo} "${codigo_titulo}", entre "${titulo} y ${hor.horario[i][j].seccion.titulo}"`
            }
        }else{
            hor.horario[i][j].mensaje='';
            let cont=1;
            while(hor.horario[i+cont][j].mensaje!=='' && hor.horario[i+cont][j].valor === columna.valor && hor.horario[i+cont][j].seccion.titulo){
                hor.horario[i+cont][j].mensaje='';
            }
        }
        if (guardar){
            await Guardar_horarioU(hor, user, api)
        }    
    }
    return columna
}
Guardar_horarioU= async(datos, user, api)=>{
    // await Tablas('unefa_horario');
    const Horario = await Model(api,tabla_horario);//require(`../models/unefa_horario`);
    let horario
    if (datos._id){
        await Horario.updateOne({_id:datos._id},{valores:datos, actualizado:user.username},{ upsert: true });
        horario = await Horario.findOne({_id: datos._id})
    }else{
        let cod_chs = await Codigo_chs({...datos});
        const Nuevo = new Horario({cod_chs, valores:datos, actualizado:user.username});
        await Nuevo.save();
        horario=Nuevo
    }
    return horario

}
module.exports = colegioCtrl;