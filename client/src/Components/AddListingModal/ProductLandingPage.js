import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductLandingPage.css";
import { formatDistanceToNow } from "date-fns";
import CustomNavbar from "../CustomNavbar/CustomNavbar";
import { Row, Col } from "react-bootstrap";
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

const ProductLandingPage = ({ item }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);


  const { id } = useParams();
  console.log(id);

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
  }, [id]);

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
            <Col className="col-4">
              {data.picture && <img src={data.picture} alt={data.nameOfItem} style={{ maxWidth: '350px', width: '100%' }} />}
            </Col>
            <Col className="col-4">
              <div className="googleMapsContainerListingPage"></div>
            </Col>
            <Col className="col-4">
              <div className="sharingOptionsContainerListingPage"></div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductLandingPage;
