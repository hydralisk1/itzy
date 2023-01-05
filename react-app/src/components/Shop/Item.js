import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import ItemModify from '../ItemPage/ItemModify'
import styles from './shop.module.css'

const Item = ({ item, setIsChanged }) => {
    const history = useHistory()
    const [isModalOn, setIsModalOn] = useState(false)

    const handleDelete = () => {
        fetch(`/api/items/${item.id}`, {method: 'DELETE'})
            .then(res => {if(res.ok) setIsChanged(true)})
    }

    return (<>
        <div className={styles.cardContainer}>
            <div
                style={{
                    background: `center no-repeat fixed url("${item.images[0]}")`,
                    backgroundSize: 'cover'
                }}
                className={styles.front + ' ' + styles.card}
            >
                <div className={styles.itemInfo}>
                    {item.name}
                </div>
                <div className={styles.stock}>
                {item.stock} in stock
                </div>
            </div>
            <div className={styles.back + ' ' + styles.card}>
                <div className={styles.category}>Category 1</div>
                <div className={styles.normalText}>{item.category_1}</div>
                <div className={styles.category}>Category 2</div>
                <div className={styles.normalText}>{item.category_2}</div>
                <div className={styles.price}>
                    <span style={{fontSize: '20px', fontWeight: 600}}>Price</span>
                    <span style={{fontSize: '20px', marginLeft: '16px'}}>${item.price}</span>
                </div>
                <div
                    className={styles.category + ' ' + styles.clickOn}
                    onClick={() => setIsModalOn(true)}
                >Click to modify this item</div>
                <div
                    className={styles.category + ' ' + styles.clickOn}
                    onClick={() => history.push(`/items/${item.id}`)}
                >Click to see this item</div>
                <div
                    style={{color: 'red'}}
                    className={styles.category + ' ' + styles.clickOn}
                    onClick={handleDelete}
                >Click to remove this item</div>
            </div>
        </div>
        { isModalOn && <ItemModify setIsChanged={setIsChanged} setIsModalOn={setIsModalOn} item={item} />}
    </>)
}

export default Item
