const moment = require('moment');
const MensajeUecla = {};
//❌✅☑️📌✔️

MensajeUecla.Yo='🤖';
MensajeUecla.Informa='ℹ️';
MensajeUecla.Mensualidades='🗓️';
MensajeUecla.Celular='📱';

MensajeUecla.Colegio = `Unidad Educativa Colegio “Libertadores de América”`;
MensajeUecla.MisDatos =`Elaborado por:
Ing. Yofredd R. Chirino S.
Telf.: 04127517660`;
MensajeUecla.separado='-----------------------------------------------------';
MensajeUecla.separadoc='---------------------------------------';

MensajeUecla.Ayuda=(emoji=MensajeUecla.yo)=>{
    return `EN QUE TE PUEDO AYUDAR?${emoji} 
${MensajeUecla.separado}
Envia ${emoji} seguido de la operación que desea realizar
${emoji} 'Operación'
${MensajeUecla.separado}
OPERACIONES PERMITIDAS
${MensajeUecla.separado}
Valor de Mensualidad:
${MensajeUecla.separadoc}
${emoji} COSTO
${MensajeUecla.separadoc}
Datos del Representante:
${MensajeUecla.separadoc} 
${emoji} MIS DATOS
${emoji} ${MensajeUecla.Informa}
${MensajeUecla.separadoc}
Mensualidades del Representante:
${MensajeUecla.separadoc}
${emoji} MIS MENSUALIDADES
${emoji} ${MensajeUecla.Mensualidades}
${MensajeUecla.separadoc}
Pagos Pendientes:
${emoji} PENDIENTE
Reportar pago:
${MensajeUecla.separadoc}
Debe enviar el capture de la operación por Transferencia o Pago Movil seguido de: 
${MensajeUecla.Yo} REFERENCIA
${MensajeUecla.Yo} PAGO
${MensajeUecla.separadoc}
Actualizar Telefono movil:
${MensajeUecla.separadoc}
${MensajeUecla.ActuliarM()}`
}

// Mensualidad : 
//     $${mes}
//     Bs. ${(mes*global.global_cambio.USD).toFixed(2)}
MensajeUecla.Mensualidad = (mes, representados)=>{
    return `VALOR DE MENSUALIDAD 
${moment().format('DD/MM/YYYY')}
${MensajeUecla.separado}
Tasa de cambio:
    BCV: ${global.global_cambio.USD}
${MensajeUecla.separadoc}
${representados.map(val=>`${val.nombres} 
    Mensualidad: $${val.mes}
    Mensualidad: Bs. ${(val.mes*global.global_cambio.USD).toFixed(2)}
`)}
    `
}

MensajeUecla.Representante = (repre) =>{
    return`DATOS DEL REPRESENTANTE
${MensajeUecla.separado}
✅ CEDULA: ${repre.cedula}
✅ NOMBRES: ${repre.nombres}
✅ APELLIDOS: ${repre.apellidos}
✅ CORREO: ${repre.correo}
✅ TELEFONO FIJO: ${repre.telefono_fijo} 
✅ TELEFONO MOVIL: ${repre.telefono_movil}
✅ PROFESIÓN: ${repre.profesion}
✅ REPRESENTADO(S):
    ${repre.representados.map(val=>`${MensajeUecla.separadoc}
    ☑️CEDULA: ${val.cedula}
    ☑️NOMBRES: ${val.nombres}
    ☑️APELLIDOS: ${val.apellidos}
    ☑️GRADO: ${val.grado.titulo} ${val.seccion.titulo}
    `)}
`
}

