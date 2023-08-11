import CustomNavbar from '../CustomNavbar/CustomNavbar';
import { Button, Container, Row, Col } from 'react-bootstrap';
import MainApp from '../AddListingModal/MainApp';
import axios from "axios";

import './ProfilePage.css';

function ProfilePage(){
    axios.get('http://localhost:3001/user-information', {
        params: {userName: "abbie", email: "abbie@test.com", password: "pass123"}
    })
        .then(res => {
            console.log("login: " + res.data);
            if(res.data.Status === "Success") {
                if(res.data.role === "admin") {
                    console.log(res.json);
                } 
            }
        }).catch(err => console.log(err))

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
                            <p><span className="userNameTitle"><h1>User Name: </h1></span></p>
                            <p><span className="emailTitle"><h1>Email: </h1></span></p>
                            <p><span className="passwordTitle"><h1>Password: </h1></span></p>
                            <Button variant='primary' className='customProfilePageButton'>Messages</Button>
                        </Col>
                    </Row>
                </div>
                <h1>Your Listings</h1>
                <MainApp/>
            </Container>
        </>
    )
}

export default ProfilePage