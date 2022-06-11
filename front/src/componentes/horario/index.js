import React, {useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import { Alert,Table,Modal,Button,Form,Row,Col } from 'react-bootstrap';
import moment from "moment";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Dialogo from '../herramientas/dialogo';
import Formulario from '../herramientas/formulario';
import { Ver_Valores,Form_todos } from '../../constantes';
import { genera_fromulario } from '../../procesos/servicios';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

let data={
    titulo:['Hora','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado'],
    Hora:{inicio:'07:00', final: '18:00', cantidad:45},
    datos:[]
}
export default function Horarios(props) {
    const [Data, setData]= useState(props.Data ? props.Data : data)
    const [dialogo, setDialogo]= useState({
        open:false,  
    });
    
    const CalcularHora = ()=>{
        let datos=[]
        var fecha = new Date();
        fecha.setHours(Number(Data.Hora.inicio.split(':')[0]));
        fecha.setMinutes(Number(Data.Hora.inicio.split(':')[1]));
        fecha.setSeconds(0);

        var fin = new Date();
        fin.setHours(Number(Data.Hora.final.split(':')[0]));
        fin.setMinutes(Number(Data.Hora.final.split(':')[1]));
        fin.setSeconds(0);
        
        let f=0
        while (fecha<fin){
            let fila=[]
            const inicio=moment(fecha).format('h:mm a')
            fecha.setMinutes(fecha.getMinutes()+Data.Hora.cantidad);
            const fin=moment(fecha).format('h:mm a')
            let hora
            data.titulo.map((v,i)=>{
                const col={mensaje:'', espacio: 1, dia:v,}
                if (v==='Hora') {
                    hora=`${inicio} - ${fin}`
                    fila=[...fila, {...col, valor:`${inicio} - ${fin}`, hora}]
                }else {
                    fila=[...fila, {...col, valor: ``, hora}]
                }
                return v
            })
            f+=1
            datos=[...datos, fila]
            
        }
        // data.datos=datos
        setData({...Data, datos})
    }
    const BuscarPos=(valor)=>{
        let pos = -1
        Data.datos.map((fila, i)=>{

            const pos1=fila.findIndex(f=> f.hora===valor.hora && f.dia===valor.dia)
            if (pos1!==-1){
                pos= {fila:i, columna:pos1}
            }
        })
        return pos;
    }
    const CalcularDisponible = (valor) =>{
        let lista=[]
        const pos= BuscarPos(valor);        
        if (pos!==-1){
            let horas=0
            let salir= false;
            
            while (salir===false){
                if ( pos.fila<Data.datos.length 
                     && (Data.datos[pos.fila][pos.columna].valor==='' || Data.datos[pos.fila][pos.columna].valor===valor.valor)
                   ){
                    horas+=1;
                    pos.fila+=1;
                }else{
                    salir=true
                }
            }
            
            for (var i=0; i<horas; i++){
                const fila={id:i, titulo:i+1}
                lista=[...lista, fila];
            }
            
        }
        return lista
    }

    const Guardar =(item)=>(valores)=>{
        const pos= BuscarPos(item);
        let cantidad= pos.fila + Number(valores.horas.titulo);
        
        let datos = Data.datos
        let conteo=0
        let aux=datos[pos.fila][pos.columna].valor
        let salir= aux==='' && valores.asignatura.titulo==='Eliminar' ? true : false
        while(!salir){
            console.log(aux)
            if (valores.asignatura.titulo==='Eliminar' && datos[pos.fila][pos.columna].valor===aux){
                datos[pos.fila][pos.columna].espacio=1;
                datos[pos.fila][pos.columna].valor='';
                pos.fila+=1;
            }else if ( pos.fila<cantidad && valores.asignatura.titulo!=='Eliminar'){
                   
                if(conteo===0){ 
                    datos[pos.fila][pos.columna].espacio=Number(valores.horas.titulo);
                    // datos[pos.fila][pos.columna].valor=valores.asignatura.titulo
                    conteo+=1
                }else{
                    datos[pos.fila][pos.columna].espacio=0;
                    // datos[pos.fila][pos.columna].valor='1'
                }
                datos[pos.fila][pos.columna].valor=valores.asignatura.titulo
                
                pos.fila+=1;
            }else{
                salir=true
            }
        }
        setData({...Data, datos})
        setDialogo({...dialogo, open: false,})
    }

    const OpenDia= async(valores)=>{
        
        let nuevo = await genera_fromulario({valores:{}, campos: Form_todos(`Form_horarios`) },1)
        let lista = CalcularDisponible(valores);
        nuevo.titulos[0].value.horas.lista=lista;
        nuevo.titulos[0].value.horas.value=lista[0];
        nuevo.datos.horas=lista[0];
        nuevo.titulos[0].value.asignatura.lista=[{_id:0, titulo:'Eliminar'},{_id:1, titulo:'Una'},{_id:2, titulo:'Dos'}, {_id:3, titulo:'Tres'}];
        
        let formulario1={
            ...nuevo,
            botones:[
                {
                  name:'guardar', label:'Guardar', title:'Guardar ',
                  variant:"contained", color:"success", icono:<CheckIcon/>,
                  onClick: Guardar(valores), validar:'true', 
                  sx:{...Ver_Valores().config.Estilos.Botones ? Ver_Valores().config.Estilos.Botones.Aceptar : {}},
                  
                },
                
                {
                  name:'cancelar', label:'Cancelar', title:'Cancelar',
                  variant:"contained",  icono:<CancelIcon/>,
                  sx:{...Ver_Valores().config.Estilos.Botones ? Ver_Valores().config.Estilos.Botones.Cancelar : {}},
                  onClick: ()=>setDialogo({...dialogo,open:false})
                },
            ]
        }
        if (valores.dia==='Hora')
            return
        setDialogo({ 
            open: !dialogo.open,
            Titulo:`${valores.dia} ${valores.hora}`,
            Cuerpo:<Formulario {...formulario1}/>,
            Cerrar: ()=>setDialogo({...dialogo,open:false}),
        })
    }
    let Datos=[]
    
    useEffect(()=>{
        CalcularHora();
        return ()=>{

        }
    },[props])
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Table  bordered hover responsive variant="dark">
                <thead>
                <tr>
                    {Data.titulo.map((valor,index)=>(
                    <th key={'th'+index}>{valor}</th>
                    ))}

                </tr>
                </thead>
                <tbody>
                {Data.datos.map((valores, index) => (
                    <tr key={'tr'+index} >
                        {valores.map((val,col)=>(
                            val.espacio!==0
                            ?   <td key={'td'+col} bgcolor={val['valor']==='' || col===0 ? 'black' : val.mensaje==='' ?'blue':'red' }
                                    rowSpan={val.espacio } text-align= 'center'
                                    title={val.mensaje==='' ? null : val.mensaje}
                                    className="align-middle"
                                    onClick={()=>OpenDia(val)}
                                >
                            
                                    <div > {val['valor']}</div >
                                </td>
                            :   null
                        ))}

                    </tr>
                    ))}

                </tbody>
            </Table>
            <Dialogo  {...dialogo} config={Ver_Valores().config}/>
        </Box>
    );
}
