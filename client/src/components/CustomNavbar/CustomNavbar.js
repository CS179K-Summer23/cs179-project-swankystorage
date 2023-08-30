import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import { Modal } from "react-bootstrap";
import { Button, Dropdown } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useSession from "../useSession";
import axios from "axios";

import "./CustomNavbar.css";

function CustomNavbar() {
  let [session] = useSession();
  const navigate = useNavigate();

    const [showLogoutButton, setShowLogoutButton] = useState(false);
    const handleCloseLogoutButton = () => setShowLogoutButton(false);
    const handleShowLogoutButton = () => setShowLogoutButton(true);

    
    const [showLogoutConfirmationSuccess, setShowLogoutConfirmationSuccess] = useState(false);
    const handleCloseLogoutConfirmationSuccess = () => {
        setShowLogoutConfirmationSuccess(false);
        navigate("/");
        window.location.reload();
    }
    const handleShowLogoutConfirmationSuccess = () => setShowLogoutConfirmationSuccess(true);

    const [showLogoutConfirmationFailure, setShowLogoutConfirmationFailure] = useState(false);
    const handleCloseLogoutConfirmationFailure = () => {
        setShowLogoutConfirmationFailure(false);
    }
    const handleShowLogoutConfirmationFailure = () => setShowLogoutConfirmationFailure(true);

    const handleLogout = () => {
        axios.get('http://localhost:3001/logout')
        .then(response => {
            handleShowLogoutConfirmationSuccess();
        })
        .catch(error => {
            handleShowLogoutConfirmationFailure();
            console.log("Something went wrong")
        });
    }

    let buttons;
    if(!session){
        buttons = <>
                    <Nav className="ml-auto">
                        <Button variant="primary" className="btn customNavbarButton" onClick={() => navigate('/login')}>Log In</Button>{' '}
                    </Nav>
                    <Nav className="ml-auto">
                        <Button variant="primary"className="btn customNavbarButton" onClick={() => navigate('/register')}>Register</Button>{' '}
                    </Nav>
        </>
    }else{
        buttons = <>
                    <Nav className="ml-auto">
                        <Button variant="primary" className="btn customNavbarButton" onClick={() => navigate('/profilePage')}>Profile</Button>
                    </Nav>
                    <Nav className="ml-auto">
                        <Button variant="primary" className="btn customNavbarButton" onClick={() => navigate('/dashboard')}>Favorites</Button>
                    </Nav>
                    <Nav className="ml-auto">
                        <Button variant="danger" className="btn customNavbarButton" onClick={handleShowLogoutButton}>Logout</Button>
                    </Nav>
        </>
    }

    return (
        <Navbar className="bg-body-tertiary navbar border-bottom" sticky="top">
            {/*Appears when user clicks "logout" button*/}
            <Modal show={showLogoutButton} onHide={handleCloseLogoutButton}>
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure you want to log out?</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLogoutButton}>
                    Cancel
                    </Button>
                    <Button variant="danger" onClick={ () => {
                        handleCloseLogoutButton();
                        handleLogout();
                        }}>
                    Logout
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*Appears if logout was successful*/}
            <Modal show={showLogoutConfirmationSuccess} onHide={handleCloseLogoutConfirmationSuccess}>
                <Modal.Header closeButton>
                    <Modal.Title>Logged out</Modal.Title>
                </Modal.Header>
                <Modal.Body>See you next time!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLogoutConfirmationSuccess}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            {/*Appears if logout was unsuccessful*/}
            <Modal show={showLogoutConfirmationFailure} onHide={handleCloseLogoutConfirmationFailure}>
                <Modal.Header closeButton>
                    <Modal.Title>Logout failed :(</Modal.Title>
                </Modal.Header>
                <Modal.Body>Something went wrong, try again at a later time!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseLogoutConfirmationFailure}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container fluid className="navBarMainContainer">
                <Container fluid>
                <Navbar.Brand onClick={() => {
                            navigate('/');
                            window.location.reload();
                            }   
                        }>
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
