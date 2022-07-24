const unefaCtrl = {};
const path = require('path');
const fs = require('fs');
const { Hash_texto, Hash_password } = require('../servicios/encriptado');
const { Codigo_chs, Hash_chs} = require('../servicios/conexiones');
const {Verifica_api, Tablas} = require('../controllers/api.controller');

Ver_disponibilidad = (datos, horario)=>{
    
    return datos.valores.valor === horario.valores.horario[datos.pos.fila][datos.pos.columna].valor || horario.valores.horario[datos.pos.fila][datos.pos.columna].valor===''

}

unefaCtrl.DisponibilidadHorario = async (req, res) =>{
    let {user, api, datos, table, hash} = req.body;
    user= typeof user==='string' ? JSON.parse(user) : user;
    const hashn = await Hash_texto(JSON.stringify({user, api, table, datos}));
    const igual= await Verifica_api(api, true);
    if (hashn===hash && igual) {
        datos= JSON.parse(datos);
        await Tablas(table);
        const Horario = require(`../models/${table}`);
        const Aula = require(`../models/unefa_aula`);
        let aulas = await Aula.find();
        let horarios = await Horario.find({$text: {$search: datos.periodo, $caseSensitive: true}})
        horarios= horarios.filter(f=> {
            const o = datos.docentes ? datos.docentes.filter(f1=> f1._id===f.valores._id_tipo) : [];
            const a = aulas.filter(f1=> String(f1._id)===f.valores._id_tipo);
            return (f.valores.periodo===datos.periodo && o.length!==0) || (f.valores.periodo===datos.periodo && a.length!==0)
        })
        aulas= aulas.filter(f=>{
            const pos1= horarios.findIndex(v=>v.valores._id_tipo===String(f._id))
            let libre= false;
            if (pos1===-1){
                libre=true;
            }else{
                libre= Ver_disponibilidad(datos, horarios[pos1])
            }
            return libre
        }).map(v=>{return {...v.valores, titulo:v.valores.nombre, _id:v._id}})
        let docentes = datos.docentes ? datos.docentes.filter(f=>{
            const pos1= horarios.findIndex(v=>v.valores._id_tipo===String(f._id))
            let libre= false;
            if (pos1===-1){
                libre=true;
            }else{
                
                libre= Ver_disponibilidad(datos, horarios[pos1])
            }
            return libre
        }) : []; 
        docentes = docentes.map(v=>{return {...v}})
        res.json({Respuesta:'Ok', aulas, docentes});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}

Verificar_horas = async (datos, i, j, hor, nuevo, columna, limpiar, user,codigo_id_tipo, codigo_titulo, codigo_tipo)=>{
    const {periodo, _id_tipo, titulo}= datos
    if (hor.length===0){
        hor=nuevo.map((val,i)=>{
            if (i===0){
                return val
            }else{
                return val.map((v,j)=>{
                    if (j===0){
                        return {...v}
                    }else{
                        return {dia:v.dia, hora:v.hora, espacio: 1, valor:'', mensaje:''}
                    }
                    
                })
            }
            
        })
        if (!limpiar){
            hor[i][j]={
                ...columna,
                seccion:{
                    _id:_id_tipo,
                    titulo,
                }
            }
        }
        
        let valores={
            _id_tipo:codigo_id_tipo, periodo, tipo:codigo_tipo,
            titulo: codigo_titulo,
            horario:hor
        }
        await Guardar_horario(valores, user)
    }else{
        hor=hor[0];
        hor.valores._id=hor._id;
        hor=hor.valores;
        let guardar = true
        // if (!limpiar)
        // console.log(codigo_titulo, i,j, hor.horario[i][j].valor === columna.valor, limpiar)
        if (hor.horario[i][j].valor==='' && !limpiar){
            let espacio=columna.espacio===0 ? 0 : 1;
            if (columna.espacio>espacio){
                let salir=false
                while (espacio<columna.espacio && !salir){
                    if (hor.horario[i+espacio][j].valor===''){
                        espacio++;
                    }else{
                        salir=true
                    }
                }
            }
            hor.horario[i][j]={
                ...columna,
                espacio,
                seccion:{
                    _id:_id_tipo,
                    titulo,
                },
                tipo:codigo_tipo
            }
            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>Agregar', i, j, columna.valor)
        }else if (hor.horario[i][j].valor!=='' && hor.horario[i][j].valor === columna.valor && hor.horario[i][j].seccion.titulo === titulo && limpiar){
            hor.horario[i][j]={dia:nuevo[i][j].dia, hora:nuevo[i][j].hora, espacio: 1, valor:'', mensaje:''};
            if (hor.horario[i+1][j].espacio===0) hor.horario[i+1][j].espacio=1;
            // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>Remover', i, j, columna.valor)
        }else if(hor.horario[i][j].valor==='' && limpiar){
            guardar=false;
        }else if(!limpiar){
            hor.horario[i][j].mensaje=`Existe un choque de horario, el ${columna.dia} a las ${columna.hora}, entre "${titulo} y ${hor.horario[i][j].seccion.titulo}"`;
            if (columna.mensaje===''){
                columna.mensaje=`Existe un choque de horario, el ${columna.dia} a las ${columna.hora}, con ${codigo_tipo} "${codigo_titulo}", entre "${titulo} y ${hor.horario[i][j].seccion.titulo}"`;
            }else{
                columna.mensaje+=` y con ${codigo_tipo} "${codigo_titulo}", entre "${titulo} y ${hor.horario[i][j].seccion.titulo}"`
            }
        }else{
            console.log('Verificar igualdad en limpiar',i,j, codigo_titulo, limpiar, hor.horario[i][j].valor,'valor columna', columna.valor);
            hor.horario[i][j].mensaje='';
            let cont=1;
            while(hor.horario[i+cont][j].mensaje!=='' && hor.horario[i+cont][j].valor === columna.valor && hor.horario[i+cont][j].seccion.titulo){
                hor.horario[i+cont][j].mensaje='';
            }
        }
        if (guardar){
            await Guardar_horario(hor, user)
        }    
    }
    return columna
}

Comparar_horario = async(datos, nuevo, user, limpiar=false)=>{
    const {horario, periodo}= datos
    let resultado=horario;
    for (var i=0; i<horario.length; i++){
        let fila= horario[i];
        for (var j=0; j<fila.length; j++){
            let columna= fila[j];
            if (columna.valor!=='' && j!==0){
                //Para Docente
                if(columna.docente && columna.docente._id){
                    let hor = await Buscar_Horario({_id_tipo:columna.docente._id, periodo});
                    resultado[i][j] = await Verificar_horas(datos, i, j, hor, nuevo, columna, limpiar, user, columna.docente._id, columna.docente.titulo, 'docente')
                    if (resultado[i][j].mensaje!==''){
                        let cont = 0;
                        while(resultado[i-cont][j].espacio===0 && i-cont>0){
                            cont++;
                            resultado[i-cont][j].mensaje=resultado[i][j].mensaje;
                        }
                    }
                    
                }
                //Para Aula
                if(columna.aula && columna.aula._id){
                    let hor = await Buscar_Horario({_id_tipo:columna.aula._id, periodo});
                    resultado[i][j] = await Verificar_horas(datos, i, j, hor, nuevo, columna, limpiar, user, columna.aula._id, columna.aula.titulo, 'aula')
                    if (resultado[i][j].mensaje!==''){
                        let cont = 0;
                        while(resultado[i-cont][j].espacio===0 && i-cont>0){
                            cont++;
                            resultado[i-cont][j].mensaje=resultado[i][j].mensaje;
                        }
                    }
                }
            }
        }
        
    }
    return resultado
}

Guardar_horario= async(datos, user)=>{
    await Tablas('unefa_horario');
    const Horario = require(`../models/unefa_horario`);
    let horario
    if (datos._id){
        await Horario.updateOne({_id:datos._id},{valores:datos, actualizado:user.username},{ upsert: true });
        horario = await Horario.findOne({_id: datos._id})
    }else{
        let cod_chs = await Codigo_chs({...datos});
        const Nuevo = new Horario({cod_chs, valores:datos, actualizado:user.username});
        await Nuevo.save();
        horario=Nuevo
    }
    return horario

}
unefaCtrl.GuardarHorario = async (req, res) =>{
    let {user, api, datos, table, hash} = req.body;
    user= typeof user==='string' ? JSON.parse(user) : user;
    const hashn = await Hash_texto(JSON.stringify({user, api, table, datos}));
    const igual= await Verifica_api(api, true);
    if (hashn===hash && igual) {
        datos= JSON.parse(datos);
        await Tablas(table);
        const nuevo = datos.nuevo
        //Limpiar
        let hor = await Buscar_Horario(datos);
        if (hor.length!==0){
            hor= {...hor[0].valores, _id: hor[0]._id}
            await Comparar_horario(hor, nuevo, user, true);
        }
        //Cargar datos
        datos.horario = await Comparar_horario(datos, nuevo, user);
        delete datos.nuevo
        let horario= await Guardar_horario(datos, user);
        
        res.json({Respuesta:'Ok', datos, horario, nuevo});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}

Buscar_Horario= async(datos, campo='_id_tipo')=>{
    await Tablas('unefa_horario');
    const Horario = require(`../models/unefa_horario`);
    let horario = await Horario.find({$text: {$search: datos[campo], $caseSensitive: true}})
    horario= horario.filter(f=> f.valores[campo]===datos[campo] && f.valores.periodo===datos.periodo) 
    return horario
}
unefaCtrl.LeerHorario = async (req, res) =>{
    let {user, api, datos, table, hash} = req.body;
    user= typeof user==='string' ? JSON.parse(user) : user;
    const hashn = await Hash_texto(JSON.stringify({user, api, table, datos}));
    const igual= await Verifica_api(api, true);
    if (hashn===hash && igual) {
        datos= JSON.parse(datos);
        let horario = await Buscar_Horario(datos)
        res.json({Respuesta:'Ok', horario});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}

unefaCtrl.MisDatos = async (req, res) =>{
    let {user, api, hash} = req.body;
    user= typeof user==='string' ? JSON.parse(user) : user;
    const hashn = await Hash_texto(JSON.stringify({user, api}));
    const igual= await Verifica_api(api, true);
    if (hashn===hash && igual) {
        await Tablas('unefa_User_api');
        await Tablas('unefa_docente');
        const Usuario = require(`../models/unefa_User_api`);
        const Docente = require(`../models/unefa_docente`);
        let usuario = await Usuario.findOne({_id:user._id});
        if (usuario!==null){
            usuario= {...usuario.valores, _id: usuario._id};
        }
        let docente = await Docente.find({$text: {$search: user.username, $caseSensitive: true}})
        if (docente.length!==0){
            docente= docente.filter(f=>f.valores.username===user.username).map(v=>{return{...v.valores,_id:v._id}})[0];
        }else{
            docente= {}
        }
        const datos = {...docente, username:usuario.username, usuario}
        res.json({Respuesta:'Ok', datos});
    }else{
        res.json({Respuesta:'Error', mensaje:'hash invalido'});
    }

}

module.exports = unefaCtrl;