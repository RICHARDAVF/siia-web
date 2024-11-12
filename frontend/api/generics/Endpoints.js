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
    }
}
export default endpointsGenerics