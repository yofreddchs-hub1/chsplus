
import Registros from './registros';
import Planificacion from './planificacion';
import Dashboard from './dashboard';
import Produccion from './produccion';
import Ingresos from './ingresos';
import IMP from './ingresos/materiaprima';
import Empaques from './ingresos/empaques';
import Egresos from './egresos';
import EMP from './egresos/materiaprima';
import EProducto from './egresos/egresosproducto';
import Reportes from './reportes';
export const sistema_pantallas={
    Sistema:Dashboard,
    Planificar: Planificacion,
    Registros,
    Produccion,
    Ingresos:{
        Ingresos,
        'Ingreso Material':IMP,
        'Ingresar Empaque':Empaques
    },
    Egresos:{
        Egresos,
        'Egreso Material':EMP,
        'Egreso Producto Terminado':EProducto
    },
    Reportes
   
}