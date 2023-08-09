import CustomNavbar from '../CustomNavbar/CustomNavbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sidebar from '../Sidebar/Sidebar';
import MainApp from '../AddListingModal/MainApp';

import './HomeScreen.css';


function HomeScreen(){
    return (
        <>
            <CustomNavbar/>
            <Container fluid>
                <Row>
                    <Col xs={2} id="sidebar-wrapper">      
                        <Sidebar className="bufferedSidebar"/>
                    </Col>
                    <Col id="page-content-wrapper">
                        <MainApp/>
                    </Col> 
                </Row>
            </Container>
        </>
    )
}

export default HomeScreen