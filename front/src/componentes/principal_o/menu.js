import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import ListItemText from '@mui/material/ListItemText';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ListItemIcon from '@mui/material/ListItemIcon';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Icon from '@mui/material/Icon';
import logo from '../../imagenes/logo.png';


const ResponsiveAppBar = (props) => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState({});
  const {Config, User}=props;

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (index,padre) => {
    setAnchorElNav(null);
    if (index)
      setSelectedIndex(index.value)
    if (props.Seleccion_pantalla){
      
      props.Seleccion_pantalla(index, padre)
  }
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setOpen({...open, [item.value]:Boolean(event.currentTarget)})
  };
  const handleClose = (item) => {
    setAnchorEl(null);
    setOpen({...open, [item.value]:false})
  };

  if (selectedIndex===undefined && Config.Menu) setSelectedIndex(Config.Menu[0].value)

  const Menus = (menus)=>{

    return menus.map((page,i) => (
      <div key={page.value+i}>
        <Button
          id={page.value}
          aria-controls={open[page.value] ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open[page.value] ? 'true' : 'false'}
          onClick={page.childen ? (event)=>handleClick(event, page) : ()=>handleCloseNavMenu(page)}
          endIcon={page.childen ? <KeyboardArrowDownIcon /> : null}
          startIcon={<Icon  sx={{...Config.Estilos ? {color:Config.Estilos.Barra_menu.color} : {}}}>{page.icon}</Icon>}
          sx={{...Config.Estilos ? {color:Config.Estilos.Barra_menu.color} : {}, marginRight:0.5, //opacity: selectedIndex===page.value ? 0.5 : 1, 
              borderColor: Config.Estilos.Barra_menu.color, borderWidth:2,
          }}
          variant={selectedIndex===page.value ? "outlined" : ""}
        >
          {page.primary}
        </Button>
        {page.childen ? 
          <Menu
            id={`Basic-${page.value}`}
            anchorEl={anchorEl}
            open={open[page.value] ? true : false}
            onClose={()=>handleClose(page)}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {page.childen.map(val=>
              <MenuItem key={val.value} 
                onClick={()=>{
                  handleCloseNavMenu(val,page);
                  handleClose(page);
                }} 
                sx={{ marginRight:1, opacity: selectedIndex===val.value ? 0.5 : 1}}
              >
                <ListItemIcon>
                    <Icon >{val.icon}</Icon>
                </ListItemIcon>
                <Typography textAlign="center" >{val.primary}</Typography>
              </MenuItem>
              
            )}
          </Menu>
          : null
        }
        {/* <MenuItem key={page.value} onClick={()=>handleCloseNavMenu(page)} sx={{ marginRight:1, opacity: selectedIndex===page.value ? 0.5 : 1}}>
          <ListItemIcon>
              <Icon  sx={{...Config.Estilos ? Config.Estilos.Input_label : {}}}>{page.icon}</Icon>
          </ListItemIcon>
          <Typography textAlign="center" sx={{...Config.Estilos ? Config.Estilos.Input_label : {}}}>{page.primary}</Typography>
        </MenuItem> */}
      </div>
    ))
  }
  return (
    <AppBar position="static" sx={{...Config.Estilos ? Config.Estilos.Barra_menu : {}}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} /> */}
          <img  src={Config.Logo ? Config.Logo : logo}  className={'logo'} 
                         style={{ height:60, width:60, ...Config.Estilos.Logo ? Config.Estilos.Logo : {} }} 
                         alt="logo" 
          /> 
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              ...Config.Estilos ? {color:Config.Estilos.Barra_menu.color} : {}
            }}
          >
            {Config && Config.Titulo ? Config.Titulo : 'CHS+'}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' },  }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{...Config.Estilos ? {color:Config.Estilos.Barra_menu.color} : {}}}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                
              }}
            >
              {Config && Config.Menu ? Config.Menu.map((page) => (
                <MenuItem key={page.value} onClick={()=>handleCloseNavMenu(page)}>
                  <ListItemIcon>
                      <Icon >{page.icon}</Icon>
                  </ListItemIcon>
                  <Typography textAlign="center" >{page.primary}</Typography>
                </MenuItem>
              )): null}
            </Menu>
          </Box>
          {/* <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              ...Config.Estilos ? {color:Config.Estilos.Barra_menu.color} : {}
            }}
          >
            {Config && Config.Titulo ? Config.Titulo : 'CHS+'}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {Config && Config.Menu 
              ? Menus(Config.Menu) 
              : null
            }
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Perfil">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircle sx={{...Config.Estilos ? {color:Config.Estilos.Barra_menu.color} : {}}}/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px'}}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
             
              {props.User ? <MenuItem 
                              onClick={()=>{
                                props.Login()
                                handleCloseUserMenu()
                              }}
                            >Salir</MenuItem>
                :<div>
                  <MenuItem onClick={()=>{
                                if (props.Login) props.Login()
                                handleCloseUserMenu()
                              }}
                  >Iniciar</MenuItem>
                  <MenuItem onClick={()=>{
                                          if(props.Registro) props.Registro()
                                          handleCloseUserMenu()
                                        }
                                      }
                  >
                    Registrarse
                  </MenuItem>
                </div>
              }
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
