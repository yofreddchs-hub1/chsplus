//se agregan todas las apis con las que se esta trabajando
import SistemaCHS from "./sistemachs";
import Colegios from "./colegio"
import Unefa from "./unefa"
import UnefaPostgrado from "./unefapostgrado";
import Logo_colegio from './colegio/imagenes/logo.png';
import Logo_unefa from './unefa/imagenes/logo.png';
export const Apis={
    sistema:SistemaCHS,
    sistemachs:SistemaCHS,
    colegio:Colegios,
    Colegio:Colegios,
    unefa:Unefa,
    Unefa,
    unefapostgrado:UnefaPostgrado,
    UnefaPostgrado,
    
}

export const Apis_menu={
    Colegio:Logo_colegio,
    Unefa:Logo_unefa,
    UnefaPostgrado:Logo_unefa,
}