export class Order {
  constructor(
    cartProduct,
    discountTotal,
    id,
    refunded,
    refundStatus,
    stripeOrderId,
    total
  ) {
    this.cartProduct = cartProduct;
    this.discountTotal = discountTotal;
    this.id = id;
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
      cartProduct: order.cartProduct,
      discountTotal: order.discountTotal,
      id: order.id,
      refunded: order.refunded,
      refundStatus: order.refundStatus,
      stripeOrderId: order.stripeOrderId,
      total: order.total
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Order(
      data.cartProduct,
      data.discountTotal,
      data.id,
      data.refunded,
      data.refundStatus,
      data.stripeOrderId,
      data.total
    );
  }
};
