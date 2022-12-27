import React, {Component} from 'react';
// import MailIcon from '@material-ui/icons/Mail';
// import NotificationsIcon from '@material-ui/icons/Notifications';
import Typography from '@mui/material/Typography';
import {conexiones, genera_fromulario, Permiso, MaysPrimera} from '../../../procesos/servicios'
import Tabla from '../../../componentes/herramientas/tabla';
import { Form_todos, Titulos_todos } from '../../../constantes';
import Dialogo from '../../../componentes/herramientas/dialogo';
import Cargando from '../../../componentes/esperar/cargar';
import moment from 'moment';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import Detalles from './detalles';

export default class Reporte extends Component {
  constructor(props) {
      super(props);

      this.state = {
          cargando:true,
          props: this.props,
          Config:this.props.Config,
          datos:[],
          dialogo:{open:false},
          dialogo1:{open:false},
      }
  }

  Seleccion = (item)=>(dato) =>{

    // console.log(dato.target.innerText, dato.target.cellIndex, this.state.Titulos[dato.target.cellIndex].field)
    console.log(item, this.state.Titulos[item])
    this.Abrir1(this.state.Titulos[item].field);
  }
  Inicio = async() =>{
    let fecha=new Date();
    var ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getUTCDate();
    var mes = moment(fecha).format('MM');
    var ano = moment(fecha).format('YYYY');
    let titulos = Titulos_todos('Titulos_ingresos_egresos');
    let meses = [];
    const ingreso='#138E04';
    const egreso='#A30E02';
    const ambos ='#AA9309';
    const Titulos_dia=[...titulos,{
        field:moment(fecha).format('YYYY-MM-DD'),
        default:'',
        title:`${moment(fecha).format('DD-MM-YYYY')} \n Ingresos/Egresos`,
        tipo:'html',
        formato: (dato)=>{
          if (dato[moment(fecha).format('YYYY-MM-DD')]){
            const valor = dato[moment(fecha).format('YYYY-MM-DD')];
            return <Typography variant="h6" 
                          sx={{
                                color:valor.ingreso!==0 && valor.egreso===0 
                                  ? ingreso 
                                  : valor.ingreso===0 && valor.egreso!==0
                                  ? egreso
                                  : ambos
                              }} 
                    >
                      {`${Number(valor.ingreso).toFixed(2)} / ${Number(valor.egreso).toFixed(2)} `}
                    </Typography>
                    
          }
          return (<Typography variant="h6" >{`0 / 0`}</Typography>)
        }
    }];
    
    for (var dia=1; dia<=ultimoDia;dia++){
      const campo = `${ano}-${mes}-${dia<10 ? '0' + dia : dia}`;
        titulos=[...titulos,{
            field:campo,
            default:'',
            title:`${dia<10 ? '0' + dia : dia}-${mes}-${ano} \n Ingresos/Egresos`,
            tipo:'html',
            props:{
              onClick:this.Seleccion(Number(dia)+2)
                
            },
            formato: (dato)=>{
              if (dato[campo]){
                return <Typography variant="h6" 
                              sx={{
                                    color:dato[campo].ingreso!==0 && dato[campo].egreso===0 
                                      ? ingreso 
                                      : dato[campo].ingreso===0 && dato[campo].egreso!==0
                                      ? egreso
                                      : ambos
                                  }} 
                        >
                          {`${Number(dato[campo].ingreso).toFixed(2)} / ${Number(dato[campo].egreso).toFixed(2)}`} 
                        </Typography>
              }
              return (<Typography variant="h6" >{`0 / 0`}</Typography>)
            }
        }];
        meses=[...meses, campo]
    }    
    const res = await conexiones.Ingreso_Egreso({meses, tipo:this.props.Titulo ? this.props.Titulo : undefined});
    // console.log('>>>>>>>>>>>>', res, meses);
    let datos = [];
    let ingresos = [];
    let egresos = [];
    if (res.Respuesta==='Ok'){
      datos= res.inventario;
      ingresos = res.ingresos;
      egresos = res.egresos;
    }
    this.setState({cargando:false, Titulos:titulos, Titulos_dia, datos, ingresos, egresos})
  }
  async componentDidMount(){
    this.Inicio();
    if (this.state.props.Actualizar && this.state.props.socket){
      this.state.props.Actualizar.map(val=>{
        this.state.props.socket.on(val, data => {
          this.Inicio();     
      })
        return val
      })
    }
   
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

  Cerrar = () =>{
    const {dialogo} = this.state;
    this.setState({dialogo:{...dialogo, open:false}})
  }
  Abrir = ()=>{
    const {datos, Config, Titulos, dialogo}=this.state;
    this.setState({dialogo:{
        open:!dialogo.open,
        tam:'xl',
        Titulo: this.props.TituloDetalle ? this.props.TituloDetalle : 'Titulo',
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.70}}>
            <Tabla
            
                Titulo={this.props.Titulo ? this.props.Titulo : 'Titulo tabla'}
                Config={Config}
                titulos={Titulos}
                table={''}
                cantidad={ null}
                datos={datos}
                // Accion={this.Abrir1}
        
            //   acciones={<Formulario {...formulario_lista}/>}
            />
            
          </div>,
        Cerrar: this.Cerrar
    }})
  }

  Abrir_detalle = ()=>{
    const {datos, Config, Titulos, dialogo}=this.state;
    this.setState({dialogo:{
        open:!dialogo.open,
        tam:'xl',
        Titulo: this.props.TituloDetalle ? this.props.TituloDetalle : 'Titulo',
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.70}}>
            
            <Detalles Config={this.state.Config} Titulo={this.props.Titulo} Ingresos={this.state.ingresos} Egresos={this.state.egresos}/>
          </div>,
        Cerrar: this.Cerrar
    }})
  }

  Abrir1 = (valores)=>{
    let fecha = new Date(valores);
    fecha.setDate(fecha.getDate()+1)
    const { dialogo1}=this.state;
    this.setState({dialogo1:{
        open:!dialogo1.open,
        // tam:'xl',
        Titulo:'Detalles',
        Cuerpo:
          <div style={{margin:5, height:window.innerHeight * 0.70}}>  
            <Detalles Config={this.state.Config} Titulo={this.props.Titulo} Fecha={fecha}/>
          </div>,
        Cerrar: ()=>this.setState({dialogo1:{open:false}})
    }})

  }
  render(){
    const {cargando, datos, Config, Titulos_dia, dialogo, dialogo1}=this.state;
    
    return (
      <div style={{width:'100%',height:'100%', position: "relative"}}>
        <Tabla
          
          Titulo={this.props.Titulo ? this.props.Titulo : "Titulo"}
          Config={Config}
          titulos={Titulos_dia}
          table={''}
          cantidad={ null}
          datos={datos}
        //   Accion={this.Abrir}
    
          acciones={
            <div>
              <IconButton color={'primary'} sx={{color:'#fff'}} title={'Ver movimientos'} onClick={this.Abrir}>
                <Icon>zoom_in</Icon>
              </IconButton>
              <IconButton color={'primary'} sx={{color:'#fff'}} title={'Detalles de Ingresos y egresos'} onClick={this.Abrir_detalle}>
                <Icon>plagiarism</Icon>
              </IconButton>
            </div>
          }
        />
        <Cargando open={cargando}/>
        <Dialogo  {...dialogo} config={Config}/>
        <Dialogo {...dialogo1} config={Config}/>
      </div>
    )
  }
}
