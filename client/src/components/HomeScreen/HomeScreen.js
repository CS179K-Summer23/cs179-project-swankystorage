import CustomNavbar from '../CustomNavbar/CustomNavbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Sidebar from '../Sidebar/Sidebar';

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
                        <h1>This is the homepage ahhhhh</h1>
                    </Col> 
                </Row>
            </Container>
        </>
    )
}

export default HomeScreen