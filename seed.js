import { addProperty } from "./data/properties.js";

const seed = async () => {
  try {
    const property = await addProperty(
      {
        propertyName: "Cozy Cottage",
        address: "   123 Oak Street   ",
        city: "   Springfield   ",
        state: "   Illinois   ",
        zipcode: "   62701   ",
        longitude: "   -89.6501   ",
        latitude: "   39.7817   ",
        category: "   Vacation Rental   ",
        bedrooms: "   2   ",
        bathrooms: "   1   ",
      },
      {
        propertyName: "   Modern Loft   ",
        address: "   456 Maple Avenue   ",
        city: "   New York City   ",
        state: "   New York   ",
        zipcode: "   10001   ",
        longitude:    -73.9877   ,
        latitude:    40.7484   ,
        category: "   Urban Apartment   ",
        bedrooms: "   1   ",
        bathrooms: "   1   ",
      }
    );
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};
seed();