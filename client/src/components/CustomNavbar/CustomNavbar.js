import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import { useNavigate } from 'react-router';
import useSession from '../useSession';

import './CustomNavbar.css'

function CustomNavbar(){
    const navigate = useNavigate()
    const [session] = useSession()
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
                    { !session && <Nav className="ml-auto">
                        <Button variant="primary" className="btn customNavbarButton" onClick={() => navigate("/login")}>Log In</Button>{' '}
                    </Nav> }
                    { !session && <Nav className="ml-auto">
                        <Button variant="primary"className="btn customNavbarButton" onClick={() => navigate("/register")}>Register</Button>{' '}
                    </Nav> }
                    { session && <Nav className="ml-auto">
                        <Button variant="primary"className="btn customNavbarButton" onClick={() => navigate("/dashboard")}>Dashboard</Button>{' '}
                    </Nav> }
                    { session && <Nav className="ml-auto">
                        <Button variant="primary"className="btn customNavbarButton" onClick={() => navigate("/logout")}>Log Out</Button>{' '}
                    </Nav> }
            </Container>
        </Navbar>
    )
}

export default CustomNavbar;