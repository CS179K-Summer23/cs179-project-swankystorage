import CustomNavbar from '../CustomNavbar/CustomNavbar';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import MainApp from '../AddListingModal/MainApp';
import FilterBar from '../Filter/FilterBar';
import axios from "axios";

import './ProfilePage.css';

function ProfilePage(args){
    let [listings, setListings] = useState([])
    axios.get("http://localhost:3001/profilePage")
        .then((res) => {
            console.log(res.data);
        }).catch((err) => {
            alert(err);
        })

    return (
        <>
            <CustomNavbar/>
            <Container fluid className='mainContainer'>
                <div className="informationContainer">
                    <Row>
                        <Col xs={3}>
                            <img className="profilePicture" src="https://www.dropbox.com/s/58algfockihugwq/Logo_Gradient.png?raw=1" alt="Avatar"/> 
                        </Col>
                        <Col xs={7} className='textFieldsContainer'>
                            <p><span className="userNameTitle"><b>User Name: </b></span></p>
                            <p><span className="emailTitle"><b>Email: </b></span></p>
                            <p><span className="passwordTitle"><b>Password: </b></span></p>
                            <Button variant='primary' className='customProfilePageButton'>Messages</Button>
                        </Col>
                    </Row>
                </div>
                <h1>Your Listings</h1>
                <MainApp listings={listings} update={(data) => {setListings(data)}}/>
                
            </Container>
            
        </>
    )
}

export default ProfilePage