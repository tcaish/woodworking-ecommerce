// require('dotenv').config();
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2020-08-27; orders_beta=v4'
});

exports.handler = async (event) => {
  try {
    const { customer, line_items, metadata, promotion_code } = JSON.parse(
      event.body
    );
    const order = await stripe.orders.create({
      currency: 'usd',
      line_items,
      customer,
      metadata,
      expand: ['line_items'],
      discounts: promotion_code
        ? [
            {
              promotion_code
            }
          ]
        : null
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
