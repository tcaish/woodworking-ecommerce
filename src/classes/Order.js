export class Order {
  constructor(
    cart_products,
    discount_total,
    id,
    ordered,
    refunded,
    refund_status,
    stripe_order_id,
    total
  ) {
    this.cart_products = cart_products;
    this.discount_total = discount_total;
    this.id = id;
    this.ordered = ordered;
    this.refunded = refunded;
    this.refund_status = refund_status;
    this.stripe_order_id = stripe_order_id;
    this.total = total;
  }

  // Formats the ordered date to something human readable
  getOrderedDate() {
    const date = this.ordered.toDate();
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
      date
    );
    const month = new Intl.DateTimeFormat('en', { month: 'short' }).format(
      date
    );
    const day = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(date);
    return `${month} ${day}, ${year}`;
  }
}

// Converts an order collection in the Firestore database to
// an Order object and vice versa.
export const orderConverter = {
  toFirestore: (order) => {
    return {
      cart_products: order.cart_products,
      discount_total: order.discount_total,
      id: order.id,
      ordered: order.ordered,
      refunded: order.refunded,
      refund_status: order.refund_status,
      stripe_order_id: order.stripe_order_id,
      total: order.total
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Order(
      data.cart_products,
      data.discount_total,
      data.id,
      data.ordered,
      data.refunded,
      data.refund_status,
      data.stripe_order_id,
      data.total
    );
  }
};
