import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../../store/session'
import styles from './navbar.module.css'

const SignIn = ({ setIsSignUp, setIsModalOn }) => {
    const dispatch = useDispatch()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showError, setShowError] = useState(false)

    const emailField = useRef(null)
    const passwordField = useRef(null)

    const handleSubmit = e => {
        e.preventDefault()

        setShowError(true)

        if(!emailError.length && !passwordError.length) {
            dispatch(login(email, password))
                .then(res => {
                    if(!res){
                        setEmailError('Invalid credential')
                        setPasswordError('Invalid credential')
                    }else setIsModalOn(false)
                })
        }
    }

    const demoUserLogin = () => {
        dispatch(login('demo@aa.io', 'password'))
            .then(res => {
                if(!res) setIsModalOn(false)
            })
    }

    useEffect(() => {
        if(!email.length) setEmailError('Email can\'t be blank')
        else if(!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email)) setEmailError('Correct email format required')
        else setEmailError('')

        if(!password.length) setPasswordError('Password can\'t be blank')
        else setPasswordError('')
    }, [email, password])

    useEffect(() => {
        if(showError){
            emailField.current.className = emailError.length ? `${styles.inputContainer} ${styles.errorField}` : styles.inputContainer
            passwordField.current.className = passwordError.length ? `${styles.inputContainer} ${styles.errorField}` : styles.inputContainer
        }
    }, [emailError, passwordError, showError])

    return (
        <>
            <form className={styles.signInForm} action='' onSubmit={handleSubmit}>
                <div className={styles.signInTitle}>
                    <div style={{fontSize: '1.5rem'}}>Sign in</div>
                    <div className={styles.registerBtn} onClick={() => setIsSignUp(true)}>Register</div>
                </div>
                <div className={styles.inputTag}>Email address</div>
                <div ref={emailField} className={styles.inputContainer}>
                    <input
                        className={styles.inputField}
                        name='email'
                        type='email'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.errorMessage}>{showError && emailError}</div>
                <div className={styles.inputTag}>Password</div>
                <div ref={passwordField} className={styles.inputContainer}>
                    <input
                        className={styles.inputField}
                        name='password'
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className={styles.errorMessage}>{showError && passwordError}</div>
                <div className={styles.submitBtnContainer}>
                    <button className={styles.formSubmitBtn} type='submit'>Sign in</button>
                </div>
                <div className={styles.submitBtnContainer}>
                    <button className={styles.formSubmitBtn} onClick={demoUserLogin}>Demo User Login</button>
                </div>
            </form>
            <p className={styles.terms}>
                By clicking Sign in, you agree to Itzy's Terms of Use and Privacy Policy.
                Itzy may send you communications; you may change your preferences in your account settings.
                We'll never post without your permission.
            </p>
        </>
    )
}

export default SignIn
