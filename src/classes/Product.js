// Functions
import { howManyDaysFromToday } from '../exports/functions';

export class Product {
  constructor(
    availability,
    category,
    cost,
    created,
    description,
    id,
    pictures,
    ratings,
    specifications,
    title
  ) {
    this.availability = availability;
    this.category = category;
    this.cost = cost;
    this.created = created;
    this.description = description;
    this.id = id;
    this.pictures = pictures;
    this.ratings = ratings;
    this.specifications = specifications;
    this.title = title;
  }

  // Returns the average rounded down rating for a product
  averageRating() {
    if (this.ratings.length === 0) return 0;
    const sum = this.ratings.reduce((total, num) => total + num);
    return Math.floor(sum / this.ratings.length);
  }

  // Returns the total cost for the product
  totalCost() {
    return (this.cost.materials + this.cost.labor).toFixed(2);
  }

  // Returns whether or not the product has been uploaded to the site
  // within the past 2 weeks
  isNew() {
    return howManyDaysFromToday(this.created) < 14;
  }

  // Returns the string respective for if it's available or not
  getAvailabilityString() {
    return this.availability ? 'Available' : 'Out of Stock';
  }

  // Returns the color that will be on the availability text
  getAvailabilityColor() {
    return this.availability ? 'green' : 'darkred';
  }
}

// Converts a rating collection in the Firestore database to
// a Rating object and vice versa.
export const productConverter = {
  toFirestore: (product) => {
    return {
      availability: product.availability,
      category: product.category,
      cost: product.cost,
      created: product.created,
      description: product.description,
      id: product.id,
      pictures: product.pictures,
      ratings: product.ratings,
      specifications: product.specifications,
      title: product.title
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new Product(
      data.availability,
      data.category,
      data.cost,
      data.created,
      data.description,
      data.id,
      data.pictures,
      data.ratings,
      data.specifications,
      data.title
    );
  }
};
