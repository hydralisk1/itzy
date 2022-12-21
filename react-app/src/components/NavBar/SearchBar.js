import { useState, useRef } from 'react';
import styles from './navbar.module.css'

const SearchBar = () => {
    const [keyword, setKeyword] = useState('')
    const submitBtn = useRef(null)
    const searchBarContainer = useRef(null)

    const handleSubmit = e => {
        e.preventDefault()
    }

    const handleFocus = () => {
        submitBtn.current.className = styles.inputFocus
        searchBarContainer.current.style.backgroundColor = 'white'
    }

    const handleBlur = () => {
        submitBtn.current.className = styles.submitBtn
        searchBarContainer.current.style.backgroundColor = 'rgb(226, 226, 226, 0.3)'
    }

    return (
        <form ref={searchBarContainer} style={{backgroundColor: 'rgb(226, 226, 226, 0.3)'}} className={styles.searchBarContainer} method='GET' action='' onSubmit={handleSubmit}>
            <input
                className={styles.input}
                type='text'
                placeholder='Search for anything'
                value={keyword}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={e => setKeyword(e.target.value)}
            />
            {!!keyword.length && <div className={styles.cancelBtn} onClick={() => {setKeyword('')}}><i className="fa-solid fa-xmark"></i></div>}
            <button ref={submitBtn} type='submit' className={styles.submitBtn}>
                <i className="fa-solid fa-magnifying-glass"></i>
            </button>
        </form>
    )
}

export default SearchBar
