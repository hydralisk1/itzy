import Logo from "./Logo"
import SearchBar from "./SearchBar"
import styles from './navbar.module.css'

const NavBar = () => {
    return (
        <nav className={styles.navContainer}>
            <Logo />
            <SearchBar />
        </nav>
    )
}

export default NavBar
