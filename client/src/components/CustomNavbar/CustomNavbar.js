import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'

import './CustomNavbar.css'

function CustomNavbar(){
    return (
        <Navbar className="bg-body-tertiary navbar border-bottom" sticky="top">
            <Container fluid className="navBarMainContainer">
                <Container fluid>
                <Navbar.Brand href="/">
                    <img
                    alt=""
                    src="https://www.dropbox.com/s/58algfockihugwq/Logo_Gradient.png?raw=1"
                    height="40"
                    />{' '}
                    Swanky Storage
                </Navbar.Brand>
                </Container>
                    <Nav className="ml-auto">
                        <Button variant="primary" className="btn btn-success customNavbarButton" href="login">Log In</Button>{' '}
                    </Nav>
                    <Nav className="ml-auto">
                        <Button variant="primary"className="btn btn-success customNavbarButton" href="register">Register</Button>{' '}
                    </Nav>
                    <Nav className="ml-auto">
                        <Button variant="primary" className="btn btn-success customNavbarButton" href="filter">Filter</Button>{' '}
                    </Nav>
            </Container>
        </Navbar>
    )
}

export default CustomNavbar;