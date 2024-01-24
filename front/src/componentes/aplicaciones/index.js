import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { Apis, Apis_menu } from '../../apis';
import { conexiones } from '../../procesos/servicios';
import { Ver_Valores } from '../../constantes';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Aplicaciones() {
  const [apis, setApis] = React.useState();
  const {config} =Ver_Valores();
  const Inicio=async()=>{
    
    const respuesta = await conexiones.Leer_C(['Api'],{
      Api:{}
    });
    
    if (respuesta.Respuesta==='Ok'){
      let api =respuesta.datos.Api.map(val=>val.valores);
      console.log(api)
      setApis(api)
    }
  }

  if (apis===undefined){
    Inicio()
  }
  
  return apis!==undefined ? (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={15}>
        
            {Object.keys(apis).map(v=>{
                const Api = apis[v]
                return(
                    <Grid key={`Grid-${v}`} xs={5}>
                        <Item elevation={20} sx={{height:'35vh', cursor:'pointer'}} onClick={()=>window.location.pathname=`${Api.direccion}`}>
                            <img
                                src={Api.direccion ? `/${Api.direccion}/logo192.png` : config.Logo}
                                alt={'App'}
                                loading="lazy"
                                style={{height: '80%'}}
                            />
                            <br/>
                            {Api.api}
                            {/* <React.Fragment>
                                <div style={{height:'80%', width:'100%', backgroundColor:'#f0f'}}>
                                    <Api />
                                </div>
                            </React.Fragment> */}
                        </Item>
                    </Grid>
                )
            })}
      </Grid>
    </Box>
  ) : null;
}
