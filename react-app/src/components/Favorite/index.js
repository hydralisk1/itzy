import { useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import Item from "../MainPage/Item"
import Placeholder from '../Placeholder'
import mainStyles from '../MainPage/main.module.css'
import styles from './favorite.module.css'

const Favorite = () => {
    const likedItems = useSelector(state => state.session.user.likes)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => {
        const itemIds = Object.keys(likedItems)

        if(itemIds.length){
            const method = 'POST'
            const headers = {'Content-type': 'application/json'}
            const body = JSON.stringify({itemIds})
            const options = {method, headers, body}

            fetch('/api/items/get', options)
                .then(res => {
                    if(res.ok) return res.json()
                    throw new Error()
                })
                .then(res => {
                    setData(Object.values(res))
                })
                .catch(() => setIsError(true))
                .finally(() => setIsLoaded(true))
        }else {
            setData([])
            setIsLoaded(true)
        }
    }, [likedItems])

    return (
        isError ? <div className={styles.title}>Something went wrong</div> :
        isLoaded ?
        <>
            <div className={styles.title}>Your Favorite Items</div>
            {!!data.length ?
            <div className={mainStyles.mainContainer}>
                {
                    data.map(d => <Item itemId={d.id} price={d.price} image={d.image} key={d.id} />)
                }
            </div>:
            <div className={styles.message}>
                You don't have any favorite items
            </div>
            }
        </>
        : <Placeholder />
    )
}

export default Favorite
