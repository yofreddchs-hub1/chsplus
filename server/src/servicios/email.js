// const Pop3Command = require('node-pop3');

// // const pop3 = new Pop3Command({
// //   user: 'example@example.com',
// //   password: 'example',
// //   host: 'pop3.example.com',
// // });

// const pop3 = new Pop3Command({ host: 'pop.ionos.es' });

// (async () => {

//   await pop3.connect();
//   await pop3.command('USER', 'raq@raqlan.com');
//   await pop3.command('PASS', '$R495op0rT3#2021');

//   //Cantidad de correos al parecer
// //   const [info] = await pop3.command('STAT');
// //   console.log(info); // 100 102400
//   const list = await pop3.UIDL();
//   console.dir(list);

//   //Datos de la pagina completa en formato string
// //   const list1 = await pop3.RETR(1);
// //   console.dir(list1);
//   const [info, stream] = await pop3.command('RETR', 1);
//   console.log(info, stream); // 1024 octets

// //   const [info] = await pop3.command('QUIT');
// //   console.log(info); // Bye

// })();
const fs = require('fs');
const path = require('path');
var XLSX = require('xlsx');
const { Client } = require('yapople');

conectar_email = async () => {
    try{
        const client = new Client({
            host: 'pop.ionos.es',
            username: 'raq@raqlan.com',
            password: '$R495op0rT3#2021',
          //   port:  995,
          //   tls: false, //true,
            mailparser: true,
            
            options: {
              secureContext: {
                passphrase: "passphrase"
              }
            }
          });
        console.log('>>>>>> Verificando correo Raq@raqlan.com')
        await client.connect();
        
        const messages = await client.retrieveAll();
        // console.log('>>>>>>',messages)
        const DB = require(`../models/Excel`);
        messages.forEach(async(message) => {
            if(message.attachments){
                for (var i in message.attachments) {
                    var attachment = message.attachments[i];
                    var data = attachment.content;
                    var filename=attachment.fileName;
                    // console.log(filename, data)
                    var workbook = XLSX.read(data, {type:"buffer"});
                    
                    let dbs = await DB.find({filename});
                    console.log(filename, dbs)
                    if (dbs.length===0){
                        procesar(filename,workbook);
                    }
                }
                
            }
        });
        await client.quit();
    }catch(error){
        console.log(error)
    }
};

procesar = (filename, workbook)=>{
    console.log('Procesar')
    let valores =JSON.parse( fs.readFileSync(__dirname.replace('servicios','')+`data${path.sep}datos.json`, 'utf8'));
    valores=valores.formularios.Form_excel_cols;

    //Paginas
    const sheetnames = workbook.SheetNames;
    const pagina1 =   workbook.Sheets[workbook.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(pagina1, {
        raw: false,
        header: 1,
        dateNF: 'yyyy-mm-dd',
        blankrows: false,
    });

    let agregar=false;
    let nrows=[];
    let sector = '';
    rows.map((v, i)=>{
            
        if (v[0]===valores[1].name){ 
            agregar=true;
        }else if (v[0]!=='' && rows[i+1][0]===valores[1].name){
            sector=v[0];
            agregar=false;
        }
        if (v[0]!=='' && v[0]!==valores[1].name && agregar){
           nrows.push([...v, sector])
        }
    })
    Registra(filename, nrows, true)
}

Registra = async(filename, datos, correo=false)=>{
    const DB = require(`../models/Orden`);
    const DBF = require(`../models/Excel`);
    let reporte = []
    let dbsf = await DBF.find({filename});
    
    if (dbsf.length!==0) reporte.push({
        mensaje:`El archivo ${filename}, ya existe en un proceso anterior`,
        correo
    })
    
    let valores =JSON.parse( fs.readFileSync(__dirname.replace('servicios','')+`data${path.sep}datos.json`, 'utf8'));
    const {Form_orden, Form_excel_cols} =valores.formularios;
    // datos.forEach(async (val)=>{
    let exitoso=true;
    
    for (var i=0; i<datos.length ; i=i+1){
        const val=datos[i]
        let campos={}
        Form_excel_cols.map((camp,i)=>{
            if (i>0)
                campos[Form_orden[camp.campo].name]=val[i-1]
        })
        console.log('>>>',campos, val)
        //Verifico el numero de contrato
        try{
            if (campos.contrato){
                let dbs = await DB.find()
                if (dbs.length!==0)
                    dbs =await DB.find({$text: {$search: campos.contrato, $caseSensitive: true}});
                console.log(dbs)     
                if (dbs.length===0){
                    const Nuevo = new DB({campos:Form_orden, valores:campos, filename});
                    await Nuevo.save();
                }else{
                    exitoso=false;
                    reporte.push({
                        contrato:campos.contrato, 
                        mensaje:`El contrato ${campos.contrato} del archivo ${filename} tambien se encuentra en el archivo ${dbs[0].filename}`,
                        correo
                    })
                }
            }    
        }catch(error) {
            console.log('Error',campos);
            exitoso=false;
        }
        // console.log({campos:Form_orden, valores:campos})
    }
    
    if (reporte.length!==0){ 
        global.io.emit('Reporte',reporte)
    }
    if (exitoso || reporte.length>datos.length){
        console.log('Guardar excel')
        const Nuevo = new DBF({filename});
        await Nuevo.save();

    }
    const data = await DB.find();
    global.io.emit('Actualizar_Orden',{tabla:'Orden', datos:data})

}
global.Registra= Registra;
//conectar_email()

const tiempo= 10 * (60000)
setInterval(async ()=> {
    conectar_email()
}, tiempo)


