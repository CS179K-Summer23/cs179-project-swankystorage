import { useEffect, useState } from "react";
import axios from "axios";

export function useSession() {
    const [session, setSession] = useState(undefined)

    useEffect(() => {
        axios.get('http://localhost:3001/profilePage').then(res => {
            if (res.status === 200) {
                // console.log("Logged in")
                setSession(res.data.user)
            } else {
                console.log("Not logged in")
                setSession(null)
            }
        }).catch(err => console.log(err))
    }, [])

    return [session]
}

export default useSession