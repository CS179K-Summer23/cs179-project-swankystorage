import {Nav} from "react-bootstrap";
import {Container, Row, Col} from "react-bootstrap";

import "./Sidebar.css"
import { FilterBar } from "../Filter/FilterBar.js";

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
    if (mongoQuery.description) mongoQuery.description = {$regex: "/" + request.description + "/"}
    return mongoQuery
  }
  

function Sidebar(){
    return (
            <Nav className="col d-none d-md-block bg-light sidebar"
            activeKey="/home"
            onSelect={selectedKey => alert(`selected ${selectedKey}`)}
            >
                <div className="sidebar-sticky"></div>
                <Nav.Item>
                    <FilterBar properties={properties} getQuery={(query) => console.log(requestToMongoQuery(query))} />
                </Nav.Item>
            </Nav>
    )
}

export default Sidebar;