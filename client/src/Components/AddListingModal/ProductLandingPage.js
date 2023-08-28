import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductLandingPage.css";
import { formatDistanceToNow } from "date-fns";
import CustomNavbar from "../CustomNavbar/CustomNavbar";
import MapComponent from "../Maps";
import { Row, Col, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from "react-share";


function useData() {
  const [data, setData] = useState(null);
  const { id } = useParams()

  useEffect(() => {
    axios.get("http://localhost:3001/listing/" + id).then(res => {
      console.log(res.data)  
      setData(res.data)
    }).catch(err => console.log(err))
}, [])

  return [data]
}


const ProductLandingPage = ({ item }) => {
  const [data] = useData();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [authorOfPost, setAuthorOfPost] = useState("Unknown");

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  /*useEffect(() => {
  const [username, setUserName] = useState('')
  const navigate = useNavigate()
  const { id } = useParams();
  console.log(id);

  useEffect(() => {
    const fetchProfile = async() =>{
      axios
      .get("http://localhost:3001/profilePage")
      .then((response) => {
        setUserName(response.data.user.userName);
      })
      .catch((error) => {
        setError(error);
      });
    }
    fetchProfile()
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/listing/" + id);
        setData(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);*/

  useEffect(() => {
    if(!data) return
    const fetchAuthor = async () =>{
      try{
        const auth = await axios.get("http://localhost:3001/listing/user/" + data.owner);
        setAuthorOfPost(auth);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [data])
  

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">
    <div className="spinner-border text-primary" role="status">
      <span className="sr-only"></span>
    </div>
  </div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  
  const createNewChat = () => {
    try {
      axios.post("http://localhost:3001/createRoom/",{
        name: data.nameOfItem,
        id: data.owner,
      }).then(()=>{
      // console.log("room has been created")
      navigate("/chat", {state: {owner: data, user: username}})
     })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
    <CustomNavbar />
    <div className="mainContainerListingPage">
      <div className="listingContentsListingPage">
        <div className="titleContainerListingPage">
          <p className="titleListingPage">{data.nameOfItem} - <span className="listingPriceListingPage">${data.price}</span></p>
        </div>
        <div className="containerVisualInfoRowListingPage">
          <Row>
            <div className="vwDivListingPage">
              {data.picture && <img src={data.picture} alt={data.nameOfItem} style={{ maxWidth: '450px', width: '100%' }} />}
            </div>
            <div className="vwDivListingPage">
              <MapComponent lat={data.latitude} lng={data.longitude} rad={data.radius}/>
            </div>
            <div className="vwDivListingPage">
              <div className="sharingOptionsContainerListingPage">
                <div className="sharingOptionsTopPanelListingPage">
                  <p className="sellerTitleListingPage"><span className="sellerTitleListingPageSpan">Posted by: {authorOfPost.data.userName}</span></p>
                  <p className="createdUpdateOptionsListingPage"><span className="updatedCreatedTitleListingPage">Created: </span>{formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}</p>
                  <p className="createdUpdateOptionsListingPage"><span className="updatedCreatedTitleListingPage">Last Updated: </span>{formatDistanceToNow(new Date(data.updatedAt), { addSuffix: true })}</p>
                  <p className="sharingOptionsTitleListingPage">Share this listing: &nbsp;
                    <FacebookShareButton url={window.location.href} quote={`Check out this item: ${data.nameOfItem}`}>
                      <FacebookIcon size={32} round={true} />
                    </FacebookShareButton>

                    <TwitterShareButton url={window.location.href} title={`Check out this item! \n${data.nameOfItem}`}>
                      <TwitterIcon size={32} round={true} />
                    </TwitterShareButton>

                    <WhatsappShareButton url={window.location.href} title={data.nameOfItem}>
                      <WhatsappIcon size={32} round={true} />
                    </WhatsappShareButton>

                    <EmailShareButton
                      url={window.location.href}
                      subject={data.nameOfItem + " on Swanky Storage"}
                      body={`Check out this item! \n${data.nameOfItem}\n`}
                    >
                      <EmailIcon size={32} round={true} />
                    </EmailShareButton>
                  </p>
                </div>
                <div className="sharingOptionsBottomPanelListingPage">
                  <Button variant="primary" className="customMessageSellerButtonListingPage" onClick={createNewChat}>
                    <span className="customMessageSellerButtonTextListingPage">Message Seller</span>
                  </Button>
                </div>
              </div>
            </div>
          </Row>
        </div>
        <div className="descriptionContainerListingPage">
          <div className="descriptionTitleContainerListingPage">
            <p className="descriptionTitleListingPage">Description</p> 
          </div>
          <p className="descriptionContentsListingPage">{data.description}</p>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductLandingPage;
