import { useState } from "react";
import appCSS from "./App.module.css";
import Navigation from "./Components/Navigation/Navigation";
import Router from "./routes/Routes";
import Login from "./Components/Login/Login";
function App() {
  const [showSecond, setShowSecond] = useState(false);
  const [isGuest, setGuest]= useState(true)
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
              <h1>Explore</h1>
            </div>
          )}
          {isGuest && <Login/>}
        </div>
      </div>
    </>
  );
}

export default App;