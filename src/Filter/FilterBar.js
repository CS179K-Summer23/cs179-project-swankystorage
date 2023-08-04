import { useEffect, useState } from "react"
import { TextField } from "./FilterFields"

export function FilterBar(args) {
    let [request, updateRequest] = useState({});
    useEffect(() => {args.getQuery(request)}, [request])
    function changeRequest(newProps) {
        updateRequest({...request, ...newProps})
    }
    return (
        <>
            <h1>Filter Bar</h1>
            { args.properties.map((item) => 
                request[item.prop] && <p key={item.key}>Product Name: {request[item.prop]}</p>
            ) }
            { args.properties.map((item) => 
                <div key={item.key}><TextField key={item.key} defaultText={item.label} type={item.type} submit={(value) => changeRequest({[item.prop]: value})}/></div>
            ) }
        </>
    )
}