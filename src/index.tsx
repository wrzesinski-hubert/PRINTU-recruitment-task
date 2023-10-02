import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Canvas from "./components/canvasComponent/Canvas";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store/store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <React.StrictMode>
      <Canvas />
    </React.StrictMode>
  </Provider>
);

reportWebVitals();
