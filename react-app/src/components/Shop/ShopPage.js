import { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
import StockManagement from './StockManagement'
import styles from './shop.module.css'
import orderStyles from '../Purchase/purchase.module.css'

const ShopPage = () => {
    const [shopName, setShopName] = useState('')
    const [editShopName, setEditShopName] = useState('')
    const [nameError, setNameError] = useState('')
    const [edit, setEdit] = useState(false)

    useEffect(() => {
        fetch('/api/shop/')
            .then(res => {
                if(res.ok) return res.json()
                throw new Error()
            })
            .then(res => setShopName(res.name))
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        setEditShopName(shopName)
    }, [shopName])

    useEffect(() => {
        if(editShopName.length < 4 || editShopName.length > 20) setNameError('Shop name should be between 4-20 characters')
        else if(!(/^[a-zA-Z0-9]+$/.test(editShopName))) setNameError('Shop name can\'t have special characters, spaces, or accented letters')
        else setNameError('')
    }, [editShopName])

    const handleShopName = e => {
        if(e.target.value.length <= 20 && /^[a-zA-Z0-9]*$/.test(e.target.value)) setEditShopName(e.target.value)
    }

    const handleCancel = () => {
        setEditShopName(shopName)
        setEdit(false)
    }

    const handleSave = () => {
        if(!nameError.length){
            const method = 'PUT'
            const headers = {'Content-Type': 'application/json'}
            const body = JSON.stringify({name: editShopName})
            const options = {
                method,
                headers,
                body
            }

            fetch('/api/shop/', options)
                .then(res => {
                    if(res.ok) {
                        setShopName(editShopName)
                        setEdit(false)
                    }
                    else if(res.status === 409) setNameError('Shop name duplicate. Please try again with another name')
                    else setNameError('Something went wrong. Please try again')
                })
        }
    }

    return (
        <div className={orderStyles.contentContainer}>
            <div className={styles.displayFlex}>
                {edit ?
                <>
                    <div className={orderStyles.inputFieldContainer} style={{marginRight: '16px'}}>
                        <input
                            className={orderStyles.inputField}
                            type='text'
                            value={editShopName}
                            onChange={handleShopName}
                        />
                    </div>
                    <button
                        className={styles.createShopBtn}
                        style={{margin: '8px 4px', width: '120px'}}
                        onClick={handleSave}
                    >Save</button>
                    <button
                        className={styles.createShopBtn}
                        style={{margin: '8px 4px', width: '120px'}}
                        onClick={handleCancel}
                    >Cancel</button>
                    </>:
                    <div
                        className={orderStyles.formTitle}
                        style={{marginBottom: '16px'}}
                        onDoubleClick={() => setEdit(true)}
                    >{shopName}</div>
                }
            </div>
            { edit ?
                <div className={styles.duplicate} style={{height: '42px'}}>{nameError}</div> :
                <div style={{color: 'rgb(0, 0, 0, 0.5)'}}>Double click on shop name to change it</div>
            }
            <StockManagement />
        </div>
    )
}

export default ShopPage
