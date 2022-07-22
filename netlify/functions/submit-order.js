// require('dotenv').config();
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2020-08-27; orders_beta=v4'
});

exports.handler = async (event) => {
  try {
    const { order_id, total } = JSON.parse(event.body);
    const order = await stripe.orders.submit(order_id, {
      expected_total: total
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ order })
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ err })
    };
  }
};
