import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';

import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Menus from './menu';
import ListaMenu from './listamenu';
import logo from '../../imagenes/logo.png';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const drawerWidth = 260;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(0.2),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft(props) {
  const theme = useTheme();
  const {Config}=props;
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex'}}>
      <CssBaseline />
      <AppBar position="fixed" open={open} 
              style={{backgroundColor:'#000000', ...Config.Estilos.Barra_menu ? Config.Estilos.Barra_menu : {}}}
      >
        <Menus {...props} open={open} handleDrawerOpen={handleDrawerOpen}/>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader 
            style={{backgroundColor:'#000000', ...Config.Estilos.Barra_menu ? Config.Estilos.Barra_menu : {}}}
        >
          { open ? <img  src={props.Config.Logo ? props.Config.Logo : logo}  className={'logo'} 
                         style={{marginRight:50, height:60, width:60, ...props.Config.Estilos.Logo ? props.Config.Estilos.Logo : {} }} 
                         alt="logo" 
                    />  
                 : null
          }
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' 
                ? <ChevronLeftIcon 
                    sx={{ color: Config.Estilos.Barra_menu ? Config.Estilos.Barra_menu.color : '#ffffff' }}
                  /> 
                : <ChevronRightIcon 
                    sx={{ color: Config.Estilos.Barra_menu ? Config.Estilos.Barra_menu.color : '#ffffff' }}
                  />
            }
          </IconButton>
        </DrawerHeader>
        <Divider />
        
        <ListaMenu {...props}/>
         
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item>
              {props.Pantalla ? props.Pantalla : null}
            </Item>
          </Grid>
        </Grid>
        
      </Main>
    </Box>
  );
}
