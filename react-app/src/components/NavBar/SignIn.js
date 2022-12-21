import { useState, useEffect } from 'react'
import styles from './navbar.module.css'

const SignIn = ({ setIsSignUp }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [showError, setShowError] = useState(false)

    const handleSubmit = e => {
        e.preventDefault()
    }

    return (
        <>
            <form action='' onSubmit={handleSubmit}>
                <div>
                    <div>Sign in</div>
                    <div>Register</div>
                </div>
                <div>Email address</div>
                <div>
                    <input
                        type='text'
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <div>{showError && emailError}</div>
                <div>Password</div>
                <div>
                    <input
                        type='password'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div>{showError && passwordError}</div>
                <div><button type='submit'>Sign in</button></div>
            </form>
            <p>
                By clicking Sign in, you agree to Itzy's Terms of Use and Privacy Policy.
                Itzy may send you communications; you may change your preferences in your account settings.
                We'll never post without your permission.
            </p>
        </>
    )
}

export default SignIn
