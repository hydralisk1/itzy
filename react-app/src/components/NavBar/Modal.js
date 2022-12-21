import { useState, useEffect, useRef } from 'react'
import SignIn from './SignIn'
import SignUp from './SignUp'
import styles from './navbar.module.css'

const Modal = ({ setIsModalOn }) => {
    const [isSignUp, setIsSignUp] = useState(false)
    const modal = useRef(null)
    const formContainer = useRef(null)

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        setTimeout(() => {
            modal.current.className = `${styles.modalContainer} ${styles.modalContainerAppear}`
            formContainer.current.className = `${styles.formContainer} ${styles.formContainerAppear}`
        }, 0)

        return () => {document.body.style.overflow = ''}
    }, [])

    const closeModal = () => {
        modal.current.className = styles.modalContainer
        formContainer.current.className = styles.formContainer

        setTimeout(() => {
            setIsModalOn(false)
        }, 300)
    }

    return (
        <div ref={modal} className={styles.modalContainer} onMouseDown={closeModal}>
            <div ref={formContainer} className={styles.formContainer} onMouseDown={e => e.stopPropagation()}>
                {isSignUp ? <SignUp /> : <SignIn setIsSignUp={setIsSignUp} />}
            </div>
        </div>
    )
}

export default Modal
