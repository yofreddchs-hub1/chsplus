const sistemachsCtrl = {};
const path = require('path');
const chalk = require('chalk');
const _ = require('lodash');
const moment = require('moment');
const fs = require('fs');
const { Hash_texto, Hash_password } = require('../servicios/encriptado');
const { Codigo_chs, Hash_chs} = require('../servicios/conexiones');
const {Verifica_api, Tablas} = require('../controllers/api.controller');
const {Model} = require('../database/model');

const tabla_ingresoem='sistemachs_ingresoem';//ingresos de empaques
const tabla_ingresomp='sistemachs_ingresomp';//ingresos de materia prima
const tabla_ingresopt='sistemachs_ingresopt';//ingresos de producto terminado
const tabla_egresoem='sistemachs_egresoem';//egresos de empaques
const tabla_egresomp='sistemachs_egresomp';//egresos de materia prima
const tabla_egresopt='sistemachs_egresopt';//egresos de producto terminado

const tabla_inventariomp='sistemachs_inventariomp';//inventario de materia prima
const tabla_inventariopt='sistemachs_inventariopt';//inventario de producto perminado
const tabla_empaque='sistemachs_empaque';//inventario de empaque
const tabla_formula='sistemachs_formula';// datos de fomulas
const tabla_produccion='sistemachs_produccion';// datos de proccion y planificacion

Generar_codigo = (valor, id='', cantidad=5)=>{
    let nuevo = String(Number(valor) + 1);
    let cero = cantidad-nuevo.length;
    for (var i=0; i<cero; i++){
      nuevo='0'+nuevo;
    }
    return `${id!=='' ? id+'-' : ''}${nuevo}`
}
  
Serie = async(dato, Api)=>{
    // await sistemachsCtrl.Tablas(dato.tabla);
    const DB = await Model(Api, dato.tabla);//require(`../models/${dato.tabla}`);
    let total = dato.condicion 
                ?   await DB.find(dato.condicion)
                :   await DB.estimatedDocumentCount();
    total= dato.condicion ? total.length : total;
    let Recibo = Generar_codigo(total,`${dato.id ? dato.id : 'S'}`, dato.cantidad ? dato.cantidad : 6);
    let res = await DB.findOne({$or:[{'valores.codigo':Recibo},{'valores.recibo':Recibo},{'valores.referencia':Recibo}]})
    while (res!==null){
        total+=1;
        Recibo = Generar_codigo(total,`${dato.id ? dato.id : 'S'}`, dato.cantidad ? dato.cantidad : 6);
        res = await DB.findOne({$or:[{'valores.codigo':Recibo},{'valores.recibo':Recibo},{'valores.referencia':Recibo}]})
    }
    return Recibo;
}
  
