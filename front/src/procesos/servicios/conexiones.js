import axios from 'axios';
import {encriptado, Usuario} from '../servicios';
import {Valord} from '../../constantes/datos';

let User; 
let Api;
const Inicio = async(user)=>{
  User= user
}

export const conexiones = {
  Ver_api,
  Login,
  Inicio,
  Enviar,
  Leer,
  Leer_C,
  Guardar,
  Guardar_Pago,
  Eliminar,
  Leer_data,
  Guardar_data,
  Eliminar_data,
  DataBase,
  Amolatina,
  Verificar,
  Guardar_excel
}

//Ver codigo de api
async function Ver_api(api){
  const resultados= await Enviar({
    datos:{api},
    http_destino:'/api/ver_api',
    method:'POST',
  });
  
  if (resultados.Respuesta==='Ok'){
    Api= resultados.api;
  }
  return resultados
}
//Login
  async function Login(datos){
    const resultados= await Enviar({
      datos:{...datos, Api, mantener:true, crear: false},
      http_destino:'/api/login',
    });
    return resultados
  }
//Leer datos de archivo
async function Leer_data(archivo, valord=Valord){
  
  const resultados= await Enviar({
                            datos:{User, Api, archivo, valord},
                            http_destino:'/api/leer_data',
                            method:'POST',
                          });
  return resultados
}
//Guardar archivo
async function Guardar_data(archivo, valor){
  const resultados= await Enviar({
                            datos:{User, Api, archivo, valor},
                            http_destino:'/api/guardar_data',
                            method:'POST',
                          });
  return resultados
}
//Elimina archivo
async function Eliminar_data(archivo){
  const resultados= await Enviar({
                            datos:{User, Api, archivo},
                            http_destino:'/api/eliminar_data',
                            method:'DELETE',
                          });
  return resultados
}
//Ver bases de datos del sistema
async function DataBase(){
  const resultados= await Enviar({
                            datos:{User},
                            http_destino:'/api/database',
                            method:'POST',
                          });
  return resultados
}
//Pide datos al servidor
//Necesario tablas=[tabla1,tabla2....]
async function Leer(tablas, mensaje='Solicitando datos...'){

  const resultados= await Enviar({
                            datos:{User,tablas},
                            http_destino:'/api/getall',
                            method:'POST',
                            mensaje_esperar:mensaje
                          });
  return resultados
}
async function Leer_C(tablas, condicion, timeout=50000,mensaje='Solicitando datos...'){
  tablas=Object.keys(condicion)
  const resultados= await Enviar({
                            datos:{User,tablas, condicion},
                            http_destino:'/api/getallc',
                            method:'POST',
                            timeout,
                            mensaje_esperar:mensaje
                          });
  return resultados
}
//Guardar Datos
async function Guardar(dato, tabla, mensaje='Guardando datos...', acciones=null){
  dato.actualizado=User ? User.username : 'Sin usuario';
  let files=undefined;
  let imagenes= ['foto','avatar','image-cedula', 'video', 'logo', 'Logo'];
  if (dato.files && Object.keys(dato.files).length!==0){
    files=dato.files;
  }else if (dato.file){
    files={'file_0':dato.file[0]};
    // dato.file=null;
  } else if (dato.multiples_valores){
    console.log('>>>>>>><<<<<<<<<>>>>',dato)
    if (dato.valores._id) dato['_id']=dato.valores._id
    Object.keys(dato.valores).map(val=>{
      const nombre=val.split('_url')[0];
      
      if (val.indexOf('_url')!==-1 && dato.valores[nombre]){ 
          if (files===undefined) files={}
          files={...files, [nombre]:dato.valores[nombre][0]}
          delete dato.valores[val]
      }else if(val.indexOf('Error-')!==-1){
        delete dato.valores[val]
      }

      return val
    })
  }else{
    imagenes.map(val=>{
      if (Object.keys(dato).indexOf(val)!==-1 && dato[val]!==undefined){
        if (files===undefined) files={}

        files={...files, [val]:dato[val][0]}
      }
      return val
    })
  }
  console.log('>>>>>>><<<<<<<<<>>>>',dato)
  const resultados= await Enviar({
                            datos:{User, datos:JSON.stringify(dato), tabla},
                            http_destino:'/api/setall',
                            method:'POST',
                            destino:'imagenes',
                            mensaje_esperar:mensaje,
                            tipo:files!==undefined ? 'Archivos' : false,
                            files,
                            acciones
                          });
  return resultados
}

