import PlanContable from "./mantenimientos/PlanContable";
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