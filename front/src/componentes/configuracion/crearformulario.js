import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import {genera_fromulario, Permiso, conexiones} from '../../procesos/servicios'
import Dialogo from '../herramientas/dialogo';
import Formulario from '../herramientas/formulario';
import { Ver_Valores, Form_todos } from '../../constantes';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import CancelIcon from '@mui/icons-material/Cancel';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default class CrearFormulario extends Component {
  constructor(props) {
      super(props);

      this.state = {
          props: this.props,
          Config:this.props.Config,
          Guardar_datos:this.Guardar, 
          dialogo:{open:false}
      }
  }

  Ordenar= async(campos) =>{
    let resultado=[];
    const list=Object.keys(campos);
    // Object.keys(campos).map(async (v) =>{
    for (var i=0; i<list.length;i++){
      const v=list[i];
      if (campos[v].multiples){
        let mas = await this.Ordenar(campos[v].value);
        resultado=[...resultado, ...mas];
      }else{
        
        let nuevo= {...campos[v]}
        delete nuevo.key;
        delete nuevo.value;
        resultado=[...resultado,
          nuevo
        ]
      }
    }
    return resultado

  }

  Guardar = async(valores, campos)=>{
    // let Config = Ver_Valores().config;
    let {Config, seleccionadoA} = this.state;
    const nuevo = this.state.formulario_seleccionado//this.state.nueva_entrada.value //await this.Ordenar(campos)
    Config.Formularios[this.state.seleccionado]={columna:Number(this.state.columnas), value:nuevo}
    let nuevoc=Config;
    
    nuevoc=JSON.stringify(nuevoc, null, 4)
    
    const resul= await conexiones.Guardar_data(`data/${seleccionadoA.api}${'.js'}`,nuevoc)
    return resul
    
    // const nuevo = desgenera_formulario(campos)
  }

  Modificar = async(valores, campos)=>{
    const Config = Ver_Valores().config;
    let nuevo={}
    Object.keys(campos).map(val=>{
      nuevo[val]=valores[val]
      return val;
    })
    nuevo.tipo=nuevo.tipo.value;
    nuevo.key= nuevo.nombre;
    nuevo.name= nuevo.nombre;
    nuevo.disabled= !nuevo.disabled;
    // nuevo.required= nuevo.required==='true' ? true : false;
    nuevo.multiline=valores.multiline;
    if (['lista_multiuso','Tabla'].indexOf(nuevo.tipo)!==-1){
      // nuevo.tipo="Lista";
      let lista=[]
      if (valores.lista.titulo && valores.lista.titulo.indexOf('lista_')!==-1){
        lista=Config.Listas[valores.lista.titulo]
      }else if(valores.lista.titulo){
        let resultado= await conexiones.Leer_C([valores.lista.titulo],{[valores.lista.titulo]:{}})
        
        if(resultado.Respuesta==='Ok'){
          lista=resultado.datos[valores.lista.titulo].map(val=>{

            return {_id:val._id, ...val.valores}
          })
        }
      }
      if(typeof valores.getOptionLabel==='string'){
        valores.getOptionLabel=valores.getOptionLabel.split(',')
      }
      if(typeof valores.form!=='string' && valores.form!==undefined){
        nuevo.form=valores.form.titulo
      }
      if(typeof valores.titulos!=='string' && valores.form!==undefined){
        nuevo.titulos=valores.titulos.titulo
      }
      nuevo.lista= nuevo.lista.titulo//lista;
      // nuevo.required=true;
      nuevo.getOptionLabel=valores.getOptionLabel;
      // nuevo.form=valores.form;
      
    }
    
    nuevo={columna:1, value:[nuevo]}
    
    let muestra_entrada = await genera_fromulario({valores:{}, campos:nuevo });
    muestra_entrada.botones=[
      {
        name:'guardar', label:'Agregar', title:'Agregar a formulario muestra ',
        variant:"contained", color:"success", icono:<CheckIcon/>,
        onClick: this.Agregar, 
        sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
        disabled: !Permiso('guardar'),
      },
      {
        name:'eliminar', label:'Eliminar', title:'Eliminar ',
        variant:"contained", color:"secondary", icono:<DeleteIcon/>,
        sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Eliminar : {}},
        confirmar:'true',
        onClick: this.Eliminar_campo,
        disabled: !Permiso('eliminar'),
      },
    ];
    
    this.setState({muestra_entrada, nueva_entrada:nuevo})
  }

  Mas_menos = (campo, valor, agregar=true)=>{
    
    let {formulario_muestra}=this.state;
    let listo = false;
    Object.keys(formulario_muestra.titulos).map(val=>{
      
      if (formulario_muestra.titulos[val].multiples){
        Object.keys(formulario_muestra.titulos[val].value).map(val1=>{
        
          if(val1===campo){
            if (agregar){
              formulario_muestra.titulos[val].value[val1]=valor;
              listo=true;
            }else{
              delete formulario_muestra.titulos[val].value[val1]
            }
          }
          return val1
        })
      }else if(val===campo){
        if (agregar){
          formulario_muestra.titulos[val]=valor;
          listo=true;
        }else{
          delete formulario_muestra.titulos[val]
        }
      }
      return val
    })
    if (listo===false && agregar){
      formulario_muestra.titulos[campo]=valor
    }
    
    this.setState({formulario_muestra});

  }

  Agregar = async(valores,campos)=>{
    
    const campo= Object.keys(campos)[0];
    this.Mas_menos(campo,campos[campo])
    if (this.state.nueva_entrada){
      let formulario_final = this.state.formulario_seleccionado;
      let nuevo = this.state.nueva_entrada.value;
      const pos = formulario_final.findIndex(f=> f.name===nuevo[0].name)
      
      if (pos===-1){
        formulario_final=[...formulario_final, ...nuevo];
      }else{
        formulario_final[pos]=nuevo[0];
      }
      this.setState({formulario_seleccionado:formulario_final})
    }
  }

  Eliminar_campo = async(valores, campos) =>{
    const campo= Object.keys(campos)[0];
    // let {formulario_muestra}=this.state;
    // delete formulario_muestra.titulos[campo]
    // this.setState({formulario_muestra})
    this.Mas_menos(campo,{},false)
    if (this.state.nueva_entrada){
      let formulario_final = this.state.formulario_seleccionado;
      let nuevo = this.state.nueva_entrada.value;
      const pos = formulario_final.findIndex(f=> f.name===nuevo[0].name)
      
      if (pos!==-1){
        // delete formulario_final[pos]
        formulario_final=formulario_final.filter((f,i)=>i!==pos)
      }
      this.setState({formulario_seleccionado:formulario_final})
    }
  }

  Seleccion_tipo = async (valores, campos)=>{
    const Config = Ver_Valores().config;
    if (valores.name==='tipo'){
      const tipo = valores.resultados[valores.name].value;
      if (tipo==='multiline'){
        campos.numberOfLines.value=4;
        campos.numberOfLines.disabled=false;
        valores.resultados.numberOfLines=valores.resultados.numberOfLines==='' ? 4 : valores.resultados.numberOfLines;
        valores.resultados.multiline=true;
      }else{
        campos.numberOfLines.value='';
        campos.numberOfLines.disabled=true;
        valores.resultados.numberOfLines='';
        valores.resultados.multiline=false;
      }

      if(tipo==='lista_multiuso'){
          let todas=[...Object.keys(Config.Listas), ...this.state.database]
          let lista=todas.map((v,i)=>{
            return {_id: i, titulo:v}
          })
          campos.lista.lista=lista;
          campos.lista.required=true;
          campos.lista.disabled=false;
          campos.lista.mensaje_error='Selecciones lista';
          campos.getOptionLabel.disabled=false;
         
      }else{
        campos.lista.disabled=true;
        campos.lista.required=false;
        campos.lista.mensaje_error='';
        campos.getOptionLabel.disabled=true;
      }

      
    }else if(valores.name==='agregar' && valores.resultados.tipo.value==='lista_multiuso'){
      
      campos.agregar.value=valores.resultados.agregar;
      campos.form.disabled=!valores.resultados.agregar;
      campos.form.lista=this.state.lista_form

    }

    this.Modificar(valores.resultados, campos)
  }

  Seleccion_input = async(valores)=>{
    
    const Config = Ver_Valores().config;
    const entrada=valores.resultados[valores.name]
    
    if (entrada.titulo!=='Agregar'){
      let muestra = {...Form_todos(`${this.state.seleccionado}`)}
      muestra.columna=1;
      muestra.value= muestra.value.filter(f=> f.name===entrada.titulo)
      
      let muestra_entrada = await genera_fromulario({valores:{}, campos: muestra })
      
      let tipo = muestra.value[0].tipo;
      let nombre = muestra.value[0].name;
      let label = muestra.value[0].label;
      let placeholder=muestra.value[0].placeholder;
      let title=muestra.value[0].title;
      let required=muestra.value[0].required;
      let mensaje_error=muestra.value[0].mensaje_error;
      let disabled=muestra.value[0].disabled;
      let agregar=muestra.value[0].agregar;

      let input_campos = await genera_fromulario({
        valores:{
          tipo, nombre, label, placeholder, title, mensaje_error,
          required,
          disabled: disabled===undefined ? false :  disabled, 
          agregar,
        }, 
        campos: Form_todos(`Form_agregaritemt`) 
      });
      input_campos.titulos.tipo.lista= Config.Listas[input_campos.titulos.tipo.lista]
      tipo= input_campos.titulos.tipo.lista.filter(f=> f.value===tipo)[0];
      tipo = tipo===undefined ? {_id:1, titulo:'Input', value:'input'} : tipo;
      input_campos.datos.tipo=tipo;
      input_campos.titulos.tipo.value=tipo;
      input_campos.titulos.tipo.mensaje_error='';
      input_campos.titulos.tipo.required=false;
      input_campos.titulos.required.value=input_campos.datos.required;
      input_campos.titulos.disabled.value=!input_campos.datos.disabled ;
      input_campos.titulos.agregar.value=input_campos.datos.agregar;
      // input_campos.titulos.tipo.disabled=true;
      input_campos.titulos.nombre.disabled=true;
      
      if (tipo.value==='lista_multiuso'){
        let todas=[...Object.keys(Config.Listas), ...this.state.database]
        let lista=todas.map((v,i)=>{
          return {_id: i, titulo:v}
        })
        input_campos.titulos.lista.lista=lista;
        input_campos.titulos.lista.value=lista.filter(f=>f.titulo===muestra.value[0].lista)[0];
        input_campos.titulos.lista.required=true;
        input_campos.titulos.lista.disabled=false;
        input_campos.titulos.lista.mensaje_error='Selecciones lista';
        input_campos.titulos.getOptionLabel.disabled=false;
        input_campos.titulos.agregar.disabled=false;
        input_campos.titulos.getOptionLabel.value=muestra.value[0].getOptionLabel;
        input_campos.titulos.agregar.value=muestra.value[0].agregar;
        if (muestra.value[0].agregar){
          input_campos.titulos.form.disabled=false;
          input_campos.titulos.form.lista=this.state.lista_form;
          input_campos.titulos.form.label="Formulario para agregar";
          input_campos.titulos.form.value=this.state.lista_form.filter(f=>f.titulo===muestra.value[0].form)[0];
        }
          
      }else if(tipo.value==='Tabla'){
        input_campos.titulos.form.disabled=false;
        input_campos.titulos.form.lista=this.state.lista_form;
        input_campos.titulos.form.label="Formulario a utilizar";
        input_campos.titulos.form.value=this.state.lista_form.filter(f=>f.titulo===muestra.value[0].form || f.titulo===muestra.value[0].Form)[0];
        input_campos.titulos.titulos.disabled=false;
        input_campos.titulos.titulos.lista=this.state.lista_cabezera;
        input_campos.titulos.titulos.value=this.state.lista_cabezera.filter(f=>f.titulo===muestra.value[0].titulos)[0];
      }else{
        input_campos.titulos.lista.required=false;
        input_campos.titulos.lista.disabled=true;
        input_campos.titulos.lista.mensaje_error='';
        input_campos.titulos.getOptionLabel.disabled=true;
        input_campos.titulos.agregar.disabled=true;
        input_campos.titulos.agregar.value=false;
        input_campos.titulos.form.disabled=true;
        input_campos.titulos.titulos.disabled=true;
      }

      Object.keys(input_campos.titulos).map(val=>{
        input_campos.titulos[val].onChange=this.Seleccion_tipo;
        return val
      });
      // input_campos.botones=[
      //   {
      //     name:'guardar', label:'Modificar', title:'Modificar muestra',
      //     variant:"contained", color:"success", icono:<CheckIcon/>,
      //     onClick: this.Modificar, 
      //     sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
      //     disabled: !Permiso('guardar'),
      //   },
      // ];

      muestra_entrada.botones=[
        {
          name:'guardar', label:'Agregar', title:'Agregar a formulario muestra ',
          variant:"contained", color:"success", icono:<CheckIcon/>,
          onClick: this.Agregar, 
          sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
          disabled: !Permiso('guardar'),
        },
        {
          name:'eliminar', label:'Eliminar', title:'Eliminar ',
          variant:"contained", color:"secondary", icono:<DeleteIcon/>,
          sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Eliminar : {}},
          confirmar:'true', 
          onClick: this.Eliminar_campo,
          disabled: !Permiso('eliminar'),
        },
      ];
      

      this.setState({muestra_entrada, input_campos, nueva_entrada:muestra})
    }else{
      
      let input_campos = await genera_fromulario({
        valores:{}, 
        campos: Form_todos(`Form_agregaritemt`) 
      });
      input_campos.titulos.tipo.value=input_campos.titulos.tipo.lista[0];

      Object.keys(input_campos.titulos).map(val=>{
        input_campos.titulos[val].onChange=this.Seleccion_tipo;
        return val
      });

      this.setState({input_campos})
    }
  }

  CambioColumna = async(valores,campos)=>{
    const Config = Ver_Valores().config;
    
    const columna=valores.resultados[valores.name];
    if (Number(columna)>0){
      let formulario_muestra = await genera_fromulario({valores:{}, campos: {...Form_todos(`${this.state.seleccionado}`), columna} })
      formulario_muestra.botones=[
        {
          name:'guardar', label:'Guardar', title:'Guardar ',
          variant:"contained", color:"success", icono:<CheckIcon/>,
          onClick: this.Guardar, 
          sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
          disabled: !Permiso('guardar'),
        },
      ];
      this.setState({formulario_muestra, columnas:columna})
    }
  }
  //Copiar, eliminar formulario
  SeleccionA = async(valores) => {
    const destino= valores.resultados[valores.name].titulo;
    // let Config = Ver_Valores().config;
    let {Config, seleccionadoA} = this.state;
    confirmAlert({
      title: 'Copiar formulario en api',
      message: `Desea copiar ${this.state.seleccionado} en ${destino} o eliminar ${this.state.seleccionado} de ${seleccionadoA.api}?`,
      buttons: [
        {
          label: 'COPIAR',
          onClick: async () => {
            let Config_nuevo= Ver_Valores().config;
            let archivo=`data/${valores.resultados.apis.api}.js`;
            const respuesta = await conexiones.Leer_data(archivo);
            if (respuesta.Respuesta==='Ok'){
              Config_nuevo=JSON.parse(respuesta.datos);
            }
            Config_nuevo.Formularios = Config_nuevo.Formularios ? Config_nuevo.Formularios : {};
            Config_nuevo.Formularios[this.state.seleccionado]=Config.Formularios[this.state.seleccionado];
            console.log(destino, Config_nuevo.Formularios)
            // Config[destino].Formularios[this.state.seleccionado]=Config.Formularios[this.state.seleccionado]
            let nuevoc=Config_nuevo;
            nuevoc=JSON.stringify(nuevoc, null, 4)
            const resul= await conexiones.Guardar_data(`data/${valores.resultados.apis.api}${'.js'}`,nuevoc)
          }
        },
        {
          label: 'ELIMINAR',
          onClick: async () => {
            let nuevo={}
            Object.keys(Config.Formularios).map(v=>{
              console.log(v, this.state.seleccionado)
              if (v!==this.state.seleccionado){
                nuevo[v]=Config.Formularios[v]
              }
              return v
            })
            console.log(nuevo)
            Config.Formularios = nuevo;
            
            let nuevoc=Config;
            nuevoc=JSON.stringify(nuevoc, null, 4)
            const resul= await conexiones.Guardar_data(`data/${seleccionadoA.api}${'.js'}`,nuevoc)
          }
        },
        {
          label: 'CANCELAR',

        }
      ]
    });
    
  }

  Seleccion = async(valores)=>{
    const Config = this.state.Config;//Ver_Valores().config;
    console.log('Por aqui', Config, valores)
    const formulario=valores.resultados[valores.name];
    if (formulario.titulo!=='Nuevo'){
      
      const formul=Object.keys(Config.Formularios);
      let lista=formul.map((val,i)=>{
        return {_id:i, titulo:val}
      })
      lista.push({_id:lista.length, titulo:'Nuevo'})
      
      let formularios = await genera_fromulario({valores:{}, campos: Form_todos(`Form_form`) }, 2)
      formularios.datos=valores.resultados;
      formularios.titulos.lista.lista=lista;
      formularios.titulos.lista.onChange= this.Seleccion;
      const columnas=Form_todos(`${formulario.titulo}`).columna;
      lista=Form_todos(`${formulario.titulo}`).value.map((val,i)=>{
        return {_id:i, titulo:val.name}
      })
      lista.push({_id:lista.length, titulo:'Agregar'})
      
      formularios.titulos.input.lista=lista;
      
      formularios.titulos.input.onChange= this.Seleccion_input;
      formularios.titulos.columna.value= columnas;
      formularios.titulos.columna.onChange= this.CambioColumna;

      // let listaA= Object.keys(Config).filter(f=> f.indexOf('Api_')!==-1).map((val,i)=>{
      //   return {_id:i, titulo:val}
      // })
      formularios.titulos.apis.lista=this.state.lista_apis//listaA
      formularios.titulos.apis.onChange= this.SeleccionA
      
      //En muestra de formulario
      let formulario_muestra = await genera_fromulario({valores:{}, campos: Form_todos(`${formulario.titulo}`, Config) })
      formulario_muestra.botones=[
        {
          name:'guardar', label:'Guardar', title:'Guardar ',
          variant:"contained", color:"success", icono:<CheckIcon/>,
          onClick: this.Guardar, 
          sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
          disabled: !Permiso('guardar'),
        },
      ];

      let muestra_entrada=undefined;
      let input_campos=undefined;
      let formulario_seleccionado = Form_todos(`${formulario.titulo}`, Config).value;

      this.setState({columnas, formularios, formulario_muestra, formulario_seleccionado, muestra_entrada, input_campos, seleccionado:formulario.titulo})
    }else{
      
      let nuevos = await genera_fromulario({valores:{}, campos: Form_todos('Form_Listas_n') });
      nuevos.titulos.nombre.label='Nombre';
      nuevos.titulos.nombre.placeholder='Nombre';
      const pguardar=await Permiso('guardar');
      const formulario ={
          ...nuevos,
          botones:[
              {
                  name:'guardar', label:'Crear', title:'Crear formulario',
                  variant:"contained", color:"success", icono:<CheckIcon/>,
                  onClick: this.Crear, validar:'true', 
                  sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Aceptar : {}},
                  disabled: !pguardar,
              },
              {
                  name:'cancelar', label:'Cancelar', title:'Cancelar',
                  variant:"contained",  icono:<CancelIcon/>,
                  sx:{...Config.Estilos.Botones ? Config.Estilos.Botones.Cancelar : {}},
                  onClick: ()=>this.setState({dialogo:{...this.state.dialogo,open:false}})
              },
          ]
      }
      let muestra_entrada=undefined;
      let input_campos=undefined;
      let formulario_muestra=undefined;
      this.setState({muestra_entrada, input_campos, formulario_muestra,
        dialogo:{
          ...this.state.dialogo, 
          open: true,
          tam:'xs',
          Titulo:'Crear nuevo Formulario',
          Cuerpo:<Formulario {...formulario}/>,
          Cerrar: ()=>this.setState({dialogo:{...this.state.dialogo,open:false}})
      }})
    }
  }
  //Crea un nuevo formulario
  Crear = async(valores) =>{
    const nueva= `Form_${valores.nombre}`;
    // let Config = Ver_Valores().config;
    let {Config, seleccionadoA}= this.state;
    Config.Formularios={...Config.Formularios, [nueva]:{columna:1, value:[]}}
    let nuevo=Config;
    nuevo=JSON.stringify(nuevo, null, 4)
    const resul= await conexiones.Guardar_data(`data/${seleccionadoA.api}${'.js'}`,nuevo)
    this.Refrescar(Config)
    this.setState({dialogo:{...this.state.dialogo, open: false}})
  }

  Refrescar = async(Config)=>{
    let database= await conexiones.DataBase();
    if (database.Respuesta==='Ok'){
      database=database.models
    }else{
      database=[]
    }
    // Object.keys(Config.Formularios).map(async v=>{
    console.log(Config)
    const formul=Object.keys(Config.Formularios);
    let lista=formul.map((val,i)=>{
      return {_id:i, titulo:val}
    })
    lista=lista.filter(f=> ['Form_form'].indexOf(f.titulo)===-1)
    const lista_form=[...lista];
    lista.push({_id:lista.length, titulo:'Nuevo'})
    const lista_cabezera = Object.keys(Config.Titulos).map((val,i)=>{
      return {_id:i, titulo:val}
    })
    let formularios = await genera_fromulario({valores:{}, campos: Form_todos(`Form_form`) }, 2)
    formularios.titulos.lista.lista=lista
    formularios.titulos.lista.onChange= this.Seleccion
    formularios.titulos.input.disabled=true
    
    // let listaA= Object.keys(Config).filter(f=> f.indexOf('Api_')!==-1).map((val,i)=>{
    //   return {_id:i, titulo:val}
    // })
    formularios.titulos.apis.lista=this.state.lista_apis;//listaA
    formularios.titulos.apis.onChange= this.SeleccionA

    let muestra_entrada=undefined;
    let input_campos=undefined;
    let formulario_muestra=undefined;
    this.setState({formularios, database, lista_form, lista_cabezera, Config, muestra_entrada, input_campos, formulario_muestra, })
  }

  async componentDidMount(){
      
    let formulario_lista= await genera_fromulario({valores:{}, campos: Form_todos(`Form_api`) })
    const litt= await conexiones.VerApis()
    let lista=[]
    if (litt.Respuesta==='Ok'){
      lista= litt.lista.filter(f=> f!=='Apis').map( (v, i)=>{
        return {_id:i, titulo:v, nombre:v, api:v}
      })
    }else{
      const listado = await conexiones.Leer_C(['Api'],{'Api':{}})
      lista= listado.datos.Api.map( v=>{
        return {...v.valores ? {_id:v._id, ...v.valores} : v}
      })
    }
    const seleccionadoA = lista[0]
    formulario_lista.titulos.apis.value= seleccionadoA
    formulario_lista.titulos.apis.onChange= this.SeleccionN
    formulario_lista.titulos.apis.lista= lista;
    this.setState({formulario_lista, lista_apis:lista})
    this.SeleccionAN(seleccionadoA)

    // const Config = Ver_Valores().config;
    
    // this.Refrescar(Config)
    
  }
  SeleccionN = (data)=>{
    let seleccionadoA = data.resultados.apis;
    this.SeleccionAN(seleccionadoA)
  }
  //Seleccionar api
  SeleccionAN = async(seleccionadoA) =>{
    let Config = Ver_Valores().config;
    let archivo=`data/${seleccionadoA.api}.js`;
    const respuesta = await conexiones.Leer_data(archivo);
    if (respuesta.Respuesta==='Ok'){
      Config=JSON.parse(respuesta.datos);
      this.setState({Config, seleccionadoA})
      
    }
    console.log(Config, seleccionadoA)
    this.Refrescar(Config)
  }
  static getDerivedStateFromProps(props, state) {

    if (props !== state.props) {
        
      return {
        props,
        Config:props.Config,
      };
    }
    // No state update necessary
    return null;
  }

  render(){
    const {formularios, formulario_muestra, muestra_entrada, seleccionado, input_campos, Config, dialogo, formulario_lista}=this.state;
    
    return (
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={0.3}>
          <Grid item xs={4} md={4}>
            <Item style={{height:'90vh', overflow:'auto'}}>
              {formulario_lista ? <Formulario {...formulario_lista}/> : null}
              <div style={{marginTop:-15}}/>
              {seleccionado
                ? <div>
                    {seleccionado}
                    <Divider />
                  </div>
                : null
              }
              <Formulario {...formularios}/>
              <Divider />
              <Formulario {...input_campos}/>
            </Item>
          </Grid>
          <Grid item xs={8} md={8}>
            <Grid container spacing={0.3}>
              <Grid item xs={12} md={12}>
                <Item style={{height:'30vh', overflow:'auto'}}>
                  Muestra de Entrada
                  <Divider />
                  <Formulario {...muestra_entrada}/>
                </Item>
              </Grid>
              <Grid item xs={12} md={12}>
                <Item style={{height:'60vh', overflow:'auto'}}>
                    Muestra del Formulario
                    <Divider />
                    <Formulario {...formulario_muestra}/>
                </Item>
              </Grid>
            </Grid>
            
          </Grid>
        </Grid>
        <Dialogo  {...dialogo} config={Config}/>
      </Box>
      
    )
  }
}
