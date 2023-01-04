import { useState } from 'react'
import { Link } from 'react-router-dom'
import Heart from "../Heart"
import styles from './main.module.css'

const Item = ({ itemId, price, image }) => {
    const [showHeart, setShowHeart] = useState(false)

    return (
        <div
            className={styles.item}
            onMouseOver={() => setShowHeart(true)}
            onMouseLeave={() => setShowHeart(false)}
        >
            <Link to={`/items/${itemId}`}>
                <div className={styles.pricetag}>$ {price.toFixed(2)}</div>
            </Link>
            {
                showHeart &&
                <Heart itemId={itemId} />
            }
            <Link to={`/items/${itemId}`}>
                <img className={styles.itemImage} src={image} alt={itemId} />
            </Link>
        </div>
    )
}

export default Item
