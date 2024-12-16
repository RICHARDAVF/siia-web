import config from '../src/config'
const {BASE_URL} = config
export const MANY_DATA_LIST =(document)=> `${BASE_URL}/api/v1/generic/${document}/`
export const LIST_ASIENTOS =(document)=> `${BASE_URL}/api/v1/contabilidad/${document}/`
// CONDICION DE PAGO
export const LIST_CONDICION_PAGO = (document)=>`${BASE_URL}/api/v1/compras/list/condicion-pago/${document}/`
export const EDIT_CONDICION_PAGO = (document)=>`${BASE_URL}/api/v1/compras/edit/condicion-pago/${document}/codigo/`
export const SAVE_CONDICION_PAGO = (document)=>`${BASE_URL}/api/v1/compras/save/condicion-pago/${document}/`
export const DELETE_CONDICION_PAGO = (document)=>`${BASE_URL}/api/v1/compras/delete/condicion-pago/${document}/codigo/`
// TIPO DE SERVICIO
export const LIST_TIPO_SERVICIO = (document)=>`${BASE_URL}/api/v1/compras/list/tipo-servicio/${document}/`
export const SAVE_TIPO_SERVICIO = (document)=>`${BASE_URL}/api/v1/compras/save/tipo-servicio/${document}/`
export const EDIT_TIPO_SERVICIO = (document)=>`${BASE_URL}/api/v1/compras/edit/tipo-servicio/${document}/codigo/`
export const DELETE_TIPO_SERVICIO = (document)=>`${BASE_URL}/api/v1/compras/delete/tipo-servicio/${document}/codigo/`
// ASIENTOS
export const EDIT_ASIENTOS = (document)=>`${BASE_URL}/api/v1/compras/edit/asientos/${document}/codigo/`




