import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Card } from "react-bootstrap";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { MdLocationOn, MdDelete } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import AddListingModal from "./AddListingModal";
import { Link, useLocation } from "react-router-dom";
import useSession from "../useSession";

import "./MainApp.css";

const MainApp = (args) => {
    const [showModal, setShowModal] = useState(false);

    const handleShowListings = (listingsToShow) => {
        /* Map through the "listings" array and display each item in a ListingCard */
        console.log(listingsToShow);
        if(listingsToShow.length > 0){
            return <>
                {args.listings.map((item, index) => (
                    <Col key={index} >
                        <ListingCard item={item} />
                    </Col>
                ))}
            </>
        }else{
            return <>
                    <h1>No Results</h1>
                   </>
        }
    }
  

  //axios.get(
  //    'http://localhost:3001/new-listing'
  //).then((response) => {
  //    console.log(response);
  //    setListings(response.data)
  //});

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
          {!args.hideAddListing && <Col>
            <Button
              onClick={handleShowModal}
              variant="primary"
              className="btn-success"
            >
              Add Listing
            </Button>
          </Col>}
        </Row>
        <Row className="mt-3">{handleShowListings(args.listings)}</Row>
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
  const location = useLocation();
  let [session] = useSession()

  const isProfilePage = location.pathname === "/profilePage";
  console.log(isProfilePage);

  useEffect(() => {
    if (!session) return
    if (!session.favorites) return
    if (session.favorites.find(element => element === item._id)) {
      setIsFavorite(true)
    }
  }, [session])

  const handleFavoriteClick = () => {
      let newFavorites = session.favorites
    if (isFavorite) {
      console.log("removing ", item._id)
      //let itemIndex = session.favorites.findIndex(element => element === item._id)
      newFavorites = newFavorites.filter(element => element !== item._id)
      console.log("now ", session.favorites)
    } else {
      console.log("adding ", item._id)
      newFavorites.push(item._id)
      console.log("now ", session.favorites)
    }
    axios.post('http://localhost:3001/update-favorites', {name: session.userName, favorites: newFavorites})
      .then(res => {
          console.log("this is the status:", res.status)
          if(res.status === 200) {
            window.location.reload()
            console.log("Favorites in session: ", session.favorites)
            setIsFavorite((prevIsFavorite) => !prevIsFavorite);
          }
      }).catch(err => console.log(err))
  };

  const handleHideClick = () => {
    setIsHidden(true);
  };

  if (isHidden) {
    return null;
  }
  const handleDeleteClick = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!isConfirmed) {
      return;
    }
    axios
      .delete(`http://localhost:3001/listing/${item._id}`)
      .then((response) => {
        if (response.status === 200) {
          console.log("Listing deleted successfully");
          handleHideClick(); // Hide the listing from the UI
        }
      })
      .catch((error) => {
        console.error("Error deleting the listing:", error);
      });
  };

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
            {session != null && <FavoriteButton
              isFavorite={isFavorite}
              handleFavoriteClick={handleFavoriteClick}
            />}
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
        {isProfilePage && (
          <Row>
            <Col>
              <Button variant="primary">Update</Button>
            </Col>
            <Col>
              <Button variant="danger" onClick={handleDeleteClick}>
                Delete
              </Button>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default MainApp;
