import { useState } from 'react'
import { Button, Modal, Form, Container, Col, Row } from 'react-bootstrap';

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
        <>
            <Button onClick={() => setShowModal(true)}>Categories</Button>
            
            <Modal show={showModal}>
                <Modal.Header>
                    <Modal.Title>Categories</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Button onClick={() => setChosenCategories([])}>Clear All</Button>
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
                    <Button onClick={() => {args.submit(chosenCategories); setShowModal(false)}}>Confirm</Button>
                    <Button onClick={() => {setChosenCategories(args.chosenCategories); setShowModal(false)}}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CategoryModal