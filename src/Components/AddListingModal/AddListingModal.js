import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddListingModal = ({ show, handleClose, handleAddListing }) => {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [pictures, setPictures] = useState(null); // Store the uploaded pictures

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate and handle form submission
    
    handleAddListing({
      itemName,
      price,
      location,
      description,
      pictures,
    });

    // Clear the form fields
    setItemName("");
    setPrice("");
    setLocation("");
    setDescription("");
    setPictures(null);

    // Close the modal
    handleClose();
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPictures(file);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Listing</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formItemName">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPictures">
            <Form.Label>Pictures</Form.Label>
            <Form.Control
              type="file"
              onChange={handleFileChange}
              accept="image/*"
            />
          </Form.Group>
          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Listing
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddListingModal;