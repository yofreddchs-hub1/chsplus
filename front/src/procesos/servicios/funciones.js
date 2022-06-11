import {const_procesos, Valord, nuevo_Valores, Ver_Valores} from '../../constantes';
import moment from 'moment';
// import {categoria_usuario} from '../../constantes/datos';
// import {categorias} from '../datos/usuarios';
// localStorage.setItem(const_procesos.dir_config,null);
import {conexiones} from './conexiones';
import {encriptado} from '../servicios';
import {ExcelRenderer} from 'react-excel-renderer';
//import {encriptado} from './encriptado'

let categoria_usuario;

export const formatoBolivar = new Intl.NumberFormat('es-VE', {
  style: 'currency',
  currency: 'VES',
  minimumFractionDigits: 2
})

export const formatoDolar = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

export const Inicio=async()=>{
  const api= await conexiones.Ver_api('wesi_chs_server');
  let archivo='data/datos.js';
  
  let config = {}
  const respuesta = await conexiones.Leer_data(archivo);
  if (respuesta.Respuesta==='Ok') {
    await localStorage.setItem(const_procesos.dir_config,respuesta.datos);
    config=JSON.parse(respuesta.datos);
  }else{
    config=Valord
  }
  categoria_usuario= config.Listas.lista_categoria;
  // console.log(config, categoria_usuario)
  nuevo_Valores({config, categoria_usuario})
  return config
}

