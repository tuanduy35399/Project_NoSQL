import { useState } from "react"
import { NavLink } from "react-router-dom"
import navcss from "./Navigation.module.css"

export default function Navigation(){
    const [compassActive, setCPActive]= useState(false)
    return(
        <>
            <div className={navcss["layout-navigation"]}>
                <div className={navcss["top-bar"]}>
                    <img className={`${navcss["logo"]}`} src="/logo.svg" alt="logo" />
                </div>
                <div className={navcss["center-bar"]}>
                    <NavLink 
                        to="/" 
                        className={({ isActive }) => `${navcss["icon"]} ${isActive ? navcss["active"] : ""}`}
                        >
                        {({ isActive }) => (
                            <img src={isActive ? "/homeIconActive.svg" : "/homeIcon.svg"} alt="home" />
                        )}
                    </NavLink>
                    
                    <NavLink 
                    to="/post" 
                    className={({isActive})=> `${navcss["icon"]} ${isActive ? navcss["active"] : ""}`}
                    >
                       {({isActive})=>(
                        <img src={isActive? "/plusIconActive.svg":"/plusIcon.svg"} alt="plus" />
                       )}
                    </NavLink>

                    <NavLink 
                    to="/user" 
                    className={({isActive})=>`${navcss["icon"]} ${isActive? navcss["active"]:undefined}`}
                    >
                        {({isActive})=>(
                        <img src={isActive? "/userIconActive.svg":"/userIcon.svg"} alt="user" />
                        )}
                    </NavLink>
                </div>
                <div className={navcss["bottom-bar"]}>
                    <div className={`${navcss["bar"]} ${compassActive===true? navcss["active"]:undefined}`}
                        onClick={()=>setCPActive(!compassActive)}
                    >
                        <img src="/compass-regular-full.svg" alt="user" />
                    </div>
                </div>
            </div>
        </>
    )
}