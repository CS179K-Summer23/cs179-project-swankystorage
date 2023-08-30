import { useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import Accordion from 'react-bootstrap/Accordion'
import { Form } from "react-bootstrap"
import axios from "axios"

export function TextField(args) {
    let [value, setValue] = useState("")
    function update(e) {
        if (args.type === "price") {
            setValue(Math.abs(Math.floor(e.target.value * 100) / 100))
            return
        }
        setValue(e.target.value)
    }
    function submit(e) {
        if (e.key === "Enter") {
            //console.log(value)
            args.submit(value)
        }
    }
    return (
    <>
        <Accordion.Header>
            {args.defaultText}: 
        </Accordion.Header>
        <Accordion.Body>
            <Form.Control type={args.type === "price" ? "number" : args.type} onKeyDown={submit} onChange={update} value={value} min='0'/>
        </Accordion.Body>
    </>
    )
}

export function LocationField(args) {
    let [value, setValue] = useState("")
    let [latitude, setLatitude] = useState(null)
    let [longitude, setLongitude] = useState(null)
    let [radius, setRadius] = useState(0)
    const [locationSuggestions, setLocationSuggestions] = useState([])
    function submit(e) {
        if (e.key === "Enter") {
            //console.log(value)
            args.submit({latitude, longitude, radius}, value)
        }
    }
    const fetchLocationSuggestions = async (input) => {
        try {
          const response = await axios.get(`http://localhost:3001/cities/city/${input}`);
          setLocationSuggestions(response.data);
        } catch (error) {
          console.error("Error fetching location suggestions:", error);
        }
    };
    const handleLocationSuggestionClick = (suggestion) => {
        setValue(suggestion.city);
        setLatitude(suggestion.latitude);
        setLongitude(suggestion.longitude);
        setLocationSuggestions([]); // Clear suggestions
    };


    return (
        <>
            <Accordion.Header>
                Location: 
            </Accordion.Header>
            <Accordion.Body>
                <h2>Radius:</h2>
                <Form.Control type="number" min="0" value={radius} onKeyDown={submit} onChange={(e) => setRadius(e.target.value)}/>
                <h2>City:</h2>
                <Form.Control
                  type="text"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    fetchLocationSuggestions(e.target.value);
                  }}
                  onKeyDown={submit}
                />
                <ul className="location-suggestions">
                  {locationSuggestions.map((suggestion) => (
                    <li
                      key={suggestion._id}
                      onClick={() => handleLocationSuggestionClick(suggestion)}
                    >
                      {suggestion.city}
                    </li>
                  ))}
                </ul>
            </Accordion.Body>
        </>
    )
}