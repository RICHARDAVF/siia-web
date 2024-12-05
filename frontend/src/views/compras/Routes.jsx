import RegistroCondicionPago from "./mantenimientos/condicionPago/RegistroCondicionPago"
import ListComprobantes from "./movimientos/comprobantes/ListComprobantes"
import RegistroComprobantes from "./movimientos/comprobantes/RegistroComprobantes"
import RegistroDocumentos from "./movimientos/RecepcionDocumentos/Registro"
import ReporteCuentasPagar from "./reporte/CuentasPagar"
export const ComprasView =[
    {
        "view":ListComprobantes,
        "route":"/list/comprobantes",
    },
    {
        "view":RegistroComprobantes,
        "route":"/registro/comprobantes",
    }
]

export const RecepcionDocumentosView = [
    {
        "view":RegistroDocumentos,
        "route":"/recepcion/documentos"
    }
]
export const CondicionPagoView = [
    {
        "view":RegistroCondicionPago,
        "route":"registro/condicion-pago"
    }
]
export const ReportesView = [
    {
        "view":ReporteCuentasPagar,
        "route":"/reporte/cuentas-pagar"
    }
]