
import { Toaster } from 'react-hot-toast'
import { Provider } from "react-redux";
import Store from "./redux/Store";
import Router from "./routers/Router";


// import "./App.css";
function App() {
  return (
    <>
      <Provider store={Store}>
        <Router />
        <Toaster
          position="top-right"
        />
      </Provider>
    </>
  )
}


export default App;
