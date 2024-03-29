
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
import Formulas from './procesos/formulas';
import SubMenu from './procesos/submenu';
import Venta from './venta';
import Cobrar from './venta/porcobrar';
export const sistema_pantallas={
    Sistema:Dashboard,
    Planificar: Planificacion,
    Registros,
    Produccion,
    Ingresos:{
        Ingresos:(props)=> <SubMenu {...props} submenu={['Sistema','Ingresos']}/>,
        'Ingreso Material':IMP,
        'Ingresar Empaque':Empaques
    },
    Egresos:{
        Egresos: (props)=> <SubMenu {...props} submenu={['Sistema','Egresos']}/>,
        'Egreso Material':EMP,
        'Egreso Producto Terminado':EProducto,
        Venta,
        cobrar:Cobrar
    },
    Reportes,
    Nuevos:{
        Nuevos: (props)=> <SubMenu {...props} submenu={['Sistema','Nuevos']}/>,
        Formulas
    }
    
   
}