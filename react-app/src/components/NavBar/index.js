import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Logo from "./Logo"
import SearchBar from "./SearchBar"
import Icons from "./Icons"
import styles from './navbar.module.css'

const NavBar = () => {
    const categoryNav = {
        'Jewelry & Accessories': [10, 1, 8],
        'Clothing, Bags & Shoes': [6, 3, 13],
        'Home & Living': [9, 4, 12],
        'Wedding & Party': [15, 11],
        'Toys & Entertainment': [14, 7, 5],
        'Art & Collectibies': [2],
    }

    const history = useHistory()

    const [categories, setCategories] = useState({})
    const [isLoaded, setIsLoaded] = useState(false)
    const [isHover, setIsHover] = useState(-1)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        fetch('/api/category/upper')
            .then(res => {
                if(res.ok) return res.json()
                throw new Error()
            })
            .then(res => {setCategories(res)})
            .catch(() => setIsError(true))
            .finally(() => setIsLoaded(true))
    }, [])

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
                        Object.keys(categoryNav).map((key, i) =>
                            <li
                                className={styles.category}
                                key={key}
                                onMouseOver={() => setIsHover(i)}
                                onMouseLeave={() => setIsHover(-1)}
                            >
                                {key}
                                {(isLoaded && isHover === i) && <ul key={key + i} className={styles.hoverCategories}>
                                    {Object.values(categoryNav)[i].map(categoryId =>
                                        <li
                                            className={styles.hoverCategory}
                                            key={categoryId}
                                            onClick={() => history.push(`/category/${categoryId}`)}
                                        >
                                            {categories[categoryId]}
                                        </li>
                                    )}
                                    </ul>
                                }
                            </li>
                        )
                    }

                </ul>
            </div>
        </>
    )
}

export default NavBar
