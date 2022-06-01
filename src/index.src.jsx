import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from './components/Auth/Auth.jsx';
import Base from './components/Base/Base.jsx';
import Claims from './components/Claims/Claims.jsx';
import NotFound from './components/NotFound/NotFound.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/base" element={<Base />} >
        <Route path="claims" element={<Claims />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
  
);

