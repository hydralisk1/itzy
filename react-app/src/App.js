import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import NavBar from './components/NavBar/';
import MainPage from './components/MainPage';
import ItemPage from './components/ItemPage';
import CartPage from './components/CartPage'
import Purchase from './components/Purchase';
import Shop from './components/Shop';
import Favorite from './components/Favorite';
import Category from './components/Category';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SearchItems from './components/SearchItems';
import OrderHistory from './components/OrderHistory';
import Footer from './components/Footer';
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
        <Route path='/items/search/:keyword'>
          <SearchItems />
        </Route>
        <Route path='/items/:itemId'>
          <ItemPage />
        </Route>
        <Route path='/category/:categoryId'>
          <Category />
        </Route>
        <ProtectedRoute path='/purchase'>
          <Purchase />
        </ProtectedRoute>
        <ProtectedRoute path='/likes'>
          <Favorite />
        </ProtectedRoute>
        <ProtectedRoute path='/shop'>
          <Shop />
        </ProtectedRoute>
        <ProtectedRoute path='/order-history'>
          <OrderHistory />
        </ProtectedRoute>
        <Route path='/cart'>
          <CartPage />
        </Route>
        <Route path='/' exact={true} >
          <MainPage />
        </Route>
      </Switch>
      <Footer />
    </>
  );
}

export default App;
