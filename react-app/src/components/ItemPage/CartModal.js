import { useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import styles from './item.module.css'

const CartModal = ({ imgSrc, setIsCartModalOn }) => {
    const modal = useRef(null)
    const cart = useRef(null)
    const history = useHistory()

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        setTimeout(() => {
            modal.current.className = styles.modalContainer + ' ' + styles.modalContainerAppear
            cart.current.className = styles.cartModal + ' ' + styles.cartModalAppear
        }, 0)
    }, [])

    const closeModal = () => {
        modal.current.className = styles.modalContainer
        cart.current.className = styles.cartModal
        setTimeout(() => setIsCartModalOn(false), 1000)
    }

    return (
        <div ref={modal} className={styles.modalContainer} onMouseDown={closeModal}>
            <div ref={cart} className={styles.cartModal} onMouseDown={e => e.stopPropagation()}>
                <div className={styles.info}>
                    <div className={styles.imgHolder}>
                        <div className={styles.checkMark}><i style={{fontSize: '21px'}} className="fa-solid fa-circle-check"></i></div>
                        <img className={styles.cartImg} src={imgSrc} alt='product' />
                    </div>
                    <div className={styles.cartMessage}>1 item added to cart</div>
                </div>
                <div style={{marginBottom: '1rem'}} className={styles.addBtn} onClick={() => history.push('/cart')}>View cart & check out</div>
                <div className={styles.keepShoppingBtn} onClick={closeModal}>Keep shopping <i style={{marginLeft: '8px', width: '16px', height:'16px', paddingTop: '2px'}} className="fa-solid fa-arrow-right"></i></div>
            </div>
        </div>
    )

}

export default CartModal
