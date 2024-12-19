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
    }
}
export default apiMedioPago