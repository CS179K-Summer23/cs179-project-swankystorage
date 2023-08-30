import { useEffect, useState } from "react"
import { TextField, LocationField } from "./FilterFields"
import 'bootstrap/dist/css/bootstrap.min.css'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import './FilterBar.css'
import CategoryModal from "./CategoryModal"



function SortButtons(args) {
    return (
        <Accordion.Item eventKey="sort">
            <Accordion.Header>
                Sort By
            </Accordion.Header>
            <Accordion.Body>
                <div><Button 
                    onClick={() => args.sort.updateSort({nameOfItem:1})}
                >Name: A-Z</Button></div>
                <div><Button 
                    onClick={() => args.sort.updateSort({nameOfItem:-1})}
                >Name: Z-A</Button></div>
                <div><Button 
                    onClick={() => args.sort.updateSort({price: -1})}
                
                >Price: High-Low</Button></div>
                <div><Button 
                    onClick={() => args.sort.updateSort({price: 1})}
                
                >Price: Low-High</Button></div>
                <div><Button 
                    onClick={() => args.sort.updateSort({createdAt: -1})}
                
                >Date: Newest-Oldest</Button></div>
                <div><Button 
                    onClick={() => args.sort.updateSort({createdAt: 1})}
                
                >Date: Oldest-Newest</Button></div>
                <div><Button 
                    onClick={() => args.sort.updateSort({distance: 1})}
                
                >Distance: Closest</Button></div>
            </Accordion.Body>
        </Accordion.Item>
    )
}

export function FilterBar(args) {
    let [request, updateRequest] = useState({categories: []});
    let [sort, updateSort] = useState({nameOfItem:1});
    let [location, updateLocation] = useState({latitude: 0, longitude: 0, radius: 0});
    let [city, updateCity] = useState("")
    useEffect(() => {args.getQuery(request, sort, location);}, [request, sort, location])
    function changeRequest(newProps) {
        updateRequest({...request, ...newProps})
    }
    return (
        <>
            <h1 className="filterBarTitle">Filter Results</h1>
            { args.properties.map((item) => 
                request[item.prop] && (<Card onClick={() => changeRequest({[item.prop]: undefined})} key={item.key}>
                    <Card.Title>{item.label}</Card.Title>
                    <Card.Text>
                        {request[item.prop]}
                    </Card.Text>
                </Card>)
            ) }
            { city !== "" && <Card onClick={() => {updateCity(""); updateLocation({latitude: 0, longitude: 0, distance: 0})}}>
                <Card.Title>Location</Card.Title> 
                <Card.Text>
                    <p>{city}</p>
                    <p>Radius: {location.radius}</p>
                </Card.Text>
            </Card> }

            <Accordion>
                <Form>
                <CategoryModal chosenCategories={request.categories} submit={(value) => changeRequest({categories: value})} />
                <SortButtons sort={{sort, updateSort}}/>
                { args.properties.map((item) => 
                    <Accordion.Item eventKey={item.key} key={item.key}>
                        <TextField key={item.key} defaultText={item.label} type={item.type} submit={(value) => changeRequest({[item.prop]: value})}/>
                    </Accordion.Item>
                ) }
                <Accordion.Item>
                    <LocationField submit={(location, city) => {updateLocation(location); updateCity(city)}} />
                </Accordion.Item>
                </Form>
            </Accordion>
        </>
    )
}

export default FilterBar