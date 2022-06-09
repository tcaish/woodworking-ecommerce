// React
import React from 'react';
import { createRoot } from 'react-dom/client';

// Redux
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Router
import { BrowserRouter } from 'react-router-dom';

// Chakra
import { ChakraProvider } from '@chakra-ui/react';

// Components
import App from './App';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
