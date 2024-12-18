import ListOrigenes from "./mantenimientos/origenes/ListOrigen";
import PlanContable from "./mantenimientos/PlanContable";
import ListMedioPago from "./MedioPago/ListMediopago";
import ListAsientos from "./movimientos/Asientos/ListAsientos";
import RegistroAsientos from "./movimientos/Asientos/RegistroAsientos";
import RegistroRetenciones from "./movimientos/Retenciones/RegistroRetenciones";
export const ContabilidadView = [
    {
        "view":ListAsientos,
        "route":"/list/asientos"
    },
    {
        "view":RegistroAsientos,
        "route":"/registro/asientos"
    }
]
export const PlanContableView = [
    {
        "view":PlanContable,
        "route":"registro/plan/contable"
    }
]
export const RetencionesView = [
    {
        "view":RegistroRetenciones,
        "route":"registro/retenciones"
    }
]

export const OrigenesView=[
    {
        'view':ListOrigenes,
        'route':'list/origen'
    }
]
export const MedioPagoView=[
    {
        'view':ListMedioPago,
        'route':'list/medio-pago'
    }
]