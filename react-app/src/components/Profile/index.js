import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import  styles from './profile.module.css'

const Profile = () => {
    const user = useSelector(state => state.session.user)
    const [data, setData] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        fetch('/api/orders/')
            .then(res => {
                if(res.ok) return res.json()
                throw new Error()
            })
            .then(res => {
                const d = {}
                res.orders.forEach(orderData => {
                    const key = ~~(new Date(orderData.time).getTime() / 1000)
                    const daysAgo = ~~((new Date().getTime() - new Date(orderData.time).getTime()) / 1000 / 60 / 60 / 24)

                    if(daysAgo <= 1) orderData.status = 'Preparing'
                    else if(daysAgo > 1 && daysAgo <= 3) orderData.status = 'Shipped'
                    else orderData.status = 'Delievered'

                    if(d[key]) d[key].push(orderData)
                    else d[key] = [orderData]
                })
                setData(d)
            })
            .catch(e => console.log(e))
            .finally(() => setIsLoaded(true))
    }, [])

    return (
        isLoaded ?
        <div className={styles.profileContainer}>
            {console.log(data)}
            <div className={styles.greetings}>Hello, {user.name}</div>
            <div className={styles.title}>Your order history</div>
            {/* {
                !Object.keys(data).length ?
                <div>There's no order placed</div> :
                Object.keys(data).sort((a, b) => b - a).map(orderNum =>
                    <>
                    <div>#{orderNum}</div>
                    <table>
                    {data[orderNum].map(order =>
                        <table>

                        </table>
                    )}
                    </>
                )
                </table>
            } */}
        </div> : 'Loading...'
    )
}

export default Profile
