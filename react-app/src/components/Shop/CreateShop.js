import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createShop } from '../../store/session'

import styles from './shop.module.css'
import orderStyles from '../Purchase/purchase.module.css'

const CreateShop = () => {
    const dispatch = useDispatch()

    const [name, setName] = useState('')
    const [lengthError, setLengthError] = useState(false)
    const [letterError, setLetterError] = useState(false)
    const [isDuplicate, setIsDuplicate] = useState(false)

    const handleName = e => {
        if(e.target.value.length <= 20 && /^[a-zA-Z0-9]*$/.test(e.target.value)) setName(e.target.value)
    }

    const handleSubmit = () => {
        if(!lengthError && !letterError) {
            dispatch(createShop(name))
                .then(res => {if(res === 'duplicate') setIsDuplicate(true)})
        }
    }

    useEffect(() => {
        setLengthError(name.length < 4)
        setLetterError(!(/^[a-zA-Z0-9]+$/.test(name)))

        setIsDuplicate(false)
    }, [name])

    return (<>
        <div style={{minHeight: '400px'}} className={orderStyles.contentContainer}>
            <div className={orderStyles.addressForm}>
                <div className={orderStyles.formTitle}>Name your shop</div>
                <p className={styles.explain}>
                    Don’t sweat it! You can just draft a name now and change it later.
                    We find sellers often draw inspiration from what they sell, their style,
                    pretty much anything goes.
                </p>
                <div className={orderStyles.inputFieldContainer} style={{marginBottom: '1rem'}}>
                    <input
                        className={orderStyles.inputField}
                        type='text'
                        value={name}
                        onChange={handleName}
                    />
                </div>
                <div>
                    {
                        lengthError ?
                        <i style={{color: 'red', width: '24px'}} className="fa-solid fa-xmark"></i> :
                        <i style={{color: 'green', width: '24px'}} className="fa-solid fa-check"></i>
                    }
                    Between 4-20 characters
                </div>
                <div>
                    {
                        letterError ?
                        <i style={{color: 'red', width: '24px'}} className="fa-solid fa-xmark"></i> :
                        <i style={{color: 'green', width: '24px'}} className="fa-solid fa-check"></i>
                    }
                    No special characters, spaces, or accented letters
                </div>
                {isDuplicate && <div className={styles.duplicate}>Duplicate shop name. Please try another shop name.</div>}
            </div>
        </div>
        <div className={styles.submitBtnContainer}>
            <button
                className={styles.createShopBtn}
                onClick={handleSubmit}
            >Create Shop</button>
        </div></>
    )
}

export default CreateShop
