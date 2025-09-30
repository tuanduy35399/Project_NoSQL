import { useState } from "react";
import appCSS from "./App.module.css";
import Navigation from "./Components/Navigation/Navigation";
import Router from "./routes/Routes";
import Login from "./Components/Login/Login";
import Explore from "./page/ExplorePage/Explore";
function App() {
  const [showSecond, setShowSecond] = useState(false);
  const [isGuest, setGuest]= useState(false)
  return (
    <>
      <div className={appCSS["layout-web"]}>
        {/* Cột điều hướng */}
        <div className={appCSS["nav"]}>
          <Navigation showPage={()=>setShowSecond(!showSecond)}/>
            
        </div>

        {/* Container các page */}
        
        <div
          className={`${appCSS["pages-container"]} ${
            showSecond ? appCSS["two"] : appCSS["one"]
          }`}
        >
          
          {/* Page Render 1 */}
          <div className={appCSS["page-render"]}>
              <Router />
          </div>
          
          {/* Explore */}
          {showSecond && (
            <div className={appCSS["box-explore"]}>
              <Explore />
            </div>
          )}
          {!isGuest && <Login guest={setGuest}/>}
        </div>
      </div>
    </>
  );
}

export default App;