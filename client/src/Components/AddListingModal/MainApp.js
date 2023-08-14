import React, { useState } from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { MdLocationOn, MdDelete } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import AddListingModal from "./AddListingModal";
import FilterBar from "../Filter/FilterBar";
import { Link } from "react-router-dom";

import "./MainApp.css";

const MainApp = (args) => {
  const [showModal, setShowModal] = useState(false);

  const handleAddListing = (newListing) => {
    args.update([...args.listings, newListing]);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Container className="mainContainer">
        <Row className="mt-3">
          <Col>
            <Button
              onClick={handleShowModal}
              variant="primary"
              className="btn-success"
            >
              Add Listing
            </Button>
          </Col>
        </Row>
        <Row className="mt-3">
          {args.listings.map((item, index) => (
            <Col key={index} md={3} sm={2}>
              <ListingCard
                item={item}
                handleDelete={() => {
                  const updatedListings = args.listings.filter(
                    (_, i) => i !== index
                  );
                  args.update(updatedListings);
                }}
              />
            </Col>
          ))}
        </Row>
        <AddListingModal
          show={showModal}
          handleClose={handleCloseModal}
          handleAddListing={handleAddListing}
        />
        <style>
          {`
          /* Custom style for the listing cards */
          .listing-card {
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            transition: box-shadow 0.3s;
          }

          .listing-card:hover {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          .listing-card .card-img-top {
            height: 200px;
            object-fit: cover;
            border-radius: 5px;
          }

          .listing-card .card-title {
            font-size: 18px;
            font-weight: bold;
          }

          .listing-card .card-text {
            font-size: 16px;
            color: #333;
          }

          .listing-card .favorite-button {
            display: flex;
            align-items: center;
            padding: 8px;
            border-radius: 5px;
            background-color: #007bff;
            color: #fff;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .listing-card .favorite-button:hover {
            background-color: #0056b3;
          }

          .listing-card .favorite-icon {
            margin-right: 8px;
          }

          .listing-card .delete-icon {
            margin-left: 8px;
            cursor: pointer;
            color: red;
          }
        `}
        </style>
      </Container>
    </>
  );
};

function FavoriteButton({ isFavorite, handleFavoriteClick }) {
  return (
    <div className="favorite-button" onClick={handleFavoriteClick}>
      {isFavorite ? (
        <AiFillHeart className="favorite-icon" />
      ) : (
        <AiOutlineHeart className="favorite-icon" />
      )}
    </div>
  );
}

const ListingCard = ({ item, handleDelete }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite((prevIsFavorite) => !prevIsFavorite);
  };

  const handleHideClick = () => {
    setIsHidden(true);
  };

  if (isHidden) {
    return null;
  }

  return (
    <Card className="listing-card">
      <Card.Img variant="top" src={item.picture} alt={item.itemName} />
      <Card.Body>
        <Link to={`/product/${encodeURIComponent(item._id)}`}>
          <Card.Title>{item.nameOfItem}</Card.Title>
        </Link>
        <Card.Text>Price: ${item.price}</Card.Text>
        <Row className="align-items-center">
          <Col xs={3}>
            <FavoriteButton
              isFavorite={isFavorite}
              handleFavoriteClick={handleFavoriteClick}
            />
          </Col>
          <Col xs={6}>
            <MdLocationOn style={{ marginRight: "8px" }} />
            {item.location}
          </Col>
          <Col xs={3}>
            <MdDelete
              className="delete-icon"
              onClick={handleHideClick}
              alt="Hide Post"
            />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default MainApp;
