// constants
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';
const CREATE_SHOP = 'session/CREATE_SHOP'
const CLOSE_SHOP = 'session/CLOSE_SHOP'
const ADD_ITEM_TO_LIKES = 'session/ADD_ITEM_TO_LIKES'
const REMOVE_ITEM_FROM_LIKES = 'session/REMOVE_ITEM_FROM_LIKES'

const setUser = (user) => ({
  type: SET_USER,
  payload: user
});

const removeUser = () => ({
  type: REMOVE_USER,
})

const setShop = (shopId) => ({
  type: CREATE_SHOP,
  shopId
})

const removeShop = () => ({
  type: CLOSE_SHOP
})

const addItemToLikes = itemId => ({
  type: ADD_ITEM_TO_LIKES,
  itemId
})

const removeItemFromLikes = itemId => ({
  type: REMOVE_ITEM_FROM_LIKES,
  itemId
})

const initialState = { user: null };

export const likeItem = itemId => async dispatch => {
  const res = await fetch(`/api/likes/${itemId}`, {method: 'POST'})

  if(res.ok) {
    dispatch(addItemToLikes(itemId))
    return true
  }

  return false
}

export const removeLikeItem = itemId => async dispatch => {
  const res = await fetch(`/api/likes/${itemId}`, {method: 'DELETE'})

  if(res.ok) {
    dispatch(removeItemFromLikes(itemId))
    return true
  }

  return false
}

export const authenticate = () => async (dispatch) => {
  const response = await fetch('/api/auth/', {
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    const data = await response.json();
    if (data.errors) {
      return false
    }

    dispatch(setUser(data));
    return true
  }
}

export const createShop = (name) => async dispatch => {
  const method = 'POST'
  const headers = {'Content-Type': 'application/json'}
  const body = JSON.stringify({name})

  const options = {
    method,
    headers,
    body
  }

  const res = await fetch('/api/shop/', options)
  if(res.ok){
    const result = await res.json()
    dispatch(setShop(result.id))
    return 'success'
  }else if(res.status === 409) return 'duplicate'
  else return 'something went wrong'
}

export const closeShop = () => async dispatch => {
  const method = 'DELETE'

  const res = await fetch('/api/shop/', {method})
  if(res.ok) {
    dispatch(removeShop())
    return true
  }

  return false
}

export const login = (email, password) => async (dispatch) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email,
      password
    })
  });


  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.']
  }

}

export const logout = () => async (dispatch) => {
  const response = await fetch('/api/auth/logout', {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};


export const signUp = (name, email, password) => async (dispatch) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data))
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ['An error occurred. Please try again.']
  }
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload }
    case REMOVE_USER:
      return { user: null }
    case CREATE_SHOP:
      return { user: { ...state.user, shop: action.shopId } }
    case CLOSE_SHOP:
      return { user: { ...state.user, shop: null}}
    case ADD_ITEM_TO_LIKES:
      const addLike = {...state.user.likes}
      addLike[action.itemId] = true
      return { user: { ...state.user, likes: {...addLike}}}
    case REMOVE_ITEM_FROM_LIKES:
      const removeLike = {...state.user.likes}
      delete removeLike[action.itemId]
      return { user: { ...state.user, likes: {...removeLike}}}
    default:
      return state;
  }
}
