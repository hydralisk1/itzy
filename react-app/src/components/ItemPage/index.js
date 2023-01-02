import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { saveItems, loadItems } from '../../store/cart'
import CartModal from './CartModal'
import Placeholder from '../Placeholder'
import styles from './item.module.css'

const ItemPage = () => {
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()
    const { itemId } = useParams()
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)
    const [currentImg, setCurrentImg] = useState('')
    const [showDesc, setShowDesc] = useState(true)
    const [fullDesc, setFullDesc] = useState(false)
    const [isCartModalOn, setIsCartModalOn] = useState(false)
    const [data, setData] = useState({}) // all product data

    useEffect(() => {
        fetch(`/api/items/get/${itemId}`)
            .then(res => {
                if(res.ok) return res.json()
                throw new Error()
            })
            .then(res => {
                setCurrentImg(res.images[0])
                setData(res)
            })
            .catch(() => setIsError(true))
            .finally(() => setIsLoaded(true))
    }, [itemId])

    const addToCart = async () => {
        // if user is not logged in, cart data will be stored to local storage
        if(!user){
            let cart = JSON.parse(localStorage.getItem('cart'))

            if(!cart){
                cart = {}
                cart[itemId] = 1
            }
            else if(Object.keys(cart).includes(itemId)) cart[itemId]++
            else cart[itemId] = 1

            localStorage.setItem('cart', JSON.stringify(cart))
            await dispatch(loadItems(false))
        }else{
            const addItem = {}
            addItem[itemId] = 1
            await dispatch(saveItems(addItem))
        }

        setIsCartModalOn(true)
    }

    return (
        isError ? <div>Something went wrong</div> :
        isLoaded ?
        <>
            <div className={styles.itemContainer}>
                <div className={styles.imgContainer}>
                    <div className={styles.images}>
                        {
                            data.images.filter(d => d).map((d, i) => {
                                const style = d === currentImg ? styles.smImgContainer + ' ' + styles.current : styles.smImgContainer
                                const content = d.slice(-3) === 'jpg' ? <img key={d} className={styles.smallImg} src={d} alt='item' /> : <video key={d} className={styles.smallImg} muted><source src={d} type='video/mp4' /></video>
                                return <div key={i} className={style} onClick={() => setCurrentImg(d)}>{content}</div>
                            })
                        }
                    </div>
                    <div className={styles.currentImgContainer}>
                        { currentImg.slice(-3) === 'jpg' ?
                            <img className={styles.currentImg} src={currentImg} alt='item' /> :
                            <video className={styles.currentImg} muted><source src={currentImg} type='video/mp4' /></video>
                        }
                    </div>
                </div>
                <div className={styles.descContainer}>
                    <div className={styles.shopName}>{data.shop_name}</div>
                    <div className={styles.stock}>{data.stock <= 0 && 'Out of stock'}</div>
                    <div className={styles.name}>{data.name}</div>
                    <div className={styles.price}>$ {data.price.toFixed(2)}</div>
                    <button className={styles.addBtn} disabled={data.stock === 0} onClick={addToCart}>
                        Add to cart
                    </button>
                    <div className={styles.descBtn} onClick={() => setShowDesc(!showDesc)}>
                        <span style={{fontWeight: 600}}>Description</span><span className={showDesc ? styles.arrowUp : styles.arrowDown}><i className="fa-solid fa-angle-down"></i></span>
                    </div>
                    <div className={showDesc ? fullDesc ? styles.desc + ' ' + styles.full : styles.desc : styles.desc + ' ' + styles.hide}>
                        {data.desc}
                    </div>
                    { showDesc &&
                        <div className={styles.learnMore}>
                            <span className={styles.learnMoreBtn} onClick={() => setFullDesc(!fullDesc)}>{fullDesc ? 'Less' : 'Learn more about this item'}</span>
                        </div>
                    }
                </div>
            </div>
            { isCartModalOn && <CartModal imgSrc={data.images[0]} setIsCartModalOn={setIsCartModalOn} />}
        </>
        : <Placeholder />
    )
}

export default ItemPage