MensajeUecla.NoRegistrado = (numero,ayuda, cedula)=>{
    return `❌❌❌❌❌❌❌❌ 
NO SE ENCUENTRA REGISTRADO
❌❌❌❌❌❌❌❌
Su número de telefono movil${cedula ? `, cedula de identidad` :''} no se encuentra${cedula ? `n` :''} asignado${cedula ? `s` :''} a ningun representante dentro de nuestro sistema.
📌 NUMERO DE TELEFONO: \n"${numero}"${cedula ? `\n📌 CEDULA: ${cedula}` :''}
Si es representante de ${MensajeUecla.Colegio}
${MensajeUecla.separado}
SE RECOMIENDA: 
${ayuda}`
}

MensajeUecla.ActuliarM = () =>{ //ACTUALIZAR MOVIL
    return `${MensajeUecla.Yo} ACT. MOVIL "cedula" "contraseña"
${MensajeUecla.Yo} ${MensajeUecla.Celular} "cedula" "contraseña"
${MensajeUecla.separadoc}
Cedula: cedula del representante dentro del sistema.
Contraseña: contraseña de acceso del representante al sistema.
`
}

MensajeUecla.MoviActualizado = (repre, clavec, clave, telefono, number, anterior) =>{
    return`ACTUALIZAR TELEFONO MOVIL  
${MensajeUecla.separado}
${(repre.valores.password && repre.valores.password===clavec) || (repre.valores.password===undefined && clave===repre.valores.cedula) ? telefono || number ?  
`✅✅✅✅✅✅✅✅
ACTUALIZACION DE:
${repre.valores.nombres} ${repre.valores.apellidos}
APROBADA` : 
`❌❌❌❌❌❌❌❌
    RECHAZADO` :''}
${(repre.valores.password && repre.valores.password===clavec) || (repre.valores.password===undefined && clave===repre.valores.cedula) ? telefono || number ?  `✅ Numero de telefono actualizado de ${anterior} a ${telefono ? telefono : number}` : '❌ No indico el nuevo numero ❌' : clave ? '❌ Contraseña Invalida ❌' : '❌ No indico contraseña ❌' }
    `
}

MensajeUecla.AyudaActulizar = `${MensajeUecla.Yo} ACTUALIZAR MOVIL "su cedula" "contraseña"`

MensajeUecla.MensualidadesM = (repre,representa) =>{
    return`MENSUALIDAD DE${representa.length>1 ? ` LOS` : `L`} REPRESENTADO${representa.length>1 ? `S` : ``} DE:
${repre.nombres} ${repre.apellidos}
REPRESENTADO${representa.length>1 ? `S` : ``}:
${representa.map(val=>`${MensajeUecla.separadoc}
☑️ ${val.nombres} ${val.apellidos}
☑️ GRADO: ${val.grado.titulo ? val.grado.titulo : val.grado} ${val.seccion.titulo}
☑️ MESES PENDIENTES:
    ${val.porpagar && Object.keys(val.porpagar).length!==0 ? Object.keys(val.porpagar).map(m=>`${m}:
        ${val.porpagar[m]}
    `) :'✅ SOLVENTE ✅\n'}`)}`
}

MensajeUecla.ReferenciaAceptada = (datos,dat,numero, representantes)=>{
    return`✅ Referencia: ${datos.referencia}
${dat}${MensajeUecla.separadoc}
✅✅✅✅✅✅✅✅
Recibida con éxito
Desde: ${numero}
Asignado a: ${representantes.valores.nombres} ${representantes.valores.apellidos}`
}

MensajeUecla.ReferenciaEspera = (datos,ref,numero, representantes)=>{
    return`${ref.valores.estatus==='0'? '✔️ Referencia en espera de ser procesada' : `✅ Referencia procesada en recibo: ${ref.valores.recibo}`}
✅ Referencia: ${datos.referencia}
☑️☑️☑️☑️☑️☑️☑️☑️
Recibida con éxito el:
${moment(ref.createdAt).format("DD/MM/YYYY HH:mm a")}
Desde: ${numero}
Asignado a:${representantes.valores.nombres} ${representantes.valores.apellidos}
Espere a que sea procesada por administración`
}

module.exports = MensajeUecla;