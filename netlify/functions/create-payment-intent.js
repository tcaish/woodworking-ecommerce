require('dotenv').config();
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

exports.handler = async (event) => {
  try {
    const { amount } = JSON.parse(event.body);
    console.log('here 1', event.body);
    const paymentIntent = await stripe.paymentIntent.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card']
    });
    console.log('here 2');
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
