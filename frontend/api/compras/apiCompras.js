const endpointsCompras = {
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
                return {'error':error.toString}()}
        }
    }
}

export default endpointsCompras