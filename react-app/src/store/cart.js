const SAVE_ITEMS_TO_CART = 'saveItems/CART'
const LOAD_CART_ITEMS = 'loadItems/CART'
const REMOVE_ITEM_FROM_CART = 'removeItem/CART'
const MODIFY_QTY_ITEM = 'modify/CART'
const EMPTY_CART = 'empty/CART'

const saveItems = items => ({
    type: SAVE_ITEMS_TO_CART,
    items
})

export const saveItemsDB = (items) => async dispatch => {
    const method = 'POST'
    const headers = {'ContentType': 'application/json'}
    const body = JSON.stringify(items)

    const options = {
        method,
        headers,
        body
    }

    const res = fetch('/api/carts', options)
        .then(res => {
            if(res.ok) {

            }
            throw new Error()
        })
        .catch(() => false)
}

const initialState = {}

export default function reducer(state = initialState, action) {
    switch (action.type) {
      case SAVE_ITEMS_TO_CART:
        return { user: action.payload }
      case EMPTY_CART:
        return { user: null }
      default:
        return state;
    }
}
