import { useState, useEffect } from 'react'
import Item from './Item'
import Placeholder from '../Placeholder'
import styles from './main.module.css'

const MainPage = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => {
        fetch('/api/items/get')
            .then(res => {
                if(res.ok) return res.json()
                throw new Error()
            })
            .then(res => setData(res))
            .catch(() => setIsError(true))
            .finally(() => setIsLoaded(true))
    }, [])

    return (
        isError ? <div className={styles.mainContainer}>Something went wrong</div> :
        isLoaded ?
        <>
        <div className={styles.mainContainer}>
            {
                data.map(d => <Item itemId={d.id} price={d.price} image={d.image} key={d.id} />)
            }
        </div>
        </>
        : <Placeholder />
    )
}

export default MainPage
