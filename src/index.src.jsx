import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';

import store from './store/store.js';
import Common from './components/Common/Common.jsx';
import Auth from './components/Auth/Auth.jsx';
import Base from './components/Base/Base.jsx';
import Claims from './components/Claims/Claims.jsx';
import NotFound from './components/NotFound/NotFound.jsx';
import NewClaim from './components/NewClaim/NewClaim.jsx';

createRoot(document.getElementById('root')).render(
  <Provider store={ store }>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Common />} >
          <Route path='/auth' element={<Auth />} />
          {/* <Route path="/base" element={<Base />} >
            <Route path="claims" element={<Claims />} />
            <Route path="claim" element={<NewClaim />} />
            <Route path="new" element={<NewClaim />} />
          </Route> */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Provider>
  
);

