export class CartProduct {
  constructor(color, id, notes, product, promo_code, purchased, quantity) {
    this.color = color;
    this.id = id;
    this.notes = notes;
    this.product = product;
    this.promo_code = promo_code;
    this.purchased = purchased;
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
      promo_code: cartProduct.promo_code,
      purchased: cartProduct.purchased,
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
      data.promo_code,
      data.purchased,
      data.quantity
    );
  }
};
