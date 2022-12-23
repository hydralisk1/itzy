import Logo from "./Logo"
import SearchBar from "./SearchBar"
import Icons from "./Icons"
import styles from './navbar.module.css'

const NavBar = () => {
    const categories = [
        'Jewelry & Accessories',
        'Clothing & Shoes',
        'Home & Living',
        'Wedding & Party',
        'Toys & Entertainment',
        'Art & Collectibies',
        'Craft Supplies',
        'Gifts & Gift Cards',
    ]

    return (
        <>
            <nav className={styles.navContainer}>
                <Logo />
                <SearchBar />
                <Icons />
            </nav>
            <div className={styles.categoryContainer}>
                <ul className={styles.categories}>
                    {
                        categories.map(c => <li className={styles.category} key={c}>{c}</li>)
                    }
                </ul>
            </div>
        </>
    )
}

export default NavBar
