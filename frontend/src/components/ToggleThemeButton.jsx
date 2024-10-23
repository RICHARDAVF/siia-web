import { Button } from "antd"
import {HiOutlineSun,HiOutlineMoon} from "react-icons/hi"
const TogleThemeButton=({darkMode,toggleTheme})=>{
    return (
        <div className="toggle-theme-button">
            <Button onClick={toggleTheme}>
                {darkMode?<HiOutlineSun/>:<HiOutlineMoon/>}
            </Button>
        </div>
    )
}
export default TogleThemeButton