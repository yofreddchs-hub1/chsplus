// Funciones utilizadas para el sistema de colegio

import { conexiones, crear_campos } from "../../procesos/servicios"

const Mayuscula = (datos)=>{
    Object.keys(datos).map(valor=>{

        if (['_id'].indexOf(valor)===-1 && typeof datos[valor]==='string' ){
            datos[valor]=datos[valor].toUpperCase()
        }
    })
    return datos
    
}

const Datos_estudiante = async(datos)=>{
    let resultado
    let anterior = await conexiones.Leer_C(['colegio_estudiante'], {'colegio_estudiante':{_id:datos._id}})
    if (anterior.Respuesta==='Ok'){
        anterior = anterior.datos.colegio_estudiante[0];
        resultado= anterior
    }
    return resultado
}

const Datos_representante = async(datos)=>{
    let resultado
    if(datos && datos._id){
        let anterior = await conexiones.Leer_C(['colegio_representante'], {'colegio_representante':{_id:datos._id}})
        if (anterior.Respuesta==='Ok'){
            anterior = anterior.datos.colegio_representante[0];
            resultado= anterior
        }
    }
    return resultado
}

const Ver_igualdad = (valor, valor1)=>{
    let igual = true;
    if (valor!==null &&  valor!==undefined && valor1!==null && valor1!==null && Object.keys(valor).length===Object.keys(valor1).length){
        Object.keys(valor).map(val=>{
            if (valor[val]!==valor1[val]){
                igual=false
            }
            return val
        })
    }else{
        igual=false
    }
    return igual

}

export const Condicion_Estudiante = async(data)=>{
    let valores= data.valores;
    let campos = data.campos;
    valores= Mayuscula(valores);
    let representante
    if (valores.representante){
        let lista={
            _id:valores.representante._id,
            cedula:valores.representante.cedula,
            nombres:valores.representante.nombres,
            apellidos:valores.representante.apellidos,
            parentesco: 
                typeof valores.representante.parentesco==='object' 
                    ? valores.representante.parentesco.titulo 
                    : valores.representante.parentesco 
                        ? valores.representante.parentesco 
                        : '',
        }
        valores.representante= lista
        representante = await Datos_representante(valores.representante)
        
    }
    let anterior
    if (valores._id){
        anterior = await Datos_estudiante(valores);
        anterior = anterior.valores ? anterior.valores : anterior;
        let representanteA = await Datos_representante(anterior.representante)
        if (representanteA!==undefined){
            representanteA.valores.representados= representanteA.valores.representados.filter(f=> f._id!==valores._id)
            await conexiones.Guardar({campos:representanteA.campos, valores:representanteA.valores, multiples_valores:true}, 'colegio_representante');
        }
    }
    // if (!igual){
    //     representante = await Datos_representante(valores.representante)
    // }

    let nuevos= await conexiones.Guardar({campos, valores, multiples_valores:true}, 'colegio_estudiante');
    if (nuevos.Respuesta==='Ok'){
        const estudiantes= nuevos.resultado
        if (representante){
            let representados = representante.valores.representados
            if (representados){
                const limite =estudiantes.filter(f=> f.valores.representante && f.valores.representante._id===representante._id); 
                const pos1= limite.findIndex(f=> f.valores.cedula===valores.cedula && f.valores.nombres===valores.nombres && f.valores.apellidos===valores.apellidos);
                //modificar en lista de representados
                const estudiante={
                    _id:limite[pos1]._id,
                    cedula:limite[pos1].valores.cedula,
                    nombres:limite[pos1].valores.nombres,
                    apellidos:limite[pos1].valores.apellidos,
                    grado:limite[pos1].valores.grado,
                    seccion:limite[pos1].valores.seccion,
                    beca:limite[pos1].valores.beca,
                    estatus:limite[pos1].valores.estatus,

                }
                const pos = representados.findIndex(f=> f._id===estudiante._id);
                if (pos===-1){
                    representante.valores.representados= [...representante.valores.representados, estudiante]
                }else{
                    representante.valores.representados[pos]= estudiante
                }
            }
            
            await conexiones.Guardar({campos:representante.campos, valores:representante.valores, multiples_valores:true}, 'colegio_representante');
        }
    }
    
    return {finalizado_condicion:true, ...nuevos}

}

export const Condicion_Representante = async(data) =>{
    let valores= data.valores;
    let campos = data.campos;
    valores= Mayuscula(valores);
    if (valores._id){
        let anterior = await Datos_representante(valores);
        if (anterior.valores.representados){
            for (var i=0; i<anterior.valores.representados.length; i++){
                let estudiante= anterior.valores.representados[i];
                estudiante= await Datos_estudiante(estudiante);
                estudiante.valores.representante= null;
                await conexiones.Guardar({campos: valores.campos, valores:estudiante.valores, multiples_valores:true}, 'colegio_estudiante');
            } 
        }
    }
    if (typeof valores.representados === 'string'){
        valores.representados=[]
    }else{

    }
    let nuevos= await conexiones.Guardar({campos, valores, multiples_valores:true}, 'colegio_representante');
    if (nuevos.Respuesta==='Ok'){
        let representantes =  nuevos.resultado;
        if (valores.representados.length!==0){
            const pos = representantes.findIndex(f=> f._id===valores._id 
                || (f.valores.cedula===valores.cedula && f.valores.nombres===valores.nombres && f.valores.apellidos===valores.apellidos) );
            const representante={
                _id: representantes[pos]._id,
                cedula: representantes[pos].valores.cedula,
                nombres: representantes[pos].valores.nombres,
                apellidos: representantes[pos].valores.apellidos,
                parentesco: typeof valores.parentesco==='object' 
                    ? valores.parentesco.titulo 
                    : valores.parentesco 
                        ? valores.parentesco 
                        : '',
            }
            for (var i=0; i<valores.representados.length; i++){
                let estudiante= valores.representados[i];
                estudiante= await Datos_estudiante(estudiante);
                estudiante.valores.representante= representante;
                await conexiones.Guardar({campos: valores.campos, valores:estudiante.valores, multiples_valores:true}, 'colegio_estudiante');
            } 
        }
    }

    return {finalizado_condicion:true, ...nuevos}

}