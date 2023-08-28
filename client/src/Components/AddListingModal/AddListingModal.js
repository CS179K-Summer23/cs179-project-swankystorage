import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const categories = [
  "Antiques",
  "Appliances",
  "Arts+Crafts",
  "ATV/UTV/SNO",
  "Auto parts",
  "Aviation",
  "Baby+Kid",
  "Barter",
  "Beauty+Hlth",
  "Bike parts",
  "Bikes",
  "Boat parts",
  "Boats",
  "Books",
  "Business",
  "Cars+Trucks",
  "CDs/DVD/VHS",
  "Cell phones",
  "Clothes+Acc",
  "Collectibles",
  "Computer parts",
  "Computers",
  "Electronics",
  "Farm+Garden",
  "Free",
  "Furniture",
  "Garage sale",
  "General",
  "Heavy equip",
  "Household",
  "Jewelry",
  "Materials",
  "Motorcycle parts",
  "Motorcycles",
  "Music instr",
  "Photo+Video",
  "RVs+Camp",
  "Sporting",
  "Tickets",
  "Tools",
  "Toys+Games",
  "Trailers",
  "Video gaming",
  "Wanted",
  "Wheels+Tires",
];

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
      price,
      location,
      description,
      pictures,
      categories: selectedCategories,
    });

    console.log(pictures);

    axios
      .post("http://localhost:3001/new-listing", {
        nameOfItem: itemName,
        price: price,
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
    const file = e.target.files;
    console.log(file);
    let base64 = []
    for (let i = 0; i < file.length; i++) {
      const picture = await convertToBase64(file[i])
      base64.push(picture)
    }
    //const base64 = await convertToBase64(file);
    //const base64 = file.map(item => convertToBase64(item))
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
              required
              multiple
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
  })
}