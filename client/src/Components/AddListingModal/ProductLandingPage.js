import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductLandingPage.css";
import { formatDistanceToNow } from "date-fns";
import CustomNavbar from "../CustomNavbar/CustomNavbar";
import { Row, Col, Button } from "react-bootstrap";
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
              {data.picture && <img src={data.picture} alt={data.nameOfItem} style={{ maxWidth: '450px', width: '100%' }} />}
            </Col>
            <Col className="col-4">
              <iframe
                width="450px"
                height="450px"
                title="California Map"
                id="map-iframe"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d998917.166994401!2d-120.67364818456007!3d36.778261015833336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ac6c3e38f3859%3A0x4e8e9992e03d3e0!2sCalifornia%2C%20USA!5e0!3m2!1sen!2sus!4v1631168552723!5m2!1sen!2sus"
                allowfullscreen
              ></iframe>
            </Col>
            <Col className="col-4">
              <div className="sharingOptionsContainerListingPage">
                <div className="sharingOptionsTopPanelListingPage">
                  <p className="sellerTitleListingPage"><span className="sellerTitleListingPageSpan">Posted by: </span>{data.owner}</p>
                  <p className="createdUpdateOptionsListingPage">Created On: {data.createdAt}</p>
                  <p className="createdUpdateOptionsListingPage">Last Updated: {data.updatedAt}</p>
                  <p className="sharingOptionsTitleListingPage">Share this listing: &nbsp;
                    <FacebookShareButton url={window.location.href} quote={data.nameOfItem}>
                      <FacebookIcon size={32} round={true} />
                    </FacebookShareButton>

                    <TwitterShareButton url={window.location.href} title={data.nameOfItem}>
                      <TwitterIcon size={32} round={true} />
                    </TwitterShareButton>

                    <WhatsappShareButton url={window.location.href} title={data.nameOfItem}>
                      <WhatsappIcon size={32} round={true} />
                    </WhatsappShareButton>

                    <EmailShareButton
                      url={window.location.href}
                      subject={data.nameOfItem}
                      body={`Check out this item: ${window.location.href}`}
                    >
                      <EmailIcon size={32} round={true} />
                    </EmailShareButton>
                  </p>
                </div>
                <div className="sharingOptionsBottomPanelListingPage">
                  <Button variant="primary" className="customMessageSellerButtonListingPage">
                    Message Seller
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductLandingPage;
