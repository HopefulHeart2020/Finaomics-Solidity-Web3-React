import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react";
import configureStore from "./store";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import Web3ReactManager from "./context/Web3ReactManager";
const store = configureStore();

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;

  return library;
}

ReactDOM.render(
  <Provider store={store.store}>
    <PersistGate persistor={store.persistor}>
      <React.StrictMode>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ReactManager>
            <App />
          </Web3ReactManager>
        </Web3ReactProvider>
      </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
