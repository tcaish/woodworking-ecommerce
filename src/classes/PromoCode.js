export class PromoCode {
  constructor(code, discount, ends, users) {
    this.code = code;
    this.discount = discount;
    this.ends = ends;
    this.users = users;
  }
}

// Converts a promo code collection in the Firestore database to
// a PromoCode object and vice versa.
export const promoCodeConverter = {
  toFirestore: (promoCode) => {
    return {
      code: promoCode.code,
      discount: promoCode.discount,
      ends: promoCode.ends,
      users: promoCode.users
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new PromoCode(data.code, data.discount, data.ends, data.users);
  }
};
