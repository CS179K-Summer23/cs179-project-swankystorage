import CustomNavbar from '../CustomNavbar/CustomNavbar';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import MainApp from '../AddListingModal/MainApp';
import FilterBar from '../Filter/FilterBar';
import axios from "axios";
import FilterFields from '../FilterFields'

import './ProfilePage.css';

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

function ProfilePage(args){
    let [listings, setListings] = useState([])
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    let [email, setEmail] = useState("");
    let [userName, setUserName] = useState("");
    let [password, setPassword] = useState("");

    useEffect(() => {
        axios.get('http://localhost:3001/profilePage')
            .then(response => {
                setUser(response.data);
                console.log(user);

                setEmail(response.data.email);
                setUserName(response.data.userName);
                setPassword(response.data.password);
            })
            .catch(error => {
                setError(error);
            });
    }, []);

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
        <>
            <CustomNavbar/>
            <Container fluid className='mainContainer'>
                <div className="informationContainer">
                    <Col xs={7} className='textFieldsContainer'>
                        <p><span className="userNameTitle"><b>User Name: </b></span><span className="userNameText">{userName}</span></p>
                        <p><span className="emailTitle"><b>Email: </b></span><span className="emailText">{email}</span></p>
                        <p><span className="passwordTitle"><b>Password: </b></span><span className="passwordText">{password}</span></p>
                        <Button variant='primary' className='customProfilePageButton'>Messages</Button>
                    </Col>
                </div>
                <h1>Your Listings</h1>
                <MainApp listings={listings} update={(data) => {setListings(data)}}/>
            </Container>
            
        </>
    )
}

export default ProfilePage