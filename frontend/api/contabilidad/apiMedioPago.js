const apiMedioPago={
    post:async(url,token,data)=>{
        try{
            const response=await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':`Bearer ${token}`
                    },
                    body:JSON.stringify(data)
                    });
            return await response.json()
        }catch(err){
            return {'error':err.toString()}
        }
    }
}
export default apiMedioPago