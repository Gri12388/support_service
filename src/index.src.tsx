import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store/store';
import Auth from './components/Auth/Auth';
import Base from './components/Base/Base';
import Claims from './components/Claims/Claims';
import NotFound from './components/NotFound/NotFound';
import NewClaim from './components/NewClaim/NewClaim';
import OldClaim from './components/OldClaim/OldClaim';

createRoot(document.getElementById('root')!).render(
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

