export class CartProduct {
  constructor(color, id, notes, product, promoCode, quantity) {
    this.color = color;
    this.id = id;
    this.notes = notes;
    this.product = product;
    this.promoCode = promoCode;
    this.quantity = quantity;
  }
}

// Converts a cart product collection in the Firestore database to
// a CartProduct object and vice versa.
export const cartProductConverter = {
  toFirestore: (cartProduct) => {
    return {
      color: cartProduct.color,
      id: cartProduct.id,
      notes: cartProduct.notes,
      product: cartProduct.product,
      promoCode: cartProduct.promoCode,
      quantity: cartProduct.quantity
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new CartProduct(
      data.color,
      data.id,
      data.notes,
      data.product,
      data.promoCode,
      data.quantity
    );
  }
};
