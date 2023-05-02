import Datos from './index';
import DataBase from './database';
import CrearFormulario from './crearformulario';
import Listas from './listas';
import Subtotales from './subtotales';
import Titulos from './titulostabla'
import Estilos from './estilos';
import Crear_App from './crearapp';
import Sincronizar from './Sincronizar';
import WhatsApp from './whatsapp';
export const configuracion_pantallas={
    Configuracion:Datos,
    Datos,
    Crear_App,
    Tablas:DataBase,
    CrearFormulario: CrearFormulario,
    Listas,
    Titulos,
    Subtotales,
    Estilos,
    Sincronizar,
    WhatsApp
}