import React,{Component, createContext} from "react";
export  const Context = createContext()
class Provider extends Component{
    constructor(props){
        super(props)
        this.state = {
            user: {},
            token:null,
            document:null
        }

    }

    updateState=(state)=>{
        this.setState(state)
    }
    render(){
        const {children} = this.props
        const globalContex = {
            ...this.state,
            updateState:this.updateState

        }
        return(
            <Context.Provider value={globalContex}>{children}</Context.Provider>
        )
    }
}
export default Provider