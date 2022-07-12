import { loadStripe } from '@stripe/stripe-js';

console.log(`${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`);
export const stripePromise = loadStripe(
  `${process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}`
);
console.log(stripePromise);
