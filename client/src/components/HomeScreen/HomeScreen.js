import CustomNavbar from '../CustomNavbar/CustomNavbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sidebar from '../Sidebar/Sidebar';
import MainApp from '../AddListingModal/MainApp';
import { useState } from 'react';

import './HomeScreen.css';


function HomeScreen(){
    let [listings, setListings] = useState([])
    return (
        <>
            <CustomNavbar/>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">      
                        <Sidebar className="bufferedSidebar" load={(data) => {setListings(data)}}/>
                    </Col>
                    <Col id="page-content-wrapper">
                        <MainApp listings={listings} update={(data) => {setListings(data)}}/>
                    </Col> 
                </Row>
            </Container>
        </>
    )
}

export default HomeScreen