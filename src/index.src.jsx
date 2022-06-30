import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store/store.js';
import Auth from './components/Auth/Auth.jsx';
import Base from './components/Base/Base.jsx';
import Claims from './components/Claims/Claims.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import NewClaim from './components/NewClaim/NewClaim.jsx';
import OldClaim from './components/OldClaim/OldClaim.jsx';

function foo() {
  debugger
  console.log(sessionStorage)
  //return sessionStorage.key(0) ? <Base /> : <Navigate to='/' />
  return sessionStorage.key(0) ? <Base /> : <Auth />
}

createRoot(document.getElementById('root')).render(
  <Provider store={ store }>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={ <Auth/> }/>
        <Route path='/base' element={ <Base /> }>
          <Route path='claims' element={ <Claims/> }/>
          <Route path='claim' element={ <OldClaim/> }/>
          <Route path='new' element={ <NewClaim/> }/>
        </Route>
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Provider>
  
);

