import React,{useEffect} from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import { Titulos_todos } from '../../constantes';



export default function TablaMostrar(props) {
    // console.log(props)
    const [rows, setRows] = React.useState([]);
    const [columns, setColumns] = React.useState([]);
    const {datos,style} = props;
    const titulos = Titulos_todos(props.titulos)
    // console.log(titulos)
    const InicarColumnas=(rows)=>{
        // console.log('>>>>', rows)
        let width= titulos ? window.innerWidth * 0.50 / titulos.length : window.innerWidth;
        const columnas= titulos 
          ? titulos.map(titulo=>{
            // console.log('>>>>>>>>>>>>>>>>>>>>',titulo)
            return {
              headerAlign: 'center', 
              headerName:titulo.title,
              minWidth:titulo.width ? titulo.width : 153.0,
              flex: titulo.flex ? titulo.flex : 1,
              width,
              ...titulo,
              editable:false,
              valueGetter:(dato)=>{
                // console.log(dato)
                let valor =titulo.formato ? titulo.formato(dato) : dato.value; 
                if (!valor || valor==='NaN')
                  valor=titulo.formato ? titulo.formato(dato.row) : dato.row[titulo.field] 
                if (!valor || valor==='NaN')
                  valor=titulo.formato ? titulo.formato(rows[dato.id]) : null
    
                if (typeof valor==='object')
                  valor = valor.value ? valor.value : valor.titulo;
                
                if(typeof valor==='string'){
                  if (valor && valor.split(',')[0]==='listar'){
                    const listar = valor.split(',');
                    let resulta= '';
                    dato.value.map(v=>{
                      let texto='';
                      for (var i=1; i<listar.length; i++){
                        texto+= `${String(v[listar[i]]).toUpperCase()} `;
                      }
                      resulta += `${texto},`;
                    })
                    valor=resulta;
                  }
                } 
                // console.log('>>>>>>',valor)
                
                // if (dato.field==='total')
                // console.log(valor, typeof valor, rows[dato.id]) 
                return titulo.type==='number' ? Number(['NaN',NaN].indexOf(String(valor))===-1 ? valor : 0).toLocaleString() : valor
              }//titulo.formato ? titulo.formato : null
            }
          })
          : []
        setColumns([
          ...columnas,
        ])
    }
    useEffect(() => {
        // console.log(datos)
        let nuevo = datos 
          ? datos.movimiento.map((data,i)=>{
            let resultado={...data, id: data.id ? data.id : i}
            if (titulos){
              titulos.map(titulo=>{
                let valor =titulo.formato ? titulo.formato(resultado) : null
                valor= String(valor)==='NaN' 
                        ? titulo.default
                        ? titulo.default
                        : 0
                        : valor
                resultado[titulo.field]= resultado[titulo.field] ? resultado[titulo.field] : valor
                return titulo
              })
            }
  
            return resultado
          })
          : []
        setRows(nuevo)
        InicarColumnas(nuevo)
        
    }, [props]);
    return (
        <Box sx={{  width: '100%' , ...style ? style : {}}}>
            <Typography variant="h6" gutterBottom>
                {`${props.label ? props.label : ''}`}
            </Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                
                disableSelectionOnClick
                // hideFooterPagination
                hideFooter
                // hideFooterRowCount
                // hideFooterSelectedRowCount
                experimentalFeatures={{ newEditingApi: true }}
                components={{Pagination:null}}
                sx={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: 'primary.light',
                    '& .MuiDataGrid-cell:hover': {
                      color: 'primary.main',
                    },
                    height:'100%'
                  }}
            />
        </Box>
    );
}
