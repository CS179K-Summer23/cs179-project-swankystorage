import { useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import Accordion from 'react-bootstrap/Accordion'
import { Form } from "react-bootstrap"

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