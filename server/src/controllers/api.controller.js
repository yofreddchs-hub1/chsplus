const serverCtrl = {};
const chalk = require('chalk');
const moment = require('moment');
const {Model} = require('../database/model');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const { Hash_texto, Hash_password, Hash_passwordA } = require('../servicios/encriptado');
const { Token, VerificarToken, Codigo_chs, Hash_chs
      } = require('../servicios/conexiones');
// const {valor_dolar} = require('../servicios/leerHTML');
// const User = require('../models/User_api');
const cloudinary = require("../servicios/api_cloudinary");
const fs = require('fs');


const admininicio= 'adminchs';
const claveinicio= 'CHS19824./'
const claveinicioapi= '4p1-';
const categoria= 0;
const dapi= global.Principal;
const sistema_api='chs';

NameAdmin = (Api)=>{
  return `admin-${Api}-wesichs`
}
General_referencia = () =>{
  return moment().format('x');
}
// Verifica el api
serverCtrl.Verifica_api = async (api, comparar=false) =>{
  const Apis = await Model(global.Principal,'Api')
  const apis = await Apis.findOne({'valores.api':dapi});
  if (apis===null){
    const key= await Codigo_chs({api:dapi});
    const hash_chs = await Hash_chs({cod_chs:key, valores:{api:dapi, key, master:true}});
    const newapi = new Apis({valores:{api, key, master:true}, cod_chs:key, hash_chs});
    await newapi.save();
  }
  
  let datos= await Apis.findOne({'valores.api': comparar ? typeof api==='object' ? api.api : api : api});
  if (datos===null){
    const key= await Codigo_chs({api});
    const hash_chs = await Hash_chs({cod_chs:key, valores:{api:dapi, key, master:false}});
    const newapi = new Apis({valores:{api, key, master:false}, cod_chs:key, hash_chs});
    await newapi.save();
    datos= await Apis.findOne({api});
  }
  return comparar ? datos.api===api.api || datos.api===api : datos;
}
//Verifica si el api existe en el sistema, si no lo crea
serverCtrl.Ver_api = async (req, res) =>{
  const {api, hash} = req.body;
  console.log('Por aqui', api)
  const hashn = await Hash_texto(JSON.stringify({api}));
  
  if (hash===hashn) {
    let datos= await serverCtrl.Verifica_api(api);
    res.json({Respuesta:'Ok', api:datos});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}
// utilizado para la verificacion de los datos
serverCtrl.Verificar_autenticidad = async ( datos, hash, token=false, inicia=false) =>{
  
  let {username, Api, password, mantener, crear}=datos;
  //  await serverCtrl.Tablas(`${Api.master ? '' : Api.api+'_'}User_api`);
  console.log('verificar autenticidad ',Api.valores && Api.valores.api ? Api.valores.api : Api)
  Api = Api.valores && Api.valores.api ? Api.valores.api : Api;
  const User = await Model(Api, Api && Api!==global.Principal 
                  ? Api+'_User_api' 
                  : 'User_api');//require(`../models/${Api.master ? '' : Api.api+'_'}User_api`);
  if (User===null){
    return {Respuesta:'Error', Mensaje:'No tienes acceso a los datos'};
  }  
  password=!inicia ? password : await Hash_password(password);
  const tokenN = await Token({username, password, fecha: new Date()});
  //  const hashn = await Hash_texto(JSON.stringify(datos));
  //  const cod_chs = await Codigo_chs({username, password, actualizado:username});
   const hash_chs = await Hash_chs({username, password, token:tokenN, actualizado:username});
   const users = await User.find();
   if (users.length===0){
     const clave= await Hash_password(claveinicio);
     const tokenA= await Token({username:admininicio, password: clave, fecha: new Date()});
    //  const codigo= await Codigo_chs({username:admininicio, password: clave,
    //                                   actualizado:'Sistema'});
     const hash_admin= await Hash_chs({username:admininicio, password: clave,
                                       token:tokenA, actualizado:'Sistema',
                                      //  cod_chs:codigo 
                                      });
     const newAdmin = new User({valores:{username:admininicio,
                                password:clave,
                                token:tokenN,
                                categoria:'0',
                                apis:[sistema_api],
                                foto:'/api/imagen/adminchs.png',
                                api:dapi,
                                master:true},
                                actualizado:'Sistema',
                                // cod_chs: codigo, 
                                hash_chs:hash_admin});
     await newAdmin.save();
   }
   //  Ver si existe usuario administrador
   // si cambias datos en nameAdmin, debes cambiarlo en userAdmin
   const nameAdmin = NameAdmin(Api);//`admin-${Api.api}-wesichs`
   let useradmin= [];
   try {
      useradmin=await User.find({$text: {$search: nameAdmin, $caseSensitive: true}});//await User.findOne({username});
   }catch(error) {
    console.log('Error-login',error);    
  }
   
   console.log('despues de ver useradmin', Api, )
   if ((Api.api && Api.api!==dapi) || (Api!==dapi)){
    useradmin = useradmin.filter(f=> f.valores.username===nameAdmin);
    if (useradmin.length===0){
      const clave= await Hash_password(`${claveinicioapi}${Api.api ? Api.api : Api}-4891`);
      const tokenA= await Token({username:nameAdmin, password: clave, fecha: new Date()});
      const codigo= await Codigo_chs({username:nameAdmin, password: clave,
                                      actualizado:'Sistema'});
      const valores = {
        username:nameAdmin, password:clave,
        nombre:'Administrador', apellido:'Sistema',
        categoria:'0', master:true, api: Api.api,
        token: tokenA
      }

      const hash_admin= await Hash_chs({cod_chs:codigo, valores, actualizado:'Sistema'});

      const newAdmin = new User({
                                cod_chs: codigo, 
                                valores,
                                hash_chs:hash_admin});
      await newAdmin.save();

    }
   }
   
   username=username.toLowerCase()
   let userS= await User.find({$text: {$search: username, $caseSensitive: false}});//await User.findOne({username});
   let user=null
   userS.map(d=>{
     if (d.username===username || d.valores.username===username){
       user=d.valores ? d.valores : d;
       user.api=Api.api ? Api.api : Api;
       user._id= d._id;
     }
   })
  //  console.log(user.password, password)
   // if (hashn === hash){

     if (inicia)  {
           if (user===null && crear){
             const newUser = new User({username, password,
                                       correo:username,
                                       token:tokenN, categoria:'5',
                                       api: Api.api ? Api.api : Api,
                                       master: Api.master,
                                       actualizado:username,
                                      //  cod_chs, 
                                       hash_chs});
             await newUser.save();
            //  return {Respuesta:'OK', user: newUser};
            user= await User.findOne({username});
            
            return {Respuesta:'OK', 
                      user: {_id:user._id, username: user.username, token: user.token, categoria: user.categoria, foto: user.foto,
                             api: user.api, master: user.master, passwordp: user.passwordp ? true : false,
                             ...user.personal ? {personal:user.personal} : {}
                            }
                   };
           }else if (user===null){
             return {Respuesta:'Error', Mensaje:'Usuario no existe', codigo:0};
           }else if (user !== null && user.username===username && user.password===password && (user.api===Api.api || user.api===Api || user.master)) {
             user.token=tokenN;
            //  user.hash_chs= await Hash_chs({
            //    username:user.username, password: user.password,
            //    token: user.token, //cod_chs: user.cod_chs,
            //    seq_chs: user.seq_chs, actualizado: user.actualizado
            //  });
             const newuser = await User.findOne({_id:user._id});
             newuser.valores=user;
             newuser.seq_chs= newuser.seq_chs + 1;
             newuser.actualizado = username;
             newuser.hash_chs= await Hash_chs({
                 username:user.username, password: user.password,
                 token: user.token
             });
             await newuser.save();
            //  return {Respuesta:'OK', user};
            return {Respuesta:'OK',
                      user: {_id:user._id, username: user.username, token: user.token, categoria: user.categoria, foto: user.foto,
                              api: user.api, master: user.master, passwordp: user.passwordp ? true : false,
                              ...user.personal ? {personal:user.personal} : {}
                            } 
                   }
           }else{
             return {Respuesta:'Error', Mensaje:'Usuario o contraseña no validos'};
           }

     }else{
       if (user !== null && user.username===username && (user.api===datos.api || user.master)) {
         if (user.token===datos.token){
          //  const ver = await VerificarToken(token);
          //  if (ver.Respuesta==='OK'){
             //return {Respuesta:'OK', user};
             
             return {Respuesta:'OK',
                      user: {_id:user._id, username: user.username, token: user.token, categoria: user.categoria, foto: user.foto,
                              api: user.api, master: user.master, passwordp: user.passwordp ? true : false,
                            } 
                    }
          //  }else{
          //    return {Respuesta:'Error', Mensaje:'Token expiro'};
          //  }

         }else{
           return {Respuesta:'Error', Mensaje:'Token no valido'};
         }
       }else{
         return {Respuesta:'Error', Mensaje:'Usuario o contraseña no validos'};
       }
     }
   // }else{
   //   return {Respuesta:'Error', Mensaje:'Error en hash'};
   // }
}

// ver en que se utiliza
Ver_conexion= async(datos, hash)=>{
  
 let resultado = await serverCtrl.Verificar_autenticidad(datos, hash, datos.token);
 return resultado
}

// verifica si el usuario sigue conectado, si a iniciado desde otro dispositivo o el token expiro
serverCtrl.Verificar = async (req, res) =>{
 const {User, hash} = req.body;
 console.log('Por verificar',User);
 let resultado = await serverCtrl.Verificar_autenticidad(User, hash);
 res.json(resultado);
}
//Login del sistema
serverCtrl.Login= async (req, res) => {
  const {username, Api, password, mantener, crear, hash} = req.body;
  console.log('login....',Api.valores && Api.valores.api ? Api.valores.api : Api)
  const datos= {username, Api, password, mantener, crear};
  let resultado = await serverCtrl.Verificar_autenticidad(datos, hash,false,inicia=true);
  // console.log('<<<<<<<<<<',resultado)
  if (resultado.Respuesta==='Error' && Api==='uecla'){
    //========================Para acceoso en uecla==================
    const tabla=['Docente','Representante','Estudiante'];
    const categoria={Docente: 3, Representante: 4, Estudiante:5};
    for (var i =0; i<tabla.length; i++){
      const DB = await Model(Api,`${Api}_${tabla[i]}`);
      let user= await DB.findOne({"valores.cedula":username});
      if (user===null){
        user= await DB.findOne({"valores.correo":username});
      }
      console.log('...... ver si es representante, estudiante, docente', tabla[i], user ? user.valores : user)
      const nuevapassword= await Hash_password(password);
      const nuevapasswordA= await Hash_passwordA(password);
      
      if (user !== null 
          &&  (((user.valores.password===null || user.valores.password===undefined) && user.valores.cedula===password) 
                || String(user.valores.password).toLowerCase()===String(nuevapassword).toLowerCase()
                || String(user.valores.password).toLowerCase()===String(nuevapasswordA).toLowerCase()
            ) 
        ) {
        
        const tokenN = await Token({username, password, fecha: new Date()});     
        let newuser={
                      username, password, categoria: categoria[tabla[i]],
                      _id:user._id, token:tokenN,
                      valores:user.valores
                    }

        if (resultado.Respuesta!=='OK'){
          resultado={
                      Respuesta:'OK', 
                      user:newuser, 
                      tipo: tabla[i], 
                      cambio:user.valores.password===null || user.valores.password===undefined 
                              ? 'Cambiar contraseña' 
                              : '' 
                    };
        }
        break;
      }else if(user!==null){
        
        resultado.Mensaje= 'Contraseña invalida';
        break
      }
    }
  }else if(Api==='uecla'){

  }
  
  res.json(resultado);
}
//Leer valores
serverCtrl.Ver_datos = async (tablas, Api, cantidad=20, sede=undefined, eliminados=false) =>{
  let datos={};
  try{
    return Promise.all(tablas.map(async(data)=>{
      if (data==='' || data===' ' || data===null ||data===undefined)
        return data
      // await serverCtrl.Tablas(data);
      let tabla = serverCtrl.ConSede(data,sede);
      const DB = await Model(Api,tabla); //require(`../models/${data}`);
      if (DB===null){
        console.log(chalk.inverse.red('Ver datos, no puede acceder >>>', data, Api))
        datos[data+'_cantidad']=0;
        datos[data]=[];
        return data
      }
      let count = await DB.estimatedDocumentCount();
      const menos = await DB.find({eliminado:true});
      count -= menos.length;
      // console.log('peticion>>>', data, count);
      if (count>=cantidad){
        // console.log(count)
        let pagina= 0;
        datos[data]=[];
        // while (pagina*cantidad<= count){
          const dbs = await DB.find({$or:[{eliminado:eliminados},{eliminado:undefined}]}).limit(cantidad).skip(pagina*cantidad).exec();
          datos[data]=[...datos[data],...dbs];
          pagina+=1;
        // }
        // console.log('Cargados>>>>>',data, datos[data].length, datos[data].length)
      }else{
        const dbs = await DB.find({$or:[{eliminado:eliminados},{eliminado:undefined}]});
        datos[data]=dbs;
      }
      
      datos[data+'_cantidad']=count;
      return data;
    })).then(()=>{
      return {Respuesta:'Ok', datos, dia: new Date()};
    });
  }catch(error) {
    console.log('Error-Getall',error);
    return {Respuesta:'Error'};
  }
}
serverCtrl.ConSede = (tabla, sede) =>{
  if (sede && sede!=='Coro'){
    sede = sede.replace(' ','_');
    console.log(sede);
    const pos = tabla.indexOf('_');
    tabla = tabla.slice(0,pos)+'_'+sede+tabla.slice(pos);
    console.log(tabla)
    // data = tabla;
  }
  return tabla
}
//Leer valores por condicion 
serverCtrl.Ver_datos_C = async (tablas, Api, condicion, sede=undefined, eliminados=false) =>{
  let datos={};
  try{
    return Promise.all(tablas.map(async(data)=>{
      if (['', ' ', undefined, null ].indexOf(data)!==-1){
        return data
      }
      // await serverCtrl.Tablas(data)
      let tabla = serverCtrl.ConSede(data,sede);
      const DB = await Model(Api, tabla); //require(`../models/${data}`);
      if (DB===null){
        return data
      }
      let dbs;
      if (['Ultimo', 'ultimo'].indexOf(condicion[data])!==-1 ){
        dbs = await DB.find().sort({$natural:-1}).limit(1);
      }else if(['cantidad', 'Cantidad'].indexOf(condicion[data])!==-1 ){
        dbs = await DB.estimatedDocumentCount();
        const menos = await DB.find({eliminado:true});
      count -= menos.length;
      }else if( condicion[data] !==undefined && Object.keys(condicion[data]).indexOf('pagina')!==-1 && Object.keys(condicion[data]).indexOf('condicion')!==-1){
        dbs = await DB.find(condicion[data].condicion)
                            .sort(condicion[data].sort ? condicion[data].sort : {$natural:-1})//'-createdAt')
                            .limit(condicion[data].cantidad)
                            .skip(condicion[data].pag*condicion[data].cantidad).exec();
        // console.log('Paginando', condicion[data].pag,condicion[data].cantidad, data, condicion[data].condicion)
      }else if( Object.keys(condicion[data] !==undefined && condicion[data]).indexOf('pagina')!==-1){
        dbs = await DB.find({$or:[{eliminado:eliminados},{eliminado:undefined}]})
                            .limit(condicion[data].cantidad)
                            .skip(condicion[data].pag*condicion[data].cantidad).exec();
        // console.log('Paginando', condicion[data].pag,condicion[data].cantidad, data)
      }else if (Object.keys(condicion[data]).length!==0 && Object.keys(condicion[data]).indexOf('condicion')!==-1 && Object.keys(condicion[data]).indexOf('sort')!==-1){
        console.log('.......',condicion[data])
        dbs = await DB.find(condicion[data].condicion).sort(condicion[data].sort);
      }else if (Object.keys(condicion[data]).length===0){
        dbs = await DB.find({$or:[{eliminado:eliminados},{eliminado:undefined}]});
      }else{
        await DB.createIndexes()
        dbs = await DB.find(condicion[data]);
      }

      datos[data]=dbs;
      return data;

    })).then(()=>{
      return {Respuesta:'Ok', datos, dia: new Date()};
    });
  }catch(error) {
    console.log('Error-Getall',error);
    return {Respuesta:'Error'};
  }
}
//Leer valores por pagina
serverCtrl.Ver_datos_pagina = async (tablas, Api, pagina, cantidad, sede) =>{
  let datos={};
  try{
    return Promise.all(tablas.map(async(data)=>{
      const DB = await Model(Api,data);//require(`../models/${data}`);
      const dbs = await DB.find();
      datos[data]=dbs;
      return data;
    })).then(()=>{
      return {Respuesta:'Ok', datos, dia: new Date()};
    });
  }catch(error) {
    console.log('Error-Getall',error);
    return {Respuesta:'Error'};
  }
}
//Leer todos los datos de distintas tablas
serverCtrl.Getall = async (req, res) =>{
  const {User, tablas, Api, cantidad, hash, sede} = req.body;
  const hashn = await Hash_texto(JSON.stringify({User, tablas, Api}));
  
  // const responder = await Ver_conexion(User, hash)
  // if (responder.Respuesta!=='OK'){
  //   res.json({Respuesta:'Error', mensaje:'no autorizado'});
  // }else 
  if (hash===hashn) {
    let datos= await serverCtrl.Ver_datos(tablas, Api, cantidad, sede);
    res.json(datos);
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }

}
//Leer datos con condiciones 
serverCtrl.Getall_C = async (req, res) =>{
  const {User, tablas, Api, condicion, hash, sede} = req.body;
  const hashn = await Hash_texto(JSON.stringify({User, tablas, condicion, Api}));
  
  // const responder = await Ver_conexion(User, hash)
  // if (responder.Respuesta!=='OK'){
  //   res.json({Respuesta:'Error', mensaje:'no autorizado'});
  // }else 
  
  if (hash===hashn) {
    let datos= await serverCtrl.Ver_datos_C(tablas, Api, condicion, sede);
    res.json(datos);
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }

}
//Leer datos pagina
serverCtrl.Getall_pagina = async (req, res) =>{
  const {User, tablas, pagina, cantidad, hash, sede} = req.body;
  const hashn = await Hash_texto(JSON.stringify({User, tablas, pagina, cantidad}));
  if (hash===hashn) {
    let datos= await serverCtrl.Ver_datos_pagina(tablas, Api, pagina, cantidad, sede);
    res.json(datos);
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }

}
serverCtrl.Copiar = async(req, res)=>{
  const {User, tablao, tablad, condicion, Api, hash} = req.body;
  const hashn = await Hash_texto(JSON.stringify({User, tablao, tablad, condicion, Api}));
  console.log('...................por copiar')
  if (hash===hashn) {
    console.log(tablao, tablad);
    const Origen = await Model(Api,tablao);
    const Destino = await Model(Api,tablad);
    const datos = await Origen.find();
    for (var i=0; i< datos.length; i++){
      let dato = datos[i];
      await Destino.updateOne({_id:dato._id},{valores:{...dato.valores}, cod_chs:dato.cod_chs, hash_chs:dato.hash_chs},{ upsert: true })
      // const newDato = new Destino({...dato});
      // await newDato.save()
    }
    res.json({Respuesta:'Ok'});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}
Eliminar_imagen =(imagen)=>{
  try{
    
    // const anterior = imagen.replace(`/api/imagen/`,'')
    // const direct= __dirname.replace(`${path.sep}src${path.sep}controllers`,`${path.sep}archivos${path.sep}imagenes`);
    // fs.unlinkSync(direct+path.sep+anterior);
    cloudinary.uploader.destroy(imagen);
  }catch(error) {
    console.log('Error en eliminar imagen',error)
  }

}
//Guardar datos en tabla
serverCtrl.Tablas = async(tabla, Api)=>{
  try{
    const DB = await Model(Api, tabla)//require(`../models/${tabla}`);
    return DB
  }catch(error) {
      if (tabla==='' || tabla===' ' || tabla===null || tabla===undefined)
        return 
      const direct= __dirname.replace('controllers',`models${path.sep}${tabla}.js`);
      fs.stat(direct, (err) => {
        if (!err) {
            console.log('Existe>>>', direct);
        }else if (err.code === 'ENOENT') {
            console.log('No existe');
            let campo= tabla.toLowerCase();
            const campo1=campo;
            campo= campo.charAt(0).toUpperCase() + campo.slice(1);
            const codigo = `const { Schema, model } = require('mongoose');

              const ${campo1}Schema = new Schema(
                  {
                      campos: {},
                      valores:{},
                      actualizado:String,
                      seq_chs:{
                        type: Number,
                        default: 0,
                        set:(v)=>{
                          return Number(v)+1
                        }
                      },
                      cod_chs:{
                        type:String,
                        unique:true
                      },
                      hash_chs:String
                  }, {
                      timestamps: true
                  });
                  ${campo1}Schema.index({'$**': 'text'});
              module.exports = model('${campo}', ${campo1}Schema);`
            
            fs.writeFileSync(direct, codigo);
            console.log('Creada tabla >>>>>>', tabla)
            return require(`../models/${tabla}`);
        }
      });

      return 
      
  }
}
serverCtrl.Setall = async (req, res) =>{
  let {User, Api, datos, tabla, hash, sede} = req.body;
  User= typeof User==='string' ? JSON.parse(User) : User;
  // console.log('>>>>>>>>>',typeof Api==='string' ? Api : Api.valores.api, datos, tabla)
  // Api= typeof Api==='string' ? JSON.parse(Api) : Api;
  const hashn = await Hash_texto(JSON.stringify({User, Api, datos, tabla}));
  // const igual= await serverCtrl.Verifica_api(Api, true);

  if (hashn===hash){ //&& igual) {
    let newdatos= typeof datos === 'string' ? JSON.parse(datos) : datos;
    // newdatos['filename']= newdatos['filename'] && newdatos['filename']!==undefined?newdatos['filename']:[];
    // newdatos['fileid']=newdatos['fileid'] && newdatos['fileid']!==undefined ? newdatos['fileid'] :[];
    try{
  
      if ((tabla==='null' || tabla==='') && req.files ){
        req.files.map(val=>{
          newdatos[val.fieldname]='/api/imagen/'+val.filename//[...newdatos['filename'],req.files[val][0].filename];
          return val;
        })
        
        res.json({Respuesta:'Ok', newdatos});
      }
      // await serverCtrl.Tablas(tabla)
      const data = serverCtrl.ConSede(tabla, sede);
      const DB = await Model(Api, data);//require(`../models/${tabla}`);
      if (newdatos['unico'] && newdatos._id===undefined){
        let datos = await DB.find(
            {$text: {$search: newdatos['multiples_valores'] ? newdatos.valores[newdatos['unico']] : newdatos[newdatos['unico']] , 
            $caseSensitive: false}});
        
        let continuar = true;
        
        datos.map(d=>{
          if ((newdatos['multiples_valores'] && d.valores[newdatos['unico']]===newdatos.valores[newdatos['unico']])
              || (!newdatos['multiples_valores'] && d[newdatos['unico']]===newdatos[newdatos['unico']])
          ){
            continuar = false
          }
        })
        
        if (continuar===false){
          res.json({Respuesta:'Error', mensaje:`Nombre de usuario ya existe`});
          
          return
        }
      }
      if (req.files){
        
        let archivos={}
        for  (var i=0; i<req.files.length; i++){
          const result = await cloudinary.uploader.upload(req.files[i].path);
          archivos[req.files[i].fieldname]= result.secure_url;
          archivos[req.files[i].fieldname+'-id']= result.public_id;
        }
        
        const valor_verificar = await DB.findOne({_id:newdatos._id})
        if(newdatos['multiples_valores']){
          req.files.map(val=>{
            if (valor_verificar!==null 
                && valor_verificar.valores[val.fieldname]!=='' 
                && valor_verificar.valores[val.fieldname]!==null 
                && valor_verificar.valores[val.fieldname]!==undefined
              ) 
              Eliminar_imagen(valor_verificar.valores[val.fieldname+'-id'])
            // newdatos.valores[val.fieldname]='/api/imagen/'+val.filename//[...newdatos['filename'],req.files[val][0].filename];
            newdatos.valores[val.fieldname]=archivos[val.fieldname];
            newdatos.valores[val.fieldname+'-id']=archivos[val.fieldname+'-id'];
            return val;
          })
        }else{
          req.files.map(val=>{
            if (valor_verificar!==null && valor_verificar[val.fieldname]!=='' && valor_verificar[val.fieldname]!==null && valor_verificar[val.fieldname]!==undefined) 
              Eliminar_imagen(valor_verificar[val.fieldname+'-id'])
            // newdatos[val.fieldname]='/api/imagen/'+val.filename//[...newdatos['filename'],req.files[val][0].filename];
            newdatos[val.fieldname]=archivos[val.fieldname]
            newdatos[val.fieldname+'-id']=archivos[val.fieldname+'-id']
            return val;
          })
        }
    
      }
      // console.log(newdatos)
      
      if (newdatos.newpassword){
        newdatos.password= await Hash_password(newdatos.newpassword);
        delete newdatos.newpassword
      }else if (newdatos['multiples_valores'] && newdatos.valores.newpassword){
        newdatos.valores.password= await Hash_password(newdatos.valores.newpassword);
        delete newdatos.valores.newpassword
      }else{
        delete newdatos.password
      }
      if (newdatos._id){//(newdatos._id){
        const hash_chs = await Hash_chs({...newdatos})
        await DB.updateOne({_id:newdatos._id},{...newdatos, hash_chs, actualizado:User && User.username ? User.username : Api},{ upsert: true });
      } else {
        console.log(newdatos.valores);
        let cod_chs = await Codigo_chs({...newdatos['multiples_valores'] ? newdatos.valores : newdatos});
        const hash_chs = await Hash_chs({...newdatos, cod_chs})
        const Nuevo = new DB({...newdatos, cod_chs, hash_chs, actualizado:User && User.username ? User.username : Api});
        await Nuevo.save();
      }
      const resultado=await DB.find()
      console.log('Actualizar_'+tabla)
      // global.io.emit('Actualizar_'+tabla,{tabla}) //datos:resultado})
      global.io.emit('Actualizar',{tabla}) //datos:resultado})
      res.json({Respuesta:'Ok', resultado});
    }catch(error) {
      console.log('Error-Setall',error, error.keyValue);
      res.json({Respuesta:'Error', code: error.code});
    }

  }else{
    res.json({Respuesta:'Error', mensaje: hashn!==hash ? 'hash invalido' : igual ? 'error igualdad api' : 'por otra cosa'});
  }

}

//Eliminar un registro de varias tablas
serverCtrl.Delall = async (req, res) =>{
  const {dato, Api, tablas, hash} = req.body;
  const hashn = await Hash_texto(JSON.stringify({dato, Api, tablas}));
  // const igual= await serverCtrl.Verifica_api(Api, true);
  console.log('Eliminar en ', Api)
  if (hash===hashn){ // && igual) {
    try{
      Promise.all(tablas.map(async(data)=>{
        const DB = await Model(Api, data);//require(`../models/${data}`);
        const valor_verificar = await DB.findOne({_id:dato._id})
        
        let imagenes= Object.keys(valor_verificar.valores).filter(f=>f.indexOf('-id')!==-1);
        imagenes.map(val=>{
          Eliminar_imagen(valor_verificar.valores[val])
        })
        // await DB.deleteOne({_id:dato._id});
        // const anterior = await DB.findOne({_id:dato._id});
        
        await DB.updateOne({_id:dato._id},{eliminado:true, actualizado:dato.user},{ upsert: true });
        //elimina definitivamente verficar con las versiones de electron
        await DB.deleteOne({_id:dato._id});
        // const resultado=await DB.find()
        global.io.emit('Actualizar',{data})//, datos:resultado})
        try{
          // const direct = __dirname.replace('/src/controllers','/archivos/imagenes/');
          // dato.filename.map(img=>
          //   fs.unlinkSync(direct+img)  
          // )
          await cloudinary.uploader.destroy(dato.fileid[0]);
          if (valor_verificar.valores.files){
            for (var i =0; i<valor_verificar.valores.files.length ; i++){
              let img=valor_verificar.valores.files[i].split('/');
              console.log(img, img[img.length-1], img[img.length-1].split('.'));

            }
          }
        }catch (err) {
          
        }
        // if (Object.keys(dato).indexOf('fileid')!==-1){
        //   dato.fileid.map( fileid=>
        //     global.gfs.delete(new mongoose.Types.ObjectId(fileid), (err, data) => {  
        //     })
        //   ) 
          
        // }
        return data;
      })).then(async()=>{
        let datos= await serverCtrl.Ver_datos(tablas, Api);
        // console.log('Despues de eliminar',datos);
        res.json(datos);
      });

    }catch(error) {
      console.log('Error-Delall',error);
      res.json({Respuesta:'Error'});
    }

  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}
//ver datos del sistema
serverCtrl.Leer_data = async (req, res) =>{
  const {User, Api, archivo, valord, hash} = req.body;
  const hashn = await Hash_texto(JSON.stringify({User, Api, archivo, valord}));
  // const igual= await serverCtrl.Verifica_api(Api, true);
  
  if (hashn===hash){ // && igual) {
    const direct= __dirname.replace('controllers',archivo);
    let datos;
    try{
        let data = fs.readFileSync(direct, 'utf8');
        datos=data;
        // if (Api.master){
        //   datos = data;  
        // }else{
        //   datos = JSON.stringify(JSON.parse(data)['Api_'+Api.api])
        //   // console.log('No es master', datos)
        // }
        
    } catch (err) {
        console.log('no existe');
        datos=JSON.stringify(valord);
        
        fs.writeFileSync(direct, JSON.stringify(valord, null, 2));
    }
    // valor_dolar();
    res.json({Respuesta:'Ok', datos});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash o api invalido'});
  }

}
//cambiar datos
serverCtrl.Guardar_data = async (req, res) =>{
  const {User, Api, archivo, valor, hash} = req.body;
  const hashn = await Hash_texto(JSON.stringify({User, Api, archivo, valor}));
  // const igual= await serverCtrl.Verifica_api(Api, true);
  if (hash===hashn){ // && igual) {
    const direct= __dirname.replace('controllers',archivo);
    fs.writeFileSync(direct, valor);
    let api= archivo.replace('data/','').replace('.js','');
    console.log(api)
    global.io.emit(`Refrescar-${api}`,valor)
    res.json({Respuesta:'Ok'});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash o api invalido'});
  }

}

//cambiar datos
serverCtrl.Eliminar_data = async (req, res) =>{
  const {User,Api, archivo, hash} = req.body;
  const hashn = await Hash_texto(JSON.stringify({User, Api, archivo}));
  // const igual= await serverCtrl.Verifica_api(Api, true);
  if (hash===hashn){ // && igual) {
    const direct= __dirname.replace('controllers',archivo);
    fs.unlinkSync(direct);
    res.json({Respuesta:'Ok'});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }

}
// ver bases de datos existentes
serverCtrl.DataBase = async (req, res) =>{
  const {User, Api, hash} = req.body;
  const hashn = await Hash_texto(JSON.stringify({User, Api}));
  if (hash===hashn) {
    // const direct= __dirname.replace('controllers','models');
    // let data = fs.readdirSync(direct, 'utf8');
    // let models=data.map(valor =>  valor.replace('.js', ''));
    await Model(Api,'databasechs', true);
    const api = typeof Api==='string' ? Api : Api.valores.api
    let models = await global.DataBase[api].db.listCollections().toArray();
    models = models.map(v=> v.name).sort((a,b)=> a>b ? 1 : -1);
    const database = models;
    const DB = await Model(Api,models[0][models[0].length-1] ==='s' ? models[0].slice(0, -1) : models[0]);//require(`../models/${models[0]}`);
    const datos = await DB.find();
    res.json({Respuesta:'Ok', models, datos, database});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }

}
// ver configuracion de apis
serverCtrl.VerApis = async (req, res) =>{
  const {User, hash} = req.body;
  const hashn = await Hash_texto(JSON.stringify({User}));
  if (hash===hashn) {
    const direct= __dirname.replace('controllers','data');
    let data = fs.readdirSync(direct, 'utf8');
    let lista=data.map(valor =>  valor.replace('.js', ''));
    lista = lista.filter(f=> ['datos copy', 'ejemplos.json', 'ejemploson', 'datos copy 2'].indexOf(f)===-1);
    res.json({Respuesta:'Ok', lista});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }

}

//Guardar varios datos, para estudiantes y representantes
serverCtrl.Varios_Datos = async (req, res) =>{
  let {User, datos, tabla, hash} = req.body;
  // console.log('aqui');
  const hashn = await Hash_texto(JSON.stringify({User, datos, tabla}));
  if (hashn===hash) {
    datos=JSON.parse(datos);
    // console.log(datos)
    
    try{
      const DB = require(`../models/${tabla}`);
      datos.map(async(val)=>{
        val.cod_chs= await Codigo_chs({cedula:val.cedula, nombres: val.nombres, apellidos: val.apellidos});
        val.hash_chs =await Hash_chs(val);
        await DB.updateOne({cod_chs:val.cod_chs},val,{ upsert: true });
      })
      
      const resultado=await DB.find()
      res.json({Respuesta:'Ok', resultado});
    }catch(error) {
      console.log('Error-SetActualizar',error, error.keyValue);
      res.json({Respuesta:'Error', code: error.code});
    }

  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }

}

// ver bases de datos existentes
serverCtrl.Valor_Dolar = async (req, res) =>{
  const {User, hash} = req.body;
  const hashn = await Hash_texto(JSON.stringify({User}));
  
  if (hash===hashn) {
    const {valor_dolar} = require('../servicios/leerHTML');
    if(global.global_tiempo_dolar) clearTimeout(global.global_tiempo_dolar)
    valor_dolar();
    console.log(global.global_cambio);
    res.json({Respuesta:'Ok', valor: global.global_cambio});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }

}

//Ver imagenes
serverCtrl.Ver_Imagen = async (req, res) =>{
  
  global.gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
        return res.status(200).json({
            success: false,
            message: 'No files available',
        });
    }

    // if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml' || files[0].contentType === 'video/mp4') {
        // render image to browser
        global.gfs.openDownloadStreamByName(req.params.filename).pipe(res);
        
    // } else {
    //     res.status(404).json({
    //         err: 'Not an image',
    //     });
    // }
  });
}

