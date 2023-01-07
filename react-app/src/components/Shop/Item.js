import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import ItemModify from '../ItemPage/ItemModify'
import Placeholder from '../Placeholder'
import Message from '../Message'
import styles from './shop.module.css'

const Item = ({ item, setIsChanged }) => {
    const history = useHistory()
    const [isModalOn, setIsModalOn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isMessageOn, setIsMessageOn] = useState(false)
    const [message, setMessage] = useState('Something went wrong. Please try again')

    const handleDelete = () => {
        setIsLoading(true)
        fetch(`/api/items/${item.id}`, {method: 'DELETE'})
            .then(res => {
                if(res.ok) setIsChanged(true)
                throw new Error
            })
            .catch(() => {
                setMessage('You can\'t remove this item since someone purchased this item')
                setIsMessageOn(true)
            })
            .finally(() => setIsLoading(false))
    }

    return (<>
        <div className={styles.cardContainer}>
            <div
                style={{
                    background: `center/auto 100% no-repeat url("${item.images[0]}")`,
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
        {isModalOn && <ItemModify setIsChanged={setIsChanged} setIsModalOn={setIsModalOn} item={item} />}
        {isMessageOn && <Message setIsMessageOn={setIsMessageOn} isError={true} message={message} />}
        {isLoading && <Placeholder width='100vw' height='100vh' position='fixed' />}
    </>)
}

export default Item
