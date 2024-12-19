const apiMedioPago={
    get:async(url,token)=>{
        try{
            const response=await fetch(url,{
                method:'get',
                headers:{
                   
                    'Authorization':`Bearer ${token}`
                    },
                   
                    });
            return await response.json()
        }catch(err){
            return {'error':err.toString()}
        }
    },
    post:async(url,token,datos)=>{
        try{
            const res = await fetch(url,{
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization':`Bearer ${token}`
                },
                method:'POST',
                body:JSON.stringify(datos)
            })
            return await res.json()
        }catch(err){
            return {'error':str(e)}
        }
    }
}
export default apiMedioPago