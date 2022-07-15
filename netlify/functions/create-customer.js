// require('dotenv').config();
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`);

exports.handler = async (event) => {
  try {
    const { name, email, phone } = JSON.parse(event.body);
    const customer = await stripe.customers.create({
      name,
      email,
      phone
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ customer })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ err })
    };
  }
};
