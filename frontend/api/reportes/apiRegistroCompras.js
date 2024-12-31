export const apiRegistroCompras={
    post:async(url,token,datos)=>{
        try{
            const res = await fetch(url,{
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':'Bearer '+token
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