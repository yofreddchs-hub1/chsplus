import Configuracion from '../componentes/configuracion';
import DataBase from '../componentes/configuracion/database';
import CrearFormulario from '../componentes/configuracion/crearformulario';
import Listas from '../componentes/configuracion/listas';
import Titulos from '../componentes/configuracion/titulostabla';
import Subtotales from '../componentes/configuracion/subtotales';
import Horarios from '../componentes/horario';
import Home from './home';

export const pantallas={
    Home,
    Inicio:Home,
    Configuracion,
    Datos:Configuracion,
    Tablas:DataBase,
    CrearFormulario: CrearFormulario,
    Listas,
    Titulos,
    Subtotales,
    Horario:Horarios
}