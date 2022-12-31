import { useSelector } from 'react-redux'
import ShopPage from './ShopPage'
import CreateShop from './CreateShop'
// import styles from './shop.module.css'

const Shop = () => {
    const user = useSelector(state => state.session.user)

    return (
        !!user.shop ? <ShopPage /> : <CreateShop />
    )
}

export default Shop
