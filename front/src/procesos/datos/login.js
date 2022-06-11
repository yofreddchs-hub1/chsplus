import {const_procesos, const_Textos}from '../../constantes';

let user = JSON.parse(localStorage.getItem(const_procesos.DATOS_USER));

const initialState = user ? { user_datos:false ,logiado: true, user} : {logiado: false,};

export const login = (action,state = initialState) => {

  switch (action.type) {
    case const_Textos.LOGIN_REQUEST:
      return {
        ...state,
        logiado:true,
        user:action.user,
        error:false,
      };
    case const_Textos.LOGIN_SUCCESS:
      return {
        ...state,
        logiado:true,
        user:action.user,
        error:false,
      };
    case const_Textos.USER_OPEN:
      return {
        ...state,
        user_datos: true
      };
    case const_Textos.USER_CLOSE:
      return {
        ...state,
        user_datos: false
      };
    case const_Textos.LOGIN_FAILURE:
      return {error:const_Textos.LOGIN_ERROR};
    case const_Textos.LOGOUT:
      return {logiado:false};
    default:
      return state

  }
}
