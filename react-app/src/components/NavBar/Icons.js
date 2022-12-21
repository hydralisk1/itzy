import { useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from './Modal'
import styles from './navbar.module.css'

const Icons = () => {
    const user = useSelector(state => state.session.user)

    const [isOnLike, setIsOnLike] = useState(false)
    const [isOnBell, setIsOnBell] = useState(false)
    const [isOnShop, setIsOnShop] = useState(false)
    const [isOnUser, setIsOnUser] = useState(false)
    const [isOnCart, setIsOnCart] = useState(false)

    const [isModalOn, setIsModalOn] = useState(false)

    return (
        <div className={styles.rightIcons}>
            {isModalOn && <Modal setIsModalOn={setIsModalOn} />}
            {!!user ? <>
            <div
                onMouseEnter={() => setIsOnLike(true)}
                onMouseLeave={() => setIsOnLike(false)}
                className={styles.icons}
            >
                {isOnLike && <div className={styles.bubble}>Favorites</div>}
                <i className="fa-regular fa-heart"></i>
            </div>
            <div
                onMouseEnter={() => setIsOnBell(true)}
                onMouseLeave={() => setIsOnBell(false)}
                className={styles.icons}
            >
                {isOnBell && <div className={styles.bubble}>Updates</div>}
                <i className="fa-regular fa-bell"></i>
                <i style={{color: '#c8c8c8', fontSize: '16px', marginLeft: '8px'}} className="fa-solid fa-caret-down"></i>
            </div>
            <div
                onMouseEnter={() => setIsOnShop(true)}
                onMouseLeave={() => setIsOnShop(false)}
                className={styles.icons}
            >
                {isOnShop && <div className={styles.bubble}>Shop Manager</div>}
                <i className="fa-solid fa-shop"></i>
            </div>
            <div
                onMouseEnter={() => setIsOnUser(true)}
                onMouseLeave={() => setIsOnUser(false)}
                className={styles.icons}
            >
                {isOnUser && <div className={styles.bubble}>Your Account</div>}
                <i style={{color: '#808080', borderRadius: '50%', backgroundColor: '#c8c8c8', padding: '6px', width: '28px', height: '28px', textAlign: 'center'}} className="fa-solid fa-user"></i>
                <i style={{color: '#c8c8c8', fontSize: '16px', marginLeft: '8px'}} className="fa-solid fa-caret-down"></i>
            </div></>:
            <div
                className={styles.signInBtn}
                onClick={() => setIsModalOn(true)}
            >
                Sign in
            </div>
            }
            <div
                onMouseEnter={() => setIsOnCart(true)}
                onMouseLeave={() => setIsOnCart(false)}
                className={styles.icons}
            >
                {isOnCart && <div className={styles.bubble}>Cart</div>}
                <i className="fa-solid fa-cart-shopping"></i>
            </div>
        </div>
    )
}

export default Icons
// style={{backgroundColor: '#c8c8c8', borderRadius: '50%', fontSize: '16px', padding: '1rem', width: '16px', height: '16px', color: '#808080', display: 'flex', alignItem: 'center', justifyContent: 'center'}}
