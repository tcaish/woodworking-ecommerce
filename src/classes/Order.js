export class Order {
  constructor(
    cartProducts,
    discountTotal,
    id,
    ordered,
    refunded,
    refundStatus,
    stripeOrderId,
    total
  ) {
    this.cartProducts = cartProducts;
    this.discountTotal = discountTotal;
    this.id = id;
    this.ordered = ordered;
    this.refunded = refunded;
    this.refundStatus = refundStatus;
    this.stripeOrderId = stripeOrderId;
    this.total = total;
  }
}

// Converts an order collection in the Firestore database to
// an Order object and vice versa.
export const orderConverter = {
  toFirestore: (order) => {
    return {
      cartProducts: order.cartProducts,
      discountTotal: order.discountTotal,
      id: order.id,
      ordered: order.ordered,
      refunded: order.refunded,
      refundStatus: order.refundStatus,
      stripeOrderId: order.stripeOrderId,
      total: order.total
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Order(
      data.cartProducts,
      data.discountTotal,
      data.id,
      data.ordered,
      data.refunded,
      data.refundStatus,
      data.stripeOrderId,
      data.total
    );
  }
};
