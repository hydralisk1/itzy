import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { likeItem, removeLikeItem } from '../../store/session'
import Message from '../Message'
import Modal from '../NavBar/Modal'
import styles from './heart.module.css'

const Heart = ({ itemId }) => {
    const user = useSelector(state => state.session.user)
    const dispatch = useDispatch()
    const [heartStyle, setHeartStyle] = useState(styles.heart)
    const [isModalOn, setIsModalOn] = useState(false)
    const [isMessageOn, setIsMessageOn] = useState(false)

    useEffect(() => {
        const timeoutId = setTimeout(() => setHeartStyle(`${styles.heart} ${styles.appear}`), 0)

        return () => clearTimeout(timeoutId)
    }, [])

    const handleHeart = async () => {
        if(!user) setIsModalOn(true)
        else {
            const res = user.likes[itemId] ? dispatch(removeLikeItem(itemId)) : dispatch(likeItem(itemId))
            if(!res) {
                setIsMessageOn(false)
                setTimeout(() => setIsMessageOn(true), 0)
            }
        }
    }

    return (
        <>
            <div className={heartStyle} onClick={handleHeart}>
                {user.likes[itemId] ? <i style={{color: 'red'}} className="fa-solid fa-heart"></i> : <i className="fa-regular fa-heart"></i>}
            </div>
            {isModalOn && <Modal setIsModalOn={setIsModalOn} />}
            {isMessageOn && <Message setIsMessageOn={setIsMessageOn} isError={true} message='Something went wrong' />}
        </>
    )
}

export default Heart
