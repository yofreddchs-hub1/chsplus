import { Ver_Valores } from ".";

export const Form_todos = (key)=>{
    const Form= Ver_Valores().config.Formularios[key];
    return Form
            ? Form
            : {columna:1,
                value:[ 
                    {"key":"xnonex", "name":"xnonex", placeholder:"Sin formulario asignado" },
                ]
              }
};

export const Titulos_todos = (key)=>{
    let Form= Ver_Valores().config.Titulos[key];
    Form= Form
            ? Form
            : [ 
                {title:'_id',field:'_id'},
                {title:'Creado',field:'createdAt'},
             ]
    return Dar_formato(Form)
};

const Dar_formato =(Form)=>{
    let nuevo= Form.map(v=>{
        let valor={...v}
        if (Object.keys(v).indexOf('formato')!==-1){
            
            if (typeof v.formato ==='string'){
                valor['formato']=eval(v.formato)    
            }else{
                valor['formato']=v.formato
            }
        }
        if (valor.tipo){ 
            if(valor.tipo.indexOf('lista_')!==-1){
                const lista= Ver_Valores().config.Listas[valor.tipo];
                console.log(lista, valor)
                valor.formato= (dato)=> {
                    console.log(dato.valores)
                    if (dato.valores)
                    return `${dato.valores[valor.field].titulo}`
                    return `${lista[dato[valor.field]].titulo}`
                }
            }
        }
        return valor
    })
    return nuevo
}
