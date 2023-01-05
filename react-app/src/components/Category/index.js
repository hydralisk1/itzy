import { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import Item from "../MainPage/Item";
import Placeholder from "../Placeholder";
import mainStyles from '../MainPage/main.module.css'
import favoriteStyles from '../Favorite/favorite.module.css'

const Category = () => {
    const { categoryId } = useParams()
    const history = useHistory()
    const [items, setItems] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)
    const [categoryName, setCategoryName] = useState('')

    useEffect(() => {
        setIsLoaded(false)
        fetch(`/api/category/${categoryId}`)
            .then(res => {
                if(res.ok) return res.json()
                throw new Error()
            })
            .then(res => {
                setItems(res.items)
                setCategoryName(res.name)
            })
            .catch(() => history.push('/'))
            .finally(() => setIsLoaded(true))
    }, [categoryId])

    return (
        isLoaded ?
        <>
            <div className={favoriteStyles.title}>Items in {categoryName} category</div>
            {!!items.length ?
            <div className={mainStyles.mainContainer}>
                {
                    items.map(d => <Item itemId={d.id} price={d.price} image={d.images[0]} key={d.id} />)
                }
            </div>:
            <div className={favoriteStyles.message}>
                No item in this category
            </div>
            }
        </>
        : <Placeholder />
    )
}

export default Category