//cambiar datos
serverCtrl.Guardar_data_excel = async (req, res) =>{
  const {User, valores, hash} = req.body;
  const hashn = await Hash_texto(JSON.stringify({User, valores}));
  if (hash===hashn) {
    console.log(valores.filename)
    global.Registra(valores.filename,valores.datos)
    res.json({Respuesta:'Ok'});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }

}

//cambiar datos
serverCtrl.Posicion_geo = async (req, res) =>{
  const {User, valores, hash} = req.body;
  const hashn = await Hash_texto(JSON.stringify({User, valores}));
  if (hash===hashn) {
    if (User){
      const BD = require('../models/User_api');
      await BD.updateOne({_id:User._id},{coordenadas:valores},{ upsert: true });
      Enviar_usuario();
    } 
    res.json({Respuesta:'Ok'});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }

}


// para egew
// Cuentas de wesipay
Buscar_completo= async(DB,User)=>{
  try{
    let datos = await DB.find();
    datos=  datos.filter(f=> f.valores.username===User.username);
    return datos
  }catch(error) {
    console.log('Error buscar data completa',error)
    return []
  }
}
Buscar_data = async(DB, User) =>{
  try{
    let datos = await DB.find(
                              {$text: {$search: User.username , 
                              $caseSensitive: false}}
                            );
    datos=  datos.filter(f=> f.valores.username===User.username);
    return datos
  }catch(error) {
    console.log('Error buscar data')//,error)
    return await Buscar_completo(DB,User)
  }
}