Movimiento = (dato)=>{
    return{
        _id: dato._id, codigo:dato.codigo, unidad:dato.unidad, descripcion: dato.descripcion,
        cantidad: dato.cantidad
    }
}
//Iniciar los valores por defecto, valores acutales en 0, ingresos y egresos eliminados
sistemachsCtrl.Iniciarchs= async(req,res)=>{
    let {User, Api, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api}));
    // const igual= await sistemachsCtrl.Verifica_api(Api, true);
    if (hashn===hash){ // && igual) {
        const listae=[tabla_ingresoem,tabla_ingresomp, tabla_ingresopt, tabla_egresoem, tabla_egresomp, tabla_egresopt, tabla_produccion];
        for (var i=0; i<listae.length; i++){
            const bd = await Model(Api,listae[i]);
            await bd.deleteMany();
        }
        const listab=[tabla_inventariomp, tabla_inventariopt, tabla_empaque, tabla_formula];
        for (var i=0; i<listab.length;i++){
            const bd = await Model(Api,listab[i]);
            const valores = await bd.find();
            for (var j=0; j<valores.length;j++){
                let valor = valores[j];
                valor.valores.actual=0;
                valor.valores.aproximadosaco=0;
                await bd.updateOne({_id:String(valor._id)},{valores:valor.valores, actualizado:User.username},{ upsert: true });
            }
        }
        res.json({Respuesta:'Ok', Iniciado:true});
        
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}
sistemachsCtrl.Guardar_produccion = async (req, res)=>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    // const igual= await sistemachsCtrl.Verifica_api(Api, true);
    if (hashn===hash){ // && igual) {
    // await sistemachsCtrl.Tablas(tabla_egresomp);
    // await sistemachsCtrl.Tablas(tabla_egresoem);
    // await sistemachsCtrl.Tablas(tabla_ingresopt);
    const Produccion = await Model(Api,tabla_produccion)//require(`../models/sistemachs_Produccion`);
    const MP = await Model(Api, tabla_inventariomp); //require(`../models/sistemachs_Inventariomp`);
    const PT = await Model(Api,tabla_inventariopt);//require(`../models/sistemachs_Inventariopt`);
    const EMPAQUE = await Model(Api,tabla_empaque);//require(`../models/sistemachs_Empaque`);
    const FORMULA = await Model(Api,tabla_formula);//require(`../models/sistemachs_Formula`);
    const EM = await Model(Api,tabla_egresomp);//require(`../models/sistemachs_Egresomp`);
    const IM = await Model(Api,tabla_ingresomp);//require(`../models/sistemachs_Egresomp`);
    const EEM= await Model(Api,tabla_egresoem);//require(`../models/sistemachs_Egresoem`);
    const IPT= await Model(Api,tabla_ingresopt);//require(`../models/sistemachs_Ingresopt`);
    const EPT= await Model(Api,tabla_egresopt);//require(`../models/sistemachs_Ingresopt`);

    datos = JSON.parse(datos);
    const fecha = datos.fecha ? datos.fecha : moment(new Date()).format('YYYY-MM-DD');
    //Egreso para materia prima
    let movimiento = [];
    //Ingreso materia prima
    let movimiento_mp = [];
    //Ingreso producto terminado
    let movimiento_pt = [];
    //Egreso producto terminado
    let movimiento_ept = [];
    //Egreso empaques
    let movimiento_em = [];
    for (var i=0; i< datos.produccion.length; i++){
        const produccion = datos.produccion[i];
        if (produccion.producir && !produccion.producido){
            //Materia prima
            for (var m=0; m<produccion.mp.length; m++){
                const mp=produccion.mp[m];
                let prima = await MP.findOne({_id:mp._id});
                if (prima!==null){
                    prima= prima.valores ? prima.valores : prima;
                    prima.actual = Number(prima.actual && prima.actual!=='' ? prima.actual : 0) - Number(mp.cantidadr);
                    await MP.updateOne({_id:mp._id},{valores:{...prima}, actualizado:User.username},{ upsert: true });
                    //movimiento de egreso de materia prima
                    movimiento = [...movimiento, Movimiento({...mp, cantidad: mp.cantidadr})
                        // {
                        // _id: mp._id, codigo:mp.codigo, unidad:mp.unidad, descripcion: mp.descripcion,
                        // cantidad: mp.cantidadr
                        // }
                    ]
                }else{
                    prima = await PT.findOne({_id:mp._id});
                    prima= prima.valores ? prima.valores : prima;
                    prima.actual = Number(prima.actual && prima.actual!=='' ? prima.actual : 0) - Number(mp.cantidadr);
                    await PT.updateOne({_id:mp._id},{valores:{...prima}, actualizado:User.username},{ upsert: true });
                    //movimiento de egreso de materia prima
                    movimiento_ept = [...movimiento_ept, 
                        Movimiento({...mp, cantidad: mp.cantidadr})                   
                    ]
                }
            }

            //Producto terminado
            for (var p=0; p<produccion.pt.length; p++){
                const pt=produccion.pt[p];
                let producto = await PT.findOne({_id:pt._id});
                if (producto === null)
                    console.log(producto, pt)
                producto = producto.valores ? producto.valores : producto;
                producto.actual = Number(producto.actual && producto.actual!=='' ? producto.actual : 0) + Number(pt.cantidadFinalr);
                //movimiento de ingreso de producto terminado
                if (Number(pt.cantidadFinalr)!==0)
                    movimiento_pt=[...movimiento_pt, Movimiento({...producto, cantidad: Number(pt.cantidadFinalr)})
                        // {
                        // _id: producto._id, codigo:producto.codigo, unidad:producto.unidad, descripcion: producto.descripcion,
                        // cantidad: Number(pt.cantidadFinalr)
                        // }
                    ]
                // Actualizar empaques 
                if (producto.empaque){
                    let empaque = await EMPAQUE.findOne({_id:producto.empaque._id});
                    empaque = empaque.valores ? {_id:empaque._id , ...empaque.valores} : empaque;
                    empaque.actual = Number(empaque.actual ? empaque.actual : 0)-Number(pt.cantidadFinalr);
                    await EMPAQUE.updateOne({_id:producto.empaque._id}, {valores:{...empaque}, actualizado:User.username},{ upsert: true });
                    // movimiento de egreso de empaque
                    if (Number(pt.cantidadFinalr)!==0){
                        movimiento_em=[...movimiento_em, Movimiento({...empaque, cantidad: Number(pt.cantidadFinalr)})
                            // {
                            // _id: empaque._id, codigo:empaque.codigo, unidad:empaque.unidad, descripcion: empaque.descripcion,
                            // cantidad: Number(pt.cantidadFinalr)
                            // }
                        ]
                    }
                }
                //Actualizar la materia prima adicional
                if (producto.madicional){
                    let materia = await MP.findOne({_id:producto.madicional._id});
                    materia = materia.valores ? materia.valores : materia;
                    materia.actual = Number(materia.actual ? materia.actual : 0) - Number(producto.cantidadm)
                    await MP.updateOne({_id:producto.madicional._id},{valores:{...materia}, actualizado:User.username},{ upsert: true });
                    //movimiento de egreso de materia prima
                    movimiento = [...movimiento,Movimiento({...materia, cantidad:producto.cantidadm})//{
                    // _id: materia._id, codigo:materia.codigo, unidad:materia.unidad, descripcion: materia.descripcion,
                    // cantidad: producto.cantidadm
                    // }
                    ]
                }
                await PT.updateOne({_id:pt._id},{valores:{...producto}, actualizado:User.username},{ upsert: true });
            }
            // cuando produce materia prima
            if (produccion.materiaprima){
                let mp = produccion.materiaprima;
                let prima = await MP.findOne({_id:mp._id});
                prima= prima.valores ? prima.valores : prima;
                prima.actual = Number(prima.actual && prima.actual!=='' ? prima.actual : 0) + Number(produccion.resta);
                await MP.updateOne({_id:mp._id},{valores:{...prima}, actualizado:User.username},{ upsert: true });
                movimiento_mp = [...movimiento_mp, 
                    Movimiento({...mp, cantidad: produccion.resta})
                ]
                datos.produccion[i].resta= 0;
                produccion.resta= 0;
            }
            let formula = await FORMULA.findOne({_id:produccion._id});
            formula = formula.valores ? formula.valores : formula;
            formula.actual = Number(formula.actual ? formula.actual : 0) + Number(produccion.resta);
            await FORMULA.updateOne({_id:produccion._id},{valores:{...formula}, actualizado:User.username},{ upsert: true });
            datos.produccion[i].producido=true;
            delete datos.produccion[i].producir;
        }
    }
    await Produccion.updateOne({_id:datos._id},{valores:{...datos}, actualizado:User.username},{ upsert: true });

    //Guardar el egreso de materia prima
    // let total = await EM.estimatedDocumentCount();
    let codigo = await Serie({tabla:tabla_egresomp,id:'EMP', cantidad:6}, Api);//Generar_codigo(total,'EMP')
    let valores = {codigo:`${codigo}${datos.titulo ? ` "${datos.titulo}"`:''} de "${datos.referencia}"`, fecha, movimiento};
    let cod_chs = await Codigo_chs({...valores});
    let hash_chs = await Hash_chs({...valores, cod_chs})

    if (movimiento.length!==0){
        const Nuevo = new EM({valores, cod_chs, hash_chs, actualizado:`Referencia: ${datos.referencia ? datos.referencia : datos._id} - ${User.username}`});
        await Nuevo.save();
    }
    //Guardar ingreso materia prima
    if (movimiento_mp.length!==0){
        codigo =  await Serie({tabla:tabla_ingresomp,id:'IMP', cantidad:6}, Api);//Generar_codigo(total,'EEM')
        valores = {codigo:`${codigo}${datos.titulo ? ` "${datos.titulo}"`:''} de "${datos.referencia}"`, fecha, movimiento: movimiento_mp};
        cod_chs = await Codigo_chs({...valores});
        hash_chs = await Hash_chs({...valores, cod_chs})
        const NuevoE = new IM({valores, cod_chs, hash_chs, actualizado:`Referencia: ${datos.referencia ? datos.referencia : datos._id} - ${User.username}`});
        await NuevoE.save();
    }

    //Guardar el egreso de empaque
    // total = await EEM.estimatedDocumentCount();
    if (movimiento_em.length!==0){
        codigo =  await Serie({tabla:tabla_egresoem,id:'EEM', cantidad:6}, Api);//Generar_codigo(total,'EEM')
        valores = {codigo:`${codigo}${datos.titulo ? ` "${datos.titulo}"`:''} de "${datos.referencia}"`, fecha, movimiento: movimiento_em};
        cod_chs = await Codigo_chs({...valores});
        hash_chs = await Hash_chs({...valores, cod_chs})
        const NuevoE = new EEM({valores, cod_chs, hash_chs, actualizado:`Referencia: ${datos.referencia ? datos.referencia : datos._id} - ${User.username}`});
        await NuevoE.save();
    }

    //Guardar el ingreso producto terminado
    // total = await IPT.estimatedDocumentCount();
    //Ingreso
    if (movimiento_pt.length!==0){
        codigo =  await Serie({tabla:tabla_ingresopt,id:'IPT', cantidad:6}, Api);//Generar_codigo(total,'IPT')
        valores = {codigo:`${codigo} de "${datos.referencia}"`, fecha, movimiento:movimiento_pt};
        cod_chs = await Codigo_chs({...valores});
        hash_chs = await Hash_chs({...valores, cod_chs})
        const NuevoI = new IPT({valores, cod_chs, hash_chs, actualizado:`Referencia: ${datos.referencia ? datos.referencia : datos._id} - ${User.username}`});
        await NuevoI.save();
    }
    //Egreso
    if (movimiento_ept.length!==0){
        codigo =  await Serie({tabla:tabla_egresopt,id:'EPT', cantidad:6}, Api);//Generar_codigo(total,'IPT')
        valores = {codigo:`${codigo}${datos.titulo ? ` "${datos.titulo}"`:''} de "${datos.referencia}"`, fecha, movimiento:movimiento_ept};
        cod_chs = await Codigo_chs({...valores});
        hash_chs = await Hash_chs({...valores, cod_chs})
        const NuevoI = new EPT({valores, cod_chs, hash_chs, actualizado:`Referencia: ${datos.referencia ? datos.referencia : datos._id} - ${User.username}`});
        await NuevoI.save();
    }
    global.io.emit(`Actualizar_empaque`);
    global.io.emit(`Actualizar_inventariomp`); 
    global.io.emit(`Actualizar_produccion`); 
    res.json({Respuesta:'Ok', datos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}
  
//Ingresar y egresar
sistemachsCtrl.Ingresar = async (req, res)=>{
    let {User, Api, datos, tabla_inv, tabla_ing, id, egresar, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos, tabla_inv, tabla_ing, id, egresar}));
    // const igual= await sistemachsCtrl.Verifica_api(Api, true);
    if (hashn===hash){ // && igual) {
        // await sistemachsCtrl.Tablas(`${tabla_ing}`);
        const MP = await Model(Api, tabla_inv);//require(`../models/${tabla_inv}`);
        const IM = await Model(Api, tabla_ing);//require(`../models/${tabla_ing}`);
        datos = JSON.parse(datos);
        if (datos._id){
        
            let anterior = await IM.findOne({_id:datos._id});
            for (var i=0; i< anterior.valores.movimiento.length; i++){
                let material =  anterior.valores.movimiento[i];
                let Mat = await MP.findOne({_id:material._id});
                Mat = Mat!==null ? Mat : await MP.findOne({'valores.codigo':material.codigo});
                if (!material._id){
                    material._id= Mat._id
                }
                
                if (egresar){
                    Mat.valores.actual= Number(Mat.valores.actual) + Number(material.cantidad);  
                }else{
                    Mat.valores.actual= Number(Mat.valores.actual)===0 ? 0 : Number(Mat.valores.actual) - Number(material.cantidad);
                }
                await MP.updateOne({_id:material._id},{valores:Mat.valores, actualizado:`Referencia: ${anterior.valores.codigo} - ${User.username}`},{ upsert: true });
                
            }
        }
        const fecha = datos.fecha; //moment(new Date()).format('YYYY-MM-DD');
        let movimiento = [];
        // let total = await IM.estimatedDocumentCount();
        const codigo = datos.codigo ? datos.codigo : await Serie({tabla:`${tabla_ing}`,id, cantidad:6}, Api);//Generar_codigo(total,'IMP');

        for (var i=0; i<datos.movimiento.length; i++){
            let material =  datos.movimiento[i];
            let Mat = await MP.findOne({_id:material._id});
            if (egresar){
                Mat.valores.actual= Number(Mat.valores.actual) - Number(material.cantidad);
            }else{
                Mat.valores.actual= Number(Mat.valores.actual) + Number(material.cantidad);
            }
            await MP.updateOne({_id:material._id},{valores:Mat.valores, actualizado:`Referencia: ${codigo} - ${User.username}`},{ upsert: true });
            movimiento=[...movimiento,Movimiento(material)];
        }
        if (datos._id){
            await IM.updateOne({_id:datos._id},{valores:datos, actualizado:`${User.username}`},{ upsert: true });
            res.json({Respuesta:'Ok', datos}); 
            return 
        }
        let valores = {codigo, fecha, movimiento};
        let cod_chs = await Codigo_chs({...valores});
        const hash_chs = await Hash_chs({...valores, cod_chs})
        const Nuevo = new IM({valores, cod_chs, hash_chs, actualizado:User.username});
        await Nuevo.save();
        let nuevo = await IM.find();
        nuevo=nuevo[nuevo.length-1]
        global.io.emit(`Actualizar`,datos); 
        res.json({Respuesta:'Ok', datos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}
//Ingresos de Materia Prima
sistemachsCtrl.Ingresar_material = async (req, res)=>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    // const igual= await sistemachsCtrl.Verifica_api(Api, true);
    if (hashn===hash){ // && igual) {
        const fecha = moment(new Date()).format('YYYY-MM-DD');
        // await sistemachsCtrl.Tablas(tabla_ingresomp);
        const MP = await Model(Api,tabla_inventariomp);//require(`../models/sistemachs_Inventariomp`);
        const IM = await Model(Api,tabla_ingresomp);//require(`../models/sistemachs_Ingresomp`);
        datos = JSON.parse(datos);
        let movimiento = [];
        // let total = await IM.estimatedDocumentCount();
        const codigo = await Serie({tabla:tabla_ingresomp,id:'IMP', cantidad:6}, Api);//Generar_codigo(total,'IMP');

        for (var i=0; i<datos.length; i++){
            let material =  datos[i];
            let Mat = await MP.findOne({_id:material._id});
            Mat.valores.actual= Number(Mat.valores.actual) + Number(material.cantidad);
            await MP.updateOne({_id:material._id},{valores:Mat.valores, actualizado:`Referencia: ${codigo} - ${User.username}`},{ upsert: true });
            movimiento=[...movimiento,Movimiento(material)];
        }
        
        let valores = {codigo, fecha, movimiento};
        let cod_chs = await Codigo_chs({...valores});
        const hash_chs = await Hash_chs({...valores, cod_chs})
        const Nuevo = new IM({valores, cod_chs, hash_chs, actualizado:User.username});
        await Nuevo.save();
        global.io.emit(`Actualizar_${Api.api}_material`,datos); 
        res.json({Respuesta:'Ok', datos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}   
// Ingreso de empaque
sistemachsCtrl.Ingresar_empaque = async (req, res)=>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    // const igual= await sistemachsCtrl.Verifica_api(Api, true);
    if (hashn===hash){ // && igual) {
        const fecha = moment(new Date()).format('YYYY-MM-DD');
        // await sistemachsCtrl.Tablas(tabla_ingresoem);
        const EM = await Model(Api,tabla_empaque);//require(`../models/sistemachs_Empaque`);
        const IE = await Model(Api,tabla_ingresoem);//require(`../models/sistemachs_Ingresoem`);
        datos = JSON.parse(datos);
        let movimiento = [];
        // let total = await IE.estimatedDocumentCount();
        const codigo =  await Serie({tabla:tabla_ingresoem,id:'IEM', cantidad:6}, Api);//Generar_codigo(total,'IEM')

        for (var i=0; i<datos.length; i++){
        let material =  datos[i];
        let Mat = await EM.findOne({_id:material._id});
        Mat.valores.actual= Number(Mat.valores.actual) + Number(material.cantidad);
        await EM.updateOne({_id:material._id},{valores:Mat.valores, actualizado:`Referencia: ${codigo} - ${User.username}`},{ upsert: true });
        movimiento=[...movimiento, Movimiento(material)]
        
        }
        
        let valores = {codigo, fecha, movimiento};
        let cod_chs = await Codigo_chs({...valores});
        const hash_chs = await Hash_chs({...valores, cod_chs})
        const Nuevo = new IE({valores, cod_chs, hash_chs, actualizado:User.username});
        await Nuevo.save();
        global.io.emit(`Actualizar_${Api.api}_empaque`,datos); 
        res.json({Respuesta:'Ok', datos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}
sistemachsCtrl.Ingreso_Egreso = async (req, res)=>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    // const igual= await sistemachsCtrl.Verifica_api(Api, true);
    if (hashn===hash){ // && igual) {
        
        datos = JSON.parse(datos);
        let Ingreso;
        let Egreso;
        let Inventario;
        if (datos.tipo === undefined ){
            res.json({Respuesta:'Ok', inventario:[], mensaje:'Tipo de ingreso y egresos no conocidos'});
        }
        if (datos.tipo==='Materia Prima'){
            Ingreso=await Model(Api,tabla_ingresomp);//require(`../models/sistemachs_Ingresomp`);
            Egreso=await Model(Api,tabla_egresomp);//require(`../models/sistemachs_Egresomp`);
            Inventario = await Model(Api,tabla_inventariomp);//require(`../models/sistemachs_Inventariomp`);
        }else if (datos.tipo==='Empaque'){
            Ingreso= await Model(Api,tabla_ingresoem);//require(`../models/sistemachs_Ingresoem`);
            Egreso= await Model(Api,tabla_egresoem);//require(`../models/sistemachs_Egresoem`);
            Inventario = await Model(Api,tabla_empaque);//require(`../models/sistemachs_Empaque`);
        }else if (datos.tipo==='Producto Terminado'){
            Ingreso= await Model(Api,tabla_ingresopt);//require(`../models/sistemachs_Ingresopt`);
            Egreso= await Model(Api,tabla_egresopt);//require(`../models/sistemachs_Egresopt`);
            Inventario = await Model(Api,tabla_inventariopt);//require(`../models/sistemachs_Inventariopt`);
        }else{
            res.json({Respuesta:'Ok', inventario:[], mensaje:'Tipo de ingreso y egresos no conocidos'});
            return
        }
        let ingresos=[];
        let egresos=[];
        let inventario = await Inventario.find();
        inventario= inventario.map(val=>{return{_id:val._id, ...val.valores}});

        for (var i=0; i<datos.meses.length;i++){
            const mes = datos.meses[i];
            let ingreso = await Ingreso.find({$text: {$search: mes, $caseSensitive: false}});
            ingreso= ingreso.filter(f=>f.valores.fecha===mes).map(val=>{return{_id: val._id, actualizado: val.actualizado, ...val.valores}});
            ingresos=[...ingresos,...ingreso];
            let egreso = await Egreso.find({$text: {$search: mes, $caseSensitive: false}});
            egreso= egreso.filter(f=>f.valores.fecha===mes).map(val=>{return{_id: val._id, actualizado: val.actualizado, ...val.valores}});
            egresos=[...egresos,...egreso];
        }
        
        for (var i=0; i<ingresos.length; i++){
            const ingreso = ingresos[i];
            
            for (var j=0; j<ingreso.movimiento.length;j++){
                const mp= ingreso.movimiento[j];
                
                const pos = inventario.findIndex(f=>String(f._id)===String(mp._id));
                
                if (pos!==-1){
                if(inventario[pos][ingreso.fecha]){
                    inventario[pos][ingreso.fecha].ingreso+=Number(mp.cantidad);  
                }else{
                    inventario[pos][ingreso.fecha]={ingreso:Number(mp.cantidad), egreso:0};
                }
                
                }
            }
        }
        
        for (var i=0; i<egresos.length; i++){
            const egreso = egresos[i];
            
            for (var j=0; j<egreso.movimiento.length;j++){
                const mp= egreso.movimiento[j];
                const pos = inventario.findIndex(f=>String(f._id)===String(mp._id) || f.codigo===mp.codigo);
                if (pos!==-1){
                if(inventario[pos][egreso.fecha]){
                    inventario[pos][egreso.fecha].egreso+=Number(mp.cantidad);  
                }else{
                    inventario[pos][egreso.fecha]={ingreso:0, egreso:Number(mp.cantidad)};
                }
                
                }
            }
        }
        
        res.json({Respuesta:'Ok', inventario, ingresos, egresos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}
// En ventas..
sistemachsCtrl.Serial= async(req,res)=>{
    let {User, Api, dato, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, dato}));
    // const igual= await sistemachsCtrl.Verifica_api(Api, true);
    if (hashn===hash){ // && igual) {
        if (dato.tabla===undefined){
            res.json({Respuesta:'Error', mensaje: `no existe ${dato.tabla}`});
        }else{
            // await sistemachsCtrl.Tablas(dato.tabla);
            // const DB = require(`../models/${dato.tabla}`);
            // let total = await DB.estimatedDocumentCount();
            // const Recibo = Generar_codigo(total,`${dato.id ? dato.id : 'S'}`, dato.cantidad ? dato.cantidad : 6);
            const Recibo = await Serie(dato, Api);
            res.json({Respuesta:'Ok', Recibo});
        }
        
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}
sistemachsCtrl.Recibo_venta = async(req, res)=>{
    // await sistemachsCtrl.Tablas('sistemachs_Venta');
    const Venta = await Model('sistemachs','sistemachs_Venta');//require(`../models/sistemachs_Venta`);
    let total = await Venta.estimatedDocumentCount();
    const Recibo = Generar_codigo(total,'V', 6);
    res.json({Respuesta:'Ok', Recibo});
}
Procesar_Entrega = async(User, fecha, Recibo, datos)=>{
    const PT = await Model('sistemachs',tabla_inventariopt);//require(`../models/sistemachs_Inventariopt`);
    const EPT= await Model('sistemachs',tabla_egresopt);//require(`../models/sistemachs_Egresopt`);
    let movimiento = [];
    for (var i=0; i< datos.orden_venta.producto.length; i++){
        let producto = datos.orden_venta.producto[i];
        movimiento = [...movimiento, Movimiento({...producto, cantidad: producto.cantidad ? producto.cantidad : 1})]
    }

    for (var i=0; i< movimiento.length; i++){
        let producto = movimiento[i];
        let Prod = await PT.findOne({_id:producto._id});
        Prod.valores.actual-= producto.cantidad;
        await PT.updateOne({_id:Prod._id},{valores:Prod.valores, actualizado:`Referencia: ${Recibo} - ${User.username}`},{ upsert: true });
        
    }
    //Guardar el egreso producto terminado
    let codigo = await Serie({tabla:tabla_egresopt, id:'EPT', cantidad:6}, Api);
    let valores = {codigo, fecha, movimiento};
    let cod_chs = await Codigo_chs({...valores});
    let hash_chs = await Hash_chs({...valores, cod_chs})
    const NuevoI = new EPT({valores, cod_chs, hash_chs, actualizado:`Referencia: ${Recibo} - ${User.username}`});
    await NuevoI.save();
    return
}
  
sistemachsCtrl.Egreso_Venta = async (req, res)=>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    // const igual= await sistemachsCtrl.Verifica_api(Api, true);
    if (hashn===hash){ // && igual) {
        //actualizar codigos
        const fecha = moment(new Date()).format('YYYY-MM-DD');
        // await sistemachsCtrl.Tablas(tabla_egresopt);
        // await sistemachsCtrl.Tablas(tabla_inventariopt);
        const PT = await Model(Api,tabla_inventariopt);//require(`../models/sistemachs_Inventariopt`);
        const EPT= await Model(Api,tabla_egresopt);//require(`../models/sistemachs_Egresopt`);
        const VENTA = await Model(Api, 'sistemachs_Venta');//require(`../models/sistemachs_Venta`);
        datos = JSON.parse(datos);

        let anterior = null;
        if (datos._id){
            anterior = await VENTA.findOne({_id:datos._id});
            anterior = anterior ? anterior.valores : anterior;
        }
        
        let Recibo = await Serie({tabla:'sistemachs_Venta', cantidad:6, id:'V', condicion:{'valores.tipo':'Venta'}}, Api);//Generar_codigo(total,'V', 6);
        Recibo = anterior ? anterior.recibo : Recibo;
        //Elimina los datos de egreso de producto terminado
        if (anterior){
            for (var j=0; j<anterior.orden_venta.producto.length; j++){
                let producto = anterior.orden_venta.producto[j];
                const cantidad= producto.cantidad ? Number(producto.cantidad) : 1;
                let Prod = await PT.findOne({_id:producto._id});
                Prod.valores.actual+= cantidad;
                await PT.updateOne({_id:Prod._id},{valores:Prod.valores, actualizado:`Referencia: ${Recibo} - ${User.username}`},{ upsert: true });
            }
        }
        
        if(datos.tipo==='Eliminar'){
            if (datos.egreso._id){
                await EPT.deleteOne({_id:datos.egreso._id});
            }
            if(datos._id){
                await VENTA.deleteOne({_id:datos._id})
            }
            global.io.emit(`Actualizar_inventariopt`);
            global.io.emit(`Actualizar_venta`); 
            res.json({Respuesta:'Ok', datos});
            return
        }
        if (datos.formapago===null || datos.formapago['formapago-subtotal'].restan>0){
            datos.pendiente=true;
            datos.estado='pendiente';
        }else{
            datos.pendiente=false;
            datos.estado='cancelado';
        }
        if (datos.tipo==='Orden'){
            if (datos._id){
                await VENTA.updateOne({_id:datos._id},{valores:datos, actualizado:`${User.username}`},{ upsert: true });
            }else{
                //Guardar venta
                datos.recibo=datos.orden_venta.recibo;
                datos.fecha=moment(datos.orden_venta.fecha).format('YYYY-MM-DD');
                const cod_chs = await Codigo_chs({...datos});
                const hash_chs = await Hash_chs({...datos, cod_chs})
                const NuevoV = new VENTA({valores:datos, cod_chs, hash_chs, actualizado:`${User.username}`});
                await NuevoV.save();
            }
        }else{
            
            //Recibo
            
            datos.orden_venta.recibo= Recibo;
            datos.recibo= Recibo;
            datos.fecha = datos.orden_venta.fecha
                            ?   moment(datos.orden_venta.fecha).format('YYYY-MM-DD')
                            :   fecha;
            datos={recibo:Recibo, ...datos, tipo:'Venta'};
            //codigo para el egreso de producto terminado
            let codigo = await Serie({tabla:tabla_egresopt, id:'EPT', cantidad:6},Api);
            codigo=`${codigo} de ${Recibo}`;
            
            datos.egreso =anterior ? anterior.egreso : {codigo};
            
            
            let movimiento = [];
            for (var i=0; i< datos.orden_venta.producto.length; i++){
                let producto = datos.orden_venta.producto[i];
                // if (!producto.entregado){
                    const cantidad=producto.cantidad ? Number(producto.cantidad) : 1;
                    movimiento = [
                        ...movimiento, 
                        Movimiento({...producto, cantidad})
                    ];
                    let Prod = await PT.findOne({_id:producto._id});
                    Prod.valores.actual-= cantidad;
                    await PT.updateOne({_id:Prod._id},{valores:Prod.valores, actualizado:`Referencia: ${Recibo} - ${User.username}`},{ upsert: true });
                    // datos.orden_venta.producto[i].entregado=true;
                    datos.orden_venta.producto[i].cantidad=cantidad;
                // }
            }
            
            // for (var i=0; i< movimiento.length; i++){
            //     let producto = movimiento[i];
            //     let Prod = await PT.findOne({_id:producto._id});
            //     Prod.valores.actual-= producto.cantidad;
            //     await PT.updateOne({_id:Prod._id},{valores:Prod.valores, actualizado:`Referencia: ${Recibo} - ${User.username}`},{ upsert: true });
                
            // }
            // //Guardar el egreso producto terminado
            if (movimiento.length!==0){
                let valores = {codigo: datos.egreso.codigo, fecha: datos.fecha ? datos.fecha : fecha, movimiento};
                if (datos.egreso._id){
                    await EPT.updateOne({_id:datos.egreso._id},{valores, actualizado:`Referencia: ${Recibo} - ${User.username}`},{ upsert: true });        
                }else{
                    let cod_chs = await Codigo_chs({...valores});
                    let hash_chs = await Hash_chs({...valores, cod_chs})
                    const NuevoI = new EPT({valores, cod_chs, hash_chs, actualizado:`Referencia: ${Recibo} - ${User.username}`});
                    await NuevoI.save();
                    const result = await EPT.findOne({'valores.codigo':datos.egreso.codigo})
                    if (result){
                        datos.egreso._id=result._id;
                    }
                }
                
            }
            
            if (datos._id){
                await VENTA.updateOne({_id:datos._id},{valores:datos, actualizado:`${User.username}`},{ upsert: true });
            }else{
                const cod_chs = await Codigo_chs({...datos});
                const hash_chs = await Hash_chs({...datos, cod_chs})
                const NuevoV = new VENTA({valores:datos, cod_chs, hash_chs, actualizado:`${User.username}`});
                await NuevoV.save();
            }
        }
        global.io.emit(`Actualizar_inventariopt`);
        global.io.emit(`Actualizar_venta`); 
        res.json({Respuesta:'Ok', datos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}

sistemachsCtrl.Ventas = async (req, res)=>{
    let {User, Api, datos, hash} = req.body;
    User= typeof User==='string' ? JSON.parse(User) : User;
    const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
    // const igual= await sistemachsCtrl.Verifica_api(Api, true);
    if (hashn===hash){ // && igual) {
        datos = datos ? JSON.parse(datos) : {};
        const VENTA = await Model(Api,'sistemachs_Venta')//require(`../models/sistemachs_Venta`);
        let ventas = datos && datos.estado 
            ? await VENTA.find({$and:[{"valores.estado":datos.estado},{"valores.tipo":'Venta'}]})//find({$text: {$search: datos.estado, $caseSensitive: false}})
            : datos && datos.tipo
            ? await VENTA.find({"valores.tipo":datos.tipo})
            : datos && datos.fecha
            ? await VENTA.find({$and:[{"valores.tipo":'Venta'},{"valores.fecha":{$gte:datos.fecha.dia,$lte:datos.fecha.diaf}}]})//find({"valores.fecha":{$gte:datos.fecha.dia,$lte:datos.fecha.diaf}})
            : await VENTA.find();
        
        let ventas_p= ventas.filter(f=>f.valores.pendiente);
        let ventas_c= ventas.filter(f=>!f.valores.pendiente);
        let total=0;
        let pendiente = 0;
        let facturado = 0;
        ventas.map(val=>{
            let valor = val.valores.formapago 
                ? val.valores.formapago['formapago-subtotal'] 
                : {
                    total:0, tasa:0, totalb:0, restan:0, cancelar:0  
                  };
            total= Number(valor.total);
            total= valor.Tasa !==0  ? Number(total + valor.totalb / valor.Tasa) : total;
            pendiente+= Number(valor.restan);
            facturado+= Number(valor.cancelar);
            return val
        })

        res.json({Respuesta:'Ok', ventas, ventas_p, ventas_c, total, pendiente, facturado});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }
}
module.exports = sistemachsCtrl;