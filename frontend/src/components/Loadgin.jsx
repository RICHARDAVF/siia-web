import {Flex,Spin } from "antd"
const Loading = ({status})=>{
    return(
        <div
        style={{ 
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: status?"flex":"none",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)", 
            zIndex: 1 ,
            

        }}
        >
            <Flex gap="middle" vertical>
                <Flex gap="middle">
                <Spin tip="Loading" size="small" >
                    <div style={{
                        padding:50,
                        background:"rgba(0,0,0,0.05)",
                        borderRadius:4}}>
                    </div>
                </Spin>
                </Flex>
            
            </Flex> 
        </div>
    )
}
export default Loading