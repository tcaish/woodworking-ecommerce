export class Rating {
  constructor(id, product, rating, submitted, user) {
    this.id = id;
    this.product = product;
    this.rating = rating;
    this.submitted = submitted;
    this.user = user;
  }
}

// Converts a rating collection in the Firestore database to
// a Rating object and vice versa.
export const ratingConverter = {
  toFirestore: (rating) => {
    return {
      id: rating.id,
      product: rating.product,
      rating: rating.rating,
      submitted: rating.submitted,
      user: rating.user
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Rating(
      data.id,
      data.product,
      data.rating,
      data.submitted,
      data.user
    );
  }
};
