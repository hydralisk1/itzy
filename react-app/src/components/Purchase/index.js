import { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Nav from './Nav'
import PhaseOne from './PhaseOne'
import PhaseTwo from './PhaseTwo'
import PhaseThree from './PhaseThree'
import styles from './purchase.module.css'

const Purchase = () => {
    const history = useHistory()

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

    useEffect(() => {
        if(!sessionStorage.getItem('purchaseItems')) history.goBack()
        const savedInfo = JSON.parse(sessionStorage.getItem(`PurchaseInfo`))

        if(savedInfo){
            if(savedInfo.fullName) setFullName(savedInfo.fullName)
            if(savedInfo.stAddr) setStAddr(savedInfo.stAddr)
            if(savedInfo.otherAddr) setOtherAddr(savedInfo.otherAddr)
            if(savedInfo.zipCode) setZipCode(savedInfo.zipCode)
            if(savedInfo.city) setCity(savedInfo.city)
            if(savedInfo.state) setState(savedInfo.state)

            if(savedInfo.nameOnCard) setNameOnCard(savedInfo.nameOnCard)
            if(savedInfo.cardNum) setCardNum(savedInfo.cardNum)

            // if(savedInfo.phase) setPhase(savedInfo.phase)
        }else sessionStorage.setItem(`PurchaseInfo`, JSON.stringify({}))

        return () => {sessionStorage.removeItem('purchaseItems')}
    }, [history])

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
                            cardNum={cardNum}
                            nameOnCard={nameOnCard}
                            fullName={fullName}
                            address={`${stAddr}${otherAddr.length ? ' '  + otherAddr : ''}, ${city}, ${state} ${zipCode}`}
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
