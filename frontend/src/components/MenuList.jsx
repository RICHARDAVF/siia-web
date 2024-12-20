import { Menu } from "antd"
import { FaHome, FaCalculator, FaDollarSign } from "react-icons/fa"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
const items = [
    {
        key: "1",
        label: "Home",
        route: "/home"
    },
    {
        key: "2",
        label: "Contabilidad",
        children: [
            {
                key: "21",
                label: "Mantenimientos",
                children: [
                    {
                        key: "211",
                        label: "Plan Contable",
                        route: "/registro/plan/contable"
                    },
                    {
                        key: "212",
                        label: "Tipos de Auxiliares",
                        route: "/tipo-auxiliar"
                    },
                    {
                        key: "213",
                        label: "Origenes",
                        route: 'list/origen'
                    },
                    {
                        key: "214",
                        label: "Medio de pago",
                        route: 'list/medio-pago'
                    },
                ]
            },
            {
                key: '22',
                label: "Movimientos",
                children: [
                    {
                        key: '221',
                        label: "Asientos",
                        route: "/list/asientos"
                    },
                    {
                        key: '222',
                        label: "Registro de Retenciones Anticipadas y Letras",
                        route: "/registro/retenciones"
                    },
                    {
                        key: "223",
                        label: "Centro de costos",
                        route: "/list/centro-costos"
                    },
                    {
                        key: "223",
                        label: "Centro de costos",
                        route: "/list/centro-costos"
                    }
                ]
            }
        ]
    },
    {
        key: "3",
        label: "Gerencial",
    },
    {
        key: "4",
        label: "Compras",
        children: [
            {
                key: "41",
                label: "Movimientos",
                children: [
                    {
                        key: "411",
                        label: "Comprobantes",
                        route: "/list/comprobantes"
                    },
                    {
                        key: "412",
                        label: "Recepcion de Documentos",
                        route: "/recepcion/documentos"
                    }
                ]
            },
            {
                key: "42",
                label: "Mantenimientos",
                children: [
                    {
                        key: "421",
                        label: "Condicion de pago",
                        route: "/list/condicion-pago"
                    },
                    {
                        key: "422",
                        label: "Tipo de Servicio",
                        route: "/list/tipo-servicio"
                    }
                ]
            },
            {
                key: "43",
                label: "Reportes",
                children: [
                    {
                        key: "431",
                        label: "Libro Diario",
                        route: "reporte/libro-diario"
                    },
                    {
                        key: "432",
                        label: "Registro Ventas",
                        route: "reporte/ventas"
                    }
                ]
            }
        ]
    },
    {
        key: "3",
        label: "Gerencial",
    },
    {
        key: "4",
        label: "Compras",
        children: [
            {
                key: "41",
                label: "Movimientos",
                children: [
                    {
                        key: "411",
                        label: "Comprobantes",
                        route: "/list/comprobantes"
                    },
                    {
                        key: "412",
                        label: "Recepcion de Documentos",
                        route: "/recepcion/documentos"
                    }
                ]
            },
            {
                key: "42",
                label: "Mantenimientos",
                children: [
                    {
                        key: "421",
                        label: "Condicion de pago",
                        route: "/list/condicion-pago"
                    },
                    {
                        key: "422",
                        label: "Tipo de Servicio",
                        route: "/list/tipo-servicio"
                    }
                ]
            },
            {
                key: "43",
                label: "Reportes",
                children: [
                    {
                        key: "431",
                        label: "Libro Diario",
                        route: "reporte/libro-diario"
                    }
                ]
            }
        ]
    },
    {
        key: "5",
        label: "Configuración",
        children: [
            {
                key: "51",
                label: "Tipo de Cambio",
                route: "/tipo-cambio"
            }
        ]
    }
]
const getLevelKeys = (items1) => {
    const key = {}
    const func = (item2, level = 1) => {
        item2.forEach(item => {
            if (item.key) {
                key[item.key] = level
            }
            if (item.children) {
                func(item.children, level + 1)
            }
        })
    }
    func(items1)
    return key
}
const levelKeys = getLevelKeys(items)
const MenuList = ({ darkMode }) => {
    const [stateOpenKeys, setStateOpenKeys] = useState([])
    const navigate = useNavigate()
    const onOpenChanges = (openKeys) => {
        const currentOpenKey = openKeys.find(key => stateOpenKeys.indexOf(key) === -1)
        if (currentOpenKey != undefined) {
            const repeatIndex = openKeys
                .filter(key => key !== currentOpenKey)
                .findIndex(key => levelKeys[key] === levelKeys[currentOpenKey])
            setStateOpenKeys(openKeys.filter((_, index) => index !== repeatIndex)
                .filter(key => levelKeys[key] <= levelKeys[currentOpenKey]))
        } else {
            setStateOpenKeys(openKeys)
        }
    }
    const findItemByKey = (items, key) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].key == key) {
                return items[i]
            }
            if (items[i].children) {
                const found = findItemByKey(items[i].children, key)
                if (found) return found
            }
        }
        return null
    }
    const onMenuClick = (item) => {
        const targetItem = findItemByKey(items, item.key)
        if (targetItem && targetItem.route) {
            navigate(targetItem.route)
        }
    }
    return (
        <Menu
            theme={darkMode ? 'dark' : 'light'}
            mode="inline"
            style={{ "height": "93vh" }}
            openKeys={stateOpenKeys}
            onOpenChange={onOpenChanges}
            onClick={onMenuClick}
            items={items}
        />

    )
}
export default MenuList