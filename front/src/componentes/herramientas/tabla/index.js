import React, {Component} from 'react';
import {Paginas, Titulo_default, Resultado_encontrados, conexiones} from '../../../procesos/servicios';
import Page from './page';

const itemsF=20;

class Tabla extends Component {
  constructor(props) {
      super(props);

      this.state = {
          props:this.props,
          pagina:1,
          buscar:'',
          items:itemsF,
          datos:[]
      }
  }
  actualizando = false;

  Cargar_todo = async(cantidad, table, datos, items=itemsF, condicion=null, cargacompleta=null, ordenar=null, cargaporparte=false) =>{
    
    if (!cargaporparte && cantidad> datos.length && !this.actualizando){
     
      this.actualizando=true;
      this.setState({actualizando:true});
      const paginas= cantidad / items;
      let pag=1;
      let nuevodatos=datos;
      while (pag<paginas+1){
        let resultados= await conexiones.Leer_C([table], 
                                              {
                                                [table]:{pagina:true, cantidad:items, pag},
                                                
                                              }
                                              );
        nuevodatos=[...nuevodatos, ...resultados.datos[table]];
        pag+=1;
        
        let paginacion =Paginas({
          datos:nuevodatos, cantp: items,
          pagina: this.state.pagina,
          buscar: this.state.buscar
        });
        
        paginacion.cantidad=items;
        if (condicion){
          nuevodatos= condicion(nuevodatos);
        }
        const progreso = nuevodatos.length * 100 / cantidad;
        nuevodatos= ordenar ? ordenar(nuevodatos) : nuevodatos
        this.setState({datos:nuevodatos, paginacion, progreso})
      }
      // console.log('Finalizo >>>>>>>>>>>', nuevodatos.length)
      if (cargacompleta){
        // cargacompleta({Titulo, datos:nuevodatos, cantidad});
        // console.log('>>>>>>>>>>>>>>>>>>>>>', Titulo, table, cantidad)
        cargacompleta({table, nuevodatos});
      }
      this.actualizando=false;
      this.setState({actualizando:false});
    }else if (cargaporparte && !this.actualizando){
      
      this.actualizando=true;
      const pag = this.state.pagina
      let nuevodatos=datos;
      let resultados= await conexiones.Leer_C([table], 
        {
          [table]:{pagina:true, cantidad:items, pag, ...cargaporparte},
          
        }
      );
      nuevodatos=[...nuevodatos, ...resultados.datos[table]];
      let paginacion =Paginas({
        datos:nuevodatos, cantp: items,
        pagina: this.state.pagina,
        buscar: this.state.buscar,
        ctotal:cantidad
      });
      
      paginacion.cantidad=items;
      nuevodatos= ordenar ? ordenar(nuevodatos) : nuevodatos
      this.setState({datos:nuevodatos, paginacion})
      this.actualizando=false;
    }
  }

  Iniciar_descarga = async(table,Titulo, ordenar, items, cargacompleta, cargaporparte, condicion)=>{
    this.setState({actualizando:true})
    let respuesta = await conexiones.Leer([table])
    if (cargaporparte){
      let cantidad= respuesta.datos[table+'_cantidad']
      
      respuesta= await conexiones.Leer_C([table], 
        {
          [table]:{pagina:true, cantidad:items, pag:0, ...cargaporparte},
        }
      );
      respuesta.datos[table+'_cantidad']=cantidad
    }
    if (respuesta.Respuesta==='Ok'){
      let datos=respuesta.datos[table]
      let cantidad=respuesta.datos[table+'_cantidad']
      
      datos= ordenar ? ordenar(datos) : datos
      // if (cantidad<items) {
        // cargacompleta({Titulo, datos, cantidad});
      // if (!cargaporparte){
        
        cargacompleta({table, nuevodatos:datos, cantidad});
      // }else{

      // }
         
      // }
      // return {datos,cantidad}
      // if (cantidad>items)
      //   this.Cargar_todo(cantidad, table, datos, items, condicion, cargacompleta, ordenar, cargaporparte);
    }else{
      
      let datos=[]
      let cantidad=0
      cargacompleta({Titulo, datos, cantidad});
    }
    this.setState({actualizando:false})
  }

  componentDidMount(){
   let {Titulo,titulos, datos, items, cantidad, table, condicion, cargacompleta, ordenar, cargaporparte}= this.state.props;
    // console.log('>>>>> Primera', cantidad, table)
    
    items= items===undefined ? itemsF : items;
    if (cantidad ===-1){
      this.Iniciar_descarga(table,Titulo, ordenar, items, cargacompleta, cargaporparte, condicion)
    }
    
    if (cantidad>items)
        this.Cargar_todo(cantidad, table, datos, items, condicion, cargacompleta, ordenar, cargaporparte);
    let {pagina, buscar}=this.state;
    // datos= Object.keys(datos).map(valor=> datos[valor]);
    datos= ordenar ? ordenar(datos) : datos
    
    let paginacion =Paginas({
                              datos, cantp: items,
                              pagina, buscar, ctotal:cantidad
                            });
    
    if (titulos===undefined && datos.length!==0){
      titulos= Titulo_default(datos[0]);
    }
    this.setState({ordenar, titulos, datos, paginacion, table,
                   total:datos, items, Cargar_todo:this.Cargar_todo, 
                   Iniciar_descarga:this.Iniciar_descarga, cantidad, cargaporparte});
  }


