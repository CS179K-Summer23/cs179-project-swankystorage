import { useEffect, useState } from "react"
import { TextField } from "./FilterFields"
import 'bootstrap/dist/css/bootstrap.min.css'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import './FilterBar.css'
import CategoryModal from "./CategoryModal"



function SortButtons(args) {
    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>
                Sort By: 
            </Accordion.Header>
            <Accordion.Body>
                <div className="sortButton"><Button 
                    onClick={() => args.sort.updateSort({nameOfItem:1})}
                >Name: A-Z</Button></div>
                <div className="sortButton"><Button 
                    onClick={() => args.sort.updateSort({nameOfItem:-1})}
                >Name: Z-A</Button></div>
                <div className="sortButton"><Button 
                    onClick={() => args.sort.updateSort({price: -1})}
                
                >Price: High-Low</Button></div>
                <div className="sortButton"><Button 
                    onClick={() => args.sort.updateSort({price: 1})}
                
                >Price: Low-High</Button></div>
                <div className="sortButton"><Button 
                    onClick={() => args.sort.updateSort({createdAt: -1})}
                
                >Date: Newest-Oldest</Button></div>
                <div className="sortButton"><Button 
                    onClick={() => args.sort.updateSort({createdAt: 1})}
                
                >Date: Oldest-Newest</Button></div>
            </Accordion.Body>
        </Accordion.Item>
    )
}

export function FilterBar(args) {
    let [request, updateRequest] = useState({categories: []});
    let [sort, updateSort] = useState({nameOfItem:1});
    useEffect(() => {args.getQuery(request, sort);}, [request, sort])
    function changeRequest(newProps) {
        updateRequest({...request, ...newProps})
    }
    return (
        <>
            <h1 className="filterBarTitle">Sort</h1>
            <Accordion>
                <Form>
                <SortButtons sort={{sort, updateSort}}/>
                </Form>
            </Accordion>
            <h1 className="filterBarTitle">Filter Results</h1>
            { args.properties.map((item) => 
                request[item.prop] && (<Card onClick={() => changeRequest({[item.prop]: undefined})} key={item.key}>
                    <Card.Title>{item.label}</Card.Title>
                    <Card.Text>{request[item.prop]}</Card.Text>
                </Card>)
            ) }
            <CategoryModal chosenCategories={request.categories} submit={(value) => changeRequest({categories: value})} />
            <Accordion>
                <Form>
                { args.properties.map((item) => 
                    <Accordion.Item eventKey={item.key} key={item.key}>
                        <TextField key={item.key} defaultText={item.label} type={item.type} submit={(value) => changeRequest({[item.prop]: value})}/>
                    </Accordion.Item>
                ) }
                </Form>
            </Accordion>
        </>
    )
}

export default FilterBar