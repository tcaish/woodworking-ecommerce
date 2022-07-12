import { loadStripe } from '@stripe/stripe-js';

console.log(`${process.env.STRIPE_PUBLISHABLE_KEY}`);
export const stripePromise = loadStripe(
  `${process.env.STRIPE_PUBLISHABLE_KEY}`
);
console.log(stripePromise);
