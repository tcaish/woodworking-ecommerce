require('dotenv').config();
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

exports.handler = async (event) => {
  console.log(process.env.STRIPE_PUBLISHABLE_KEY);
  console.log(process.env.STRIPE_SECRET_KEY);
  console.log(`${process.env.STRIPE_PUBLISHABLE_KEY}`);
  console.log(`${process.env.STRIPE_SECRET_KEY}`);
  try {
    const { amount } = JSON.parse(event.body);
    const paymentIntent = await stripe.paymentIntents
      .create({
        amount,
        currency: 'usd',
        payment_method_types: ['card']
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    return {
      statusCode: 200,
      body: JSON.stringify({ paymentIntent })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ err })
    };
  }
};
