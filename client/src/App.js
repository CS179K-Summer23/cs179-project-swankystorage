import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import {FilterBar} from './Filter/FilterBar'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/esm/Col'

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

function App() {
  let [query, updateQuery] = useState({})
  return (
    <div className="App">
      <Container fluid><Row>
        <Col sm="3">
          <FilterBar properties={properties} getQuery={(request) => updateQuery(requestToMongoQuery(request))} />
        </Col>
        <Col>
          <h1>{JSON.stringify(query)}</h1>
        </Col>
      </Row></Container>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
