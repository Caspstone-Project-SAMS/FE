
import { Layout } from "antd";
import { Toaster } from 'react-hot-toast'
import { Provider } from "react-redux";
import Store from "./redux/Store";
import Router from "./routers/Router";

const App = () => {


import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import Headers from "./components/header/Header";
import PageContent from "./components/pagecontents/PageContents";


function App() {
  
  return (

<!--     <Layout className="container">
      <Sidebar />
      <Layout>
        <Headers />
        <PageContent />
      </Layout>
    </Layout>
  ); -->
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
