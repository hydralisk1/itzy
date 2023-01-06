import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import  styles from './profile.module.css'

const Profile = () => {
    const user = useSelector(state => state.session.user)
    const history = useHistory()
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
                    else orderData.status = 'Delivered'

                    const orderDate = orderData.time.split(' ')

                    orderData.time = orderDate[2] + ' ' + orderDate[1] + ', ' + orderDate[3]

                    if(d[key]){
                        let idx = 0
                        let found = false

                        while(idx < d[key].length){
                            if(d[key][idx].item.id === orderData.item.id && d[key][idx].address === orderData.address){
                                found = true
                                break
                            }
                            idx++
                        }

                        if(found) d[key][idx].qty += orderData.qty
                        else d[key].push(orderData)
                    }
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
            {
                !Object.keys(data).length ?
                <div>There's no order placed</div> :
                Object.keys(data).sort((a, b) => b - a).map((orderNum, i) =>
                    <div key={orderNum + orderNum} style={{marginBottom: '2rem', padding: '16px 0',borderBottom: '1px solid rgb(0, 0, 0, 0.4)'}}>
                        <div key={orderNum} className={styles.orderNum}>Order# {orderNum}</div>
                        <div key={orderNum + i.toString()} className={styles.orderContainerTitle}>
                            <div key={orderNum + i.toString() + orderNum} className={styles.orderListTitle}></div>
                            <div key={i.toString() + orderNum + i.toString() + orderNum} className={styles.orderListTitle}>Item Name</div>
                            <div key={i.toString() + orderNum + i.toString() + orderNum + i.toString()} className={styles.orderListTitle}>Qty</div>
                            <div key={orderNum + i.toString() + orderNum + i.toString() + orderNum + i.toString()} className={styles.orderListTitle}>Order Date</div>
                            <div key={orderNum + i.toString() + orderNum + i.toString() + orderNum + i.toString() + orderNum + i.toString() + orderNum + i.toString() + orderNum + i.toString()} className={styles.orderListTitle}>
                                Current Status
                            </div>
                        </div>
                        {data[orderNum].map((order, i) =>
                            <div key={orderNum + order.item.name + i} className={styles.orderContainer} onClick={() => history.push(`/items/${order.item.id}`)}>
                                <div key={'b' + order.item.images[0]} className={styles.imageHolder}>
                                    <img className={styles.image} key={'gh' + order.item.images[0] + orderNum} src={order.item.images[0]} alt='item' />
                                </div>
                                <div key={'c' + order.item.name + i + orderNum}>{order.item.name}</div>
                                <div style={{textAlign: 'center'}} key={'d' + i + order.item.name}>{order.qty}</div>
                                <div style={{textAlign: 'center'}} key={'f' + order.item.name + order.item.id + order.item.name}>{order.time}</div>
                                <div style={{textAlign: 'center'}} key={'e' + i + order.item.id + order.item.name}>{order.status}</div>
                            </div>
                        )}
                    </div>
                )
            }
        </div> : 'Loading...'
    )
}

export default Profile
