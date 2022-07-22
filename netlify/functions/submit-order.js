// require('dotenv').config();
const Stripe = require('stripe');
const stripe = Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2020-08-27; orders_beta=v4'
});

exports.handler = async (event) => {
  try {
    const { order_id, total } = JSON.parse(event.body);
    const resource = Stripe.StripeResource.extend({
      request: Stripe.StripeResource.method({
        method: 'post',
        path: `orders/${order_id}/submit`
      })
    });

    const response = await new resource(stripe).request(
      {
        expected_total: total
      },
      function (err, res) {
        if (res) {
          return {
            statusCode: 200,
            body: JSON.stringify(res)
          };
        }

        if (err) {
          return {
            statusCode: 400,
            body: JSON.stringify(err)
          };
        }
      }
    );

    console.log(response);
    return response;
  } catch (err) {
    console.log(err);
    return {
      statusCode: 400,
      body: JSON.stringify({ err })
    };
  }
};
