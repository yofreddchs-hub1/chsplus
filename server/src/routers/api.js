const { Router, static } = require('express');
const router = Router();
const upload = require('../servicios/api_fichero');
var fs = require('fs');
let archivos=upload.any()
// .fields([
//   {name:'file' },{name:'foto'},{name:'image-cedula'}, {name:'avatar'}, {name:'video'},
//   {name:'file_0' }, {name:'file_1' }, {name:'file_2' }, {name:'file_3' }, {name:'file_4' },
//   {name:'file_5' }, {name:'file_6' }, {name:'file_7' }, {name:'file_8' }, {name:'file_9' },
//   {name:'file_10' }, {name:'file_11' }, {name:'file_12' }, {name:'file_13' }, {name:'file_14' },
//   {name:'file_15' }, {name:'file_16' }, {name:'file_17' }, {name:'file_18' }, {name:'file_19' },
// ]);

const direct = __dirname.replace('/src/routers','/archivos');
fs.stat(direct, (err) => {
  if (!err) {
      console.log('Existe>', direct);
  }
  else if (err.code === 'ENOENT') {
      console.log('No existe');
      const Archivos_crear=['','imagenes',
                          ];
      Archivos_crear.map(dir => fs.mkdirSync(`${direct}/${dir}`));
  }
});

const { Ver_api, Login,Verificar, Getall, Getall_C, Setall, Delall, Leer_data, Guardar_data,
        Eliminar_data, DataBase, Varios_Datos, Valor_Dolar,Ver_Imagen,Guardar_data_excel,
        Posicion_geo,
        Egew_cuentas_wesi, Egew_cuentas_banco, Egew_movimientos, Egew_userAdmin, Egew_cuentas_sistema, 
        Egew_comprarWesi, Egew_statusComprarWesi, Egew_cambiar_status_compra, Egew_cambiar_password,
        Egew_pagarWesi,
        Egew_transferirWesi,
        VerApis,
        Guardar_produccion, Ingresar_material, Ingresar_empaque, Ingreso_Egreso, Recibo_venta, Serial, Egreso_Venta, Ventas,
        Sincronizar,
        Ingresar,
        Infor_database,Infor_databaseD, Infor_datos, WhatsAppQR,
      } = require('../controllers/api.controller');

const {Mensualidades, EnviarPago, Solvencias, Resumen, Sincronizar_uecla, Recibos, Verificar_Inscripcion, Actualizar_Referencia, Promover, LeerHorarioU, DisponibilidadHorarioU, GuardarHorarioU, Notas} = require('../controllers/colegio.controller');
const { LeerHorario, GuardarHorario, DisponibilidadHorario, MisDatos } = require('../controllers/unefa.controller');

router.post('/ver_api', Ver_api);
router.post('/login/verificar', Verificar);
router.post('/login', Login);
router.post('/getall',Getall);
router.post('/getallc',Getall_C);
router.post('/setall',archivos ,Setall);

// router.post('/setall',upload.single('file') ,Setall);
router.post('/leer_data',Leer_data);
router.post('/guardar_data',Guardar_data);
router.post('/database',DataBase);
router.post('/verapis',VerApis);
router.post('/varios_datos',Varios_Datos);
router.post('/valor_dolar',Valor_Dolar);
router.post('/guardar_excel',Guardar_data_excel);
router.post('/posicion_geo',Posicion_geo);

router.delete('/delall',Delall);
router.delete('/eliminar_data',Eliminar_data);
// sincronizacion
router.post('/sincronizar', Sincronizar);
router.post('/infodatabase', Infor_database);
router.post('/infodatabased', Infor_databaseD);
router.post('/infodatos', Infor_datos);

//Whatsapp
router.post('/whatsappqr', WhatsAppQR);
// SistemaCHS
router.get('/reciboventa',Recibo_venta);
router.post('/serial', Serial);
router.post('/egresoventa', Egreso_Venta);
router.post('/ventas', Ventas);
router.post('/guardarproduccion',Guardar_produccion);
router.post('/ingresar',Ingresar);
router.post('/ingresarmaterial',Ingresar_material);
router.post('/ingresarempaque',Ingresar_empaque);
router.post('/ingresoegreso',Ingreso_Egreso);

// Para EGEW
router.post('/cuentas_wesi',Egew_cuentas_wesi);
router.post('/cuentas_banco',Egew_cuentas_banco);
router.post('/cuentas_sistema',Egew_cuentas_sistema);
router.post('/movimientos',Egew_movimientos);
router.post('/useradmin',Egew_userAdmin);
router.post('/comprawesi',Egew_comprarWesi);
router.post('/pagarwesi',Egew_pagarWesi);
router.post('/transferirwesi',Egew_transferirWesi);
router.post('/statuscomprawesi',Egew_statusComprarWesi);
router.post('/cambiarpassword',Egew_cambiar_password);
router.post('/cambiarstatuscompra',Egew_cambiar_status_compra);

// Para colegio
router.post('/colegio/mensualidades',Mensualidades);
router.post('/colegio/verificarinscripcion',Verificar_Inscripcion);
router.post('/colegio/solvencias',Solvencias);
router.post('/colegio/enviarpago',EnviarPago);
router.post('/colegio/resumen',Resumen);
router.post('/colegio/recibo',Recibos);
router.post('/colegio/sincronizar',Sincronizar_uecla);
router.post('/colegio/actualizarreferencia',Actualizar_Referencia);
router.post('/colegio/promover',Promover);
router.post('/colegio/leerhorario',LeerHorarioU);
router.post('/colegio/disponibilidadhorario',DisponibilidadHorarioU);
router.post('/colegio/guardarhorario',GuardarHorarioU);
router.post('/colegio/notas',Notas);
// router.get('/imagen/:filename',Ver_Imagen);

//Para Unefa
router.post('/unefa/leerhorario',LeerHorario);
router.post('/unefa/guardarhorario',GuardarHorario);
router.post('/unefa/disponibilidadhorario',DisponibilidadHorario);
router.post('/unefa/misdatos',MisDatos);


module.exports = router;
