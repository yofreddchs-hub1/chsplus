const colegioCtrl = {};
const path = require('path');
const fs = require('fs');
const { Hash_texto, Hash_password } = require('../servicios/encriptado');
const { Codigo_chs, Hash_chs} = require('../servicios/conexiones');
const {Verifica_api, Tablas} = require('../controllers/api.controller');

// valores de las tablas para el sistema de colegio
// valores para uecla
const tabla_mensualidad = 'uecla_Mensualidad';//'colegio_mensualidad'; 
const tabla_recibo = 'uecla_Recibo';//'colegio_recibo';
const tabla_estudiante = 'uecla_Estudiante'; //'colegio_estudiante'
const tabla_representante = 'uecla_Representante'; // 'colegio_representante'

Buscar = async(tabla, dato, campo='_id') =>{
    const BD = require(`../models/${tabla}`);
    let resultado = dato===undefined ? await BD.find() : await BD.find({$text: {$search: dato, $caseSensitive: true}})
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

Guardar_Mensualidades = async(Mensualidades, User) =>{
    await Tablas(tabla_mensualidad);
    await Tablas('uecla_Inscripcion');
    const Mensualidad= require(`../models/${tabla_mensualidad}`);
    const Estudiante = require(`../models/uecla_Estudiante`);
    const Inscripcion = require(`../models/uecla_Inscripcion`);
    let inscripcion = await Inscripcion.find();
    inscripcion= inscripcion.sort((a,b) => a.valores.periodo> b.valores.periodo ? -1 : 1).filter(f=> f.valores.estatus);

    let mensualidades= [];
    for (var i=0; i<Mensualidades.meses.length; i++){
        const mes= Mensualidades.meses[i];
        if (mes.value==='inscripcion' && inscripcion.length!==0 && inscripcion[0].valores.periodo===mes.periodo){
            console.log('por aqui', mes.value, mes.periodo)
            let estudiante = await Estudiante.findOne({_id:mes._id});
            estudiante.valores.estatus={
              _id :1,
              titulo :"Inscrito",
              value: "inscrito",
              permisos:""
            }
            console.log(estudiante);
            const hash_chs = await Hash_chs({...estudiante.valores, cod_chs: estudiante.cod_chs})
            await Mensualidad.updateOne({_id:estudiante._id},{valores:estudiante.valores, hash_chs, actualizado:User.username},{ upsert: true });
        }
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
        let mensualidad = await Buscar(tabla_mensualidad, mensual._id_estudiante, '_id_estudiante');
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
            let mensualidad = await Buscar(tabla_mensualidad, estu._id, '_id_estudiante');
            mensualidades=[...mensualidades, ...mensualidad];
            mensualidad = await Buscar('uecla_Mensualidad', estu.cedula, 'cedula');
            mensualidad.map(men=>{
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
            })
        }
        res.json({Respuesta:'Ok', mensualidades});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}

const Ver_Mensualidades = async(estu)=>{
    let mensualidades=[];
    let mensualidad = await Buscar(tabla_mensualidad, estu._id, '_id_estudiante');
    mensualidades=[...mensualidades, ...mensualidad];
    mensualidad = await Buscar(tabla_mensualidad, estu.cedula, 'cedula');
    mensualidad.map(men=>{
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
    })
    return mensualidades;
}
colegioCtrl.Solvencias = async (req, res) =>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    const igual= await Verifica_api(Api, true);
    if (hashn===hash && igual) {
        datos= JSON.parse(datos);
        
        let estudiantes = await Buscar(tabla_estudiante, datos.grado, 'grado.titulo');
        estudiantes = estudiantes.filter(f=> 
            datos.seccion && f.valores.seccion && f.valores.seccion.titulo===datos.seccion 
              && f.valores.estatus && f.valores.estatus.value==='inscrito'
            || datos.seccion===undefined && f.valores.estatus && f.valores.estatus.value==='inscrito'
        );
        estudiantes = estudiantes.map(val=>{
            return {...val.valores}
        })
        let mensualidades=[];
        for (var i=0; i<estudiantes.length; i++){
            const estu= estudiantes[i];
            // let mensualidad = await Buscar(tabla_mensualidad, estu._id, '_id_estudiante');
            let mensualidad = await Ver_Mensualidades(estu);
            mensualidad = mensualidad.map(val=>{
                return {_id:val._id, ...val.valores}
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
        await Tablas(tabla_representante);
        await Tablas(tabla_recibo);
        const Representante = require(`../models/${tabla_representante}`);
        const Recibo = require(`../models/${tabla_recibo}`);
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
        // let mensualidad = await Buscar(tabla_mensualidad, datos._id, '_id_estudiante');
        let mensualidad = await Ver_Mensualidades(datos);
        mensualidad = mensualidad.map(val=>{
            return {...val.valores}
        }).sort((a,b)=> a.periodo>b.periodo ? -1 : 1);
        let recibos = await Buscar(tabla_recibo, datos.representante._id, 'representante._id');
        recibos= recibos.filter(f=> f.valores.mensualidades.meses.filter(fi=> fi._id===datos._id));
        res.json({Respuesta:'Ok', datos, mensualidad, recibos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}

Realizar_Sincronizacion = async(datos, User)=>{
    let sincronizado= [...datos.seleccion];
    if (datos.destino==='Nuevo'){
        for (var i=0; i<datos.seleccion.length; i++){
            const data =datos.seleccion[i];
            await Tablas(data.origen);
            await Tablas(data.destino);
            const Origen = require(`../models/${data.origen}`);
            const Destino = require(`../models/${data.destino}`);
            const Representante = require('../models/uecla_Representante');
            const Estudiante = require('../models/uecla_Estudiante');
            sincronizado[i].titulo=data.destino;
            // global.io.emit('Sincronizando_uecla',{tabla:data.destino, guardar:'Calculando...', guardado:0, sincronizado}) //datos:resultado})
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            const Valores = await Origen.find().sort({createdAt:-1})//.limit(1000);
            global.io.emit('Sincronizando_uecla',{tabla:data.destino, guardar:Valores.length, guardado:0, sincronizado}) //datos:resultado})
            if (data.origen==='Recibo'){
                for (var j=0; j < Valores.length; j++){
                    const valor= Valores[j];
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
                                totald:valor.total_dolar,
                                total:valor.total
                            },
                            totales:{
                                bolivar:valor.monto,
                                total:valor.total,
                                abono:valor.abono,
                                retan:valor.abono,
                                dolar:valor.dolar,
                                totald:valor.total_dolar,
                                abonod:valor.abono_dolar,
                                restand:valor.abono_dolar,
                            }
                        },
                        createdAt: valor.createdAt,
                        fecha:valor.createdAt
                    };
                    // console.log(valor.cedula, representante.length);
                    let cod_chs = await Codigo_chs({...nuevo});
                    let hash_chs = await Hash_chs({...nuevo, cod_chs})
                    await Destino.updateOne({_id:nuevo._id},{...nuevo, cod_chs, hash_chs, actualizado:User.username},{ upsert: true });
                    sincronizado[i].progreso= Number(j+1)*100 / Number(Valores.length);
                    sincronizado[i].guardar = Valores.length;
                    sincronizado[i].guardado = j+1;
                    global.io.emit('Sincronizando_uecla',{tabla:data.destino, guardar:Valores.length, guardado:j+1, sincronizado}) //datos:resultado})
                }

            }else{
                
                for (var j=0; j < Valores.length; j++){
                    const valor= Valores[j];
                    let nuevo = {};
                    if (data.campos){
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
                                const Table =  require(`../models/${val.table}`);
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
                            const Table =  require(`../models/${val.table}`);
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
                        
                        let cod_chs = await Codigo_chs({...nuevo});
                        let hash_chs = await Hash_chs({...nuevo, cod_chs})
                        await Destino.updateOne({_id:nuevo._id},{...nuevo, cod_chs, hash_chs, actualizado:User.username},{ upsert: true });
                        sincronizado[i].progreso= Number(j+1)*100 / Number(Valores.length);
                        sincronizado[i].guardar = Valores.length;
                        sincronizado[i].guardado = j+1;
                        global.io.emit('Sincronizando_uecla',{tabla:data.destino, guardar:Valores.length, guardado:j+1, sincronizado}) //datos:resultado})
                    }
                }
            }
        }
    }
}

colegioCtrl.Sincronizar_uecla = async (req, res)=>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    const igual= await Verifica_api(Api, true);
    if (hashn===hash && igual) {
        datos= JSON.parse(datos);
        Realizar_Sincronizacion(datos, User);
        res.json({Respuesta:'Ok', datos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}
module.exports = colegioCtrl;