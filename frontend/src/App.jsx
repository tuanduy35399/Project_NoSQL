import appCSS from './App.module.css'
import Navigation from './Components/Navigation/Navigation'
import Router from './routes/Routes'
import Login from './Components/Login/Login.jsx'

function App() {

  return (
    <>
      <div className={appCSS["layout-web"]}>
        <div className={appCSS["nav"]}><Navigation/></div>
        <div className={appCSS["page-render"]}>
          <Router/>
          <Login/>
        </div>
      </div>
    </>
  )
}

export default App
