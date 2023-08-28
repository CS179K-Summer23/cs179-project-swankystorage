import {Nav} from "react-bootstrap";
import axios from "axios";
import { useState } from "react";
import "./Sidebar.css"
import { FilterBar } from "../Filter/FilterBar.js";

const properties = [
    {key: 0, label: "Product Name", prop: "name", type: "text"},
    {key: 1, label: "Product Description", prop: "description", type: "text"},
    {key: 2, label: "Minimum Price", prop: "minPrice", type: "price"},
    {key: 3, label: "Maximum Price", prop: "maxPrice", type: "price"},
    {key: 4, label: "Location", prop: "location", type: "text"}
  ]
  
  function requestToMongoQuery(request) {
    let mongoQuery = {nameOfItem: request.name, price: {$gte: Number(request.minPrice * 100), $lte: Number(request.maxPrice * 100)}, location: request.location, description: request.description}
    for (let key in mongoQuery) {
        if (!mongoQuery[key]) delete mongoQuery[key]
    }
    if (!mongoQuery.price.$gte) mongoQuery.price.$gte = 0
    if (!mongoQuery.price.$lte) mongoQuery.price.$lte = 2e10;
    if (mongoQuery.description) mongoQuery.description = {$regex: ".*" + request.description + ".*"}
    return mongoQuery
  }
  

function Sidebar(args){
    const getQueryResult = (query) => {
        console.log("query: ", query)
        axios.get(
            'http://localhost:3001/filter-listings',
            {params: {query}}
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
                    <FilterBar properties={properties} getQuery={(query) => getQueryResult(requestToMongoQuery(query))} />
                </Nav.Item>
            </Nav>
    )
}

export default Sidebar;