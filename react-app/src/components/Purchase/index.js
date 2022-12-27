import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Nav from './Nav'
import PhaseOne from './PhaseOne'
import PhaseTwo from './PhaseTwo'
import PhaseThree from './PhaseThree'
import styles from './purchase.module.css'

const Purchase = () => {
    const user = useSelector(state => state.session.user)

    const [phase, setPhase] = useState(1)

    // for shipping address phase
    const [fullName, setFullName] = useState('')
    const [stAddr, setStAddr] = useState('')
    const [otherAddr, setOtherAddr] = useState('')
    const [zipCode, setZipCode] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')

    // for payment method phase
    const [nameOnCard, setNameOnCard] = useState('')
    const [cardNum, setCardNum] = useState('')
    // const [expMonth, setExpMonth] = useState(1)
    // const [expYear, setExpYear] = useState(new Date().getFullYear())

    // const [name, setName] = useState('')
    // const [addr, setAddr] = useState('')
    // const [nameOnCard, setNameOnCard] = useState('')
    // const [cardNum, setCardNum] = useState('')
    // const [expDate, setExpDate] = useState('')
    // const [cvv, setCvv] = useState('')

    useEffect(() => {
        const userId = user ? user.id : 0
        const savedInfo = JSON.parse(localStorage.getItem(`PurchaseInfo${userId}`))

        if(savedInfo){
            if(savedInfo.fullName) setFullName(savedInfo.fullName)
            if(savedInfo.stAddr) setStAddr(savedInfo.stAddr)
            if(savedInfo.otherAddr) setOtherAddr(savedInfo.otherAddr)
            if(savedInfo.zipCode) setZipCode(savedInfo.zipCode)
            if(savedInfo.city) setCity(savedInfo.city)
            if(savedInfo.state) setState(savedInfo.state)

            if(savedInfo.nameOnCard) setNameOnCard(savedInfo.nameOnCard)
            if(savedInfo.cardNum) setCardNum(savedInfo.cardNum)

            if(savedInfo.phase) setPhase(savedInfo.phase)
        }else localStorage.setItem(`PurchaseInfo${userId}`, JSON.stringify({}))

    }, [])

    const renderPhase = () => {
        switch(phase){
            case 1:
                return <PhaseOne
                            setPhase={setPhase}
                            phase={phase}
                            setFullName={setFullName}
                            fullName={fullName}
                            setStAddr={setStAddr}
                            stAddr={stAddr}
                            setOtherAddr={setOtherAddr}
                            otherAddr={otherAddr}
                            setZipCode={setZipCode}
                            zipCode={zipCode}
                            setCity={setCity}
                            city={city}
                            setState={setState}
                            state={state}
                        />
            case 2:
                return <PhaseTwo
                            setPhase={setPhase}
                            phase={phase}
                            setNameOnCard={setNameOnCard}
                            nameOnCard={nameOnCard}
                            setCardNum={setCardNum}
                            cardNum={cardNum}
                        />
            case 3:
                return <PhaseThree
                            setPhase={setPhase}
                            phase={phase}
                        />
            default:
                return <div>Something went wrong</div>
        }
    }

    return (
        <>
            <Nav phase={phase} />
            <div className={styles.contentContainer}>
                {renderPhase()}
            </div>
        </>
    )
}

export default Purchase
