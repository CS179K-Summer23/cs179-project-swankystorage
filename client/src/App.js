import Signup from "./components/signup"
import Login from "./components/login"
import HomeScreen from "./components/HomeScreen/HomeScreen.js"
import { FilterBar } from "./components/FilterBar"
import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

const properties = [
  {key: 0, label: "Product Name", prop: "name", type: "text"},
  {key: 1, label: "Product Description", prop: "description", type: "text"},
  {key: 2, label: "Minimum Price", prop: "minPrice", type: "number"},
  {key: 3, label: "Maximum Price", prop: "maxPrice", type: "number"},
  {key: 4, label: "Location", prop: "location", type: "text"}
]

function requestToMongoQuery(request) {
  let mongoQuery = {nameOfItem: request.name, price: {$gte: Number(request.minPrice), $lte: Number(request.maxPrice)}, location: request.location, description: request.description}
  for (let key in mongoQuery) {
      if (!mongoQuery[key]) delete mongoQuery[key]
  }
  if (!mongoQuery.price.$gte) mongoQuery.price.$gte = 0
  if (!mongoQuery.price.$lte) mongoQuery.price.$lte = 2e10;
  return mongoQuery
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeScreen />}></Route>
        <Route path="/filter" element={<FilterBar properties={properties} getQuery={(query) => console.log(requestToMongoQuery(query))} />}></Route>
        <Route path="/register" element={<Signup />}></Route>
        <Route path="/login" element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
