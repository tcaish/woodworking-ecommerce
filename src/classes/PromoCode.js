import { howManyDaysFromToday } from '../exports/functions';

export class PromoCode {
  constructor(code, discount, ends, id, stripe_promo_code_id, users) {
    this.code = code;
    this.discount = discount;
    this.ends = ends;
    this.id = id;
    this.stripe_promo_code_id = stripe_promo_code_id;
    this.users = users;
  }

  // Returns if the promo code has expired
  expired() {
    return howManyDaysFromToday(this.ends) >= 0;
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
      id: promoCode.id,
      stripe_promo_code_id: promoCode.stripe_promo_code_id,
      users: promoCode.users
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new PromoCode(
      data.code,
      data.discount,
      data.ends,
      data.id,
      data.stripe_promo_code_id,
      data.users
    );
  }
};
