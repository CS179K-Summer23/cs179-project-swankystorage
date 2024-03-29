import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Card, Modal } from "react-bootstrap";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { MdLocationOn, MdDelete } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import AddListingModal from "./AddListingModal";
import FilterBar from "../Filter/FilterBar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useSession from "../useSession";
import "./MainApp.css";
import UpdateListingModal from "../UpdateListingModal";

const MainApp = (args) => {
  const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [listings, setListings] = useState(args.listings)
    let [loggedIn, setLoggedIn] = useState(false);
    let [session] = useSession();

    const [showNotLoggedInPrompt, setShowNotLoggedInPrompt] = useState(false);
    const handleCloseShowNotLoggedInPrompt = () => setShowNotLoggedInPrompt(false);
    const handleShowShowNotLoggedInPrompt = () => setShowNotLoggedInPrompt(true);

    useEffect(() => {
      setListings(args.listings)
    }, [args.listings])

    useEffect(() => {
      axios
        .get("http://localhost:3001/profilePage")
        .then((response) => {
          setLoggedIn(true);
        })
        .catch((error) => {
          setLoggedIn(false);
          console.log("User not logged in");
        });
    }, []);
  
  const handleShowListings = (listingsToShow) => {
    /* Map through the "listings" array and display each item in a ListingCard */
    // console.log(listingsToShow);
    if (listingsToShow.length > 0) {
      return (
        <>
          {listings.map((item, index) => (
            <Col key={index} md={3} sm={2}>
              <ListingCard item={item} session={session} />
            </Col>
          ))}
        </>
      );
    } else {
      return (
        <>
          <h1>No Results</h1>
        </>
      );
    }
  };

  //axios.get(
  //    'http://localhost:3001/new-listing'
  //).then((response) => {
  //    console.log(response);
  //    setListings(response.data)
  //});

  const handleAddListing = (newListing) => {
    setListings([...listings, newListing]);
  };

  const handleShowModal = () => {
    if(session){
      setShowModal(true);
    }else{
      setShowNotLoggedInPrompt(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGoToLogInButton = () => {
    navigate("/login")
  }

  return (
    <>
      {/*Appears when user clicks "logout" button*/}
      <Modal show={showNotLoggedInPrompt} onHide={handleCloseShowNotLoggedInPrompt}>
          <Modal.Header closeButton>
              <Modal.Title>Not logged in</Modal.Title>
          </Modal.Header>
          <Modal.Body>You need to log in to add a listing!</Modal.Body>
          <Modal.Footer>
              <Button variant="success" onClick={handleGoToLogInButton}>
                Log In
              </Button>
              <Button variant="secondary" onClick={handleCloseShowNotLoggedInPrompt}>
                Back
              </Button>
          </Modal.Footer>
      </Modal>
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
        <Row className="mt-3">{handleShowListings(listings)}</Row>
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

const ListingCard = ({ item, session }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const location = useLocation();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate()

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [showNotLoggedIn, setShowNotLoggedIn] = useState(false);
  const handleCloseLoggedIn= () => setShowNotLoggedIn(false);
  const handleShowNotLoggedIn = () => setShowNotLoggedIn(true);

  const isProfilePage = location.pathname === "/profilePage";
  // console.log(isProfilePage);

  const handleUpdateClick = () => {
    setShowUpdateModal(true);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3001/profilePage")
      .then((response) => {
        setLoggedIn(true);
      })
      .catch((error) => {
        setLoggedIn(false);
        console.log("User not logged in");
      });
  }, []);

  useEffect(() => {
    if (!session) return
    if (!session.favorites) return
    if (session.favorites.find(element => element === item._id)) {
      setIsFavorite(true)
    }
  }, [session])

  const handleFavoriteClick = () => {
    if (!session) {
      navigate('/login')
      return
    }
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

      handleClose();
      window.location.reload();
  };

  const handleGoToLogInButton = () => {
    navigate("/login")
  }

  var link;
  if(loggedIn){
    link = <>
            <Link to={`/product/${encodeURIComponent(item._id)}`}>
              <Card.Title>{item.nameOfItem}</Card.Title>
            </Link>
            </>
  }else{
    link = <Link onClick={handleShowNotLoggedIn}>
            <Card.Title>{item.nameOfItem}</Card.Title>
          </Link>
  }

  return (
    <>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete item?</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteClick}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
    <Modal show={showNotLoggedIn} onHide={handleCloseLoggedIn}>
        <Modal.Header closeButton>
            <Modal.Title>Not logged in</Modal.Title>
        </Modal.Header>
        <Modal.Body>You need to log in view this listing!</Modal.Body>
        <Modal.Footer>
            <Button variant="success" onClick={handleGoToLogInButton}>
              Log In
            </Button>
            <Button variant="secondary" onClick={handleCloseLoggedIn}>
              Back
            </Button>
        </Modal.Footer>
    </Modal>
    <Card className="listing-card">
      <Card.Img variant="top" src={item.picture[0]} alt={item.itemName} />
      <Card.Body>
        {link}
        <Card.Text>Price: ${(item.price/100).toFixed(2)}</Card.Text>
        {!isProfilePage && (
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
        )}
        {isProfilePage && (
          <Row>
            <Col>
              <Button variant="primary" onClick={handleUpdateClick}>
                Update
              </Button>
            </Col>
            <Col>
              <Button variant="danger" onClick={handleShow}>
                Delete
              </Button>
            </Col>
          </Row>
        )}
        <UpdateListingModal
          show={showUpdateModal}
          handleClose={() => setShowUpdateModal(false)}
          handleUpdateListing={(updatedListing) => {
            setShowUpdateModal(false);
          }}
          listing={item}
        />
      </Card.Body>
    </Card>
    </>
  );
};

export default MainApp;
