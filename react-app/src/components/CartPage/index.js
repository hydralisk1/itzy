import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './cart.module.css'

const CartPage = () => {
    const cartItems = useSelector(state => state.cart)

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

    return (
        !Object.keys(cartItems).length ?
        <div className={styles.cartContainer}>
            {purchaseProtection()}
            <div className={styles.cartEmpty + ' ' + styles.inYourCart}>Your cart is empty.</div>
            {carbonEmissions()}
        </div>:
        <div className={styles.cartContainer}>
            <div className={styles.topLine}>
                <div className={styles.inYourCart}>{Object.keys(cartItems).length} items in your cart</div>
                <div className={styles.keepShoppingBtn}>Keep shopping</div>
            </div>
            {purchaseProtection()}
            <div className={styles.mainContainer}>
                <div style={{border: '1px solid black', height: '400px'}}>a</div>
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
                                        checked
                                    />
                                </div>
                                <label for='cc'>
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
                                <label for='paypal'>
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
                                <label for='apple-pay'>
                                    <span className={styles.cards}><i style={{ fontSize: '2rem' }} className="fa-brands fa-cc-apple-pay"></i></span>
                                </label>
                            </li>
                        </ul>
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
        </div>
    )
}

export default CartPage