export const MaysPrimera=(string)=>{
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const ArrayMaysPrimera=(datos)=>{
  return datos.map((valor)=> MaysPrimera(valor))
}

export const Titulo_default=(datos)=>{
  return Object.keys(datos).map((valor)=> {
    // if (valor === 'categoria') {
    //   return { title: MaysPrimera(valor), field: valor, lookup: categorias }
    // }else
    if (['createdAt','updatedAt','fecha', 'Fecha'].indexOf(valor)!==-1){
      return { title: MaysPrimera(valor), field: valor , editable: 'never' , fecha:true}
    }else if (['_id','__v','createdAt','updatedAt',
               'actualizado', 'cod_chs', 'seq_chs', 'hash_chs'].indexOf(valor)!==-1){
      return { title: MaysPrimera(valor), field: valor , editable: 'never'}
    }else{
      return { title: MaysPrimera(valor), field: valor }
    }
  })
}

export const Usuario = async(status='Leer', dato=null)=>{
  if (status==='Leer'){
    try{
      let User = await localStorage.getItem(const_procesos.dir_user);
      if (User!==null) 
        User = await encriptado.desencriptado(User);
        
      User = JSON.parse(User);
      conexiones.Inicio(User)
      return User
    }catch(error){
      return null
    }
  }else if (status==='Guardar'){
    conexiones.Inicio(dato)
    let User= await encriptado.Encriptado(JSON.stringify(dato));
    localStorage.setItem(const_procesos.dir_user, User);
  }else{
    localStorage.setItem(const_procesos.dir_user,null);
    conexiones.Inicio(null)
  }  
  
}
export const Permiso =  async(accion, superadmin=false) =>{
  let User = await Usuario()//JSON.parse(localStorage.getItem(const_procesos.dir_user));
  if (User===null) return false
  let resultado=categoria_usuario.filter(lis => String(lis._id)===String(User.categoria));
  if (!superadmin) {
    if (resultado.length!==0 && resultado[0].permisos!==undefined &&
          (resultado[0].permisos.indexOf(accion)!==-1 || resultado[0].permisos.indexOf('*')===0)
        ) {
      return true;

    }else {
      return false;
    }
  }else{
    if (resultado.length!==0 && resultado[0].permisos!==undefined && resultado[0].permisos.indexOf('**')===1) {
      return true;
    }else{
      return false;
    }
  }


}

export const Quitar_valores = (props) =>{
  const {datos,quitar}=props;
  let resultado={}
  Object.keys(datos).map((campo)=>{
    if (quitar.indexOf(campo)===-1){
      resultado={...resultado,[campo]:datos[campo]};
    }
    return campo;
  })
  return resultado;
}

export const Resultado_encontrados = (datos,valor) =>{
  let resultado=[];
  
  if (datos !== undefined && datos.length!==0)
    datos.map((dato)=>{
      
      if (Ver_igualdad(dato,valor)){
        resultado.push(dato);
      }
      return valor;
    })
  return resultado
}


export const Ver_igualdad = (dato, valor)=>{
    
    if (dato=== null || dato ===undefined)
      return false;
    const campos= Object.keys(dato);
    delete dato['$setOnInsert']
    const no=['password','passwordA','token'];
    let resultado=false;
    
    try{
     campos.map((campo)=>{
       if (typeof dato[campo]==='object' && dato[campo]!==null){
          
          if (dato[campo].length){
            dato[campo].map( val=>{
              if (Ver_igualdad(val,valor)){
                resultado=true;
              }
              return val
            })
          }else{
            if (Ver_igualdad(dato[campo],valor)){
              resultado=true;
            }
          }
        }
       const val= '' + dato[campo];
       if ((no.indexOf(campo)===-1 && val.toLowerCase().indexOf(valor.toLowerCase())!==-1)|| valor===''){
         resultado=true;
       }
       return campo
     })
    }catch(error) {
      console.log('Ver_igualdad',error, dato, valor, campos);
      
    }
    return resultado;
}

export const Resultado_encontrados_k = (datos,valor) =>{
  let resultado=[];
  datos.map((dato)=>{
    if (Ver_igualdad_K(dato,valor)){
      resultado.push(dato);
    }
    return valor;
  })
  return resultado
}

export const Resultado_encontrados_k_p = (datos,valor) =>{
  let resultado=-1;
  for(let i=0; i<datos.length;i++){
    if (Ver_igualdad_K(datos[i],valor)){
      resultado=i;
      break;
    }

  }
  return resultado
}

export const Ver_igualdad_K = (dato, valor)=>{
    const campos= Object.keys(valor);
    let resultado=false;
    let cont=0;
     campos.map((campo)=>{
       if (''+dato[campo]===''+valor[campo]){
         cont++;
       }
       return campo
     })

     if (cont>=campos.length){
       resultado=true;
     }
    return resultado;
}

export const Buscar_array = (datos,valor) => {
  let resultado=[];
  datos.map((dato)=>{
    let igual =0;

    valor.map((v,i)=> {
      if (v===dato[i]) {
        igual++;
      }
      return v;
    })
    if (igual===valor.length){
      resultado.push(dato);
    }

    return dato;
  })
  return resultado;
}
export const Buscar_array_posicion = (datos,valor) => {
  let resultado=-1;
  for (let i=0;i < datos.length;i++){

      if (valor===datos[i][0]){
        resultado=i;
        break;
      }
  }
  return resultado;
}

export const Paginas = (props) =>{
  let rdatos=[];
  let paginas=[1];
  // let cont=0;
  // let contp=2;
  const {datos,cantp,pagina,buscar, ctotal}=props;
  const inicio=cantp*(pagina-1);
  const fin=inicio+cantp;
  const datosE=Resultado_encontrados(datos,buscar);
  
  for (var i=0;i<datosE.length;i++){
    if (i>inicio-1 && i < fin){
        rdatos.push({...datosE[i],id:i+1});
    }
   
  }
  
  paginas=[1];
  const ttotal= ctotal ? ctotal : datosE.length
  for ( i=2; i<(ttotal/cantp)+1;i++){
    paginas.push(i);
  }
  
  const comienza=inicio+1;
  const finaliza= datosE.length< fin ? datosE.length : fin;
  const total='('+comienza+' al '+finaliza+') <> (Total:'+datosE.length+')';
  return {datos:rdatos,paginas:paginas,total:total}

}

export const Excell = async(archivo)=>{
  // console.log(archivo.target.files[0])
  let resultado={}
  let fileObj = archivo.target.files[0];
  //just pass the fileObj as parameter
  await ExcelRenderer(fileObj, (err, resp) => {
    if(err){
      console.log(err);            
    }
    else{
      resultado={
        cols: resp.cols,
        rows: resp.rows,
      };
      return {filename: fileObj.name , datos:resultado}
    }
    return {filename: fileObj.name , datos:resultado}
  });
  
  return {filename: fileObj.name , datos:resultado}
}

const item_form = async(val, valores, _id)=>{
  
  let resultado={
    ...val,
    tipo: val.tipo ? val.tipo : '',
    placeholder: val.placeholder ? val.placeholder : val.label ? val.label : '',
    label: val.label ? val.label : val.placeholder ? val.placeholder : '',
    value: val.value ? val.value : valores[val.name] && val.no_mostrar!==true ? valores[val.name]: '', 
    required: val.required,
    mensaje_error: val.mensaje_error ? val.mensaje_error : val.error,
    disabled: val.disabled
              ? val.disabled
              : valores[val.name] && val.no_modificar
              ? true
              : false
  }
  if (val.tipo==='Lista'){
    // console.log('En lista',val, valores[val.name])

    resultado={
      ...resultado,
      value: val.lista[valores[val.name]],
      getOptionLabel: val.tipo==='Lista' ? (option)=> `${option.title ? option.title : option.titulo ? option.titulo : option.label}` : null,
      getOptionSelected: val.tipo==='Lista' ? (option)=> `${option.value ? option.value : option.titulo}` : null

    }
  }else if (val.multiline){
    resultado={
      ...resultado,
      multiline:true,
      maxRows: val.numberOfLines ? val.numberOfLines : val.maxRows ?  val.maxRows : 4,
    }
  }else if (val.tipo==='auto-codigo'){
    resultado={
      ...resultado,
      tipo:'',
      value:Generar_id('S')

    }
  }else if (val.tipo==='lista_multiuso'){
    let lista  
    const table=val.lista;
    if (typeof val.lista==='string' && val.lista.indexOf('lista_')===-1) {  
      const listado = await conexiones.Leer_C([val.lista],{[val.lista]:{}})
      lista= listado.datos[val.lista].map( v=>{
        return {...v.valores}
      })
    }else if (val.lista.indexOf('lista_')!==-1){
      lista = Ver_Valores()['config']['Listas'][val.lista]
      if (lista===undefined) lista=[]
    }else {
      lista= val.lista
    };
    
    resultado={
      ...resultado,
      lista, 
      tipo:'Lista',
      table,
      getOptionLabel:(option) => {
        let mostrar=''
        val.getOptionLabel.map(vl=>{ 
          mostrar = mostrar + option[vl] + ' ';
          return vl
        })
        
        return mostrar;
      },
      getOptionSelected:(option) => {
        let mostrar=''
        val.getOptionLabel.map(vl=>{ 
          mostrar = mostrar + option[vl] + ' ';
          return vl
        })
        
        return mostrar;
      },
    }
    
  }else if (val.tipo==='lista_representados'){
    const listado = await conexiones.Leer_C([val.lista],{[val.lista]:{}})
    const table=val.lista;
    const lista = listado.datos[val.lista].map( v=>{
      return {...v.valores}
    })
    
    resultado={
      ...resultado,
      lista, 
      table,
      getOptionLabel:(option) => {
        let mostrar=''
        val.getOptionLabel.map(vl=>{ 
          mostrar = mostrar + option[vl] + ' ';
          return vl
        })
        
        return mostrar;
      },
    }
    
  }else if (val.tipo==='Checkbox'){
    resultado={
      ...resultado,
      label:val.label.indexOf('/')!==-1 ? val.label :'Seleccionado/No Seleccionado',
      value:'false'

    }
  }else if (val.tipo==='Fecha'){
    resultado={
      ...resultado,
      type:'date'

    }
  }else if (val.tipo==='Tabla'){
    let Subtotal = Ver_Valores()['config']['Subtotales'][val.Subtotal]
    
    resultado={
      ...resultado,
      value:valores[val.name],
      Subtotal: typeof Subtotal==='object' ? Subtotal : val.Subtotal
    }
  }

  delete resultado.numberOfLines
  return resultado
}

export const genera_fromulario = async (datos, columnas=1)=>{
  let {campos, valores,_id} = datos;
  columnas=campos.columna;
  campos=campos.value;
  let titulos={};
  
  // campos.map(async val=>{
  const filas= Math.ceil(campos.length/columnas);
  for (var i=0; i<filas; i++){
    titulos[i]={ multiples:true, listo:false, value:{}}
  }
  for (var j=0; j<campos.length; j++){
      const val = campos[j];
      // delete val.numberOfLines
      if (columnas===1){
        titulos[val.name]= await item_form(val, valores, _id)
      }else{
        if (val.multiline || ['lista_representados', 'Avatar', 'avatar', 'Tabla'].indexOf(val.tipo)!==-1){
          // col=1;
          // fila=fila+1;
          // titulos[val.name]= await item_form(val, valores, _id);
          let pos= Object.keys(titulos).findIndex(f=> !titulos[f].listo && Object.keys(titulos[f].value).length===0);
          if (pos===-1) {
            titulos[Object.keys(titulos).length]={ multiples:true, listo:false, value:{}}
            pos=Object.keys(titulos).length-1;
          }
          titulos[pos].value[val.name]= await item_form(val, valores, _id);
          titulos[pos].listo=true ;
        }else{
          let pos= Object.keys(titulos).findIndex(f=> !titulos[f].listo && Object.keys(titulos[f].value).length<columnas);
          if (pos===-1) {
            titulos[Object.keys(titulos).length]={ multiples:true, listo:false, value:{}}
            pos=Object.keys(titulos).length-1;
          }
          
          titulos[pos].value[val.name]= await item_form(val, valores, _id);
          if (titulos[pos].value[val.name].length===columnas) titulos[pos].listo=true ;
        } 
        
        // if(col<columnas){
          
        //   if (!titulos[fila]) titulos[fila]={ multiples:true,value:{}}
        //   titulos[fila].value[val.name]= await item_form(val, valores, _id);
        //   // console.log(val.name)
        //   col=col+1
        // }else{
          
        //   fila=fila+1;
        //   col=1;
        //   titulos[fila]={ multiples:true,value:{}}
        //   titulos[fila].value[val.name]=await item_form(val, valores, _id);
        // }
      }
      
      // return val
  }//)
  
  titulos= Filtar_vacios(titulos);
  
  // console.log(titulos, valores)
  return {titulos, datos:{_id,...valores}}
}

const Filtar_vacios = (titulos) =>{
  let nuevotitulo={}
  Object.keys(titulos).map(val=>{
    if ((titulos[val].multiples && Object.keys(titulos[val].value).length!==0)||(!titulos[val].multiples)){
      nuevotitulo[val]=titulos[val]
    }
    return val
  })

  return nuevotitulo
}

export const crear_campos = async(campos, Form_origen)=>{
  let resultado=[]
  const list=Object.keys(campos)
  // Object.keys(campos).map(async val=>{
  // console.log(Form_origen)
  for (var i=0;i<list.length;i++){
      const val=list[i]
      if (campos[val].multiples){
          const otros= await crear_campos(campos[val].value, Form_origen)
          resultado=[...resultado,...otros.value]
      }else{

          let valor= campos[val]
          const pos= Form_origen.value.findIndex(v=> v.name===valor.name)
          
          if (Form_origen.value[pos] && (Form_origen.value[pos].tipo==='lista_multiuso' || Form_origen.value[pos].tipo==='lista_representados')){
              valor={
                  ...valor,
                  tipo:Form_origen.value[pos].tipo,
                  lista:Form_origen.value[pos].lista,
                  getOptionLabel:Form_origen.value[pos].getOptionLabel
              }
          }
          resultado=[...resultado, valor]
          
      }
      // return val;
  }//)
  
  return {columna:Form_origen.columna, value:resultado}
}

export const Generar_id =(id)=>{
  return `${id ? id+'-' :''}${moment().format('x')}` 
}
