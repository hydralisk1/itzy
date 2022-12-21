import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/session'
import Modal from './Modal'
import styles from './navbar.module.css'

const Icons = () => {
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()

    const [isOnLike, setIsOnLike] = useState(false)
    const [isOnBell, setIsOnBell] = useState(false)
    const [isOnShop, setIsOnShop] = useState(false)
    const [isOnUser, setIsOnUser] = useState(false)
    const [isOnCart, setIsOnCart] = useState(false)

    const [isOpenAccount, setIsOpenAccount] = useState(false)

    const [isModalOn, setIsModalOn] = useState(false)

    useEffect(() => {
        if(isOpenAccount) setIsOnUser(false)
    }, [isOpenAccount])

    const handleLogout = () => {
        dispatch(logout())
    }

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
                onMouseEnter={() => {
                    if(!isOpenAccount)
                        setIsOnUser(true)
                }}
                onMouseLeave={() => setIsOnUser(false)}
                onClick={() => setIsOpenAccount(!isOpenAccount)}
                className={styles.icons}
            >
                {isOnUser && <div className={styles.bubble}>Your Account</div>}
                {isOpenAccount &&
                    <ul className={styles.accountMenuContainer}>
                        <li className={styles.accountMenu}>
                            <div className={styles.menuIcon}><i style={{color: '#808080', borderRadius: '50%', backgroundColor: '#c8c8c8', padding: '6px', width: '28px', height: '28px', textAlign: 'center'}} className="fa-solid fa-user"></i></div>
                            <div>
                                <div>{user.name}</div>
                                <div style={{width: '100%'}}>View your profile</div>
                            </div>
                        </li>
                        <li className={styles.accountMenu}>
                            <div className={styles.menuIcon}><i style={{fontSize: '16px'}} class="fa-solid fa-arrow-right-to-bracket"></i></div>
                            <div onClick={handleLogout}>Sign Out</div>
                        </li>
                    </ul>
                }
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
