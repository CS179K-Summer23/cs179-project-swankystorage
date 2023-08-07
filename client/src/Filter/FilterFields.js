import { useState } from "react"
import 'bootstrap/dist/css/bootstrap.min.css'
import Accordion from 'react-bootstrap/Accordion'

export function TextField(args) {
    let [value, setValue] = useState("")
    function update(e) {
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
            <input type={args.type} onKeyDown={submit} onChange={update} value={value} min='0'/>
        </Accordion.Body>
    </>
    )
}