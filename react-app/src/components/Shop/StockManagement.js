import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { closeShop } from '../../store/session'
import Item from './Item'
import ItemModify from '../ItemPage/ItemModify'
import Placeholder from '../Placeholder'
import itemStyles from '../ItemPage/item.module.css'
import styles from './shop.module.css'

const StockManagement = () => {
    const dispatch = useDispatch()
    const history = useHistory()

    const [isLoaded, setIsLoaded] = useState(false)
    const [items, setItems] = useState([])
    const [isChanged, setIsChanged] = useState(true)
    const [isModalOn, setIsModalOn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if(isChanged)
            fetch('/api/shop/items')
                .then(res => {if(res.ok) return res.json()})
                .then(res => {
                    setItems(Object.values(res.items))
                    setIsChanged(false)
                    setIsLoaded(true)
                })
    }, [isChanged])

    const handleClose = () => {
        setIsLoading(true)
        dispatch(closeShop())
            .then(res => {
                setIsLoading(false)
                if(res) history.push('/')
            })
    }

    return (<>
        <div className={styles.stockContainer}>{isLoaded ?
            !!items.length ?
            items.map(item => <Item key={item.name} item={item} setIsChanged={setIsChanged} />)
            : <div>You don't have any items to sell yet</div>
            : <div>Loading...</div>}
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <div
                style={{width: '30%', margin: '0 16px'}}
                className={itemStyles.addBtn}
                onClick={() => setIsModalOn(true)}
            >Add Item</div>
            <div
                style={{width: '30%', margin: '0 16px', backgroundColor: 'red'}}
                className={itemStyles.addBtn}
                onClick={handleClose}
            >Close This Shop</div>
        </div>
        {isModalOn && <ItemModify setIsModalOn={setIsModalOn} setIsChanged={setIsChanged} />}
        {isLoading && <Placeholder width='100vw' height='100vh' position='fixed' />}
    </>)
}

export default StockManagement
