import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductLandingPage.css";
import { formatDistanceToNow } from "date-fns";
import CustomNavbar from "../CustomNavbar/CustomNavbar";
import MapComponent from "../Maps";
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
    <div class="parent">
      <div className="div1">
        <h1>
          {data.nameOfItem} - ${data.price} ({data.location}) <button onClick={togglePopup}>
              <h2>Reply</h2>
            </button>
        </h1> 
      </div>
      <div className="div2">
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
      </div>

      <div className="div3">
          {data.picture && <img src={data.picture} alt={data.nameOfItem} style={{ maxWidth: '350px', width: '100%' }} />}
      </div>
      <div className="div4">{data.description}</div>
      <div className="div5"><div className="button-box"><b>Post id:</b> {data._id}</div></div>
      <div className="div6"><div className="button-box"><b>Posted:</b> {formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}</div></div>
      <div className="div7"><div className="button-box"><b>Updated:</b> {formatDistanceToNow(new Date(data.updatedAt), { addSuffix: true })}</div></div>
      <div className="div8"> <MapComponent lat={data.latitude} lng={data.longitude} rad={data.radius}/>  </div>
      {showPopup && (
        <div className="popup">
          <p> 🛠️ We see your curiosity sparked by <b>{data.nameOfItem}</b>, and we're thrilled about your interest! At the moment, our chat feature is undergoing some enhancements to provide you with an even better experience.🛠️</p>
          <button onClick={togglePopup}>Close</button>
        </div>
      )}

    </div>
    </>
  );
};

export default ProductLandingPage;
