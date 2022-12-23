import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styles from './item.module.css'

const ItemPage = () => {
    const user = useSelector(state => state.session.user)
    const { itemId } = useParams()
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)
    const [data, setData] = useState({})

    useEffect(() => {
        fetch(`/api/items/get/${itemId}`)
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
            <div>
                {console.log(data)}
                {itemId}
            </div>
        : 'Loading...'
    )
}

export default ItemPage
