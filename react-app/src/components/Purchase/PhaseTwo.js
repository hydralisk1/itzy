import { useState, useEffect } from 'react'
import styles from './purchase.module.css'

const PhaseTwo = ({
    phase, nameOnCard, cardNum,
    setPhase, setNameOnCard, setCardNum
}) => {
    const [expMonth, setExpMonth] = useState(1)
    const [expYear, setExpYear] = useState(new Date().getFullYear())
    const [cvv, setCvv] = useState('')

    const [nameErr, setNameErr] = useState('')
    const [cardNumErr, setCardNumErr] = useState('')
    const [cvvErr, setCvvErr] = useState('')
    const [expErr, setExpErr] = useState('')

    const [showErr, setShowErr] = useState(false)

    const handleSubmit = e => {
        e.preventDefault()

        setShowErr(true)

        if(!nameErr.length && !cardNumErr.length && !cvvErr.length && !expErr.length){
            const info = JSON.parse(sessionStorage.getItem('PurchaseInfo'))

            info.nameOnCard = nameOnCard
            info.cardNum = cardNum
            info.phase = phase + 1

            sessionStorage.setItem('PurchaseInfo', JSON.stringify(info))

            setPhase(phase + 1)
        }
    }

    const handleCardNum = e => {
        if(!isNaN(e.target.value)) setCardNum(e.target.value.replace(' ', ''))
    }

    const handleCVV = e => {
        if(!isNaN(e.target.value)) setCvv(e.target.value.replace(' ', ''))
    }

    useEffect(() => {
        if(!nameOnCard.length) setNameErr('Name on card is required')
        else setNameErr('')

        if(!cardNum.length) setCardNumErr('Card number is required')
        else setCardNumErr('')

        if(!cvv.length) setCvvErr('CVV code is required')
        else setCvvErr('')

        const expDate = new Date(expYear, expMonth, 1)
        const today = new Date()

        if(expDate.getTime() < today.getTime()) setExpErr('This card has expired')
        else setExpErr('')
    }, [nameOnCard, cardNum, cvv, expMonth, expYear])

    return (
        <form
            action=''
            onSubmit={handleSubmit}
            className={styles.addressForm}
        >
            <div className={styles.formTitle} style={{marginBottom: '4px'}}>Enter your CC information</div>
            <div style={{marginBottom: '2rem'}}>You will not be charged until you review this order on the next page.</div>
            <div className={styles.fieldLine}>
                <div><label className={styles.fieldLabel} htmlFor='nameOnCard'>Name on card <span className={styles.required}>*</span></label></div>
                <div style={{margin: '4px 0', color:'rgb(0, 0, 0, 0.5)'}}>Make sure to enter the full name that's on your card.</div>
                <div className={!!nameErr.length && showErr ? `${styles.inputFieldContainer} ${styles.errorField}` : styles.inputFieldContainer}>
                    <input
                        id='nameOnCard'
                        className={styles.inputField}
                        type='text'
                        value={nameOnCard}
                        onChange={e => setNameOnCard(e.target.value)}
                    />
                </div>
                <div className={styles.errorMsg}>{showErr && nameErr}</div>
            </div>
            <div className={styles.fieldLine}>
                <div><label className={styles.fieldLabel} htmlFor='cardNum'>Card number <span className={styles.required}>*</span></label></div>
                <div className={!!cardNumErr.length && showErr ? `${styles.inputFieldContainer} ${styles.errorField}` : styles.inputFieldContainer}>
                    <input
                        id='cardNum'
                        className={styles.inputField}
                        type='text'
                        value={cardNum}
                        onChange={handleCardNum}
                    />
                </div>
                <div className={styles.errorMsg}>{showErr && cardNumErr}</div>
            </div>
            <div className={styles.fieldHalfHalf}>
                <div>
                    <div><label className={styles.fieldLabel} htmlFor='expMonth'>Expiration date <span className={styles.required}>*</span></label></div>
                    <div className={styles.expContainer}>
                        <select
                            className={!!expErr.length && showErr ? `${styles.customSelect} ${styles.errorField}` : styles.customSelect}
                            defaultValue={1}
                            style={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}
                            onChange={e => setExpMonth(e.target.value)}
                        >
                            {Array.from({length: 12}, (_, i) => i+1).map(m => <option value={m} key={m}>{m}</option>)}
                        </select>
                        <select
                            className={!!expErr.length && showErr ? `${styles.customSelect} ${styles.errorField}` : styles.customSelect}
                            defaultValue={new Date().getFullYear()}
                            style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
                            onChange={e => setExpYear(e.target.value)}
                        >
                            {Array.from({length: 21}, (_, i) => i + new Date().getFullYear()).map(y => <option value={y} key={y}>{y}</option>)}
                        </select>
                    </div>
                    <div className={styles.errorMsg}>{showErr && expErr}</div>
                </div>
                <div>
                    <div><label className={styles.fieldLabel} htmlFor='CVV'>CVV code <span className={styles.required}>*</span></label></div>
                    <div className={!!cardNumErr.length && showErr ? `${styles.inputFieldContainer} ${styles.errorField}` : styles.inputFieldContainer}>
                    <input
                        id='CVV'
                        className={styles.inputField}
                        type='password'
                        value={cvv}
                        onChange={handleCVV}
                    />
                    </div>
                    <div className={styles.errorMsg}>{showErr && cvvErr}</div>
                </div>
            </div>
            <button className={styles.submitBtn} type='submit'>Review your order</button>
        </form>
    )
}

export default PhaseTwo
