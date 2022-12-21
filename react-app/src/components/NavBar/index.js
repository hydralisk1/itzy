import Logo from "./Logo"
import SearchBar from "./SearchBar"
import Icons from "./Icons"
import styles from './navbar.module.css'

const NavBar = () => {
    return (
        <nav className={styles.navContainer}>
            <Logo />
            <SearchBar />
            <Icons />
        </nav>
    )
}

export default NavBar
