import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
//import App from './App';
import MainApp from "./Components/AddListingModal/MainApp";
import reportWebVitals from "./reportWebVitals";
import HomeScreen from "./Components/HomeScreen/HomeScreen.js";
import { FilterBar } from "./Components/FilterBar";
import Signup from "./Components/signup";
import Login from "./Components/login";
import ProductLandingPage from "./Components/AddListingModal/ProductLandingPage";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />}></Route>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/product/:id" element={<ProductLandingPage />}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
