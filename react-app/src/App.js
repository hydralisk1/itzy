import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import NavBar from './components/NavBar/';
import MainPage from './components/MainPage';
import ItemPage from './components/ItemPage';
import CartPage from './components/CartPage'
// import ProtectedRoute from './components/auth/ProtectedRoute';
import { authenticate } from './store/session';
import { loadItems } from './store/cart';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

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
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path='/items/:itemId'>
          <ItemPage />
        </Route>
        <Route path='/cart'>
          <CartPage />
        </Route>
        <Route path='/' exact={true} >
          <MainPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