Crear_cuenta_principal = async(DB, User)=>{
  let valores={
    tipo:"0", divisa: "0",
    referencia: "Principal",
    cod_cuenta: `${User.username}-wesipay-VED-Principal`,
    disponible:0,
    diferidos: 0,
    username:User.username
  };
  let cod_chs = await Codigo_chs({...valores});
  const hash_chs = await Hash_chs({...valores, cod_chs})
  const Nuevo = new DB({valores, cod_chs, hash_chs, actualizado:'Sistema'});
  await Nuevo.save();
}

serverCtrl.Egew_cuentas_wesi = async (req, res) =>{
  let {User, Api, hash} = req.body;
  User= typeof User==='string' ? JSON.parse(User) : User;
  const hashn = await Hash_texto(JSON.stringify({User, Api}));
  // const igual= await serverCtrl.Verifica_api(Api, true);

  if (hashn===hash){ // && igual) {
    const DB = require(`../models/egew_cuenta_wesi`);
    
    let datos = await Buscar_data(DB,User)
    
    if (datos.length===0){
      await Crear_cuenta_principal(DB,User);
      datos= await Buscar_data(DB,User);  
    }
    res.json({Respuesta:'Ok', datos});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}

serverCtrl.Egew_cuentas_banco = async (req, res) =>{
  let {User, Api, hash} = req.body;
  User= typeof User==='string' ? JSON.parse(User) : User;
  const hashn = await Hash_texto(JSON.stringify({User, Api}));
  // const igual= await serverCtrl.Verifica_api(Api, true);

  if (hashn===hash){ // && igual) {
    const DB = require(`../models/egew_cuenta_banco`);
    console.log('buscar cuenta banco')
    let datos = await Buscar_data(DB,User)
    res.json({Respuesta:'Ok', datos});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}

serverCtrl.Egew_cuentas_sistema = async (req, res) =>{
  let {User, Api, hash} = req.body;
  User= typeof User==='string' ? JSON.parse(User) : User;
  const hashn = await Hash_texto(JSON.stringify({User, Api}));
  // const igual= await serverCtrl.Verifica_api(Api, true);

  if (hashn===hash){ // && igual) {
    const DB = require(`../models/egew_cuenta_banco`);
    const nameAdmin = NameAdmin(Api)
    console.log('buscar cuenta banco admin')
    let datos = await Buscar_data(DB,{username:nameAdmin})
    res.json({Respuesta:'Ok', datos});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}

serverCtrl.Egew_movimientos = async (req, res) =>{
  let {User, Api, cod_cuenta, hash} = req.body;
  User= typeof User==='string' ? JSON.parse(User) : User;
  const hashn = await Hash_texto(JSON.stringify({User, Api, cod_cuenta}));
  // const igual= await serverCtrl.Verifica_api(Api, true);

  if (hashn===hash){ // && igual) {
    // await serverCtrl.Tablas('egew_movimiento')
    const DB = await Model(Api, 'egew_movimiento');//require(`../models/egew_movimiento`);
    console.log('movimientos>>>>', cod_cuenta)
    if (cod_cuenta===undefined){
      res.json({Respuesta:'Ok', datos:[]});
      return 
    }
    let datos
    try{
      datos = await DB.find(
          {$text: {$search: cod_cuenta , 
          $caseSensitive: false}});
    }catch(error) {
      console.log('Error en movimientos>>>>>')//,error)
      datos= await DB.find();
    }
    datos=  datos.filter(f=> f.valores.monederos===cod_cuenta)
    res.json({Respuesta:'Ok', datos});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}

serverCtrl.Egew_comprarWesi = async (req, res) =>{
  let {User, Api, datos, hash} = req.body;
  User= typeof User==='string' ? JSON.parse(User) : User;
  const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
  // const igual= await serverCtrl.Verifica_api(Api, true);

  if (hashn===hash){ // && igual) {
    // await serverCtrl.Tablas('egew_compra_wesi');
    // await serverCtrl.Tablas('egew_movimiento');

    const DB = await Model(Api, 'egew_compra_wesi');//require(`../models/egew_compra_wesi`);
    const Cuenta = await Model(Api, 'egew_cuenta_banco');//require(`../models/egew_cuenta_banco`);
    const  Movimiento= await Model(Api, 'egew_movimiento');//require(`../models/egew_movimiento`);
    const Monedero = await Model(Api, 'egew_cuenta_wesi');//require(`../models/egew_cuenta_wesi`);
    const cuenta =  await Cuenta.findOne({_id: datos.cuenta})
    try{
      //Guarda los datos de la compra
      datos.api=Api.api;
      datos.cod_referencia = General_referencia();
      datos.status= 'Por confirmar';
      let cod_chs= await Codigo_chs({...datos});
      let hash_chs= await Hash_chs({cod_chs, valores:datos, actualizado:User.username})
      const nuevo = new DB({cod_chs, valores:datos, hash_chs});
      await nuevo.save();
      const compra= await DB.findOne({cod_chs});
      
      //Guardar movimiento
      datos.cod_compra= compra._id;
      datos.cod_chs_compra= compra.cod_chs;
      datos.status= 'Por confirmar';
      datos.descripcion= `Compra WESICOIN realizada por el monto de ${datos.monto}`;
      cod_chs= await Codigo_chs({...datos});
      hash_chs= await Hash_chs({cod_chs, valores:datos, actualizado:User.username})
      const nuevom = new Movimiento({cod_chs, valores:datos, hash_chs});
      await nuevom.save();

      //Actualiza los datos en el monedero
      let monedero =  await Monedero.findOne({_id: datos.monederos});
      monedero.valores.diferidos+= Number(datos.monto);
      hash_chs = await Hash_chs({cod_chs: monedero.cod_chs, valores:monedero.valores, actualizado:User.username});
      await Monedero.updateOne({_id: datos.monederos},{ valores: monedero.valores, hash_chs, actualizado:User.username},{ upsert: true });
      console.log(`Actualizar_${Api.api}_compra`)
      global.io.emit(`Actualizar_${Api.api}_compra`); //datos:resultado})
      res.json({Respuesta:'Ok'});
    }catch(error) {
      console.log('Error-CompraWesi', error.keyValue);
      res.json({Respuesta:'Error', code: error.code});
    }

  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}

serverCtrl.Egew_pagarWesi = async (req, res) =>{
  let {User, Api, datos, hash} = req.body;
  User= typeof User==='string' ? JSON.parse(User) : User;
  const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
  // const igual= await serverCtrl.Verifica_api(Api, true);

  if (hashn===hash){ // && igual) {
    // await serverCtrl.Tablas('egew_cuenta_wesi');
    // await serverCtrl.Tablas('egew_movimiento');

    const  Movimiento= await Model(Api, 'egew_movimiento');//require(`../models/egew_movimiento`);
    const Monedero = await Model(Api, 'egew_cuenta_wesi');//require(`../models/egew_cuenta_wesi`);
    try{
      const DB = require(`../models/${Api.master ? '' : Api.api+'_'}User_api`);
      let user = await DB.findOne({_id:User._id});
      const password = await Hash_password(datos.origen.password);
      if (user.valores.passwordp!==password){
        res.json({Respuesta:'Error', mensaje:'Contraseña invalida'});
        return
      }
      const cod_referencia = General_referencia();
      const comision = 0.01;
      let monto= Number(datos.origen.monto) * comision /100;
      
      // Monedero origen
      let monedero_origen= await Monedero.findOne({_id:datos.origen.monedero})
      monedero_origen.valores.disponible -= (Number(datos.origen.monto)+ monto);
      let hash_chs= await Hash_chs({cod_chs:monedero_origen.cod_chs, valores:monedero_origen.valores, actualizado:User.username})

      // Movimientos para la cuenta administradora
      const nameAdmin = NameAdmin(Api);
      console.log('buscar cuenta monedero')
      let monederos_admin= await Buscar_data(Monedero,{username:nameAdmin});
      monederos_admin=monederos_admin.filter(f=> f.valores.tipo===monedero_origen.valores.tipo && f.valores.divisa===monedero_origen.valores.divisa);
      if (monederos_admin.length===0){
        let cod_cuenta= monedero_origen.valores.cod_cuenta.split('-');
        cod_cuenta = `${nameAdmin}-${cod_cuenta[1]}-${cod_cuenta[2]}-${cod_cuenta[3]}`
        let valores ={
          tipo:monedero_origen.valores.tipo, 
          divisa: monedero_origen.valores.divisa,
          referencia: "Principal",
          cod_cuenta: cod_cuenta,
          disponible:monto,
          diferidos: 0,
          username:nameAdmin
        }
        let cod_chs = await Codigo_chs({...valores});
        const hash_chs1 = await Hash_chs({...valores, cod_chs})
        const Nuevo = new Monedero({valores, cod_chs, hash_chs: hash_chs1, actualizado:'Sistema'});
        await Nuevo.save();
        monederos_admin= await Buscar_data(Monedero,{username:nameAdmin});
        monederos_admin=monederos_admin.filter(f=> f.valores.tipo===monedero_origen.valores.tipo && f.valores.divisa===monedero_origen.valores.divisa)[0];
      }else{
        monederos_admin= monederos_admin[0];
        monederos_admin.valores.disponible += monto;
        const hash_chs1= await Hash_chs({cod_chs:monederos_admin.cod_chs, valores:monederos_admin.valores, actualizado:User.username}) 
        await Monedero.updateOne({_id: monederos_admin._id},{ valores: monederos_admin.valores, hash_chs:hash_chs1, actualizado:User.username},{ upsert: true });
      }

       //Movimientos administrativo
       let movimiento_admin = {
        api:Api.api,
        cod_referencia: cod_referencia,
        monederos: String(monederos_admin._id),
        monto: `${monto}`,
        username: datos.origen.username,
        descripcion:`Comision por pago de ${datos.origen.username} a ${datos.destino.username}, monto ${monto}`
      }

      // Monedero destino
      let monedero_destino= await Monedero.findOne({_id:datos.destino.monedero})
      monedero_destino.valores.disponible += Number(datos.destino.monto);

      //Movimientos origen
      let movimiento_origen = {
        api:Api.api,
        cod_referencia: cod_referencia,
        monederos: datos.origen.monedero,
        monto: `-${Number(datos.origen.monto) + monto}`,
        username: datos.destino.username,
        descripcion:`Monto cancelado a ${datos.destino.username}, por un monto de -${datos.destino.monto}, comision ${monto}`
      }

      //Movimientos origen
      let movimiento_destino = {
        api:Api.api,
        cod_referencia: cod_referencia,
        monederos: datos.destino.monedero,
        monto: `${datos.destino.monto}`,
        username: datos.origen.username,
        descripcion:`Pago recibido por ${datos.origen.username}, por un monto de ${datos.destino.monto}`
      }
      
      await Monedero.updateOne({_id: monedero_origen._id},{ valores: monedero_origen.valores, hash_chs, actualizado:User.username},{ upsert: true });
      hash_chs= await Hash_chs({cod_chs:monedero_destino.cod_chs, valores:monedero_destino.valores, actualizado:User.username})
      await Monedero.updateOne({_id: monedero_destino._id},{ valores: monedero_destino.valores, hash_chs, actualizado:User.username},{ upsert: true });
      
      let cod_chs= await Codigo_chs({...movimiento_origen});
      hash_chs= await Hash_chs({cod_chs, valores:movimiento_origen, actualizado:User.username})
      let nuevom = new Movimiento({cod_chs, valores:movimiento_origen, hash_chs});
      await nuevom.save();
      cod_chs= await Codigo_chs({...movimiento_destino});
      hash_chs= await Hash_chs({cod_chs, valores:movimiento_destino, actualizado:User.username})
      nuevom = new Movimiento({cod_chs, valores:movimiento_destino, hash_chs});
      await nuevom.save();
      cod_chs= await Codigo_chs({...movimiento_admin});
      hash_chs= await Hash_chs({cod_chs, valores:movimiento_admin, actualizado:User.username})
      nuevom = new Movimiento({cod_chs, valores:movimiento_admin, hash_chs});
      await nuevom.save();
      global.io.emit(`Actualizar_${Api.api}_compra`); //datos:resultado})
      res.json({Respuesta:'Ok'});
    }catch(error) {
      console.log('Error-PagarWesi', error.keyValue);
      res.json({Respuesta:'Error', code: error.code});
    }

  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}

serverCtrl.Egew_transferirWesi = async (req, res) =>{
  let {User, Api, datos, hash} = req.body;
  User= typeof User==='string' ? JSON.parse(User) : User;
  const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
  // const igual= await serverCtrl.Verifica_api(Api, true);

  if (hashn===hash){ // && igual) {
    // await serverCtrl.Tablas('egew_cuenta_wesi');
    // await serverCtrl.Tablas('egew_movimiento');

    const  Movimiento= await Model(Api, 'egew_movimiento');//require(`../models/egew_movimiento`);
    const Monedero = await Model(Api, 'egew_cuenta_wesi');//require(`../models/egew_cuenta_wesi`);
    try{
      const DB = await Model(Api, `${Api.master ? '' : Api.api+'_'}User_api`);//require(`../models/${Api.master ? '' : Api.api+'_'}User_api`);
      
      const cod_referencia = General_referencia();
      const comision = 0.01;
      let monto= Number(datos.monto) * comision /100;
      
      // Monedero origen
      let monedero_origen= await Monedero.findOne({_id:datos.origen})
      monedero_origen.valores.disponible -= (Number(datos.monto)+ monto);
      let hash_chs= await Hash_chs({cod_chs:monedero_origen.cod_chs, valores:monedero_origen.valores, actualizado:User.username})

      // Movimientos para la cuenta administradora
      const nameAdmin = NameAdmin(Api);
      console.log('buscar cuenta monedero')
      let monederos_admin= await Buscar_data(Monedero,{username:nameAdmin});
      monederos_admin=monederos_admin.filter(f=> f.valores.tipo===monedero_origen.valores.tipo && f.valores.divisa===monedero_origen.valores.divisa);
      
      if (monederos_admin.length===0){
        let cod_cuenta= monedero_origen.valores.cod_cuenta.split('-');
        cod_cuenta = `${nameAdmin}-${cod_cuenta[1]}-${cod_cuenta[2]}-${cod_cuenta[3]}`
        let valores ={
          tipo:monedero_origen.valores.tipo, 
          divisa: monedero_origen.valores.divisa,
          referencia: "Principal",
          cod_cuenta: cod_cuenta,
          disponible:monto,
          diferidos: 0,
          username:nameAdmin
        }
        let cod_chs = await Codigo_chs({...valores});
        const hash_chs1 = await Hash_chs({...valores, cod_chs})
        const Nuevo = new Monedero({valores, cod_chs, hash_chs: hash_chs1, actualizado:'Sistema'});
        await Nuevo.save();
        monederos_admin= await Buscar_data(Monedero,{username:nameAdmin});
        monederos_admin=monederos_admin.filter(f=> f.valores.tipo===monedero_origen.valores.tipo && f.valores.divisa===monedero_origen.valores.divisa)[0];
      }else{
        monederos_admin= monederos_admin[0];
        monederos_admin.valores.disponible += monto;
        const hash_chs1= await Hash_chs({cod_chs:monederos_admin.cod_chs, valores:monederos_admin.valores, actualizado:User.username}) 
        await Monedero.updateOne({_id: monederos_admin._id},{ valores: monederos_admin.valores, hash_chs:hash_chs1, actualizado:User.username},{ upsert: true });
      }
      
      //Movimientos administrativo
      let movimiento_admin = {
        api:Api.api,
        cod_referencia: cod_referencia,
        monederos: String(monederos_admin._id),
        monto: `${monto}`,
        username: User.username,
        descripcion:`Comision por transferencia de ${User.username} a ${User.username}, monto ${monto}`
      }
      
      // Monedero destino
      let monedero_destino= await Monedero.findOne({_id:datos.destino})
      monedero_destino.valores.disponible += Number(datos.monto_destino);
      
      //Movimientos origen
      let movimiento_origen = {
        api:Api.api,
        cod_referencia: cod_referencia,
        monederos: datos.origen,
        monto: `-${Number(datos.monto) + monto}`,
        username: User.username,
        descripcion:`Monto transferido a ${User.username}, por un monto de -${datos.monto}, comision ${monto}`
      }
      
      //Movimientos origen
      let movimiento_destino = {
        api:Api.api,
        cod_referencia: cod_referencia,
        monederos: datos.destino,
        monto: `${datos.monto_destino}`,
        username: User.username,
        descripcion:`Transferencia recibida de ${User.username}, por un monto de ${datos.monto_destino}`
      }
      // console.log('Despues de movimiento destino')
      // console.log('Monederos>>>>',monederos_admin, monedero_origen, monedero_destino)
      // console.log('Movimientos>>>>',movimiento_admin, movimiento_origen, movimiento_destino)
      await Monedero.updateOne({_id: monedero_origen._id},{ valores: monedero_origen.valores, hash_chs, actualizado:User.username},{ upsert: true });
      hash_chs= await Hash_chs({cod_chs:monedero_destino.cod_chs, valores:monedero_destino.valores, actualizado:User.username})
      await Monedero.updateOne({_id: monedero_destino._id},{ valores: monedero_destino.valores, hash_chs, actualizado:User.username},{ upsert: true });
      
      let cod_chs= await Codigo_chs({...movimiento_origen});
      hash_chs= await Hash_chs({cod_chs, valores:movimiento_origen, actualizado:User.username})
      let nuevom = new Movimiento({cod_chs, valores:movimiento_origen, hash_chs});
      await nuevom.save();
      cod_chs= await Codigo_chs({...movimiento_destino});
      hash_chs= await Hash_chs({cod_chs, valores:movimiento_destino, actualizado:User.username})
      nuevom = new Movimiento({cod_chs, valores:movimiento_destino, hash_chs});
      await nuevom.save();
      cod_chs= await Codigo_chs({...movimiento_admin});
      hash_chs= await Hash_chs({cod_chs, valores:movimiento_admin, actualizado:User.username})
      nuevom = new Movimiento({cod_chs, valores:movimiento_admin, hash_chs});
      await nuevom.save();
      global.io.emit(`Actualizar_${Api.api}_compra`); //datos:resultado})
      res.json({Respuesta:'Ok'});
    }catch(error) {
      console.log('Error-PagarWesi', error.keyValue);
      res.json({Respuesta:'Error', code: error.code});
    }

  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}

serverCtrl.Egew_cambiar_status_compra = async (req, res) =>{
  let {User, Api, datos, hash} = req.body;
  User= typeof User==='string' ? JSON.parse(User) : User;
  const hashn = await Hash_texto(JSON.stringify({User, Api, datos}));
  // const igual= await serverCtrl.Verifica_api(Api, true);

  if (hashn===hash){ // && igual) {
    // await serverCtrl.Tablas('egew_compra_wesi');
    // await serverCtrl.Tablas('egew_movimiento');

    const DB = await Model(Api, 'egew_compra_wesi');//require(`../models/egew_compra_wesi`);
    const  Movimiento= await Model(Api, 'egew_movimiento');//require(`../models/egew_movimiento`);
    const Monedero = await Model(Api, 'egew_cuenta_wesi');//require(`../models/egew_cuenta_wesi`);
    
    try{
      //Guarda los datos de la compra
      let compra = await DB.findOne({_id:datos._id})
      let hash_chs= await Hash_chs({cod_chs: compra.cod_chs, valores:datos, actualizado:User.username})
      await DB.updateOne({_id: datos._id},{ valores: datos, hash_chs, actualizado:User.username},{ upsert: true });
      
      //Guardar movimiento
      console.log('buscar Movimiento')
      let movimiento = await Buscar_data(Movimiento,{username:datos.username})
      const pos = movimiento.findIndex(f=>f.valores.cod_referencia===datos.cod_referencia);
      movimiento= movimiento[pos]
      movimiento.valores.status=datos.status
      hash_chs= await Hash_chs({cod_chs: movimiento.cod_chs, valores:movimiento.valores, actualizado:User.username})
      await Movimiento.updateOne({_id: movimiento._id},{ valores: movimiento.valores, hash_chs, actualizado:User.username},{ upsert: true });

      //Actualiza los datos en el monedero
      let monedero =  await Monedero.findOne({_id: datos.monederos});
      if (datos.status==='Aprobado'){
        monedero.valores.diferidos-=Number(datos.monto);
        monedero.valores.disponible+=Number(datos.monto);
      }else if(['Rechazado '].indexOf(datos.status)!==-1 || datos.status==='Rechazado '){
        console.log('por aqui')
        monedero.valores.diferidos-=Number(datos.monto);
      }
      hash_chs = await Hash_chs({cod_chs: monedero.cod_chs, valores:monedero.valores, actualizado:User.username});
      await Monedero.updateOne({_id: datos.monederos},{ valores: monedero.valores, hash_chs, actualizado:User.username},{ upsert: true });

      console.log(`Actualizar_${Api.api}_compra`)
      global.io.emit(`Actualizar_${Api.api}_compra`); //datos:resultado})
      res.json({Respuesta:'Ok'});
    }catch(error) {
      console.log('Error-CompraWesi', error.keyValue);
      res.json({Respuesta:'Error', code: error.code});
    }

  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}

serverCtrl.Egew_statusComprarWesi = async (req, res) =>{
  let {User, Api, status, hash} = req.body;
  User= typeof User==='string' ? JSON.parse(User) : User;
  const hashn = await Hash_texto(JSON.stringify({User, Api, status}));
  // const igual= await serverCtrl.Verifica_api(Api, true);

  if (hashn===hash){ // && igual) {
    const DB = require(`../models/egew_compra_wesi`);
    
    let datos = status === ''
      ? await DB.find()
      : await DB.find(
                      {$text: {$search: status , 
                      $caseSensitive: true}}
                    )
    datos= status === '' ? datos : datos.filter(f=> f.valores.status===status);
    
    res.json({Respuesta:'Ok', datos});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}

serverCtrl.Egew_cambiar_password = async (req, res) =>{
  let {User, Api, password, hash} = req.body;
  User= typeof User==='string' ? JSON.parse(User) : User;
  const hashn = await Hash_texto(JSON.stringify({User, Api, password}));
  // const igual= await serverCtrl.Verifica_api(Api, true);

  if (hashn===hash){ // && igual) {
    const DB = require(`../models/${Api.master ? '' : Api.api+'_'}User_api`);
    
    let datos = await DB.findOne({_id:User._id})
    datos.valores.passwordp= await Hash_password(password);
    const hash_chs = await Hash_chs({cod_chs: datos.cod_chs, valores:datos.valores, actualizado:User.username});
    await DB.updateOne({_id: datos._id},{ valores: {...datos.valores}, hash_chs, actualizado:User.username},{ upsert: true });

    res.json({Respuesta:'Ok'});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}

serverCtrl.Egew_userAdmin = async (req, res) =>{
  let {password, Api, hash} = req.body;
  
  const hashn = await Hash_texto(JSON.stringify({password, Api}));
  // const igual= await serverCtrl.Verifica_api(Api, true);

  if (hashn===hash && password===claveinicio) {
    const nameAdmin = NameAdmin(Api);//`admin-${Api.api}-wesichs`
    res.json({Respuesta:'Ok', nameAdmin});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }
}
// =============== codigo para la sincronizacion =============
serverCtrl.Sincronizar = async (req, res) =>{
  let {tablas, datos, Api, hash} = req.body;
  
  const hashn = await Hash_texto(JSON.stringify({tablas, datos, Api}));
  // const igual= await serverCtrl.Verifica_api(Api, true);
  if (hashn===hash){ // && igual){
    const data = tablas;
    let DB //= await Model(Api, data);//await serverCtrl.Tablas(data);
    try{
      DB = await Model(Api, data);//require(`../models/${data}`);
    }catch(error) {
      console.error(`Error en sincronizar >>>> (${data})`);
      res.json({Respuesta:'Error', code: error.code});
      return
    }
    if (datos.datos.length>0){
      console.log(chalk.inverse.red('Sincronizando >>>', data, datos.fecha));
    }
    for (let i=0; i<datos.datos.length;i++){
      const newdatos=datos.datos[i];
      try{
        let cod_chs = await Codigo_chs({...newdatos.valores});
        const hash_chs = await Hash_chs({...newdatos, cod_chs})
        await DB.updateOne({_id:newdatos._id},{...newdatos, cod_chs, hash_chs},{ upsert: true });
      }catch(error) {
        console.log('Error, al amacenar datos en',data, newdatos.valores);    
      }
      if (data.indexOf('eliminados')!==-1 ){
        console.log('Elimninar>>>>',newdatos.tabla)
        const DBE = await Model(Api, newdatos.tabla);//require(`../models/${newdatos.tabla}`);
        await DBE.deleteOne({_id:newdatos.valores._id});
      }
    }
    // let resultados = {};
    // await Promise.all(tablas.map(async(data)=>{
    //   await serverCtrl.Tablas(data);
    //   const DB = require(`../models/${data}`);
    //   for (let i=0; i<datos[data].length;i++){
    //     const newdatos=datos[data][i];
    //     console.log(newdatos);
    //     await DB.updateOne({_id:newdatos._id},{...newdatos},{ upsert: true });
        
    //     if (data.indexOf('Eliminados')!==-1){
    //       console.log('Elimninar>>>>',newdatos.tabla)
    //       const DBE = require(`../models/${newdatos.tabla}`);
    //       await DBE.deleteOne({_id:newdatos.valores._id});
    //     }
    //   }
    //   global.io.timeout(1000).emit('Actualizar_'+data,{tabla:data})
    // }))
    // .then(()=>{
    // });
    // const resultado = await Promise.all(tablas.map(async(data)=>{
    //   await serverCtrl.Tablas(data);
    //   const DB = require(`../models/${data}`);
    //   const dbs = await DB.find();
    //   resultados[data]=dbs;
      
    // }))
    // .then(()=>{
    //   return {Respuesta:'Ok', resultados, dia: new Date()};
    // });
    console.log(chalk.inverse.green('Sincronizado >>>>>>...', data));
    let dbs=[]
    // if (datos.fecha===null){
    //   console.log('Enviar todos...............', data);
    //   dbs = await DB.find();
    // }else{
    //   let fecha = new Date(datos.fecha);
    //   fecha.setDate(fecha.getDate()-1);
    //   dbs = await DB.find({updatedAt:{$gte:datos.fecha}});
    //   console.log('Enviar despues de ', fecha, dbs.length, data);
    // }
    global.io.emit('Actualizar',data)
    res.json({Respuesta:'Ok', data, resultados:dbs, fecha:new Date()});
  }else{
    res.json({Respuesta:'Error', mensaje:'hash invalido'});
  }

}
serverCtrl.Infor_database = async (req, res) =>{
  require('dotenv').config({path:'../server/variables.env'})
  const URI = process.env.DB_URL;
  res.json({Respuesta:'Ok', URI, fecha:new Date()});
}
serverCtrl.Infor_databaseD = async (req, res) =>{
  let {destino} = req.body;
  console.log('>>>>>>>>>>>>>',destino)
  let options = {
    url: destino+'/api/infodatabase',
    method: 'POST',
    timeout: 10000,
    headers: {
      'Accept': 'application/json',
      'Content-type': 'application/json;charset=UTF-8',
      'destino':destino
    }
  };
  const resultado = await axios(options)
    .then((res) => {
      return res.data
    })
    .catch(err => {
      console.log(err);
      // this.setState({cargando:false, progreso:0})
      return {Respuesta:'Error_c', mensaje:'Error en conexión, intente nuevamente'}
    } );
  res.json({...resultado, fecha:new Date()});
}
serverCtrl.Infor_datos = async (req, res) =>{
  let {tabla, destino} = req.body;
  console.log('>>>>>>>>>>>>>',tabla, destino)
  const DB = require(`../models/${tabla}`);
  let ultimo= await DB.find().sort({updatedAt:-1}).limit(1); //await DB.find().sort({$natural:-1}).limit(1);
  let total = await DB.estimatedDocumentCount();
  let datoorigen = {ultimo, total};
  let datodestino ={};
  if (destino && destino !==''){
    let options = {
      url: destino+'/api/infodatos',
      method: 'POST',
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json;charset=UTF-8',
        'destino':destino
      },
      data:{tabla}
    };
    const resultado = await axios(options)
      .then((res) => {
        return res.data
      })
      .catch(err => {
        console.log(err);
        // this.setState({cargando:false, progreso:0})
        return {Respuesta:'Error_c', mensaje:'Error en conexión, intente nuevamente', datoorigen:{}}
      } );
    datodestino = {...resultado.datoorigen}
  }
  
  res.json({Respuesta:'Ok', datoorigen, datodestino, fecha:new Date()});
}
serverCtrl.WhatsAppQR = async (req, res) =>{
  let {Api} = req.body;
  
  res.json({Respuesta:'Ok', QR: global[Api], fecha:new Date()});
}
module.exports = serverCtrl;
