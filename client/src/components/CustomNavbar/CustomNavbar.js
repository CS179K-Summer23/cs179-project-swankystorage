import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router';

import './CustomNavbar.css'

function CustomNavbar(){
    const navigate = useNavigate()
    return (
        <Navbar className="bg-body-tertiary navbar border-bottom" sticky="top">
            <Container fluid className="navBarMainContainer">
                <Container fluid>
                <Navbar.Brand onClick={() => navigate('/')}>
                    <img
                    alt=""
                    src="https://www.dropbox.com/s/58algfockihugwq/Logo_Gradient.png?raw=1"
                    height="40"
                    />{' '}
                    Swanky Storage
                </Navbar.Brand>
                </Container>
                    { !window.user && <Nav className="ml-auto">
                        <Button variant="primary" className="btn customNavbarButton" onClick={() => navigate("/login")}>Log In</Button>{' '}
                    </Nav> }
                    { !window.user && <Nav className="ml-auto">
                        <Button variant="primary"className="btn customNavbarButton" onClick={() => navigate("/register")}>Register</Button>{' '}
                    </Nav> }
                    { window.user && <Nav className="ml-auto">
                        <Button variant="primary"className="btn customNavbarButton" onClick={() => navigate("/dashboard")}>Dashboard</Button>{' '}
                    </Nav> }
            </Container>
        </Navbar>
    )
}

export default CustomNavbar;