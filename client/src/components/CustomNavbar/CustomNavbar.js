import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';


import './CustomNavbar.css'

function CustomNavbar(){
    let[loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3001/profilePage')
            .then(response => {
                setLoggedIn(true);
            })
            .catch(error => {
                setLoggedIn(false);
                console.log("User not logged in")
            });
    }, []);

    const handleLogout = () => {
        axios.get('http://localhost:3001/logout')
        .then(response => {
            setLoggedIn(false);
            navigate("/");
        })
        .catch(error => {
            setLoggedIn(true);
            console.log("Something went wrong")
        });
    }

    let buttons;
    if(!loggedIn){
        buttons = <>
                    <Nav className="ml-auto">
                        <Button variant="primary" className="btn customNavbarButton" href="login">Log In</Button>{' '}
                    </Nav>
                    <Nav className="ml-auto">
                        <Button variant="primary"className="btn customNavbarButton" href="register">Register</Button>{' '}
                    </Nav>
        </>
    }else{
        buttons = <>
                    <Nav className="ml-auto">
                        <Button variant="primary" className="btn customNavbarButton" href="profilePage">Profile</Button>
                    </Nav>
                    <Nav className="ml-auto">
                        <Button variant="danger" className="btn customNavbarButton" onClick={handleLogout}>Logout</Button>
                    </Nav>
        </>
    }

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
                    {buttons}
            </Container>
        </Navbar>
    )
}

export default CustomNavbar;