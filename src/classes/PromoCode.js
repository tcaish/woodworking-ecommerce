import { howManyDaysFromToday } from '../exports/functions';

export class PromoCode {
  constructor(
    advertise,
    code,
    discount,
    ends,
    id,
    stripe_promo_code_id,
    users
  ) {
    this.advertise = advertise;
    this.code = code;
    this.discount = discount;
    this.ends = ends;
    this.id = id;
    this.stripe_promo_code_id = stripe_promo_code_id;
    this.users = users;
  }

  // Formats the ordered date to something human readable
  getExpiredDateAndTime() {
    const date = this.ends.toDate();
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'long'
    }).format(date);
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
      advertise: promoCode.advertise,
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
      data.advertise,
      data.code,
      data.discount,
      data.ends,
      data.id,
      data.stripe_promo_code_id,
      data.users
    );
  }
};
