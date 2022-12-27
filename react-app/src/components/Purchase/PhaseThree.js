import styles from './purchase.module.css'

const PhaseThree = ({phase, setPhase}) => {
    const handleSubmit = e => {
        e.preventDefault()
    }

    return (
        <form
            action=''
            onSubmit={handleSubmit}
            className={styles.addressForm}
        >
            <div className={styles.formTitle}>Review your order</div>
        </form>
    )
}

export default PhaseThree
