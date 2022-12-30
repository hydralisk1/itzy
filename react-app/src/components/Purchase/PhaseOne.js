import { useState, useEffect } from 'react'
import styles from './purchase.module.css'

const PhaseOne = ({
    phase, fullName, stAddr, otherAddr, zipCode, city, state,
    setPhase, setFullName, setStAddr, setOtherAddr, setZipCode, setCity, setState
}) => {
    // errors for validation
    const [fullNameErr, setFullNameErr] = useState('')
    const [stAddrErr, setStAddrErr] = useState('')
    const [zipCodeErr, setZipCodeErr] = useState('')
    const [cityErr, setCityErr] = useState('')
    const [stateErr, setStateErr] = useState('')

    const [showError, setShowError] = useState(false)

    const STATES = {
        AK: 'Alaska',
        AL: 'Alabama',
        AR: 'Arkansas',
        AZ: 'Arizona',
        CA: 'California',
        CO: 'Colorado',
        CT: 'Connecticut',
        DE: 'Delaware',
        FL: 'Florida',
        GA: 'Georgia',
        HI: 'Hawaii',
        IA: 'Iowa',
        ID: 'Idaho',
        IL: 'Illinois',
        IN: 'Indiana',
        KS: 'Kansas',
        KY: 'Kentucky',
        LA: 'Louisiana',
        MA: 'Massachusetts',
        MD: 'Maryland',
        ME: 'Maine',
        MI: 'Michigan',
        MN: 'Minnesota',
        MO: 'Missouri',
        MT: 'Montana',
        NC: 'North Carolina',
        ND: 'North Dakota',
        NE: 'Nebraska',
        NH: 'New Hampshire',
        NJ: 'New Jersey',
        NM: 'New Mexico',
        NV: 'Nevada',
        NY: 'New York',
        OH: 'Ohio',
        OK: 'Oklahoma',
        OR: 'Oregon',
        PA: 'Pennsylvania',
        RI: 'Rhode Island',
        SC: 'South Carolina',
        SD: 'South Dakota',
        TN: 'Tennessee',
        TX: 'Texas',
        UT: 'Utah',
        VA: 'Virginia',
        VT: 'Vermont',
        VI: 'Virgin Islands',
        WA: 'Washington',
        WI: 'Wisconsin',
        WV: 'West Virginia',
        WY: 'Wyoming',
    }

    useEffect(() => {
        if(!fullName.length) setFullNameErr('Full Name is required')
        else setFullNameErr('')

        if(!stAddr.length) setStAddrErr('Street Address is required')
        else setStAddrErr('')

        if(zipCode.length !== 5) setZipCodeErr('Valid Zip code is required')
        else setZipCodeErr('')

        if(!city.length) setCityErr('City is required')
        else setCityErr('')

        if(!state.length) setStateErr('State is required')
        else setStateErr('')

    }, [fullName, stAddr, otherAddr, zipCode, city, state])

    const handleSubmit = e => {
        e.preventDefault()

        setShowError(true)

        if(!fullNameErr.length && !stAddrErr.length && !zipCodeErr.length && !cityErr.length && !stateErr.length){
            const info = JSON.parse(sessionStorage.getItem('PurchaseInfo'))

            info.fullName = fullName
            info.stAddr = stAddr
            info.otherAddr = otherAddr
            info.zipCode = zipCode
            info.city = city
            info.state = state
            info.phase = phase + 1

            sessionStorage.setItem('PurchaseInfo', JSON.stringify(info))
            setPhase(phase + 1)
        }
    }

    const handleZipCode = e => {
        if(!isNaN(e.target.value) && e.target.value.length <= 5) setZipCode(e.target.value.replace(' ', ''))
    }

    return (
        <form
            action=''
            onSubmit={handleSubmit}
            className={styles.addressForm}
        >
            <div className={styles.formTitle}>Enter your shipping address</div>
            <div className={styles.fieldLine}>
                <div><label className={styles.fieldLabel} htmlFor='fullName'>Full Name <span className={styles.required}>*</span></label></div>
                <div className={!!fullNameErr.length && showError ? `${styles.inputFieldContainer} ${styles.errorField}` : styles.inputFieldContainer}>
                    <input
                        id='fullName'
                        className={styles.inputField}
                        type='text'
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                    />
                </div>
                <div className={styles.errorMsg}>{showError && fullNameErr}</div>
            </div>
            <div className={styles.fieldHalfHalf}>
                <div>
                    <div><label className={styles.fieldLabel} htmlFor='zipCode'>Zip code <span className={styles.required}>*</span></label></div>
                    <div className={!!zipCodeErr.length && showError ? `${styles.inputFieldContainer} ${styles.errorField}` : styles.inputFieldContainer}>
                        <input
                            id='zipCode'
                            className={styles.inputField}
                            type='text'
                            value={zipCode}
                            onChange={handleZipCode}
                        />
                    </div>
                    <div className={styles.errorMsg}>{showError && zipCodeErr}</div>
                </div>
                <div>
                    <div><label className={styles.fieldLabel} htmlFor='city'>City <span className={styles.required}>*</span></label></div>
                    <div className={!!cityErr.length && showError ? `${styles.inputFieldContainer} ${styles.errorField}` : styles.inputFieldContainer}>
                        <input
                            id='city'
                            className={styles.inputField}
                            type='text'
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        />
                    </div>
                    <div className={styles.errorMsg}>{showError && cityErr}</div>
                </div>
            </div>
            <div className={styles.fieldLine}>
                <div><label className={styles.fieldLabel} htmlFor='stAddr'>Street address <span className={styles.required}>*</span></label></div>
                <div className={!!stAddrErr.length && showError ? `${styles.inputFieldContainer} ${styles.errorField}` : styles.inputFieldContainer}>
                    <input
                        id='stAddr'
                        className={styles.inputField}
                        type='text'
                        value={stAddr}
                        onChange={e => setStAddr(e.target.value)}
                    />
                </div>
                <div className={styles.errorMsg}>{showError && stAddrErr}</div>
            </div>
            <div className={styles.fieldLine}>
                <div><label className={styles.fieldLabel} htmlFor='otherAddr'>Apt / Suite / Other <span className={styles.optional}>(optional)</span></label></div>
                <div className={styles.inputFieldContainer} style={{marginBottom: '20px'}}>
                    <input
                        id='otherAddr'
                        className={styles.inputField}
                        type='text'
                        value={otherAddr}
                        onChange={e => setOtherAddr(e.target.value)}
                    />
                </div>
            </div>
            <div className={styles.fieldLine}>
                <div><label className={styles.fieldLabel} htmlFor='state'>State <span className={styles.required}>*</span></label></div>
                <select
                    className={!!stateErr.length && showError ? `${styles.customSelect} ${styles.errorField}` : styles.customSelect}
                    value={state}
                    defaultValue={state}
                    onChange={e => setState(e.target.value)}
                >
                    <option value='' disabled>Select state</option>
                    {Object.keys(STATES).map(key =>
                        <option value={key} key={key}>{STATES[key]}</option>
                    )}
                </select>
                <div className={styles.errorMsg}>{showError && stateErr}</div>
            </div>
            <button className={styles.submitBtn} type='submit'>Continue to payment</button>
        </form>
    )
}

export default PhaseOne
