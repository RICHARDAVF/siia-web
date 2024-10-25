import { Route, Routes } from "react-router-dom"
import Home from "./Home"
import RegistroAsientos from "../views/contabilidad/movimientos/RegistroAsientos.jsx"
import TipoCambio from "../views/gerencial/mantenimiento/TipoCambio.jsx"
import ListAsientos from "../views/contabilidad/movimientos/ListAsientos.jsx"
const ContentViews=()=>{
    return(
        <>
            <Routes>
                <Route path='/home' element={<Home/>}/>

                <Route path='/asientos/list' element={<ListAsientos/>}/>
                <Route path='/asientos/create' element={<RegistroAsientos/>}/>
                <Route path='/tipo-cambio' element={<TipoCambio/>}/>

            </Routes>

        </>
    )
}
export default ContentViews