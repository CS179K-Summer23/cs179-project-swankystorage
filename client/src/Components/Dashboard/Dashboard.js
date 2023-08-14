import { useLocation } from "react-router"
import MainApp from "../AddListingModal/MainApp"
import CustomNavbar from "../CustomNavbar/CustomNavbar"
import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export function Dashboard() {
    let [listings, setListings] = useState()
    let [doneLoading, setDoneLoading] = useState(false)
    let [noFavorites, setNoFavorites] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (window.user) {getFavorites()}
        else {navigate('/login')}
    }, [])

    function makeQuery(favorites) {
        let query = { $or: [] }
        for (let favorite = 0; favorite < favorites.length; favorite++) {
            query.$or.push({_id: window.user.favorites[favorite]})
        }
        return query
    }

    async function getFavorites() {
        if (window.user.favorites.length === 0) {
            setListings([])
            setDoneLoading(true)
            setNoFavorites(true)
            return
        }
        console.log("Favorites: ", window.user.favorites)
        const query = makeQuery(window.user.favorites)
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
            { window.user && doneLoading && <MainApp listings={listings} update={(data) => {setListings(data)}}/>}
            { window.user && noFavorites && <h2>Explore the home page to add favorites!</h2>}
        </>
    )
}

export default Dashboard