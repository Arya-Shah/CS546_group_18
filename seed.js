import { addProperty,addPropertyReview,addCommentReply,addLikeDislike } from "./data/properties.js";
import { addLandLordReport,registerUser,addLandlordReview } from "./data/users.js";
import { addThread } from "./data/threads.js";
import { v4 as uuid } from "uuid";

const seed = async () => {
  try {
    const { userId } =  await registerUser("John","Doe","johndoe","Connor123@","New York","NY","johndoe@example.com",false,false);
    const {userId_one} =  await registerUser("jayanth","kanala","johndoek","Connor123@","New York","NY","johndoek@example.com",false,false);
    const {userId_two} =  await registerUser("jayanthi","kana","johndoeki","Connor123@","New York","NY","johndoeking@example.com",false,true);
    //landlord
    const {userId_three} =  await registerUser("jayanthi","kanas","johndoekid","Connor123@","New York","NY","johndoekidfng@example.com",true,false);
    const userone =  await registerUser("rajesh","akula","rajesha","Connor123@","Texas","TX","jkanala0@gmail.com",true,false);
    const usertwo =  await registerUser("arya","shah","aryashah","Connor123@","New York","NY","johndoeki@example.com",true,false);
    const user_two =  await registerUser("gnaneshwar","koyalamudi","gnaneshk","Connor123@","Ohio","OH","johndoekin@example.com",true,false);
    const {propertyId} = await addProperty("Cozy Cottage", "123 Oak Street", "Springfield", "Illinois", "62701", "-89.6501", "39.7817", "Apartment", "2","2");
    const {propertyId_one} = await addProperty("The Hills", "125 Oak Street", "Jersey city", "New Jersey", "07307", "-89.6501", "39.7817", "House", "3","4");
    const {propertyId_two} = await addProperty("The Avenue", "125 palisade Street", "Jersey city", "New Jersey", "07307", "-89.6501", "39.7817", "Condo", "2","2");
    const {propertyId_three} = await addProperty("The Row", "158 palisade Street", "Hoboken", "New Jersey", "07307", "-89.6501", "39.7817", "Condo", "2","2");
    const report = await addLandLordReport(userId,"no maintanance", "property", "maintenance", propertyId);
    const report_one = await addLandLordReport(userId,"no maintanance in the community.", "property", "maintenance", propertyId);
    const addReview = await addLandlordReview(
      userId,
      {
        kindnessRating: 1,
        maintenanceResponsivenessRating: 2,
        overallCommunicationRating: 3,
        professionalismRating: 5,
        handinessRating: 3,
        depositHandlingRating: 2,
        reviewText: "This is a sample review."
      },userId);
      // const addReview_one = await addLandlordReview(
      //   userId_three,
      //   {
      //     kindnessRating: 1,
      //     maintenanceResponsivenessRating: 2,
      //     overallCommunicationRating: 3,
      //     professionalismRating: 5,
      //     handinessRating: 3,
      //     depositHandlingRating: 2,
      //     reviewText: "This is a sample review."
      //   },userId_two);
        // const addReview_two = await addLandlordReview(
        //   userId_two,
        //   {
        //     kindnessRating: 1,
        //     maintenanceResponsivenessRating: 2,
        //     overallCommunicationRating: 3,
        //     professionalismRating: 5,
        //     handinessRating: 3,
        //     depositHandlingRating: 2,
        //     reviewText: "This is a sample review."
        //   },userId);
      // const addpropertyreview_one = await addPropertyReview(
      //   propertyId_one,
      //   {
      //     maintenanceRating:3,
      //     locationDesirabilityRating:2,
      //     ownerResponsivenessRating:5,
      //     propertyConditionRating:2 ,
      //     communityRating:1 ,
      //     amenitiesRating:4 ,
      //     reviewText: "Excellent!"
      //   },userId);
      //   const addpropertyreview_two = await addPropertyReview(
      //     propertyId_two,
      //     {
      //       maintenanceRating:3,
      //       locationDesirabilityRating:2,
      //       ownerResponsivenessRating:5,
      //       propertyConditionRating:2 ,
      //       communityRating:1 ,
      //       amenitiesRating:4 ,
      //       reviewText: "Excellent!"
      //     },userId);
        const addpropertyreview = await addPropertyReview(
          propertyId,
          {
            maintenanceRating:1,
            locationDesirabilityRating:2,
            ownerResponsivenessRating:3,
            propertyConditionRating:4 ,
            communityRating:5 ,
            amenitiesRating:3 ,
            reviewText: "sample review"
          },userId);
        const {commentId} = await addCommentReply(userId,propertyId,"too bad!!");
        const {threadId} = await addThread(userId,"this is great!!","Properties","Properties");

  } catch (error) {
    console.error("Error seeding data:", error);
  }
};
seed();