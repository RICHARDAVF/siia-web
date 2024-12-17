const endpointOrigen = {
    
    post:async(url,token,datos)=>{
        try{
            const res = await fetch(url,{
                method: 'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+token
                },
                body:JSON.stringify(datos)
            })
            
            return await res.json()
        }catch(err){
            return {'error':err.toString()}
        }
    },
    get:async(url,token)=>{
        try{
            const res = await fetch(url,{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            return await res.json()
        }catch(err){
            return {'error':err.toString()}
        }
    }
}
export default endpointOrigen