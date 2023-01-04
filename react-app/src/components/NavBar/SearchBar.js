import { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import styles from './navbar.module.css'

const SearchBar = () => {
    const [keyword, setKeyword] = useState('')
    const [showResult, setShowResult] = useState(false)
    const [isOnResult, setIsOnResult] = useState(false)
    const [result, setResult] = useState({})
    const submitBtn = useRef(null)
    const searchBarContainer = useRef(null)
    const history = useHistory()

    const handleSubmit = e => {
        e.preventDefault()
        if(Object.keys(result).length) {
            history.push(`/items/search/${keyword}`)
            setKeyword('')
        }
    }

    const handleFocus = () => {
        setShowResult(!!keyword.length)
        submitBtn.current.className = styles.inputFocus
        searchBarContainer.current.style.backgroundColor = 'white'
    }

    const handleBlur = () => {
        setShowResult(false)
        submitBtn.current.className = styles.submitBtn
        searchBarContainer.current.style.backgroundColor = 'rgb(226, 226, 226, 0.3)'
    }

    useEffect(() => {
        if(keyword.length){
            fetch(`/api/items/search/${keyword}`)
                .then(res => {
                    if(res.ok) return res.json()
                })
                .then(res => setResult(res))
        }
        setShowResult(!!keyword.length)
    }, [keyword])

    return (
        <div className={styles.searchResultContainer}>
            <form ref={searchBarContainer} style={{backgroundColor: 'rgb(226, 226, 226, 0.3)'}} className={styles.searchBarContainer} method='GET' action='' onSubmit={handleSubmit}>
                <input
                    className={styles.input}
                    type='text'
                    placeholder='Search for anything'
                    value={keyword}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={e => {
                        if(/^[a-zA-Z0-9]*$/.test(e.target.value))
                            setKeyword(e.target.value)
                    }}
                />
                {!!keyword.length && <div className={styles.cancelBtn} onClick={() => {setKeyword('')}}><i className="fa-solid fa-xmark"></i></div>}
                <button ref={submitBtn} type='submit' className={styles.submitBtn}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                </button>
            </form>
            {(showResult || isOnResult) &&
                <ul
                    className={styles.searchResult}
                    onMouseOver={() => setIsOnResult(true)}
                    onMouseLeave={() => setIsOnResult(false)}
                >
                    {
                        !!Object.keys(result).length ?
                        Object.keys(result).map(itemId =>
                            <li
                                className={styles.itemsFound}
                                onClick={() => {
                                    history.push(`/items/${itemId}`)
                                    setIsOnResult(false)
                                    setKeyword('')
                                }}
                            >{result[itemId]}</li>) :
                        <li className={styles.itemNotFound}>No item found</li>
                    }
                </ul>
            }
        </div>
    )
}

export default SearchBar
