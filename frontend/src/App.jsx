import appCSS from './App.module.css'
import Navigation from './Components/Navigation/Navigation'
import Router from './routes/Routes'
function App() {
  const [showSecond, setShowSecond] = useState(false);

  return (
    <>
      <div className={appCSS["layout-web"]}>
        <div className={appCSS["nav"]}><Navigation/></div>
        <div className={appCSS["page-render"]}>
          <Router/>
        </div>
      </div>
    </>
  );
}

export default App;