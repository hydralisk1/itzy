import { useState, useEffect, Children, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { removeItems, modifyItems } from '../../store/cart'
import Placeholder from '../Placeholder'
import Modal from '../NavBar/Modal'
import styles from './cart.module.css'

const CartPage = () => {
    const cartItems = useSelector(state => state.cart)
    const user = useSelector(state => state.session.user)

    const dispatch = useDispatch()
    const history = useHistory()

    const [totalPrice, setTotalPrice] = useState(0)
    const [data, setData] = useState([])
    const [paymentMethod, setPaymentMethod] = useState('cc')
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState()

    const [isModalOn, setIsModalOn] = useState(false)

    useEffect(() => {
        const itemIds = Object.keys(cartItems)
        if(itemIds.length){
            const method = 'POST'
            const headers = {'Content-type':'application/json'}
            const body = JSON.stringify({itemIds})

            const options = {
                method,
                headers,
                body
            }

            fetch('/api/items/get', options)
                .then(res => {
                    if(res.ok) return res.json()
                    throw new Error()
                })
                .then(res => {
                    const handledData = {}

                    Object.values(res).forEach(d => {
                        const cartData = {
                            id: d.id,
                            name: d.name,
                            stock: d.stock,
                            price: d.price,
                            image: d.image,
                            qty: cartItems[d.id] <= d.stock ? cartItems[d.id] : d.stock
                        }

                        if(handledData[d.shop_name])
                            handledData[d.shop_name].push(cartData)
                        else handledData[d.shop_name] = [cartData]
                    })

                    setData(handledData)
                    setTotalPrice(Object.values(handledData).reduce((p, c) => p + c.reduce((p, c) => p + c.price * c.qty, 0), 0))
                })
                .catch(() => setIsError(true))
                .finally(() => setIsLoaded(true))
        }
    }, [cartItems])

    const removeItem = async (itemId) => {
        await dispatch(removeItems([itemId], !!user))
    }

    const modifyItem = async (itemId, qty) => {
        const item = {}
        item[itemId] = qty * 1
        await dispatch(modifyItems(item, !!user))
    }

    const purchaseProtection = () => {
        return (
            <div className={styles.protection}>
                <span><i  style={{ fontSize: '40px', color: 'rgb(83, 106, 192)'}} className="fa-regular fa-handshake"></i></span>
                <span style={{ fontWeight: 600, margin: '0 8px' }}>Itzy Purchase Protection:</span> Shop confidently on Itzy knowing if something goes wrong with an order, we've got your back.
            </div>
        )
    }

    const carbonEmissions = () => {
        return (
            <div className={styles.carbonEmissions}>
                <span style={{ marginRight: '1rem'}}><i className="fa-solid fa-leaf"></i></span>
                <span>Itzy offsets carbon emissions from every delivery</span>
            </div>
        )
    }

    const checkout = () => {
        if(!user) setIsModalOn(true)
        else{
            const purchaseItems = {}
            Object.keys(data).forEach(shopName => {
                const items = data[shopName].filter(item => item.qty > 0)
                if(items.length) purchaseItems[shopName] = items
            })
            sessionStorage.setItem('purchaseItems', JSON.stringify(purchaseItems))
            history.push('/purchase')
        }
    }

    return (
        !Object.keys(cartItems).length ?
        <div className={styles.cartContainer}>
            {purchaseProtection()}
            <div className={styles.cartEmpty + ' ' + styles.inYourCart}>Your cart is empty.</div>
            {carbonEmissions()}
        </div> : isLoaded ? isError ? <div>Something went worng. Please try again</div> :
        <div className={styles.cartContainer}>
            <div className={styles.topLine}>
                <div className={styles.inYourCart}>{Object.keys(cartItems).length} items in your cart</div>
                <div className={styles.keepShoppingBtn} onClick={() => {history.push('/')}}>Keep shopping</div>
            </div>
            {purchaseProtection()}
            <div className={styles.mainContainer}>
                <div>
                    {
                        Object.keys(data).map(shopName => (
                            <Fragment key={shopName + shopName} >
                            <div className={styles.shopName} key={shopName}>{shopName}</div>
                            {
                                Children.toArray(
                                    data[shopName].map(d => (
                                        <div style={{marginBottom: '1rem', borderBottom: '1px solid #ececec', paddingBottom: '1rem'}}>
                                            <div className={styles.cartItemContainer}>
                                                <div className={styles.cartImgContainer}><img className={styles.cartImg} src={d.image} alt={d.name} /></div>
                                                <div className={styles.cartItemNameContainer}>
                                                    <div className={styles.cartItemName}>{d.name}</div>
                                                    <div className={styles.removeBtn} onClick={() => removeItem(d.id)}>Remove</div>
                                                </div>
                                                <div className={styles.qtyPrice}>
                                                {d.stock > 0 ? <>
                                                    <div>
                                                        <select
                                                            defaultValue={d.qty}
                                                            onChange={e => modifyItem(d.id, e.target.value)}
                                                            style={{fontSize: '20px', padding: '0.5rem'}}
                                                        >
                                                            {
                                                                Array
                                                                    .from({length: d.stock}, (_, i) => i+1)
                                                                    .map(qty => <option value={qty} key={qty}>{qty}</option>)
                                                            }
                                                        </select>
                                                    </div>
                                                    <div style={{width: '60%'}}>
                                                        <div style={{fontWeight: 600, textAlign: 'right'}}>$ {(d.price * d.qty).toFixed(2)}</div>
                                                        <div style={{color: 'rgba(0, 0, 0, 0.5)', textAlign: 'right'}}>{d.qty >= 2 && <span style={{fontSize: '15px'}}>($ {d.price.toFixed(2)} each)</span>}</div>
                                                    </div></> : 'Out of Stock'}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )
                            }
                            </Fragment>
                        ))
                    }
                </div>
                <div>
                    <div className={styles.payment}>
                        <div className={styles.paymentTopLine}>
                            How you'll pay
                        </div>
                        <ul className={styles.paymentMethod}>
                            <li className={styles.options}>
                                <div className={styles.radioBtn}>
                                    <input
                                        id='cc'
                                        name='payment'
                                        type='radio'
                                        value='cc'
                                        style={{ width: '32px', height: '32px' }}
                                        onChange={e => setPaymentMethod(e.target.value)}
                                        checked={paymentMethod === 'cc'}
                                    />
                                </div>
                                <label htmlFor='cc'>
                                    <span className={styles.cards}><i style={{ fontSize: '2rem' }} className="fa-brands fa-cc-visa"></i></span>
                                    <span className={styles.cards}><i style={{ fontSize: '2rem' }} className="fa-brands fa-cc-mastercard"></i></span>
                                    <span className={styles.cards}><i style={{ fontSize: '2rem' }} className="fa-brands fa-cc-discover"></i></span>
                                    <span className={styles.cards}><i style={{ fontSize: '2rem' }} className="fa-brands fa-cc-amex"></i></span>
                                </label>
                            </li>
                            <li className={styles.options}>
                                <div className={styles.radioBtn}>
                                    <input
                                        id='paypal'
                                        name='payment'
                                        type='radio'
                                        value='paypal'
                                        style={{ width: '32px', height: '32px' }}
                                        disabled
                                    />
                                </div>
                                <label htmlFor='paypal'>
                                    <span className={styles.cards}><i style={{ fontSize: '2rem' }} className="fa-brands fa-cc-paypal"></i></span>
                                </label>
                            </li>
                            <li className={styles.options}>
                                <div className={styles.radioBtn}>
                                    <input
                                        id='apple-pay'
                                        name='payment'
                                        type='radio'
                                        value='paypal'
                                        style={{ width: '32px', height: '32px' }}
                                        disabled
                                    />
                                </div>
                                <label htmlFor='apple-pay'>
                                    <span className={styles.cards}><i style={{ fontSize: '2rem' }} className="fa-brands fa-cc-apple-pay"></i></span>
                                </label>
                            </li>
                        </ul>
                        <div className={styles.total}>
                            <div style={{fontWeight: 600, letterSpacing: '0.5px'}}>Item(s) total</div>
                            <div style={{fontWeight: 600, letterSpacing: '0.5px', fontSize: '20px'}}>${totalPrice.toFixed(2)}</div>
                        </div>
                        <button className={styles.checkoutBtn} disabled={totalPrice === 0} onClick={checkout}>Proceed to checkout</button>
                        {isModalOn && <Modal setIsModalOn={setIsModalOn} />}
                    </div>
                    <div className={styles.donation}>
                        <div className={styles.donationDesc}>
                            The Joonil Fund supports nonprofits that provide resources to creative entrepreneurs in communities that need it most.
                            You can donate your change at Checkout.
                        </div>
                        <div className={styles.donationIcon}>
                            <i style={{ fontSize: '3rem'}} className="fa-solid fa-shield-heart"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div> : <Placeholder />
    )
}

export default CartPage
