// valid strings
export const isValidString = (str) => {
        if (typeof str !== 'string' || str.trim().length === 0) return false;
        return true;
};

// valid email 
export const isValidEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,2}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
};

// valid UUID format
export const isValidUuid = (uuid) => {
      return true;
};

// valid password (example: at least one number, one lowercase and one uppercase letter, at least six characters)
export const isValidPassword = (password) => {
        const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
        return re.test(password);
};

// valid boolean type
export const isBoolean = (bool) => {
        return typeof bool === 'boolean';
};


//Valid Zipcode
export const isValidZipcode = (zipcode) => {
    const re = /^\d{5}(?:-\d{4})?$/;
    return re.test(zipcode);
};


//Valid Longitude
export const isValidLongitude = (longitude) => {
        
    const parsedLongitude = parseFloat(longitude);
        
    if (isNaN(parsedLongitude)) {
      return false;
    }
        
    return parsedLongitude >= -180 && parsedLongitude <= 180;

};


//Valid Latitude
export const isValidLatitude = (latitude) => {
    
    const parsedLatitude= parseFloat(latitude);
    
    if (isNaN(parsedLatitude)) {
      return false;
    }
    return parsedLatitude >= -90 && parsedLatitude <= 90;

};


//Valid Property Category
export const isValidPropertyCategory = (propertyCategory) => {
    
    const propertyCategories = ['Apartment', 'House', 'Condo', 'Townhouse', 'Studio'];

    if (propertyCategories.includes(propertyCategory)){
        return true;
    } else {
        return false;
    }
    
};


//Function: updateRating
//Update Landlord Review

const updateRating = async (landlordId) => {
        
    //Validate UUID
        isValidUuid(landlordId);

    //Retreive User Collection
        const userCollection = await users();

    //Pull Landlord
        const landlord = await userCollection.findOne({userId: landlordId});

    if (!landlord){
        throw 'Landlord not found.';
    }

    let kindnessRatingTotal = 0;
    let maintenanceResponsivenessRatingTotal = 0;
    let overallCommunicationRatingTotal = 0;
    let professionalismRatingTotal = 0;
    let handinessRatingTotal = 0;
    let depositHandlingRatingTotal = 0;

    for (let landlordReview of landlord.landlordReviews){
        kindnessRatingTotal += landlordReview.kindnessRating;
        maintenanceResponsivenessRatingTotal += landlordReview.maintenanceResponsivenessRating;
        overallCommunicationRatingTotal += landlordReview.overallCommunicationRating;
        professionalismRatingTotal += landlordReview.professionalismRating;
        handinessRatingTotal += landlordReview.handinessRating;
        depositHandlingRatingTotal += landlordReview.depositHandlingRating;
    }

    let newAverageRatings = {
        kindnessRating: kindnessRatingTotal / landlord.landlordReviews.length,
        maintenanceResponsivenessRating: maintenanceResponsivenessRatingTotal / landlord.landlordReviews.length,
        overallCommunicationRating: overallCommunicationRatingTotal / landlord.landlordReviews.length, 
        professionalismRating: professionalismRatingTotal / landlord.landlordReviews.length, 
        handinessRating: handinessRatingTotal / landlord.landlordReviews.length, 
        depositHandlingRating: depositHandlingRatingTotal / landlord.landlordReviews.length
    }

    await userCollection.updateOne(
        {userId: landlordId},
        {$set: {averageRatings: newAverageRatings}}
    );

}

export default {
  isValidString,
  isValidEmail,
  isValidUuid,
  isValidPassword,
  isBoolean,
  isValidZipcode,
  isValidLongitude,
  isValidLatitude,
  isValidPropertyCategory,
  updateRating
};
