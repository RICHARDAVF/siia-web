import { Route, Routes } from "react-router-dom"
import Home from "./Home"
import RegistroAsientos from "../views/contabilidad/movimientos/RegistroAsientos.jsx"
import TipoCambio from "../views/gerencial/mantenimiento/TipoCambio.jsx"
const ContentViews=()=>{
    return(
        <>
            <Routes>
                <Route path='/home' element={<Home/>}/>
                <Route path='/registro-asientos' element={<RegistroAsientos/>}/>
                <Route path='/tipo-cambio' element={<TipoCambio/>}/>

            </Routes>

        </>
    )
}
export default ContentViews