const moment = require('moment');
const MensajeCHS = {};

MensajeCHS.Yo='🤖';
MensajeCHS.Informa='ℹ️';

MensajeCHS.MisDatos =`Elaborado por:
Ing. Yofredd R. Chirino S.
Telf.: 04127517660`;

MensajeCHS.separado='-----------------------------------------------';
MensajeCHS.separadoc='---------------------------------------';

MensajeCHS.Ayuda=`EN QUE TE PUEDO AYUDAR?${MensajeCHS.Yo}
${MensajeCHS.separado}
Envia ${MensajeCHS.Yo} seguido de la operación que desea realizar
${MensajeCHS.Yo} 'Operación'
${MensajeCHS.separado}
OPERACIONES PERMITIDAS
${MensajeCHS.separado}
Inventario Materia Prima:
${MensajeCHS.separadoc}
${MensajeCHS.Yo} MATERIA PRIMA
${MensajeCHS.Yo} 📌
${MensajeCHS.separadoc}
Inventario de Productos Terminados:
`+
// ${MensajeCHS.separadoc}
// ${MensajeCHS.Yo} PRODUCTO TERMINADO
// ${MensajeCHS.Yo} 📦
// ${MensajeCHS.separadoc}
`Planificación del dia:
${MensajeCHS.separadoc}
${MensajeCHS.Yo} PLANIFICACION dd/mm/año
${MensajeCHS.Yo} 📝 dd/mm/año
`
MensajeCHS.Planificacion = (dia, dbs)=>{
    let mensaje = `Planificación ${dia} 📝\n`;
    dbs.map(val=>{
        val.produccion.map(v=>{
            mensaje+=`${MensajeCHS.separado}
${v.cantidad} trompo(s) de
"${v.mezcla}"
${MensajeCHS.separadoc}
Materia Prima: 📋
${MensajeCHS.separadoc}
`;
            v.mp.map(mp=>{
                mensaje+=`📌${mp.descripcion} ${mp.cantidadT}\n`;
            })
            mensaje+=`${MensajeCHS.separadoc}
Productos Terminados: 📦
${MensajeCHS.separadoc}
`;
            v.pt.map(pt=>{
                if(pt.cantidadFinal!==0){
                    mensaje+=`📦Cant.:${pt.cantidadFinal} de ${pt.descripcion} \n`
                }  
            })
        })
        return val;
    })
    return mensaje
}
module.exports = MensajeCHS;