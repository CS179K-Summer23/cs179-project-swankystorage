import { useLocation } from "react-router"
import MainApp from "../AddListingModal/MainApp"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import useSession from "../useSession"

export function Dashboard() {
    let [listings, setListings] = useState()
    let [doneLoading, setDoneLoading] = useState(false)
    let [noFavorites, setNoFavorites] = useState(false)
    let [session] = useSession()
    const navigate = useNavigate()

    useEffect(() => {
        console.log(session)
        if (session === null) {navigate('/login')}
        else if (session === undefined) {return}
        else {getFavorites()}
    }, [session])

    function makeQuery(favorites) {
        let query = { $or: [] }
        for (let favorite = 0; favorite < favorites.length; favorite++) {
            query.$or.push({_id: session.favorites[favorite]})
        }
        return query
    }

    async function getFavorites() {
        if (session.favorites.length === 0) {
            setListings([])
            setDoneLoading(true)
            setNoFavorites(true)
            return
        }
        console.log("Favorites: ", session.favorites)
        const query = makeQuery(session.favorites)
        console.log("query: ", query)
        axios.get(
            'http://localhost:3001/filter-listings',
            {params: {query}}
        ).then((response) => {
            console.log("response.data: ", response.data)
            setListings(response.data)
            setDoneLoading(true)
            setNoFavorites(false)
        })
    }

    return (
        <>
            <CustomNavbar />
            { session && doneLoading && <MainApp listings={listings} update={(data) => {setListings(data)}}/>}
            { session && noFavorites && <h2>Explore the home page to add favorites!</h2>}
        </>
    )
}

export default Dashboard