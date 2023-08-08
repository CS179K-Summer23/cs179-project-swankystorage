import { useEffect, useState } from "react"
import { TextField } from "./FilterFields"
import 'bootstrap/dist/css/bootstrap.min.css'
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'

export function FilterBar(args) {
    let [request, updateRequest] = useState({});
    useEffect(() => {args.getQuery(request);}, [request])
    function changeRequest(newProps) {
        updateRequest({...request, ...newProps})
    }
    return (
        <>
            <h1>Filter Results</h1>
            { args.properties.map((item) => 
                request[item.prop] && (<Card onClick={() => changeRequest({[item.prop]: undefined})} key={item.key}>
                    <Card.Title>{item.label}</Card.Title>
                    <Card.Text>{request[item.prop]}</Card.Text>
                </Card>)
            ) }
            <Accordion>
                { args.properties.map((item) => 
                    <Accordion.Item eventKey={item.key} key={item.key}>
                        <TextField key={item.key} defaultText={item.label} type={item.type} submit={(value) => changeRequest({[item.prop]: value})}/>
                    </Accordion.Item>
                ) }
            </Accordion>
        </>
    )
}