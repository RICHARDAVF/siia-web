
import { MANY_DATA_LIST } from "../../service/urls"
const endpointsGenerics = {
    Ubicacion:{
        get:async(url,token)=>{
            return fetch(url,{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                    }
            }).then(res=>{
                if(res.ok){
                    return res.json()
                }
                return {"error":"Tuvimos fallas para recuperar las ubicaciones"}
            })
            .catch(erro=>{
                return erro.toString()
            })
        }
    },
    Proveedor:{
        get:async(url,token)=>{
            return fetch(url,{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                    }
            }).then(res=>{
                if(res.ok){
                    return res.json()
                }
                return {"error":"Tuvimos fallas para recuperar las ubicaciones"}
            })
            .catch(erro=>{
                return erro.toString()
            })
        },
        post:async(url,token,params)=>{
            return fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                    },
                body:JSON.stringify(params)
            }).then(res=>{
                if(res.ok){
                    return res.json()
                }
                return {"error":"Tuvimos fallas para recuperar los proveedores"}
            })
            .catch(erro=>{
                return erro.toString()
            })
        }
    },
    Document:{
        get:async(url,token)=>{
            return fetch(url,{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                    }
            }).then(res=>{
                if(res.ok){
                    return res.json()
                }
                return {"error":"Tuvimos fallas para recuperar los documentos"}
            })
            .catch(erro=>{
                return erro.toString()
            })
        }
    },
    CentroCostos:{
        get:async(url,token)=>{
            return fetch(url,{
                method:'GET',
                headers:{
                    'Authorization':`Bearer ${token}`
                    }
            }).then(res=>{
                if(res.ok){
                    return res.json()
                }
                return {"error":"Tuvimos fallas para recuperar los centros de costo"}
            })
            .catch(erro=>{
                return erro.toString()
            })
        }
    },
    Cuentas:{
        post:async(url,token,params)=>{
            return fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                    },
                body:JSON.stringify(params)
            }).then(res=>{
                if(res.ok){
                    return res.json()
                }
                return {"error":"Tuvimos fallas para recuperar las cuentas"}
            })
            .catch(erro=>{
                return erro.toString()
            })
        }
    },
    TipoCambio:{
        post:async(url,token,params)=>{
            try{
                const res = await fetch(url,{
                    method:"POST",
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${token}`
                    },
                    body:JSON.stringify(params)
                })
                const response = await res.json()
                return response
            }catch(erro){
                return {"error":`Hubo problemas con conectarse con el servidor:${erro.toString()}`}
            }
        }
    },
    Vendedor:{
        get:async(url,token)=>{
            try{
                const res = await fetch(url,{
                    method:'GET',
                    headers:{
                        "Content-Type":'application/json',
                        "Authorization":`Bearer ${token}`
                    }
                })
                if(!res.ok){
                    throw new Error("No se pudo procesar la respues")
                }
                return res.json()
            }catch(erro){
                return {"error":`Error:${erro.toString()}`}
            }
        }
    },
    ManyData:{
        post:async(document,token,datos)=>{
            try{
                const url = MANY_DATA_LIST(document)
                const res = await fetch(url,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${token}`
                    },
                    body:JSON.stringify(datos)
                })
                return await res.json()
            }catch(error){
                return {'error':error.toString()}
            }

        }
    },

}
export default endpointsGenerics