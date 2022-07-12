// React
import React from 'react';
import { createRoot } from 'react-dom/client';

// Redux
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Router
import { BrowserRouter } from 'react-router-dom';

// Chakra
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Stripe
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from './utils/stripe/stripe';

// Components
import App from './App';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';

const container = document.getElementById('root');
const root = createRoot(container);

const activeLabelStyles = {
  transform: 'scale(0.85) translateY(-24px)'
};
export const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontFamily: 'Roboto'
      }
    }
  },
  components: {
    Form: {
      variants: {
        floating: {
          container: {
            _focusWithin: {
              label: {
                ...activeLabelStyles
              }
            },
            'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label':
              {
                ...activeLabelStyles
              },
            label: {
              top: 0,
              left: 0,
              zIndex: 2,
              position: 'absolute',
              backgroundColor: 'white',
              color: 'grey',
              pointerEvents: 'none',
              mx: 3,
              px: 1,
              my: 2,
              transformOrigin: 'left top'
            }
          }
        }
      }
    }
  }
});

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <Elements stripe={stripePromise}>
            <App />
          </Elements>
        </ChakraProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
