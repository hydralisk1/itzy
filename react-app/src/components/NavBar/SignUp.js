import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { signUp } from '../../store/session'
import styles from './navbar.module.css'

const SignUp = ({ setIsModalOn }) => {
    const dispatch = useDispatch()

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [nameError, setNameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showError, setShowError] = useState(false)

    const emailField = useRef(null)
    const nameField = useRef(null)
    const passwordField = useRef(null)

    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true)

    const handleSubmit = e => {
        e.preventDefault()

        setShowError(true)

        if(!isSubmitDisabled) {
            dispatch(signUp(name, email, password))
                .then(res => {
                    if(!res) setIsModalOn(false)
                    else throw new Error()
                })
                .catch(() => {
                    setEmailError('Email is duplicated')
                })
        }
    }

    useEffect(() => {
        if(!email.length) setEmailError('Email can\'t be blank')
        else if(!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email)) setEmailError('Correct email format required')
        else setEmailError('')

        if(!password.length) setPasswordError('Password can\'t be blank')
        else setPasswordError('')

        if(!name.length) setNameError('Name can\'t be blank')
        else setNameError('')

        setIsSubmitDisabled(!email.length || !password.length || !name.length)
    }, [email, password, name])

    useEffect(() => {
        if(showError){
            emailField.current.className = emailError.length ? `${styles.inputContainer} ${styles.errorField}` : styles.inputContainer
            passwordField.current.className = passwordError.length ? `${styles.inputContainer} ${styles.errorField}` : styles.inputContainer
            nameField.current.className = nameError.length ? `${styles.inputContainer} ${styles.errorField}` : styles.inputContainer
        }
    }, [emailError, passwordError, nameError, showError])

    return (
        <>
            <form className={styles.signInForm} action='' onSubmit={handleSubmit}>
                <div className={styles.signUpTitle}>Create your account</div>
                <div className={styles.signUpNote}>Registration is easy</div>
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
                <div className={styles.inputTag}>Name</div>
                <div ref={nameField} className={styles.inputContainer}>
                    <input
                        className={styles.inputField}
                        name='name'
                        type='text'
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                </div>
                <div className={styles.errorMessage}>{showError && nameError}</div>
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
                    <button className={styles.formSubmitBtn} type='submit' disabled={isSubmitDisabled}>Register</button>
                </div>
            </form>
            <p className={styles.terms}>
                By clicking Register, you agree to Itzy's Terms of Use and Privacy Policy.
                Itzy may send you communications; you may change your preferences in your account settings.
                We'll never post without your permission.
            </p>
        </>
    )
}

export default SignUp
