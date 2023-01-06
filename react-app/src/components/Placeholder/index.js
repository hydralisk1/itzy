import styles from './placeholder.module.css'

const Placeholder = ({width, height, position = 'static'}) => {
    const w = width || '1400px'
    const h = height || '90vh'

    return (
        <div style={{width: w, height: h, position, top: 0, left: 0}} className={styles.container}>
            <i className={`fa-regular fa-snowflake ${styles.loading}`}></i>
            <span>Loading...</span>
        </div>
    )
}

export default Placeholder
