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
                        {listings.length === 0 && 
                            <>
                              <h2>No Results</h2>
                              <p>Reduce your search terms to see more!</p>
                            </>
                        }
                        <MainApp listings={listings} update={(data) => {setListings(data)}}/>
                    </Col> 
                </Row>
            </Container>
        </>
    )
}

export default HomeScreen