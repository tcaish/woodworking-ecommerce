require('dotenv').config();
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

exports.handler = async (event) => {
  try {
    console.log('yo 1');
    const { amount } = JSON.parse(event.body);
    console.log('yo 2');
    const paymentIntent = await stripe.paymentIntent.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card']
    });
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
