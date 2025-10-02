import style from "./Explore.module.css"
export default function Explore(){
    return(
        <>
            <div className={style["box-explore"]}>
                <div className={style["search-container"]}>
                    <i className="fa fa-search"></i>
                    <input
                        className={style["search-bar"]}
                        type="text"
                        placeholder="Tìm kiếm"
                    />
                </div>
            </div>
        </>
    )
}