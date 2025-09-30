import style from "./Explore.module.css"
export default function Explore(){
    return(
        <>
            <div className={style["box-explore"]}>
                <input className={style["search-bar"]} type="text" placeholder="Tìm kiếm" />
            </div>
        </>
    )
}