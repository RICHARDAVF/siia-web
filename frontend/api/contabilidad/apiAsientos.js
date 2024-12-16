const EndPointContabilidad = {
    Asientos:{
        post:async(url,data,token)=>{
            try{
                const response = await fetch(url,{
                    method:"POST",
                    headers:{
                        "Content-type":"application/json",
                        "Authorization":`Bearer ${token}`
                    },
                    body:JSON.stringify(data)
                })
                return response.json()
            }catch(error){
                return {"error":error.toString()}
            }
        },
        get:async(url,token)=>{
            try{
                const res = await fetch(url,{
                    headers:{
                        "Authorization":`Bearer ${token}`
                    },
                    method:'GET'
                })
                return await res.json()
            }catch(err){
                return {"error":err.toString()}
            }
        }
    }
}
export default EndPointContabilidad