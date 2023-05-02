import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import QRCode from "react-qr-code";
import { styled } from '@mui/material/styles';
import { conexiones } from '../../procesos/servicios';
import { Ver_Valores } from '../../constantes';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function WhatsApp() {
    const [qr,setQr]= React.useState('');
    React.useEffect(()=>{
        const Inicio = async()=>{
            const resp= await conexiones.WhatsappQR();
            console.log(resp)
            if (resp.Respuesta==='Ok' && resp.QR){
                setQr(resp.QR);
            }
            
            Ver_Valores().socket.on('whatsappqr',data=>{
                setQr(data.qr);
            })
        }
        Inicio();
    })
    return (
        <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
            <Item sx={{bgcolor:'#fff'}}>
                <QRCode value={qr} size={window.innerHeight * 0.75}
     />
            </Item>
            <Item>Item 2</Item>
        </Stack>
        </Box>
    );
}
