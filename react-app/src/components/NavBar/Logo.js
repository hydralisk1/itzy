import { Link } from 'react-router-dom'
import styles from './navbar.module.css'

const Logo = () => {
    return <Link to='/'><div className={styles.logo}>Itzy</div></Link>
}

export default Logo
