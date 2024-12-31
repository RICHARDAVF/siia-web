
export const endpointsCompras = {
    Compras:{
        post:async(url,values,token)=>{
            try{
                const response = await fetch(url,{
                    method:"POST",
                    headers:{
                        'Content-Type':"application/json",
                        'Authorization':`Bearer ${token}`
                    },
                    body:JSON.stringify(values)
                })
                return response.json()
            } catch(error){
                return {'error':error.toString()}

                }
        }
    }
}

export const endpointsCondicionPago = {
    CondicionPago:{
        post:async(url,token,datos)=>{
            try{
                const res = await fetch(url,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json',
                        'Authorization':`Bearer ${token}`
                    },
                    body:JSON.stringify(datos)
                })
                return await res.json()
            }catch(erro){
                return {'error':erro.toString()}
            }
        },
        get:async(url,token)=>{
            try{
                const res = await fetch(url,{
                    method:'GET',
                    headers:{
                        'Authorization':`Bearer ${token}`
                    }
                })
                return await res.json()
                
            }catch(erro){
                return {"error":"error"+erro.toString()}
            }
        },
        delete:async(url,token,datos)=>{
            try{
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
    }
}
export const endpointsTipoServicio={
    TipoServicio:{
        get:async(url,token)=>{
            try{
                const res = await fetch(url,{
                    headers:{
                        'Authorization':`Bearer ${token}`,
                        'Content-Type':'application/json'
                    },
                    method:'GET',
                 
                })
                return await res.json()
            }catch(err){
                return {'error':err.toString()}
            }
        },
        post:async(url,token,datos)=>{
            try{
                const res = await fetch(url,{
                    headers:{
                        'Authorization':`Bearer ${token}`,
                        'Content-Type':'application/json'
                    },
                    method:'POST',
                    body:JSON.stringify(datos)
                })
                return await res.json()
            }catch(err){
                return {'error':err.toString()}
            }
        }
    }
}

export const endpointComprobantes={
    get:async(url,token)=>{
        try{
            const res = await fetch(url,{
                headers:{
                    'Authorization':`Bearer ${token}`,
                    'Content-Type':'application/json'
                    },
                method:'GET'
            })
            return await res.json()
        }catch(err){
            return {'error':err.toString()}
        }
    }
}