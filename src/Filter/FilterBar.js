import { useEffect, useState } from "react"
import { TextField } from "./FilterFields"

export function FilterBar() {
    let [request, updateRequest] = useState({});
    useEffect(() => {console.log(requestToMongoQuery(request))}, [request])
    function changeRequest(newProps) {
        updateRequest({...request, ...newProps})
    }
    function requestToMongoQuery(request) {
        let mongoQuery = {nameOfItem: request.name, price: {$gte: Number(request.minPrice), $lte: Number(request.maxPrice)}, location: request.location, description: request.description}
        for (let key in mongoQuery) {
            if (!mongoQuery[key]) delete mongoQuery[key]
        }
        if (!mongoQuery.price.$gte) mongoQuery.price.$gte = 0
        if (!mongoQuery.price.$lte) mongoQuery.price.$lte = 2e10;
        return mongoQuery
    }
    return (
        <>
            <h1>Filter Bar</h1>
            {request.name && <p>Product Name: {request.name}</p>}
            {request.description && <p>Product Description: {request.description}</p>}
            {request.minPrice && <p>Minimum Price: {request.minPrice}</p>}
            {request.maxPrice && <p>Maximum Price: {request.maxPrice}</p>}
            {request.location && <p>Location: {request.location}</p>}
            <TextField defaultText='name' submit={(value) => changeRequest({name:value})}/>
            <TextField defaultText='description' submit={(value) => changeRequest({description:value})}/>
            <TextField defaultText='minimum price' submit={(value) => changeRequest({minPrice:value})}/>
            <TextField defaultText='maximum price' submit={(value) => changeRequest({maxPrice:value})}/>
            <TextField defaultText='location' submit={(value) => changeRequest({location:value})}/>
        </>
    )
}