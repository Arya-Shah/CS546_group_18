import express from 'express';
const router = express.Router();
import {getAllPendingReports,updateReportStatus} from '../data/users.js';
import xss from "xss";

router.route('/').get(async (req,res)=>{
    try{
      const userId = req.session.user.userId;
      const pendingReports = await getAllPendingReports(userId);
      return res.status(200).render('moderator',{ layout: 'main',
      error: '', pendingReports })
    }catch(e){
      res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
    }
  });
  
  router.route('/accept/:userId/:reportId/:propertyId').post(async (req, res) => {
      try {
          const status = "Accepted";
          const reportId = xss(req.params.reportId);
          const userId = xss(req.params.userId);
          const propertyId=xss(req.params.propertyId);
          const result = await updateReportStatus(userId,reportId,status,propertyId);
      
          // updatePostReportStatus
  
  //         // Implement logic to accept the report with the given reportId
  //         // For example, update the status of the report in the database
  //         // Once the report is accepted, you can redirect or respond accordingly
  //         return res.status(200).render('moderator', { layout: 'main', success: 'Report accepted successfully.' }).then(
  //           res.redirect('/')
  //         );
  //         // return res.status(200).json({ message: 'Report accepted successfully.' });
  //     } catch (e) {
  //       res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
  //     }
  // });
      } catch (error) {
          console.error(error);
          res.status(error.status || 500).render('error', { error: error.error || error, form: req.body });
      }
    });

  router.post('/accept/:userId/:reportId/:propertyId', async (req, res) => {
    try {
        const { userId, reportId, propertyId } = req.params;
        const newStatus = "Accepted";
        const result = await updateReportStatus(userId, reportId, newStatus, propertyId);
        res.status(200).json({ success: true, message: 'Report accepted successfully.', result });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ success: false, message: error.message || 'Internal server error' });
    }
});
  
  // router.route('/reject/:userId/:reportId/:property_id').post(async (req, res) => {
  //     try {
  //         const status = "Rejected";
  //         const reportId = req.params.reportId;
  //         const userId = req.params.userId;
  //         const propertyId=req.params.property_id;
  //         const result = await updateReportStatus(userId,reportId,status,propertyId);
  //         // updatePostReportStatus
  
  //         // Implement logic to accept the report with the given reportId
  //         // For example, update the status of the report in the database
  //         // Once the report is accepted, you can redirect or respond accordingly
  //         return res.status(200).json({ message: 'Report Rejected successfully.' });
  //     } catch (e) {
  //       res.status(e.status?e.status:500).render('error', { error: e.error?e.error:e, form: req.body });
  //     }
  // });

  router.post('/reject/:userId/:reportId/:propertyId', async (req, res) => {
    try {
        const { userId, reportId, propertyId } = req.params;
        const newStatus = "Rejected";
        const result = await updateReportStatus(userId, reportId, newStatus, propertyId);
        res.status(200).json({ success: true, message: 'Report rejected and property removed successfully.', result });
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).json({ success: false, message: error.message || 'Internal server error' });
    }
});

  export default router;