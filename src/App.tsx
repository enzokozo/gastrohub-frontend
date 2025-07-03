import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Rota from './Rota';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Rota />
    </BrowserRouter>
  );
};

export default App;