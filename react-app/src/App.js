import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import NavBar from './components/NavBar/';
import MainPage from './components/MainPage';
import ItemPage from './components/ItemPage';
// import ProtectedRoute from './components/auth/ProtectedRoute';
import { authenticate } from './store/session';

function App() {
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (async() => {
      await dispatch(authenticate());
      setLoaded(true);
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
        <Route path='/' exact={true} >
          <MainPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
