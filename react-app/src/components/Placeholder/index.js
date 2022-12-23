import styles from './placeholder.module.css'

const Placeholder = ({width, height}) => {
    const w = width || '1400px'
    const h = height || '400px'

    return (
        <div style={{width: w, height: h}} className={styles.container}>
            <i className={`fa-regular fa-snowflake ${styles.loading}`}></i>
            <span>Loading...</span>
        </div>
    )
}

export default Placeholder
