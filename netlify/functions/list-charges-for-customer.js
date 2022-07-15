// require('dotenv').config();
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

exports.handler = async (event) => {
  try {
    const { customer } = JSON.parse(event.body);
    const charges = await stripe.charges.list({
      customer
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ charges })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ err })
    };
  }
};
