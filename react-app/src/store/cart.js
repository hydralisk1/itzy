const SAVE_ITEMS_TO_CART = 'saveItems/CART'
const LOAD_CART_ITEMS = 'loadItems/CART'
const REMOVE_ITEMS_FROM_CART = 'removeItems/CART'
const MODIFY_QTY_ITEM = 'modify/CART'

const saveItemsStore = items => ({
    type: SAVE_ITEMS_TO_CART,
    items
})

const setItems = items => ({
    type: LOAD_CART_ITEMS,
    items
})

const deleteItems = items => ({
    type: REMOVE_ITEMS_FROM_CART,
    items
})

const modifyQty = item => ({
    type: MODIFY_QTY_ITEM,
    item
})


export const saveItems = (items) => async dispatch => {
    const method = 'POST'
    const headers = {'Content-Type': 'application/json'}

    const options = {
        method,
        headers,
        body: JSON.stringify(items)
    }

    const res = fetch('/api/cart/', options)
                    .then(res => {
                        if(res.ok) return true
                        throw new Error()
                    })
                    .catch(() => false)

    if(res) dispatch(saveItemsStore(items))

    return res
}

export const loadItems = (login) => async dispatch => {
    let res
    if(login){
        res = fetch('/api/cart/')
                .then(res => {
                    if(res.ok) return res.json()
                    throw new Error()
                })
                .then(res => {
                    dispatch(setItems(res))
                    return true
                })
                .catch(() => false)
    }else{
        res = true

        const cartItems = JSON.parse(localStorage.getItem('cart'))
        if(cartItems) dispatch(setItems(cartItems))
        else dispatch(setItems({}))
    }
    return res
}

export const removeItems = (items) => async dispatch => {
    const method = 'DELETE'
    const headers = {'Content-Type': 'application/json'}

    const options = {
        method,
        headers,
        body: JSON.stringify(items)
    }

    const res = fetch('/api/cart/', options)
                    .then(res => {
                        if(res.ok) return res.json()
                        throw new Error()
                    })
                    .catch(() => false)

    if(res) dispatch(deleteItems(items))

    return res
}

export const modifyItems = (item) => async dispatch => {
    const method = 'PUT'
    const headers = {'Content-Type': 'application/json'}

    const options = {
        method,
        headers,
        body: JSON.stringify(item)
    }

    const res = fetch('/api/cart/', options)
                    .then(res => {
                        if(res.ok) return res.json()
                        throw new Error()
                    })
                    .catch(() => false)

    if(res) dispatch(modifyQty(item))

    return res
}

const initialState = {}

export default function reducer(state = initialState, action) {
    const newItems = {...state}

    switch (action.type) {
        case SAVE_ITEMS_TO_CART:
            Object.keys(action.items).forEach(k => {
                if(k in newItems) newItems[k] += action.items[k]
                else newItems[k] = action.items[k]
            })
            return {...newItems}

        case LOAD_CART_ITEMS:
            return {...action.items}

        case REMOVE_ITEMS_FROM_CART:
            Object.keys(action.items).forEach(k => {delete newItems[k]})
            return {...newItems}

        case MODIFY_QTY_ITEM:
            newItems[Object.keys(action.item)[0]] = Object.values(action.item)[0]
            return {...newItems}

        default:
            return state;
    }
}
