import { useState } from 'react'
import { Button, Modal, Form, Container, Col, Row } from 'react-bootstrap';
import "./CategoryModal.css"

const {categories} = require('../../categories.json')

function CategoryModal(args) {
    const [showModal, setShowModal] = useState(false);
    const [chosenCategories, setChosenCategories] = useState(JSON.parse(JSON.stringify(args.chosenCategories)));
    if (!chosenCategories) return(<></>)
    function updateCategories(category) {
        if (chosenCategories.includes(category)) {
            setChosenCategories(chosenCategories.filter(item => item !== category))
        } else {
            setChosenCategories(chosenCategories.concat([category]))
        }
        //console.log(chosenCategories)
    }
    return (
        <div style={{display: "flex", width: "100%", justifyContent: "center"}}>
            <Button className="customButtonSideBar" style={{width: "100%", height: "5vh"}} onClick={() => setShowModal(true)}>By Category</Button>
            
            <Modal show={showModal}>
                <Modal.Header>
                    <Modal.Title>Categories</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Button variant="danger" style={{marginBottom: "1vh"}}onClick={() => setChosenCategories([])}>Clear All</Button>
                        </Row>
                        <Row>
                        {[0,1,2].map((col) => 
                            <Col>
                                {categories.slice((categories.length / 3) * col, (categories.length / 3) * (col+1)).map((category) => 
                                    <Form.Check
                                        key={category}
                                        type="checkbox"
                                        label={category}
                                        checked={chosenCategories.includes(category)}
                                        onChange={() => updateCategories(category)}
                                    />
                                )}
                            </Col>
                        )}
                        </Row>
                    </Container>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {setChosenCategories(args.chosenCategories); setShowModal(false)}}>Cancel</Button>
                    <Button variant="success" onClick={() => {args.submit(chosenCategories); setShowModal(false)}}>Confirm</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CategoryModal