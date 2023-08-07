import { useEffect, useState } from "react"

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
            {args.defaultText}: 
            <input type={args.type} onKeyDown={submit} onChange={update} value={value} min='0'/>
        </>
    )
}