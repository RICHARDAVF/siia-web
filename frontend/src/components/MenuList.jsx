import {Menu} from "antd"
import {FaHome,FaCalculator} from "react-icons/fa"
import {useState } from "react"
import {useNavigate} from "react-router-dom"
const items = [
    {
        key:"1",
        label:"Home",
        icon:<FaHome/>,
        route:"/home"
    },
    {
        key:"2",
        label:"Contabilidad",
        icon:<FaCalculator/>,
        children:[
            {
                key:"21",
                label:"Mantenimientos",
                children:[
                    {
                        key:"211",
                        label:"Plan Contable"
                    },
                    {
                        key:"212",
                        label:"Tipos de Auxiliares"
                    },
                ]
            },
            {
                key:'22',
                label:"Movimientos",
                children:[
                    {
                        key:'221',
                        label:"Registro de Asientos",
                        route:"/registro-asientos"
                    },
                    {
                        key:'222',
                        label:"Registro de Retenciones Anticipadas y Letras"
                    },
                ]
            }
        ]
    }, 
    {
        key:"3",
        label:"Gerencial",
        children:[
            {
                key:"31",
                label:"Tipo de Cambio",
                route:"/tipo-cambio"
            }

        ]
    }
]
const getLevelKeys=(items1)=>{
    const key = {}
    const func = (item2,level=1)=>{
        item2.forEach(item=>{
            if(item.key){
                key[item.key] = level
            }
            if(item.children){
                func(item.children,level+1)
            }
        })
    }
    func(items1)
    return key
}
const levelKeys = getLevelKeys(items)
const MenuList=({darkMode})=>{
    const [stateOpenKeys,setStateOpenKeys] = useState([])
    const navigate = useNavigate()
    const onOpenChanges=(openKeys)=>{
        const currentOpenKey = openKeys.find(key=>stateOpenKeys.indexOf(key)===-1)
        if(currentOpenKey!=undefined){
            const repeatIndex = openKeys
            .filter(key=>key!==currentOpenKey)
            .findIndex(key=>levelKeys[key]===levelKeys[currentOpenKey])
            setStateOpenKeys(openKeys.filter((_,index)=>index!==repeatIndex)
            .filter(key=>levelKeys[key]<=levelKeys[currentOpenKey]))
        }else{
            setStateOpenKeys(openKeys)
        }
    }
    const findItemByKey=(items,key)=>{
        for(let i=0;i<items.length;i++){
            if(items[i].key==key){
                return items[i]
            }
            if(items[i].children){
                const found = findItemByKey(items[i].children,key)
                if(found) return found
            }
        }
        return null
    }
    const onMenuClick=(item)=>{
        const targetItem = findItemByKey(items,item.key)
        if(targetItem && targetItem.route){
            navigate(targetItem.route)
        }
    }
    return(
        <Menu 
        theme={darkMode?'dark':'light'}
        mode="inline"
        style={{"height":"93vh"}}
        openKeys={stateOpenKeys}
        onOpenChange={onOpenChanges}
        onClick={onMenuClick}
        items={items}
        />
          
    )
}
export default MenuList