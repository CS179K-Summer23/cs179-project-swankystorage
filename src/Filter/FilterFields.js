import { useState } from "react"

export function TextField(args) {
    let [value, setValue] = useState(args.defaultText)
    function update(e) {
        setValue(e.target.value)
    }
    function submit(e) {
        if (e.key === "Enter") {
            console.log(value)
            args.submit(value);
        }
    }
    return (
        <input type='text' onKeyDown={submit} onChange={update} value={value}/>
    )
}