//Guardar Pago
async function Guardar_Pago(dato, mensaje='Guardando datos...'){
  dato.actualizado=User.username;
  
  const resultados= await Enviar({
                            datos:{User, datos:JSON.stringify(dato)},
                            http_destino:'/api/procesarpago',
                            method:'POST',
                            destino:'archivos/imagenes',
                            mensaje_esperar:mensaje,
                          });
  return resultados
}
//eliminar
async function Eliminar(dato, tablas, mensaje='Eliminar datos...'){
  const resultados= await Enviar({
                            datos:{dato, tablas},
                            http_destino:'/api/delall',
                            method:'DELETE',
                            mensaje_esperar:mensaje
                          });
  return resultados
}
//Cargar datos de amolatina
async function Amolatina(datos){

  const resultados= await Enviar({
                            http_destino:'/amolatina/login',
                            method:'POST',
                            datos
                          });
  return resultados
}

//eliminar
async function Verificar(dato){
  const resultados= await Enviar({
                            datos:dato,
                            http_destino:'/api/login/verificar',
                            method:'POST',
                          });
  return resultados
}

//Guardar excel
async function Guardar_excel(valores){
  const resultados= await Enviar({
                            datos:{User, valores},
                            http_destino:'/api/guardar_excel',
                            method:'POST',
                          });
  return resultados
}

async function Enviar(props){
  // console.log('Enviar ====>',props);
  //Datos de props necesarios
  //datos: valores que desea Enviar
  //http_destino: destino del envio '/api' o 'http://www.ejemplo.com/api'
  // tipo: solo si es Archivo, de lo contrario se deja en blanco
  // method: metodo de envio POST, GET, DELETE, PUT
  let {datos, http_destino, destino, tipo, method, files, acciones}= props;
  const timeout=props.timeout ? props.timeout : 90000;
  const hash= await encriptado.Hash_texto(JSON.stringify(datos));
  datos= {...datos, hash};
  var data=datos;
  if (tipo && tipo==='Archivos'){
    data =  new FormData();

    await Object.keys(files).map(val=>{
      data.append(val,files[val]);
      return val
    })
    
    await Object.keys(datos).map(async value =>{
      if (['User'].indexOf(value)!==-1){
        data.append(value, JSON.stringify(datos[value]));
      }else{
        data.append(value, datos[value]);
      }
      // console.log(value,data.get(value))
      return value;
    })
    
  }
  // console.log('destino',http_destino);
  let options = {
    url: http_destino,
    method: method ? method : 'POST',
    timeout: timeout,
    headers: {
      'Accept': 'application/json',
      'Content-type': tipo==='Archivos' ?
                      'multipart/form-data' :
                      'application/json;charset=UTF-8',
      'destino':destino
    },
    data,
    onUploadProgress: (progressEvent)=> {
      var progreso = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      // console.log(progreso);
      if(acciones) acciones(progreso)
      // this.setState({progreso});
    },
    onDownloadProgress: progressEvent => {
      // let percentCompleted = Math.round(
      //   (progressEvent.loaded * 100) / progressEvent.total
      // );
      if(acciones) acciones(progressEvent)//progressEvent)
    },

  };
  // console.log('enviar',options);
  return await axios(options)
    .then((res) => {
      
      if (res.data.Respuesta==='Error' && res.data.mensaje==="no autorizado"){
        Usuario('Eliminar')
        window.location.reload()
      }
      // this.setState({cargando:false, progreso:0})
      return res.data
    })
    .catch(err => {
      console.log(err);
      // this.setState({cargando:false, progreso:0})
      return {Respuesta:'Error_c', mensaje:'Error en conexión, intente nuevamente'}
    } );
}
