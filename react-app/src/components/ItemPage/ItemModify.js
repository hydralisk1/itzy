import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Message from '../Message'
import Placeholder from '../Placeholder'
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
    const [primaryImg, setPrimaryImg] = useState()
    const [secondaryImg, setSecondaryImg] = useState()
    const [video, setVideo] = useState()

    const [nameError, setNameError] = useState('')
    const [priceError, setPriceError] = useState('')
    const [stockError, setStockError] = useState('')
    const [descError, setDescError] = useState('')
    const [imgError, setImgError] = useState('')
    // const [videoError, setVideoError] = useState('')
    const [categoryError, setCategoryError] = useState('')

    const [allCategories, setAllCategories] = useState({})
    const [showCategories, setShowCategories] = useState(false)
    const [showChild, setShowChild] = useState(0)

    const [preview1, setPreview1] = useState()
    const [preview2, setPreview2] = useState()
    const [preview3, setPreview3] = useState()

    const [showErrors, setShowErrors] = useState(false)

    const [isMessageOn, setIsMessageOn] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const message = 'Something went wrong. Please try again'

    const handleUpload = (e, setFunc) => {
        if(e.target.files) setFunc(e.target.files[0])
    }

    useEffect(() => {
        if(!primaryImg){
            setPreview1(undefined)
            return
        }

        const objectUrl = typeof primaryImg !== 'string' ? URL.createObjectURL(primaryImg) : primaryImg
        setPreview1(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [primaryImg])

    useEffect(() => {
        if(!secondaryImg){
            setPreview2(undefined)
            return
        }

        const objectUrl = typeof secondaryImg !== 'string' ? URL.createObjectURL(secondaryImg) : secondaryImg
        setPreview2(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [secondaryImg])

    useEffect(() => {
        if(!video){
            setPreview3(undefined)
            return
        }

        const objectUrl = typeof video !== 'string' ? URL.createObjectURL(video) : video
        setPreview3(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [video])

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
            console.log(item)
            setName(item.name)
            setCategory(`${item.category_1} > ${item.category_2}`)
            setPrice('$' + item.price)
            setStock(item.stock.toString())
            setDesc(item.desc)
            setPrimaryImg(item.images[0])
            setSecondaryImg(item.images[2])
            setVideo(item.images[1])
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

        if(!primaryImg) setImgError('First image is required')
        else setImgError('')

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

        if(!nameError && !priceError && !stockError && !descError && !imgError && !categoryError){
            setIsLoading(true)
            const method = isModify ? 'PUT' : 'POST'
            // const headers = {'Content-Type': 'application/json'}
            const formData = new FormData()
            formData.append('name', name)
            formData.append('price', price.replaceAll('$', '') * 1)
            formData.append('stock', stock * 1)
            formData.append('desc', desc)
            formData.append('primaryImg', primaryImg)
            formData.append('secondaryImg', secondaryImg)
            formData.append('video', video)
            formData.append('shopId', shopId)

            if(method === 'POST' || categoryId !== 0) formData.append('categoryId', categoryId)

            const options = {
                method,
                body: formData
            }

            const url = isModify ? `/api/items/${item.id}` : '/api/items/'

            fetch(url, options)
                .then(res => {
                    if(res.ok) {
                        setIsChanged(true)
                        handleClose()
                        return
                    }
                    throw new Error()
                })
                .catch(() => {
                    setIsMessageOn(false)
                    setTimeout(() => setIsMessageOn(true), 0)
                })
                .finally(() => setIsLoading(false))
        }
    }

    return (<>
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
                    <div style={{display: 'flex', marginBottom: '32px'}}>
                        <div style={{marginRight: '16px'}}>
                            <div className={navStyles.inputTag}>Item Images</div>
                            <div style={{display: 'flex'}}>
                                <div style={{marginRight: '8px'}}>
                                    {
                                        !!preview1 ?
                                        <div className={styles.previewHolder}>
                                            <img className={styles.preview} src={preview1} alt='img' />
                                            <div className={styles.closeBtn} onClick={() => {
                                                if(secondaryImg){
                                                    setPrimaryImg(secondaryImg)
                                                    setSecondaryImg(undefined)
                                                }else setPrimaryImg(undefined)
                                            }}>
                                                <i style={{color: 'white'}} className="fa-solid fa-xmark"></i>
                                            </div>
                                        </div>
                                        : <>
                                            <input
                                                type='file'
                                                hidden
                                                id='primary-img'
                                                accept='image/*'
                                                onChange={e => handleUpload(e, setPrimaryImg)}
                                            />
                                            <label htmlFor='primary-img' className={styles.imgUploadBtn}>
                                                <i className="fa-solid fa-plus"></i>
                                            </label>
                                        </>
                                    }

                                </div>
                                {!!preview1 &&
                                <div>
                                    {
                                        !!preview2 ?
                                        <div className={styles.previewHolder}>
                                            <img className={styles.preview} src={preview2} alt='img' />
                                            <div className={styles.closeBtn} onClick={() => {setSecondaryImg(undefined)}}>
                                                <i style={{color: 'white'}} className="fa-solid fa-xmark"></i>
                                            </div>
                                        </div>
                                        : <>
                                            <input
                                                type='file'
                                                hidden
                                                id='secondary-img'
                                                accept='image/*'
                                                onChange={e => handleUpload(e, setSecondaryImg)}
                                            />
                                            <label htmlFor='secondary-img' className={styles.imgUploadBtn}>
                                                <i className="fa-solid fa-plus"></i>
                                            </label>
                                        </>
                                    }
                                </div>}
                            </div>
                        </div>
                        <div>
                            <div className={navStyles.inputTag}>Item Video</div>
                            <div>
                                <div>
                                    {
                                        !!preview3 ?
                                        <div className={styles.previewHolder}>
                                            <video>
                                                <source src={preview3} />
                                            </video>
                                            <div style={{zIndex: 99}} className={styles.closeBtn} onClick={() => {
                                                console.log(video)
                                                setVideo(undefined)
                                                console.log(1)
                                                console.log(video)
                                                }}>
                                                <i style={{color: 'white'}} className="fa-solid fa-xmark"></i>
                                            </div>
                                        </div> : <>
                                            <input
                                                type='file'
                                                hidden
                                                id='video'
                                                accept='video/mp4'
                                                onChange={e => handleUpload(e, setVideo)}
                                            />
                                            <label htmlFor='video' className={styles.imgUploadBtn}>
                                                <i className="fa-solid fa-plus"></i>
                                            </label>
                                        </>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={navStyles.errorMessage}>{showErrors && imgError}</div>
                    <div className={navStyles.submitBtnContainer} style={{display: 'flex', justifyContent: 'center'}}>
                        <button type='submit' style={{width: '30%', marginRight: '16px'}} className={navStyles.formSubmitBtn}>{isModify ? 'Save changes' : 'Add Item'}</button>
                        <button style={{width: '30%'}} className={navStyles.formSubmitBtn} onClick={handleClose}>Cancel</button>
                    </div>
                </form>
            </div>
            {isMessageOn && <Message setIsMessageOn={setIsMessageOn} isError={true} message={message} />}
        </div>
        {isLoading && <Placeholder width='100vw' height='100vh' position='fixed' />}
    </>)
}

export default ItemModify
