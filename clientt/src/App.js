// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { Addcomponents } from '../../clientt/src/components/Addcomponents';

const App = () => {


  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Addcomponents/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
