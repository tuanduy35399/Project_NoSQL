import navcss from "./Navigation.module.css"
import { useState } from "react"
export default function Navigation(){
    const [isActive, setActive] = useState("home")
    const [cpActive, setCPActive] = useState(false)
    return(
        <>
            <div className={`${navcss["layout-navigation"]} ${cpActive===true? navcss["active"]:undefined}`}>
                <div className={navcss["top-bar"]}>
                    <img className={`${navcss["logo"]}`} src="/logo.svg" alt="logo" />
                </div>
                <div className={navcss["center-bar"]}>
                    <div className={`${navcss["icon"]} ${isActive==="home"? navcss["active"]:undefined}`}
                    onClick={()=>setActive("home")}>
                        <img src={isActive==="home"? "/homeIconActive.svg":"/homeIcon.svg"} alt="home" />
                    </div>
                    
                    <div className={`${navcss["icon"]} ${isActive==="plus"? navcss["active"]:undefined}`}
                        onClick={()=>setActive("plus")}>
                        <img src={isActive==="plus"? "/plusIconActive.svg":"/plusIcon.svg"} alt="plus" />
                    </div>

                    <div className={`${navcss["icon"]} ${isActive==="user"? navcss["active"]:undefined}`}
                    onClick={()=>setActive("user")}>
                        <img src={isActive==="user"? "/userIconActive.svg":"/userIcon.svg"} alt="user" />
                    </div>
                </div>
                <div className={navcss["bottom-bar"]}>
                    <div className={`${navcss["bar"]} ${cpActive===true? navcss["active"]:undefined}`}
                        onClick={()=>setCPActive(!cpActive)}
                    >
                        <img src="/compass-regular-full.svg" alt="user" />
                    </div>
                </div>
            </div>
        </>
    )
}