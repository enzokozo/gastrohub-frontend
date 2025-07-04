import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Rota from './Rota';
import { AuthProvider } from './auth/AuthContext';
import { CustomThemeProvider } from './theme/ThemeContext';

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Rota />
        </BrowserRouter>
      </AuthProvider>
    </CustomThemeProvider>
  );
};

export default App;