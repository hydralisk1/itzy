import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
import Placeholder from '../Placeholder'
import styles from './item.module.css'

const ItemPage = () => {
    // const user = useSelector(state => state.session.user)
    const { itemId } = useParams()
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)
    const [currentImg, setCurrentImg] = useState('')
    const [showDesc, setShowDesc] = useState(true)
    const [fullDesc, setFullDesc] = useState(false)
    const [data, setData] = useState({})

    useEffect(() => {
        fetch(`/api/items/get/${itemId}`)
            .then(res => {
                if(res.ok) return res.json()
                throw new Error()
            })
            .then(res => {
                setCurrentImg(res.images[0])
                setData(res)
            })
            .catch(() => setIsError(true))
            .finally(() => setIsLoaded(true))
    }, [itemId])

    return (
        isError ? <div>Something went wrong</div> :
        isLoaded ?
            <div className={styles.itemContainer}>
                <div className={styles.imgContainer}>
                    <div className={styles.images}>
                        {
                            data.images.filter(d => d).map((d, i) => {
                                const style = d === currentImg ? styles.smImgContainer + ' ' + styles.current : styles.smImgContainer
                                const content = d.slice(-3) === 'jpg' ? <img key={d} className={styles.smallImg} src={d} alt='item' /> : <video key={d} className={styles.smallImg} muted><source src={d} type='video/mp4' /></video>
                                return <div key={i} className={style} onClick={() => setCurrentImg(d)}>{content}</div>
                            })
                        }
                    </div>
                    <div className={styles.currentImgContainer}>
                        { currentImg.slice(-3) === 'jpg' ?
                            <img className={styles.currentImg} src={currentImg} alt='item' /> :
                            <video className={styles.currentImg} muted><source src={currentImg} type='video/mp4' /></video>
                        }
                    </div>
                </div>
                <div className={styles.descContainer}>
                    <div className={styles.shopName}>{data.shop_name}</div>
                    <div className={styles.name}>{data.name}</div>
                    <div className={styles.price}>$ {data.price.toFixed(2)}</div>
                    <div className={styles.addBtn}>
                        Add to cart
                    </div>
                    <div className={styles.descBtn} onClick={() => setShowDesc(!showDesc)}>
                        <span style={{fontWeight: 600}}>Description</span><span className={showDesc ? styles.arrowUp : styles.arrowDown}><i className="fa-solid fa-angle-down"></i></span>
                    </div>
                    <div className={showDesc ? fullDesc ? styles.desc + ' ' + styles.full : styles.desc : styles.desc + ' ' + styles.hide}>
                        {data.desc}
                    </div>
                    { showDesc &&
                        <div className={styles.learnMore}>
                            <span className={styles.learnMoreBtn} onClick={() => setFullDesc(!fullDesc)}>{fullDesc ? 'Less' : 'Learn more about this item'}</span>
                        </div>
                    }
                </div>
            </div>
        : <Placeholder />
    )
}

export default ItemPage
