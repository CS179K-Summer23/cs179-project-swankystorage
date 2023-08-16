import React, { useState } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import AddListingModal from './AddListingModal';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { MdLocationOn } from 'react-icons/md';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import FilterBar from '../Filter/FilterBar';

import './MainApp.css'
  

const MainApp = (args) => {
    const [showModal, setShowModal] = useState(false);

    const handleShowListings = (listingsToShow) => {
        /* Map through the "listings" array and display each item in a ListingCard */
        console.log(listingsToShow);
        if(listingsToShow.length > 0){
            return <>
                {args.listings.map((item, index) => (
                    <Col key={index} md={3} sm={2}>
                        <ListingCard item={item} />
                    </Col>
                ))}
            </>
        }else{
            return<h1>Hmmm.. There's nothing here...</h1>
        }
    }

    //axios.get(
    //    'http://localhost:3001/new-listing'
    //).then((response) => {
    //    console.log(response);
    //    setListings(response.data)
    //});

    const handleAddListing = (newListing) => {
        args.update([...args.listings, newListing])
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
                    <Button onClick={handleShowModal} variant="primary" className="btn-success">
                        Add Listing
                    </Button>
                </Col>
            </Row>
            <Row className="mt-3">
                {handleShowListings(args.listings)}
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
        `}
            </style>
        </Container>
        </>
    );
};

function FavoriteButton({ isFavorite, handleFavoriteClick }) {
    return (
        <div
            className="favorite-button"
            onClick={handleFavoriteClick}
        >
            {isFavorite ? (
                <>
                    <AiFillHeart className="favorite-icon" />
                </>
            ) : (
                <>
                    <AiOutlineHeart className="favorite-icon" />
                </>
            )}
        </div>
    );
}

const ListingCard = ({ item }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleFavoriteClick = () => {
        setIsFavorite((prevIsFavorite) => !prevIsFavorite);
    };

    return (
        <Card className="listing-card">
            {/* Display item details */}
            <Card.Img variant="top" src={item.picture} alt={item.itemName} />
            <Card.Body>
                <Card.Title>{item.nameOfItem}</Card.Title>
                <Card.Text>Price: ${item.price}</Card.Text>
                {/* Create a new row for the location icon and favorite button */}
                <Row className="align-items-between">
                    <Col xs={6}>
                        {/*location icon */}
                        <MdLocationOn style={{ marginRight: '8px' }} />
                        {item.location}
                    </Col>
                    <Col xs={3} className="align-content-center">
                        <FavoriteButton
                            isFavorite={isFavorite}
                            handleFavoriteClick={handleFavoriteClick}
                            className=""
                        />
                    </Col>
                </Row>
                {/*<Card.Text>Description: {item.description}</Card.Text>*/}
            </Card.Body>
        </Card>
    );
};

export default MainApp;