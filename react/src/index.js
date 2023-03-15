import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Account from "./components/account/Account";
import Login from "./components/account/login/Login";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App/>}/>
      <Route path="/account" element={<Account/>}/>
      <Route path="/account/login" element={<Login/>}/>
    </Routes>
  </Router>
);

reportWebVitals();
