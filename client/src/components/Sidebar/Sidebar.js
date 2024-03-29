import {Nav} from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import "./Sidebar.css"
import { FilterBar } from "../Filter/FilterBar.js";

const properties = [
    {key: 0, label: "Product Name", prop: "name", type: "text"},
    {key: 1, label: "Product Description", prop: "description", type: "text"},
    {key: 2, label: "Minimum Price", prop: "minPrice", type: "price"},
    {key: 3, label: "Maximum Price", prop: "maxPrice", type: "price"}
  ]
  
  function requestToMongoQuery(request) {
    let mongoQuery = {nameOfItem: request.name, price: {$gte: Number(request.minPrice * 100), $lte: Number(request.maxPrice * 100)}, location: request.location, description: request.description, categories: request.categories}
    for (let key in mongoQuery) {
        if (!mongoQuery[key]) delete mongoQuery[key]
    }
    if (!mongoQuery.price.$gte) mongoQuery.price.$gte = 0
    if (!mongoQuery.price.$lte) mongoQuery.price.$lte = 2e10;
    if (mongoQuery.description) mongoQuery.description = {$regex: ".*" + request.description + ".*"}
    if (mongoQuery.categories) mongoQuery.categories = { $all: mongoQuery.categories }
    return mongoQuery
  }
  

function Sidebar(args){
    const getQueryResult = (query, sort, location) => {
        console.log("query: ", query, " sort: ", sort, " location: ", location)
        axios.get(
            'http://localhost:3001/filter-listings',
            {params: {query, sort, location}}
        ).then((response) => {
            //console.log("Filtered: ", response)
            args.load(response.data)
        })
    };
    return (
            <Nav className="col d-none d-md-block bg-light sidebar"
            activeKey="/home"
            onSelect={selectedKey => alert(`selected ${selectedKey}`)}
            >
                <div className="sidebar-sticky"></div>
                <Nav.Item>
                    <FilterBar properties={properties} getQuery={(query, sort, location) => getQueryResult(requestToMongoQuery(query), sort, location)} />
                </Nav.Item>
            </Nav>
    )
}

export default Sidebar;