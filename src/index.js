import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/css/style.css";
import "./assets/css/font-awesome.min.css";
import * as serviceWorker from "./serviceWorker";
import AppTravelWidgets from "./App";
serviceWorker.unregister();

ReactDOM.render(
  <BrowserRouter>
    <AppTravelWidgets />
  </BrowserRouter>,
  document.getElementById("root")
);
