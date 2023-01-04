import { useEffect, useState } from "react"
import { useParams, useHistory } from "react-router-dom"
import Item from "../MainPage/Item";
import Placeholder from "../Placeholder"
import mainStyles from '../MainPage/main.module.css'
import favoriteStyles from '../Favorite/favorite.module.css'

const SearchItems = () => {
    const { keyword } = useParams()
    const history = useHistory()
    const [items, setItems] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        fetch(`/api/items/search-all/${keyword}`)
            .then(res => {
                if(res.ok) return res.json()
                throw new Error()
            })
            .then(res => {setItems(Object.values(res))})
            .catch(() => history.push('/'))
            .finally(() => setIsLoaded(true))
    }, [keyword])

    return (
        isLoaded ?
        <>
            <div className={favoriteStyles.title}>Search results with "{keyword}"</div>
            {!!items.length ?
            <div className={mainStyles.mainContainer}>
                {
                    items.map(d => <Item itemId={d.id} price={d.price} image={d.images[0]} key={d.id} />)
                }
            </div>:
            <div className={favoriteStyles.message}>
                No item found
            </div>
            }
        </>
        : <Placeholder />
    )
}

export default SearchItems
