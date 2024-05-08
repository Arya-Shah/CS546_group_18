import express from 'express';
const router = express.Router();
import {getAllPendingReports,updateReportStatus} from '../data/users.js';
import xss from "xss";

router.route('/').get(async (req,res)=>{
    try{
      const userId = req.session.user.userId;
      const pendingReports = await getAllPendingReports(userId);
      return res.status(200).render('moderator',{title:"moderator", layout: 'main',
      error: '', pendingReports })
    }catch(e){
      res.status(e.status?e.status:500).render('error', { title:"error",error: e.error?e.error:e, form: req.body });
    }
  });
  
  router.route('/accept/:userId/:reportId/:propertyId').post(async (req, res) => {
      try {
          const status = "Accepted";
          const reportId = xss(req.params.reportId);
          const userId = xss(req.params.userId);
          const propertyId=xss(req.params.propertyId);
          const result = await updateReportStatus(userId,reportId,status,propertyId);
          console.log("Result Accepted",result);
          if(result.success === true){
            
            res.status(200).render('moderator', {title:"moderator", layout: 'main', success: 'Report accepted successfully.' });
          }
      } catch (error) {
          console.error(error);
          res.status(error.status || 500).render('error', { title:"error",error: error.error || error, form: req.body });
      }
    });

//   router.post('/accept/:userId/:reportId/:propertyId', async (req, res) => {
//     try {
//         const { userId, reportId, propertyId } = req.params;
//         const newStatus = "Accepted";
//         const result = await updateReportStatus(userId, reportId, newStatus, propertyId);
//         res.status(200).json({ success: true, message: 'Report accepted successfully.', result });
//     } catch (error) {
//         console.error(error);
//         res.status(error.status || 500).json({ success: false, message: error.message || 'Internal server error' });
//     }
// });

  router.post('/reject/:userId/:reportId/:propertyId', async (req, res) => {
    try {
        const { userId, reportId, propertyId } = req.params;
        const newStatus = "Rejected";
        const result = await updateReportStatus(userId, reportId, newStatus, propertyId);
        res.status(200).render('moderator', {title:"moderator", layout: 'main', success: 'Report rejected and property removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ success: false, title:"moderator",message: error.message || 'Internal server error' });
    }
});

  export default router;