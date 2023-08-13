import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ProductLandingPage.css";
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleReplyClick = () => {
    // reply button's functionality here
    console.log("Reply button clicked");
  };

  return (
    <div class="parent">
      <div className="div1">
        <h1>
          {data.nameOfItem} - ${data.price} ({data.location})
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
        {data.picture && <img src={data.picture} alt={data.nameOfItem} />}
      </div>
      <div className="div4">{data.description}</div>
      <div className="div5">
        <button onClick={handleReplyClick}>Reply</button>
      </div>
      <div className="div6">post id: {data._id}</div>
      <div className="div7">posted: about an hour ago</div>
      <div className="div8">Location: {data.location}</div>
    </div>
  );
};

export default ProductLandingPage;
