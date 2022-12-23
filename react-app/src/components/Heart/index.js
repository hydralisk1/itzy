import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Modal from '../NavBar/Modal'
import styles from './heart.module.css'

const Heart = ({ itemId }) => {
    const user = useSelector(state => state.session.user)
    const [heartStyle, setHeartStyle] = useState(styles.heart)
    const [isModalOn, setIsModalOn] = useState(false)

    useEffect(() => {
        setTimeout(() => setHeartStyle(`${styles.heart} ${styles.appear}`), 0)
    }, [])

    const handleHeart = () => {
        if(!user) setIsModalOn(true)
    }

    return (
        <>
            <div className={heartStyle} onClick={handleHeart}>
                <i className="fa-regular fa-heart"></i>
            </div>
            {isModalOn && <Modal setIsModalOn={setIsModalOn} />}
        </>
    )
}

export default Heart
