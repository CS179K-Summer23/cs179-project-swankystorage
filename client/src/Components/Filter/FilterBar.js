import { useEffect, useState } from "react"
import { TextField } from "./FilterFields"
import 'bootstrap/dist/css/bootstrap.min.css'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Form from "react-bootstrap/Form"
import './FilterBar.css'
import CategoryModal from "./CategoryModal"



export function FilterBar(args) {
    let [request, updateRequest] = useState({categories: []});
    useEffect(() => {args.getQuery(request);}, [request])
    function changeRequest(newProps) {
        updateRequest({...request, ...newProps})
    }
    return (
        <>
            <h1 className="filterBarTitle">Filter Results</h1>
            { args.properties.map((item) => 
                request[item.prop] && (<Card onClick={() => changeRequest({[item.prop]: undefined})} key={item.key}>
                    <Card.Title>{item.label}</Card.Title>
                    <Card.Text>{request[item.prop]}</Card.Text>
                </Card>)
            ) }
            <Accordion>
                <Form>
                <CategoryModal chosenCategories={request.categories} submit={(value) => changeRequest({categories: value})} />
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