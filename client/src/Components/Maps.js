import React, { useRef, useEffect } from "react";

const MapComponent = ({ lat, lng, rad }) => {
  const mapRef = useRef(null);
  const circleRef = useRef(null); // Ref for the circle overlay

  useEffect(() => {
    // Create a new map instance
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat, lng },
      zoom: 10,
    });

    // Add a marker to the map
    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map,
      title: "Selected Location",
    });

    // Create a circle overlay
    const circle = new window.google.maps.Circle({
      strokeColor: "#FF0000",
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: "#FF0000",
      fillOpacity: 0.35,
      map,
      center: { lat, lng },
      radius: rad * 1609.34, // Convert miles to meters
    });

    // Save the circle reference to U or D it later
    circleRef.current = circle;
  }, [lat, lng, rad]);

  return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};

export default MapComponent;