import { addProperty,addPropertyReview,addCommentReply,addLikeDislike } from "./data/properties.js";
import { addLandLordReport,registerUser,addLandlordReview } from "./data/users.js";
import { addThread } from "./data/threads.js";
import { v4 as uuid } from "uuid";

const seed = async () => {
  try {
    const { userId } =  await registerUser("John","Doe","johndoe","Connor123@","New York","NY","johndoe@example.com",false,false)
    const user =  await registerUser("jayanth","kanala","johndoek","Connor123@","New York","NY","johndoek@example.com",false,true)
    const report = await addLandLordReport(userId,"eherhrr", "property", "maintenance", "663902c1f1d649ff153c2938");
    const {propertyId} = await addProperty("Cozy Cottage", "123 Oak Street", "Springfield", "Illinois", "62701", "-89.6501", "39.7817", "Apartment", "2","2");
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
      },'jayanth',userId);
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
        },'jayanth',userId);
        const {commentId} = await addCommentReply(userId,propertyId,"too bad!!");
        const {threadId} = await addThread(userId,"lmaooo","Properties","Properties");

  } catch (error) {
    console.error("Error seeding data:", error);
  }
};
seed();