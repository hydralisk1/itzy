import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import navStyles from '../NavBar/navbar.module.css'
import styles from './item.module.css'

const ItemModify = ({ setIsModalOn, item = null, setIsChanged }) => {
    const shopId = useSelector(state => state.session.user.shop)

    const modalRef = useRef(null)
    const formRef = useRef(null)
    const isModify = item !== null
    const [name, setName] = useState('')
    const [category, setCategory] = useState('')
    const [categoryId, setCategoryId] = useState(0)
    const [price, setPrice] = useState('$0')
    const [stock, setStock] = useState('0')
    const [desc, setDesc] = useState('')
    const [primaryImg, setPrimaryImg] = useState('')
    const [secondaryImg, setSecondaryImg] = useState('')
    const [video, setVideo] = useState('')

    const [nameError, setNameError] = useState('')
    const [priceError, setPriceError] = useState('')
    const [stockError, setStockError] = useState('')
    const [descError, setDescError] = useState('')
    const [imgError, setImgError] = useState('')
    const [videoError, setVideoError] = useState('')
    const [categoryError, setCategoryError] = useState('')

    const [allCategories, setAllCategories] = useState({})
    const [showCategories, setShowCategories] = useState(false)
    const [showChild, setShowChild] = useState(0)

    const [showErrors, setShowErrors] = useState(false)

    useEffect(() => {
        document.body.style.overflow = 'hidden'

        fetch('/api/category/')
            .then(res => {
                if(res.ok) return res.json()
            })
            .then(res => {
                const categories = {}
                res.categories.forEach(category => {
                    if(category.upper_category){
                        if(!categories[category.upper_category_id])
                            categories[category.upper_category_id] = {name: category.upper_category, children: {}}

                        categories[category.upper_category_id].children[category.category_id] = category.category
                    }
                })
                setAllCategories(categories)
            })
            .catch(e => console.log(e))

        if(isModify){
            setName(item.name)
            setCategory(`${item.category_1} > ${item.category_2}`)
            setPrice('$' + item.price)
            setStock(item.stock.toString())
            setDesc(item.desc)
            setPrimaryImg(item.images[0])
            setSecondaryImg(item.images[2] || '')
            setVideo(item.images[1] || '')
        }

        setTimeout(() => {
            modalRef.current.className = navStyles.modalContainer + ' ' + navStyles.modalContainerAppear
            formRef.current.className = styles.formContainer + ' ' + styles.formContainerAppear
        }, 0)

        return () => {document.body.style.overflow = ''}
    }, [item, isModify])

    useEffect(() => {
        if(!name.length) setNameError('Item name is required')
        else setNameError('')

        const priceCheck = price.replaceAll('$', '')
        if(!priceCheck.length) setPriceError('Price is required')
        else if(priceCheck * 1 <= 0) setPriceError('Price should be greater than 0')
        else setPriceError('')

        if(!stock.length) setStockError('Stock is required')
        else if(stock * 1 < 0) setStockError('Stock should be equal to or greated than 0')
        else setStockError('')

        if(!desc.length) setDescError('Description is required')
        else setDescError('')

        const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')

        if(!primaryImg.length) setImgError('First image is required')
        else if(!regex.test(primaryImg)) setImgError('Invalid url for the first image')
        else if(secondaryImg && !regex.test(secondaryImg)) setImgError('Invalid url for the second image')
        else setImgError('')

        if(video && !regex.test(video)) setVideoError('Invalid url for the video')
        else setVideoError('')

        if(!isModify && categoryId === 0) setCategoryError('Category is required')
        else setCategoryError('')

    }, [name, categoryId, price, stock, desc, primaryImg, secondaryImg, video])

    const handleClose = () => {
        modalRef.current.className = navStyles.modalContainer
        formRef.current.className = styles.formContainer
        setTimeout(() => setIsModalOn(false), 300)
    }

    const handlePrice = e => {
        const value = e.target.value.replaceAll('$', '')
        if(!isNaN(value)) setPrice('$' + value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        setShowErrors(true)
        if(!nameError && !priceError && !stockError && !descError && !imgError && !videoError && !categoryError){
            const method = isModify ? 'PUT' : 'POST'
            const headers = {'Content-Type': 'application/json'}
            const body = {
                name,
                price: price.replaceAll('$', '') * 1,
                stock: stock * 1,
                desc,
                images: [primaryImg, secondaryImg],
                video,
                shopId,
            }

            if(method === 'POST' || categoryId !== 0) body.categoryId = categoryId

            const options = {
                method,
                headers,
                body: JSON.stringify(body)
            }

            const url = isModify ? `/api/items/${item.id}` : '/api/items/'

            fetch(url, options)
                .then(res => {
                    if(res.ok) {
                        setIsChanged(true)
                        handleClose()
                    }
                })
                .catch(err => console.log(err))
        }
    }

    return (
        <div
            ref={modalRef}
            className={navStyles.modalContainer}
            onMouseDown={handleClose}
        >
            <div ref={formRef} className={styles.formContainer} onMouseDown={e => e.stopPropagation()}>
                <div className={navStyles.closeBtnContainer} onMouseDown={handleClose}>
                    <i style={{fontSize: '24px'}} className="fa-solid fa-xmark"></i>
                </div>
                <form className={navStyles.signInForm} action='' onSubmit={handleSubmit}>
                    <div className={navStyles.signInTitle}>
                        <div style={{fontSize: '1.5rem'}}>{isModify ? 'Modify Item' : 'Create Item'}</div>
                    </div>
                    <div className={navStyles.inputTag}>Item Name</div>
                    <div className={navStyles.inputContainer}>
                        <textarea
                            className={navStyles.inputField}
                            // type='text'
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className={navStyles.errorMessage}>{showErrors && nameError}</div>

                    <div className={styles.priceAndStock}>
                        <div style={{width: '70%'}}>
                            <div className={navStyles.inputTag}>Category</div>
                            <div className={styles.addBtn} style={{position: 'relative', marginBottom: '4px'}} onClick={() => setShowCategories(!showCategories)}>
                                <span>{category || 'Click here to choose category'}</span>
                                {showCategories &&
                                    <ul className={styles.categorySelect}>
                                        {
                                            Object.keys(allCategories).map(id =>
                                            <li
                                                key={id}
                                                className={styles.categoryList}
                                                onMouseOver={() => setShowChild(id)}
                                                onMouseLeave={() => setShowChild(0)}
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    setShowCategories(false)
                                                }
                                            }>
                                                {showChild === id &&
                                                    <ul
                                                        key={allCategories[id].name + id}
                                                        className={styles.childCategory}
                                                    >
                                                        {
                                                            Object.keys(allCategories[id].children).map(childId =>
                                                                <li
                                                                    key={childId}
                                                                    className={styles.categoryList}
                                                                    onClick={() => {
                                                                        setCategory(`${allCategories[id].name} > ${allCategories[id].children[childId]}`)
                                                                        setCategoryId(childId)
                                                                        setShowCategories(false)
                                                                    }}
                                                                >
                                                                    {allCategories[id].children[childId]}
                                                                </li>
                                                            )
                                                        }
                                                    </ul>
                                                }
                                                <span key={allCategories[id].name}>{allCategories[id].name}</span>
                                            </li>)
                                        }
                                    </ul>

                                }
                            </div>
                            <div className={navStyles.errorMessage}>{showErrors && categoryError}</div>
                        </div>
                        <div style={{width: '10%'}}>
                            <div className={navStyles.inputTag}>Price</div>
                            <div className={navStyles.inputContainer}>
                                <input
                                    className={navStyles.inputField}
                                    style={{textAlign: 'right'}}
                                    type='text'
                                    value={price}
                                    onChange={handlePrice}
                                />
                            </div>
                            <div className={navStyles.errorMessage}>{showErrors && priceError}</div>
                        </div>
                        <div style={{width: '10%'}}>
                            <div className={navStyles.inputTag}>Stock</div>
                            <div className={navStyles.inputContainer}>
                                <input
                                    className={navStyles.inputField}
                                    style={{textAlign: 'right'}}
                                    type='text'
                                    value={stock}
                                    onChange={e => setStock(e.target.value)}
                                />
                            </div>
                            <div className={navStyles.errorMessage}>{showErrors && stockError}</div>
                        </div>
                    </div>
                    <div className={navStyles.inputTag}>Description</div>
                    <div className={navStyles.inputContainer}>
                        <textarea
                            className={navStyles.inputField}
                            style={{height: '200px'}}
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                        />
                    </div>
                    <div className={navStyles.errorMessage}>{showErrors && descError}</div>
                    <div className={navStyles.inputTag}>Item Images</div>
                    <div className={navStyles.inputContainer} style={{marginBottom: '4px'}}>
                        <input
                            className={navStyles.inputField}
                            type='text'
                            placeholder='First Image Url'
                            value={primaryImg}
                            onChange={e => setPrimaryImg(e.target.value)}
                        />
                    </div>
                    <div className={navStyles.inputContainer}>
                        <input
                            className={navStyles.inputField}
                            type='text'
                            placeholder='Second Image Url'
                            value={secondaryImg}
                            onChange={e => setSecondaryImg(e.target.value)}
                        />
                    </div>
                    <div className={navStyles.errorMessage}>{showErrors && imgError}</div>
                    <div className={navStyles.inputTag}>Video</div>
                    <div className={navStyles.inputContainer}>
                        <input
                            className={navStyles.inputField}
                            type='text'
                            placeholder='Video Url'
                            value={video}
                            onChange={e => setVideo(e.target.value)}
                        />
                    </div>
                    <div className={navStyles.errorMessage}>{showErrors && videoError}</div>
                    <div className={navStyles.submitBtnContainer} style={{display: 'flex', justifyContent: 'center'}}>
                        <button type='submit' style={{width: '30%', marginRight: '16px'}} className={navStyles.formSubmitBtn}>{isModify ? 'Save changes' : 'Add Item'}</button>
                        <button style={{width: '30%'}} className={navStyles.formSubmitBtn} onClick={handleClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ItemModify
