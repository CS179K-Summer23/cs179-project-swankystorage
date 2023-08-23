import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
const {categories} = require('../../categories.json')

const AddListingModal = ({ show, handleClose, handleAddListing, listing }) => {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [pictures, setPictures] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    if (listing) {
      setItemName(listing.nameOfItem);
      setPrice(listing.price);
      setLocation(listing.location);
      setDescription(listing.description);
      setPictures(listing.pictures);
      setSelectedCategories(listing.categories);
    }
  }, [listing]);

  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== category)
      );
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate and handle form submission

    handleAddListing({
      itemName,
      price: (price * 100).toFixed(0),
      location,
      description,
      pictures,
      categories: selectedCategories,
    });

    console.log(selectedCategories);

    axios
      .post("http://localhost:3001/new-listing", {
        nameOfItem: itemName,
        price: (price * 100).toFixed(0),
        location: location,
        picture: pictures,
        description: description,
        categories: selectedCategories,
      })
      .then((response) => {
        console.log(response);
      });

    // Clear the form fields
    setItemName("");
    setPrice("");
    setLocation("");
    setDescription("");
    setPictures(null);
    setSelectedCategories([]);

    // Close the modal
    handleClose();
  };

  // Handle file input change
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const base64 = await convertToBase64(file);
    setPictures(base64);
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
              onChange={(e) => setPrice(Math.abs(Math.floor(e.target.value * 100) / 100))}
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
          <Form.Group controlId="formCategories">
            <Form.Label>Categories</Form.Label>
            {categories.map((category) => (
              <Form.Check
                key={category}
                type="checkbox"
                label={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
            ))}
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
          <Button variant="primary" type="submit" className="mt-4">
            Add Listing
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddListingModal;

function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
