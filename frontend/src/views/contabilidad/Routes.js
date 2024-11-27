import ListAsientos from "./movimientos/ListAsientos";
import RegistroAsientos from "./movimientos/RegistroAsientos";
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