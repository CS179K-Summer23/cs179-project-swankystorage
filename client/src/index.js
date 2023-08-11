import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import MainApp from './Components/AddListingModal/MainApp'
import reportWebVitals from './reportWebVitals';
import HomeScreen from './Components/HomeScreen/HomeScreen.js'
import { FilterBar } from './Components/FilterBar';
import Signup from './Components/signup';
import Login from './Components/login';
import ProfilePage from './Components/ProfilePage/ProfilePage.js'
import App from './App';
import { BrowserRouter, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />}></Route>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/profilePage" element={<ProfilePage/>}></Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
