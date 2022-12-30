import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import NavBar from './components/NavBar/';
import MainPage from './components/MainPage';
import ItemPage from './components/ItemPage';
import CartPage from './components/CartPage'
import Purchase from './components/Purchase';
import Shop from './components/Shop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { authenticate } from './store/session';
import { loadItems } from './store/cart';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation()

  useEffect(() => {
    (async() => {
      const res = await dispatch(authenticate());
      await dispatch(loadItems(res))
      setLoaded(true)
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      {location.pathname !== '/purchase' && <NavBar />}
      <Switch>
        <Route path='/items/:itemId'>
          <ItemPage />
        </Route>
        <ProtectedRoute path='/purchase'>
          <Purchase />
        </ProtectedRoute>
        <ProtectedRoute path='/shop'>
          <Shop />
        </ProtectedRoute>
        <Route path='/cart'>
          <CartPage />
        </Route>
        <Route path='/' exact={true} >
          <MainPage />
        </Route>
      </Switch>
    </>
  );
}

export default App;