  static getDerivedStateFromProps(props, state) {
    // Store prevId in state so we can compare when props change.
    // Clear out previously-loaded data (so we don't render stale stuff).
    if (props !== state.props && !state.actualizando) {
      
      let {Titulo,datos, titulos, items, cantidad, table, condicion, cargacompleta, ordenar, cargaporparte}= props;
      // console.log('>>>>> Segunda', cantidad)
      items= items===undefined ? itemsF : items;
      if (cantidad ===-1){
        state.Iniciar_descarga(table,Titulo, ordenar, items, cargacompleta, cargaporparte, condicion)
      }
      // datos= Object.keys(datos).map(valor=> datos[valor])
      
      datos= ordenar ? ordenar(datos) : datos
      
      if (titulos===undefined && datos.length!==0){
        titulos= Titulo_default(datos[0]);
      }
      
      if (cantidad>items && !cargaporparte)
        state.Cargar_todo(cantidad, table, datos, items, condicion, cargacompleta, ordenar, cargaporparte);
      
      let paginacion =Paginas({
                                datos, cantp: items,
                                pagina: state.pagina,
                                buscar: state.buscar, ctotal:cantidad
                              });
      paginacion.cantidad=items;
      // paginacion.datos=paginacion.datos;//datos;
      // console.log('por aqoi', datos, cantidad)

      return {  
        props,
        datos,
        paginacion,
        titulos, total:datos,
        items, table, cantidad,
        ordenar
      };
    }
    // No state update necessary
    return null;
  }

  Cambio_pagina = async (e, page)=>{

    let {pagina, datos, items, cantidad, cargaporparte, table, ordenar}= this.state;
    pagina= page;
    let paginacion
    if (!cargaporparte || this.state.buscar!==''){
      paginacion =Paginas({datos, cantp: items, pagina: pagina, buscar: this.state.buscar});
      this.setState({paginacion, pagina});
    }else{
      let resultados= await conexiones.Leer_C([table], 
        {
          [table]:{pagina:true, cantidad:items, pag:pagina-1, ...cargaporparte},
          
        }
      );
      let nuevodatos=resultados.datos[table];
      let paginacion =Paginas({
        datos:nuevodatos, cantp: items,
        pagina: pagina,
        buscar: this.state.buscar,
        ctotal:cantidad
      });
      
      paginacion.cantidad=items;
      nuevodatos= ordenar ? ordenar(nuevodatos) : nuevodatos
      paginacion.datos=nuevodatos
      this.setState({datos:nuevodatos, paginacion, pagina})
    }
    
  }

  Accion = (valor)=>{

    if (this.state.props.Accion){
      this.state.props.Accion(valor);
    }else{
      console.log('No se asigno accion');
    }

  }

  Buscar = async(e)=>{
    let {pagina, datos, total, buscar, items, cargaporparte, table, ordenar, cantidad}= this.state;
    const {name, value}=e.target;
    pagina=1;
    if(!cargaporparte){  
      if (buscar===''){
        total=datos;
        datos=[];
      }else if (value===''){
        datos=total;
      }
      if (value!==''){
        datos=Resultado_encontrados(total,value);
      }
      let paginacion =Paginas({datos, cantp: items, pagina: pagina, buscar: value});
      this.setState({[name]:value, pagina, total, paginacion, datos})
    }else  if (value!==''){
      this.setState({[name]:value});
      let resultados= await conexiones.Leer_C([table], 
        {
          [table]:{$text: {$search: value, $caseSensitive: false}},
          
        }
      );
      let nuevodatos=resultados.datos[table];
      let paginacion =Paginas({
        datos:nuevodatos, cantp: items,
        pagina: pagina,
        buscar: this.state.buscar,
        
      });
      
      paginacion.cantidad=items;
      
      this.setState({ datos:nuevodatos, paginacion, pagina})
    }else{

      this.setState({[name]:value});
      let resultados= await conexiones.Leer_C([table], 
        {
          [table]:{pagina:true, cantidad:items, pag:0, ...cargaporparte},
          
        }
      );
      
      let nuevodatos=resultados.datos[table];
      let paginacion =Paginas({
        datos:nuevodatos, cantp: items,
        pagina: pagina,
        buscar: this.state.buscar,
        ctotal:cantidad
      });
      
      paginacion.cantidad=items;
      nuevodatos= ordenar ? ordenar(nuevodatos) : nuevodatos
      paginacion.datos=nuevodatos
      this.setState({datos:nuevodatos, paginacion, pagina})
    }
  }
  
  render(){
    return (
      <Page  {...this.state.props}
            datos={this.state.paginacion ?
                    this.state.paginacion.datos :
                    []
                  }
            titulos={this.state.titulos}
            Cambio={this.Cambio_pagina}
            Pagina={this.state.pagina}
            paginacion={this.state.paginacion}
            actualizando={this.state.actualizando}
            progreso={this.state.progreso}
            Accion={this.Accion}
            buscar={this.state.buscar}
            Buscar={this.Buscar}
      />
    )
  }
}

export default Tabla;
