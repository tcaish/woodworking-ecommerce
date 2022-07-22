// require('dotenv').config();
const stripe = require('stripe')(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2020-08-27; orders_beta=v4'
});

exports.handler = async (event) => {
  try {
    const { order_id, total } = JSON.parse(event.body);
    const resource = stripe.StripeResource.extend({
      request: stripe.StripeResource.method({
        method: 'POST',
        path: `orders/${order_id}/submit`
      })
    });

    new resource(stripe).request(
      {
        expected_total: total
      },
      function (err, response) {
        if (response) {
          return {
            statusCode: 200,
            body: JSON.stringify({ response })
          };
        }

        if (err) {
          return {
            statusCode: 400,
            body: JSON.stringify({ err })
          };
        }
      }
    );
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ err })
    };
  }
};
