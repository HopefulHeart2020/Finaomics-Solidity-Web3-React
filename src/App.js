import React, { useEffect, useState } from "react";
import "./App.css";
import Routes from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "firebase.js";
import { useSelector } from "react-redux";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      user ? setAuthenticated(true) : setAuthenticated(false);
    });
  });

  const { theme } = useSelector((state) => state.web3);

  return (
    <div className="App">
      <Routes authenticated={authenticated} />
      <ToastContainer autoClose={5000} hideProgressBar />
    </div>
  );
};

export default App;
