// require('dotenv').config();
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

exports.handler = async (event) => {
  try {
    const { payment_intent_id } = JSON.parse(event.body);
    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment_intent_id
    );

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
