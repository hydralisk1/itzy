import { useEffect, useState, Fragment, Children } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { removeItems } from '../../store/cart'
import Placeholder from '../Placeholder'
import styles from './purchase.module.css'
import cartStyles from '../CartPage/cart.module.css'

const PhaseThree = ({setPhase, cardNum, nameOnCard, fullName, address}) => {
    const dispatch = useDispatch()
    const history = useHistory()

    // const user = useSelector(state => state.session.user)
    const cart = useSelector(state => state.cart)

    const [totalPrice, setTotalPrice] = useState(0)

    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)
    const [items, setItems] = useState()

    useEffect(() => {
        const purchaseItems = JSON.parse(sessionStorage.getItem('purchaseItems'))
        if(purchaseItems){
            setItems(purchaseItems)
            setTotalPrice(Object.keys(purchaseItems).reduce((p, c) => p + purchaseItems[c].reduce((p, c) => p + c.price * c.qty, 0), 0))
            setIsLoaded(true)
        }else{
            const itemIds = Object.keys(cart)

            const method = 'POST'
            const headers = {'Content-Type': 'application/json'}

            const options = {
                method,
                headers,
                body: JSON.stringify({itemIds})
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
                            if: d.id,
                            name: d.name,
                            price: d.price,
                            image: d.image,
                            qty: cart[d.id] <= d.stock ? cart[d.id] : d.stock
                        }

                        if(handledData[d.shop_name]) handledData[d.shop_name].push(cartData)
                        else handledData[d.shop_name] = [cartData]
                    })

                    setItems(handledData)
                    setTotalPrice(Object.values(handledData).reduce((p, c) => p + c.reduce((p, c) => p + c.price * c.qty, 0), 0))
                })
                .catch(() => {setIsError(true)})
                .finally(() => {setIsLoaded(true)})
        }
    }, [cart])

    const handleCheckout = () => {
        const method = 'POST'
        const headers = {'Content-type': 'application/json'}
        const orderItems = Object.values(items).reduce((p, c) => [...p, ...c], [])
        const body = JSON.stringify({items: orderItems, address})

        const options = {
            method,
            headers,
            body,
        }

        fetch('/api/orders/', options)
            .then(async res => {
                if(res.ok) {
                    await dispatch(removeItems(orderItems.map(item => item.id), true))
                    history.push('/')
                }
                else throw new Error()
            })
            .catch()

    }

    return (
        isLoaded ? isError ? <div>Something went wrong</div> :
        <div className={styles.addressForm}>
            <div className={styles.formTitle}>Review your order</div>
            <div className={cartStyles.shopName}>Shipping Address</div>
            <div style={{fontSize: '20px', marginBottom: '1rem'}}>{fullName} - {address}</div>
            <div className={cartStyles.shopName}>Credit Card Information</div>
            <div style={{fontSize: '20px', marginBottom: '1rem'}}>{nameOnCard} - {cardNum}</div>
            <div>
                    {
                        Object.keys(items).map(shopName => (
                            <Fragment key={shopName + shopName} >
                            <div className={cartStyles.shopName} key={shopName}>{shopName}</div>
                            {
                                Children.toArray(
                                    items[shopName].map(d => (
                                        <div style={{marginBottom: '1rem', borderBottom: '1px solid #ececec', paddingBottom: '1rem'}}>
                                            <div className={cartStyles.cartItemContainer}>
                                                <div className={cartStyles.cartImgContainer}><img className={cartStyles.cartImg} src={d.image} alt={d.name} /></div>
                                                <div className={cartStyles.cartItemNameContainer}>
                                                    <div className={cartStyles.cartItemName}>{d.name}</div>
                                                </div>
                                                <div className={cartStyles.qtyPrice}>
                                                    <div>
                                                        {d.qty}
                                                    </div>
                                                    <div style={{width: '60%'}}>
                                                        <div style={{fontWeight: 600, textAlign: 'right'}}>$ {(d.price * d.qty).toFixed(2)}</div>
                                                        <div style={{color: 'rgba(0, 0, 0, 0.5)', textAlign: 'right'}}>{d.qty >= 2 && <span style={{fontSize: '15px'}}>($ {d.price.toFixed(2)} each)</span>}</div>
                                                    </div>
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
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div className={cartStyles.shopName}>Total</div>
                    <div className={cartStyles.shopName}>$ {totalPrice.toFixed(2)}</div>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div
                        style={{fontWeight: 600, letterSpacing: '0.5px', width: '48%'}}
                        className={cartStyles.checkoutBtn}
                        onClick={() => setPhase(1)}
                    >Modify address & card information</div>
                    <div
                        style={{fontWeight: 600, letterSpacing: '0.5px', width: '48%'}}
                        className={cartStyles.checkoutBtn}
                        onClick={handleCheckout}
                    >Place order</div>
                </div>
        </div>
        : <Placeholder />
    )
}

export default PhaseThree
