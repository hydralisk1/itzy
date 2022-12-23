import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Heart from '../Heart'
import styles from './main.module.css'

const MainPage = () => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)
    const [data, setData] = useState([])
    const [showHeart, setShowHeart] = useState(-1)

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
        isError ? <div>Something went wrong</div> :
        isLoaded ?
        <>
        <div className={styles.mainContainer}>
            {
                data.map((d, i) =>
                    <div
                        key={d.price + d.image}
                        className={styles.item}
                        onMouseOver={() => setShowHeart(i)}
                        onMouseLeave={() => setShowHeart(-1)}
                    >
                        <Link key={i + d.image + d.price} to={`/items/${d.id}`}>
                            <div className={styles.pricetag} key={d.image}>$ {d.price.toFixed(2)}</div>
                        </Link>
                        {
                            showHeart === i &&
                            <Heart key={i + d.image} itemId={d.id} />
                        }
                        <Link key={i + d.image + i} to={`/items/${d.id}`}>
                            <img className={styles.itemImage} key={i} src={d.image} alt={d.id} />
                        </Link>
                    </div>
                )
            }
        </div>
        </>
        : 'Loading'
    )
}

export default MainPage
