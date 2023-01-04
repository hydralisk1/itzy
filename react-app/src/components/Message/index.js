import { useEffect, useRef } from 'react'
import styles from './message.module.css'

const Message = ({setIsMessageOn, isError=false, message='everything is working'}) => {
    const messageContainer = useRef(null)
    const icon = isError ? <i style={{color: 'red', marginRight: '1rem'}} className="fa-solid fa-circle-xmark"></i> : <i style={{color: 'green', marginRight: '1rem'}} className="fa-solid fa-circle-check"></i>

    useEffect(() => {
        let timeoutId

        setTimeout(() => {
            messageContainer.current.className = styles.message + ' ' + styles.messageOn
            timeoutId = setTimeout(() => {
                if(messageContainer.current) messageContainer.current.className = styles.message
                setTimeout(() => {setIsMessageOn(false)}, 1000)
            }, 5000)
        }, 0)

        return () => {clearTimeout(timeoutId)}
    }, [])

    return (
        <div ref={messageContainer} className={styles.message}>
            <div>{icon}{message}</div>
            <div className={styles.closeBtn} onClick={() => setIsMessageOn(false)}>
                    <i className="fa-solid fa-xmark"></i>
            </div>
        </div>
    )

}

export default Message
