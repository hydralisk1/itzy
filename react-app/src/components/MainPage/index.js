import { useState, useEffect } from 'react'
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
        isLoaded ?
        <div className={styles.mainContainer}>
            {
                data.map((d, i) =>
                    <div key={d} className={styles.item}>
                        <img className={styles.itemImage} key={i} src={d.image} alt={d.id} />
                    </div>
                )
            }
        </div>
        : 'Loading'
    )
}

export default MainPage
